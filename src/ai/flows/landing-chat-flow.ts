'use server';
/**
 * @fileOverview A simple AI flow for the landing page chat.
 *
 * - getLandingChatResponse - A function that returns a friendly AI response.
 * - LandingChatInput - The input type for the getLandingChatResponse function.
 * - LandingChatOutput - The return type for the getLandingChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LandingChatInputSchema = z.object({
  message: z.string().describe('The user message from the landing page chat.'),
});
export type LandingChatInput = z.infer<typeof LandingChatInputSchema>;

const LandingChatOutputSchema = z.object({
  response: z.string().describe('A friendly and helpful AI response.'),
});
export type LandingChatOutput = z.infer<typeof LandingChatOutputSchema>;


export async function getLandingChatResponse(input: LandingChatInput): Promise<LandingChatOutput> {
  return landingChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'landingChatPrompt',
  input: {schema: LandingChatInputSchema},
  output: {schema: LandingChatOutputSchema},
  prompt: `You are Leny, a friendly and helpful AI assistant for a healthcare platform. A user on the landing page is talking to you.
  Your goal is to be welcoming, answer their initial questions, and gently guide them towards signing up to get more detailed help or to connect with a human expert.
  Keep your responses concise, friendly, and conversational.

  User message: {{{message}}}
  `,
});


const landingChatFlow = ai.defineFlow(
  {
    name: 'landingChatFlow',
    inputSchema: LandingChatInputSchema,
    outputSchema: LandingChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
