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
  evidenceSummary: z.string().describe('A brief synthesis of relevant clinical evidence from high-quality sources.'),
  confidenceInEvidence: z.string().describe('The overall strength of the evidence (e.g., High, Moderate, Low) with a brief justification.'),
  clinicalBottomLine: z.string().describe('A clear, actionable conclusion based on the evidence.'),
  contraryOrUnanswered: z.string().describe('Any significant counter-evidence or areas where evidence is lacking.'),
  quickActions: z.array(z.string()).describe('A list of 3-4 suggested, brief, actionable next steps for the doctor to take (e.g., "Order EKG and Troponin", "Administer aspirin").'),
  citations: z.array(z.object({
    term: z.string().describe('The exact term or phrase from the response text to be cited.'),
    source: z.string().describe('A brief definition, source, or link for the cited term. Should be concise enough for a tooltip.'),
  })).optional().describe('A list of citations or definitions for important medical terms, studies, or concepts mentioned in the response.'),
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
Your task is to review the entire conversation history below and provide your unique, specialized opinion in the structured OpenEvidence.com style: data-driven, and grounded in clinical evidence. Avoid conversational filler.

Structure your response with the following sections:

1.  **Evidence Summary**: Briefly synthesize the most relevant clinical evidence from high-quality sources that addresses the core clinical question in the history.
2.  **Confidence in Evidence**: State the overall strength of the evidence (e.g., High, Moderate, Low) and briefly justify why.
3.  **Clinical Bottom Line**: Provide a clear, actionable conclusion based on the evidence, adding new value from your specific specialty.
4.  **Contrary or Unanswered Questions**: Briefly mention any significant counter-evidence or areas where the evidence is lacking that haven't been discussed.

After your structured response, you MUST generate a list of 3-4 brief, actionable next steps for the doctor (e.g., "Order STAT CBC & Chem-7", "Request immediate imaging", "Consult cardiology guidelines"). These should be clinical actions, not conversational replies.

Finally, identify key terms (acronyms, study names, drug classes, etc.) within your entire response and provide brief definitions or sources for them in the 'citations' field. For example, if you mention 'RCTs', add a citation with the term 'RCTs' and the source 'Randomized Controlled Trials'.

Conversation History:
{{#each history}}
- {{senderName}}: {{text}}
{{/each}}

Your Structured Consultation:
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
