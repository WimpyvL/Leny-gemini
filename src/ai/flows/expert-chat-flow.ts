'use server';
/**
 * @fileOverview An AI flow for a user to chat with a specialized AI expert.
 *
 * - getExpertChatResponse - A function that returns a specialized AI response.
 * - ExpertChatInput - The input type for the getExpertChatResponse function.
 * - ExpertChatOutput - The return type for the getExpertChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExpertChatInputSchema = z.object({
  message: z.string().describe('The user message to the expert.'),
  expertPrompt: z.string().describe("The expert's persona and instructions."),
});
export type ExpertChatInput = z.infer<typeof ExpertChatInputSchema>;

const ExpertChatOutputSchema = z.object({
  response: z.string().describe('A specialized and helpful AI response from the expert.'),
});
export type ExpertChatOutput = z.infer<typeof ExpertChatOutputSchema>;


export async function getExpertChatResponse(input: ExpertChatInput): Promise<ExpertChatOutput> {
  return expertChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'expertChatPrompt',
  input: {schema: ExpertChatInputSchema},
  output: {schema: ExpertChatOutputSchema},
  prompt: `{{expertPrompt}}

You are conversing with a human user who is seeking your expert opinion. Provide a concise, insightful, and actionable response based on your specialty.

User's message: {{{message}}}
  `,
});


const expertChatFlow = ai.defineFlow(
  {
    name: 'expertChatFlow',
    inputSchema: ExpertChatInputSchema,
    outputSchema: ExpertChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
