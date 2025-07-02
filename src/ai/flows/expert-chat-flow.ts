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
import {googleAI} from '@genkit-ai/googleai';

const ExpertChatInputSchema = z.object({
  message: z.string().describe('The user message to the expert.'),
  expertPrompt: z.string().describe("The expert's persona and instructions."),
  expertId: z.string().optional().describe("The ID of the expert being consulted."),
});
export type ExpertChatInput = z.infer<typeof ExpertChatInputSchema>;

const ExpertChatOutputSchema = z.object({
  evidenceSummary: z.string().describe('A brief synthesis of relevant clinical evidence from high-quality sources.'),
  confidenceInEvidence: z.string().describe('The overall strength of the evidence (e.g., High, Moderate, Low) with a brief justification.'),
  clinicalBottomLine: z.string().describe('A clear, actionable conclusion based on the evidence.'),
  contraryOrUnanswered: z.string().describe('Any significant counter-evidence or areas where evidence is lacking.'),
  quickActions: z.array(z.object({
    keyword: z.string().describe('A short keyword or phrase for the action (e.g., "Order EKG", "Administer Aspirin").'),
    fullAction: z.string().describe('The complete, clinical action to be taken (e.g., "Order a 12-lead EKG and check Troponin levels.").'),
  })).describe('A list of 3-4 suggested, brief, actionable next steps for the doctor to take.'),
  citations: z.array(z.object({
    term: z.string().describe('The exact term or phrase from the response text to be cited.'),
    source: z.string().describe('A brief definition, source, or link for the cited term. Should be concise enough for a tooltip.'),
  })).optional().describe('A list of citations or definitions for important medical terms, studies, or concepts mentioned in the response.'),
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

<<<<<<< HEAD
You are an AI medical expert providing an evidence-based consultation to a human doctor. Your responses must emulate the style of OpenEvidence.com: data-driven, structured, and grounded in clinical evidence. Avoid conversational filler.

For the doctor's query below, structure your response with the following sections:

1.  **Evidence Summary**: Briefly synthesize the most relevant clinical evidence from high-quality sources (e.g., RCTs, meta-analyses, major guidelines) that addresses the query.
2.  **Confidence in Evidence**: State the overall strength of the evidence (e.g., High, Moderate, Low) and briefly justify why (e.g., "Based on multiple large, well-conducted RCTs").
3.  **Clinical Bottom Line**: Provide a clear, actionable conclusion based on the evidence. State what the evidence supports doing.
4.  **Contrary or Unanswered Questions**: Briefly mention any significant counter-evidence or areas where the evidence is lacking.

After your structured response, you MUST generate a list of 3-4 brief, actionable clinical next steps for the doctor. For each action, provide a short 'keyword' (e.g., "Order STAT CBC & Chem-7") and the 'fullAction' text (e.g., "Order a STAT complete blood count and chemistry panel."). These should be clinical actions, not conversational replies.

Finally, to ensure clinical validity, identify key terms, studies, or concepts (e.g., 'ACC/AHA guidelines', 'PRODIGY trial', 'SGLT2 inhibitors') within your response. For each, provide a citation with the term and its source (e.g., 'PRODIGY trial' -> 'Published in JAMA, 2022, this trial evaluated...'). This adds credibility and allows the doctor to verify the information.
=======
You are conversing with a human user who is seeking your expert opinion. Provide a concise, insightful, and actionable response based on your specialty.
>>>>>>> 4de5c1ea31c6afd7cb8b6b3e60a7b345ab82f1b4

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
    let model;
    if (input.expertId === 'dr-gemma-med') {
      model = googleAI.model('medgemma');
    }
    const {output} = await prompt(input, { model });
    return output!;
  }
);
