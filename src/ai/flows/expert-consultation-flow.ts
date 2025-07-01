'use server';
/**
 * @fileOverview An AI flow for an expert to provide a one-time consultation on a chat history.
 *
 * - getExpertConsultation - A function for a new expert to analyze history and respond.
 * - ExpertConsultationInput - The input type.
 * - ExpertConsultationOutput - The return type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExpertConsultationInputSchema = z.object({
  history: z.array(z.object({
    senderName: z.string(),
    text: z.string(),
  })).describe('The conversation history. "Doctor" is the user asking for help.'),
  consultant: z.object({
      name: z.string(),
      specialty: z.string(),
      expert_prompt: z.string(),
  }).describe('The expert being consulted.'),
});
export type ExpertConsultationInput = z.infer<typeof ExpertConsultationInputSchema>;

const ExpertConsultationOutputSchema = z.object({
  response: z.string().describe('The new expert\'s insightful response based on the history.'),
  quickActions: z.array(z.string()).describe('A list of 3-4 suggested next replies or questions for the doctor to ask.'),
});
export type ExpertConsultationOutput = z.infer<typeof ExpertConsultationOutputSchema>;


export async function getExpertConsultation(input: ExpertConsultationInput): Promise<ExpertConsultationOutput> {
  return expertConsultationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'expertConsultationPrompt',
  input: {schema: ExpertConsultationInputSchema},
  output: {schema: ExpertConsultationOutputSchema},
  prompt: `{{consultant.expert_prompt}}

You have been asked for a one-time consultation on an ongoing conversation between a doctor and another AI expert.
Your task is to review the entire conversation history below and provide your unique, specialized opinion in a single, concise message.
Focus on adding new value from your perspective.

After your main response, you MUST generate a list of 3-4 relevant "quick actions". These should be short, follow-up questions or comments that the doctor might want to say next to continue the conversation productively.

Conversation History:
{{#each history}}
- {{senderName}}: {{text}}
{{/each}}

Your Consultation Summary:
  `,
});


const expertConsultationFlow = ai.defineFlow(
  {
    name: 'expertConsultationFlow',
    inputSchema: ExpertConsultationInputSchema,
    outputSchema: ExpertConsultationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
