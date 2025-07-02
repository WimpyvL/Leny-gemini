'use server';
/**
 * @fileOverview A comprehensive query processing AI agent.
 *
 * - processQuery - A function that handles a user query, providing context-aware,
 *   role-specific (user vs. expert) responses.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { 
  type UserRole, 
  type QueryInput, 
  type FormattedResponse,
  QueryInputSchema,
  FormattedResponseSchema,
} from '@/lib/types';


// Main exported function to be called from server actions
export async function processQuery(input: QueryInput): Promise<FormattedResponse> {
  return queryFlow(input);
}


const queryFlow = ai.defineFlow(
  {
    name: 'queryFlow',
    inputSchema: QueryInputSchema,
    outputSchema: FormattedResponseSchema,
  },
  async (input) => {
    const isProfessional = input.userRole === 'expert';
    const responseMode = isProfessional ? 'professional' : 'consumer';

    // Construct the prompt
    const prompt = `
      You are S.A.N.I., a sophisticated AI reasoning engine.
      Your response will be tailored for the user role: ${input.userRole}.
      
      ${input.conversationHistory ? `Conversation History:\n${input.conversationHistory.join('\n')}\n` : ''}

      Current User Query: "${input.text}"

      ${isProfessional ? `
        Your Task (for an expert user):
        Provide a structured, insightful response.
        - Start with a brief summary of the user's query.
        - Offer a few potential perspectives or solutions.
        - Suggest key questions or data points to consider.
        - Outline a clear action plan or next steps.
        - Format the output as clean, readable markdown.
      ` : `
        Your Task (for a general user):
        Provide a warm, open, and knowledgeable response.
        - Your name is S.A.N.I. You are an AI companion.
        - Lead with empathy and curiosity.
        - Avoid absolute statements. Use phrases like "It's often recommended..." or "Some people find..."
        - Explain potential ideas in simple terms.
        - Provide clear, actionable next steps.
      `}
    `;

    // 5. Generate the response from the model
    const llmResponse = await ai.generate({
      prompt,
      model: 'googleai/gemini-2.0-flash-preview',
      config: { temperature: 0.2 },
    });

    return {
      content: llmResponse.text,
      metadata: {
        responseMode: responseMode,
      },
    };
  }
);
