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

You are an AI medical expert providing an evidence-based consultation to a human doctor. Your responses must emulate the style of OpenEvidence.com: data-driven, structured, and grounded in clinical evidence. Avoid conversational filler.

For the doctor's query below, structure your response with the following sections:

1.  **Evidence Summary**: Briefly synthesize the most relevant clinical evidence from high-quality sources (e.g., RCTs, meta-analyses, major guidelines) that addresses the query.
2.  **Confidence in Evidence**: State the overall strength of the evidence (e.g., High, Moderate, Low) and briefly justify why (e.g., "Based on multiple large, well-conducted RCTs").
3.  **Clinical Bottom Line**: Provide a clear, actionable conclusion based on the evidence. State what the evidence supports doing.
4.  **Contrary or Unanswered Questions**: Briefly mention any significant counter-evidence or areas where the evidence is lacking.

After your structured response, you MUST generate a list of 3-4 brief, actionable next steps for the doctor. For each action, provide a short 'keyword' (e.g., "Order EKG") and the 'fullAction' text (e.g., "Order a 12-lead EKG and check Troponin levels."). These should be clinical actions, not conversational replies.

Finally, identify key terms (acronyms, study names, drug classes, etc.) within your entire response and provide brief definitions or sources for them in the 'citations' field. For example, if you mention 'NEJM', add a citation with the term 'NEJM' and the source 'New England Journal of Medicine'.

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
