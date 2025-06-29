'use server';
/**
 * @fileOverview A comprehensive medical query processing AI agent.
 *
 * - processMedicalQuery - A function that handles a medical query, providing context-aware,
 *   role-specific (patient vs. provider) responses.
 * - MedicalQueryInput - The input type for the processMedicalQuery function.
 * - FormattedClinicalResponse - The return type for the processMedicalQuery function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  classifyQuery,
  type Classification,
} from '@/lib/medical/context-classifier';
import { retrieveMedicalKnowledge } from '@/lib/medical/medical-knowledge-db';
import { getAgentConfig } from '@/lib/medical/agent-configs';
import type { UserType, MedicalSpecialty } from '@/lib/types';

export const MedicalQueryInputSchema = z.object({
  text: z.string().describe('The medical query text from the user.'),
  userType: z.custom<UserType>().describe('The type of user (patient or provider).'),
  specialtyHint: z.custom<MedicalSpecialty>().optional().describe('A hint for the medical specialty.'),
  conversationHistory: z.array(z.string()).optional().describe('Previous messages in the conversation for context.'),
});
export type MedicalQueryInput = z.infer<typeof MedicalQueryInputSchema>;

export const FormattedClinicalResponseSchema = z.object({
  content: z.string().describe('The formatted clinical response text for the user.'),
  metadata: z.object({
    classification: z.custom<Classification>().describe('The classification of the query.'),
    retrievedKnowledge: z.string().optional().describe('Summary of knowledge retrieved for the query.'),
    responseMode: z.enum(['consumer', 'professional']).describe('The mode used for the response.'),
  }),
  escalationTriggered: z.boolean().describe('Whether an escalation for emergency was triggered.'),
  sources: z.array(z.string()).optional().describe('A list of sources or citations used.'),
});
export type FormattedClinicalResponse = z.infer<typeof FormattedClinicalResponseSchema>;


// Main exported function to be called from server actions
export async function processMedicalQuery(input: MedicalQueryInput): Promise<FormattedClinicalResponse> {
  return medicalQueryFlow(input);
}


// Define tools for the flow to use
const classifyQueryTool = ai.defineTool(
  {
    name: 'classifyQuery',
    description: 'Classifies a medical query to determine context, specialty, and urgency.',
    inputSchema: z.object({ text: z.string() }),
    outputSchema: z.custom<Classification>(),
  },
  async ({ text }) => classifyQuery(text)
);

const retrieveKnowledgeTool = ai.defineTool(
  {
    name: 'retrieveMedicalKnowledge',
    description: 'Retrieves relevant medical knowledge and clinical guidelines based on a query.',
    inputSchema: z.object({ query: z.string(), specialty: z.custom<MedicalSpecialty>() }),
    outputSchema: z.object({
      summary: z.string().describe('A summary of the retrieved medical knowledge.'),
      sources: z.array(z.string()).describe('A list of source titles for citation.'),
    }),
  },
  async ({ query, specialty }) => retrieveMedicalKnowledge(query, specialty)
);


const medicalQueryFlow = ai.defineFlow(
  {
    name: 'medicalQueryFlow',
    inputSchema: MedicalQueryInputSchema,
    outputSchema: FormattedClinicalResponseSchema,
    experimental: {
      tools: [classifyQueryTool, retrieveKnowledgeTool],
    }
  },
  async (input) => {
    // 1. Classify the query
    const classification = await classifyQueryTool(input);

    const specialty = input.specialtyHint || classification.specialty;
    const isProfessional = input.userType === 'provider';
    const responseMode = isProfessional ? 'professional' : 'consumer';

    // 2. Retrieve knowledge if it's a professional query
    let knowledge = { summary: '', sources: [] };
    if (isProfessional) {
      knowledge = await retrieveKnowledgeTool({ query: input.text, specialty });
    }
    
    // 3. Get agent "tinting" config for the specialty
    const agentConfig = getAgentConfig(specialty);

    // 4. Construct the prompt
    const prompt = `
      You are the Leny Medical AI System, a sophisticated clinical reasoning engine.
      Your response will be tailored for the user type: ${input.userType}.
      The query has been classified as:
      - Context: ${classification.context}
      - Specialty: ${specialty}
      - Red Flags: ${classification.hasRedFlags ? 'Yes' : 'No'}

      ${input.conversationHistory ? `Conversation History:\n${input.conversationHistory.join('\n')}\n` : ''}

      Current User Query: "${input.text}"

      ${isProfessional ? `
        Retrieved Medical Knowledge:
        ${knowledge.summary || 'No specific literature found. Rely on general medical knowledge.'}

        Specialty Agent Instructions (${specialty}):
        - Prioritize: ${agentConfig?.prioritize_keywords.join(', ') || 'N/A'}
        - Emphasize: ${agentConfig?.emphasis_areas.join(', ') || 'N/A'}

        Your Task (for a healthcare provider):
        Provide a structured, evidence-based clinical response.
        - Start with a brief summary of the situation.
        - List the most likely diagnoses with rationale.
        - List "must-not-miss" red flag diagnoses.
        - Suggest key history questions and physical exam focus areas.
        - Outline a clear diagnostic and initial management plan.
        - Reference the provided medical knowledge where appropriate.
        - Format the output as clean, readable markdown.
      ` : `
        Your Task (for a patient):
        Provide a warm, open, and knowledgeable response.
        - Your name is Leny. You are a healthcare companion, not a doctor.
        - Lead with empathy.
        - Avoid absolute statements. Use phrases like "It's often recommended..." or "Some people find..."
        - Explain potential causes in simple terms.
        - Provide clear, actionable next steps (e.g., self-care, when to see a doctor).
        - If red flags are detected, gently but clearly advise seeking immediate medical attention.
      `}
    `;

    // 5. Generate the response from the model
    const llmResponse = await ai.generate({
      prompt,
      model: 'googleai/gemini-2.0-flash-preview',
      config: { temperature: 0.1 },
    });

    return {
      content: llmResponse.text,
      metadata: {
        classification: classification,
        retrievedKnowledge: knowledge.summary,
        responseMode: responseMode,
      },
      escalationTriggered: classification.hasRedFlags,
      sources: knowledge.sources,
    };
  }
);
