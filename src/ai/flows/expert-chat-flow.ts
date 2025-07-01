'use server';
/**
 * @fileOverview An AI flow for a doctor to chat with a specialized AI expert.
 *
 * - getExpertChatResponse - A function that returns a specialized AI response.
 * - ExpertChatInput - The input type for the getExpertChatResponse function.
 * - ExpertChatOutput - The return type for the getExpertChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExpertChatInputSchema = z.object({
  message: z.string().describe('The user message from the doctor.'),
  expertPrompt: z.string().describe("The expert's persona and instructions."),
});
export type ExpertChatInput = z.infer<typeof ExpertChatInputSchema>;

const ExpertChatOutputSchema = z.object({
  response: z.string().describe('A specialized and helpful AI response from the expert.'),
  quickActions: z.array(z.string()).describe('A list of 3-4 suggested next replies or questions for the doctor to ask the expert.'),
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

You are conversing with a human doctor who is seeking your expert opinion. Provide a concise, insightful, and actionable response based on your specialty.

After your main response, you MUST generate a list of 3-4 relevant "quick actions". These should be short, follow-up questions or comments that the doctor might want to say next to continue the conversation productively.

Doctor's message: {{{message}}}
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
