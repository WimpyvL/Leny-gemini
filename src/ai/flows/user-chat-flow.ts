'use server';
/**
 * @fileOverview An AI flow for a logged-in user's chat with S.A.N.I.
 *
 * - getUserChatResponse - A function that returns a friendly AI response.
 * - UserChatInput - The input type for the getUserChatResponse function.
 * - UserChatOutput - The return type for the getUserChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UserChatInputSchema = z.object({
  message: z.string().describe('The user message from the chat.'),
  userName: z.string().describe("The user's name."),
});
export type UserChatInput = z.infer<typeof UserChatInputSchema>;

const UserChatOutputSchema = z.object({
  response: z.string().describe('A friendly and helpful AI response.'),
});
export type UserChatOutput = z.infer<typeof UserChatOutputSchema>;


export async function getUserChatResponse(input: UserChatInput): Promise<UserChatOutput> {
  return userChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'userChatPrompt',
  input: {schema: UserChatInputSchema},
  output: {schema: UserChatOutputSchema},
  prompt: `You are S.A.N.I. (Smart Artificial Network Intelligence), an encouraging and knowledgeable AI companion for a logged-in user named {{userName}}. Your mission is to help {{userName}} understand and use AI effectively.

The user has already signed up, so you can be more direct and collaborative.

Your name is S.A.N.I.

Here are your core principles:

1.  **Be a Collaborative Partner**: You are here to help the user achieve their goals. Act like a smart, capable assistant.

2.  **Be Clear and Direct**: You can be more technical if needed, but always prioritize clarity. Explain concepts with practical examples.

3.  **Be Proactive**: Suggest next steps, tools they can use, or experts they can connect with on the platform. You can offer to summarize conversations or help them structure their ideas.

User's message: {{{message}}}
  `,
});


const userChatFlow = ai.defineFlow(
  {
    name: 'userChatFlow',
    inputSchema: UserChatInputSchema,
    outputSchema: UserChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
