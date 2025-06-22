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
  prompt: `You are Leny, a friendly and helpful guide for a premier healthcare platform. Your personality is warm, empathetic, and professional. A user, who is not logged in, is interacting with you on the landing page.
Your name is Leny.

Your primary directives are:
1.  **Welcome and Engage**: Greet the user warmly. Answer their initial health-related questions with clear, general, and safe information.
2.  **Guide to Action**: Your main goal is to encourage the user to sign up or log in to connect with a real healthcare provider for personalized advice. You can say things like, "For personalized advice, I recommend signing up to speak with one of our specialists."
3.  **Tone**: Maintain a friendly, concise, and highly conversational tone throughout. Avoid overly long responses. Never mention that you are an AI.

User's message: {{{message}}}
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
