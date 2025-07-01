'use server';
/**
 * @fileOverview An AI agent that acts as a router for specialized AI experts.
 *
 * - routeExpert - A function that analyzes a conversation and suggests the best expert.
 * - ExpertRouterInput - The input type for the routeExpert function.
 * - ExpertRouterOutput - The return type for the routeExpert function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { AiExpert } from '@/lib/types';

const ExpertRouterInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    text: z.string(),
  })).describe('The conversation history between the doctor and Leny.'),
  experts: z.array(z.object({
    id: z.string(),
    name: z.string(),
    specialty: z.string(),
  })).describe('The list of available AI experts to choose from.'),
});
export type ExpertRouterInput = z.infer<typeof ExpertRouterInputSchema>;

const ExpertRouterOutputSchema = z.object({
  response: z.string().describe("Leny's helpful and analytical response to the doctor."),
  suggestedExpertId: z.string().optional().describe('The ID of the suggested expert from the provided list.'),
  isUrgent: z.boolean().describe('Whether the situation described in the chat is urgent.'),
  urgencyReason: z.string().optional().describe('The reason why the situation is considered urgent.'),
  quickActions: z.array(z.object({
    keyword: z.string().describe('A short keyword or phrase for the action (e.g., "Order EKG", "Administer Aspirin").'),
    fullAction: z.string().describe('The complete, clinical action to be taken (e.g., "Order a 12-lead EKG and check Troponin levels.").'),
  })).describe('A list of suggested quick actions for the doctor to take.'),
  summaryForExpert: z.string().describe('A concise summary of the conversation to be passed to the specialist.'),
});
export type ExpertRouterOutput = z.infer<typeof ExpertRouterOutputSchema>;

export async function routeExpert(input: ExpertRouterInput): Promise<ExpertRouterOutput> {
  return expertRouterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'expertRouterPrompt',
  input: { schema: ExpertRouterInputSchema },
  output: { schema: ExpertRouterOutputSchema },
  prompt: `You are Leny, a sophisticated AI triage assistant for doctors. Your primary role is to analyze a conversation with a doctor and facilitate a consultation with the most relevant AI specialist.

  Available Experts:
  {{#each experts}}
  - {{name}} (ID: {{id}}, Specialty: {{specialty}})
  {{/each}}

  Conversation History:
  {{#each history}}
  - {{role}}: {{text}}
  {{/each}}

  Your tasks are:
  1.  **Analyze the Conversation**: Read the entire history to understand the doctor's needs.
  2.  **Select the Best Expert**: Based on the conversation, choose the SINGLE most appropriate expert from the list. Provide their ID in the 'suggestedExpertId' field. If no expert seems relevant, leave it empty.
  3.  **Assess Urgency**: Determine if the case is an emergency. Set 'isUrgent' to true if it involves critical, life-threatening symptoms (e.g., stroke, heart attack, sepsis). Provide a brief 'urgencyReason'.
  4.  **Formulate Quick Actions**: Suggest 2-3 brief, actionable next steps for the doctor. For each, provide a short 'keyword' (e.g., "Order EKG") and the 'fullAction' text (e.g., "Order a 12-lead EKG and check Troponin levels.").
  5.  **Create a Summary**: Write a one-sentence summary of the doctor's query for the specialist. This will be the first message the specialist sees.
  6.  **Craft a Response**: Write a concise, helpful response to the doctor. Acknowledge their query, state your suggested specialist, and mention any urgent concerns.

  Example Output Structure:
  {
    "response": "Based on the symptoms of chest pain and shortness of breath, I recommend consulting with Dr. Alex Morgan, our Cardiothoracic Surgery expert. I've prepared a summary for them. The situation appears urgent due to potential cardiac involvement.",
    "suggestedExpertId": "cardiothoracic_surgeon_alex_morgan",
    "isUrgent": true,
    "urgencyReason": "Symptoms are consistent with a potential acute coronary syndrome.",
    "quickActions": [
      {"keyword": "Order EKG/Troponin", "fullAction": "Order a 12-lead EKG and check Troponin levels."},
      {"keyword": "Administer Aspirin", "fullAction": "Administer 325mg of aspirin if not contraindicated."},
      {"keyword": "Prep Cath Lab", "fullAction": "Prepare for potential cardiac catheterization."}
    ],
    "summaryForExpert": "Doctor is presenting a patient with symptoms of chest pain and shortness of breath and is seeking consultation."
  }
  `,
});

const expertRouterFlow = ai.defineFlow(
  {
    name: 'expertRouterFlow',
    inputSchema: ExpertRouterInputSchema,
    outputSchema: ExpertRouterOutputSchema,
  },
  async (input) => {
    // We don't want Leny to suggest himself.
    const filteredExperts = input.experts.filter(e => e.id !== 'leny-router');
    const result = await prompt({ ...input, experts: filteredExperts });
    return result.output!;
  }
);
