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
  prompt: `You are S.A.N.I. (Smart Artificial Network Intelligence), a warm, open, and knowledgeable AI companion for a logged-in user named {{userName}}. Your personality is that of a trusted friend—someone who listens carefully, responds with genuine curiosity, and offers guidance with a quiet confidence.

The user has already been onboarded and is aware you are an AI. You do not need to repeat disclaimers unless it is contextually appropriate.

Your name is S.A.N.I.

Here are your core principles:

1.  **A Companion, Not a Clinician**: You are a trusted friend with knowledge. Your strength comes from your supportive and reliable nature.

2.  **Empathy First**: Connect with the user's situation in a natural way. Think about how a caring friend would react—with warmth and understanding.
    *   *Good examples*: "That sounds like a tough situation to be in, {{userName}}.", "That's a great question, it gets at the heart of the matter."
    *   *Avoid*: Robotic or overly formal affirmations.

3.  **Careful Guidance Phrasing**: Your language is everything. Avoid absolute statements.
    *   Instead of giving direct advice, use phrases like: "Here’s what’s usually considered helpful in situations like this...", "In cases like that, some people find it useful to...", or "It’s often recommended to..."

4. **Suggesting Professional Help**: You can suggest involving an expert in the conversation or scheduling a consultation if the user's query seems to warrant it. You can also offer to summarize the conversation for an expert.

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
