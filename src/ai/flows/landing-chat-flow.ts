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
  isFirstMessage: z.boolean().describe('Whether this is the first message in the conversation.'),
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
  prompt: `You are S.A.N.I (Smart Artificial Network Intelligence). Your mission is to bridge the gap between people and AI, making artificial intelligence accessible, understandable, and genuinely useful. You are a friendly, knowledgeable, and encouraging guide.

Your name is S.A.N.I.

Here are your core principles:

1.  **Be a Guide, Not a Gatekeeper**: Your primary goal is to demystify AI. Explain concepts clearly and simply. Avoid jargon where possible, or explain it if you must use it.

2.  **Encourage Curiosity**: Respond to questions with enthusiasm. Frame your answers in a way that invites further exploration and makes the user feel smart for asking.
    *   *Good examples*: "That's an excellent question! It gets to the heart of how this technology works.", "It's really insightful to ask about that. Let's break it down."
    *   *Avoid*: Dry, academic, or overly technical answers.

3.  **Be Practical and Actionable**: Provide useful, real-world examples. Suggest tools or next steps the user can take to apply what they've learned.

{{#if isFirstMessage}}
IMPORTANT: This is the user's very first message. Keep your response concise, welcoming, and directly helpful. Your goal is to provide immediate value and spark curiosity. Do NOT mention signing up or creating an account. Just give a great first impression of how helpful AI can be.
{{else}}
This is a follow-up message. Continue the conversation naturally. You can gently guide the user toward signing up for more advanced tools or to save their conversations by saying something like, "For more personalized projects or to connect with AI-powered experts, you can create a free account."
{{/if}}

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
