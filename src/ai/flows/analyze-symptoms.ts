'use server';

/**
 * @fileOverview An AI agent that analyzes patient symptoms and detects potential emergencies.
 *
 * - analyzeSymptoms - A function that analyzes chat messages, extracts relevant symptoms, and detects potential emergencies.
 * - AnalyzeSymptomsInput - The input type for the analyzeSymptoms function.
 * - AnalyzeSymptomsOutput - The return type for the analyzeSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSymptomsInputSchema = z.object({
  message: z.string().describe('The chat message from the patient.'),
});
export type AnalyzeSymptomsInput = z.infer<typeof AnalyzeSymptomsInputSchema>;

const AnalyzeSymptomsOutputSchema = z.object({
  symptoms: z.array(z.string()).describe('The list of extracted symptoms.'),
  emergencyDetected: z.boolean().describe('Whether a potential emergency is detected.'),
  urgencyReason: z.string().optional().describe('The reason for the detected emergency, if any.'),
});
export type AnalyzeSymptomsOutput = z.infer<typeof AnalyzeSymptomsOutputSchema>;

export async function analyzeSymptoms(input: AnalyzeSymptomsInput): Promise<AnalyzeSymptomsOutput> {
  return analyzeSymptomsFlow(input);
}

const extractSymptomsTool = ai.defineTool({
  name: 'extractSymptoms',
  description: 'Extracts a list of symptoms from a patient message.',
  inputSchema: z.object({
    message: z.string().describe('The chat message from the patient.'),
  }),
  outputSchema: z.array(z.string()),
}, async (input) => {
  // Mock implementation for extracting symptoms
  // In a real application, this would involve more sophisticated NLP techniques
  const message = input.message.toLowerCase();
  const extractedSymptoms: string[] = [];

  if (message.includes('fever')) {
    extractedSymptoms.push('Fever');
  }
  if (message.includes('cough')) {
    extractedSymptoms.push('Cough');
  }
  if (message.includes('shortness of breath')) {
    extractedSymptoms.push('Shortness of breath');
  }
  if (message.includes('chest pain')) {
    extractedSymptoms.push('Chest pain');
  }
  if (message.includes('headache')) {
    extractedSymptoms.push('Headache');
  }
  return extractedSymptoms;
});

const detectEmergencyTool = ai.defineTool({
  name: 'detectEmergency',
  description: 'Detects potential emergencies from a list of symptoms and a patient message.',
  inputSchema: z.object({
    symptoms: z.array(z.string()).describe('The list of extracted symptoms.'),
    message: z.string().describe('The chat message from the patient.'),
  }),
  outputSchema: z.object({
    emergencyDetected: z.boolean().describe('Whether a potential emergency is detected.'),
    urgencyReason: z.string().optional().describe('The reason for the detected emergency, if any.'),
  }),
}, async (input) => {
  const {symptoms, message} = input;
  if (symptoms.includes('Chest pain') && symptoms.includes('Shortness of breath')) {
    return {emergencyDetected: true, urgencyReason: 'Possible heart attack or severe respiratory issue.'};
  }
  if (message.toLowerCase().includes('suicidal thoughts')) {
    return {emergencyDetected: true, urgencyReason: 'Patient is expressing suicidal thoughts.'};
  }
  return {emergencyDetected: false};
});

const prompt = ai.definePrompt({
  name: 'analyzeSymptomsPrompt',
  tools: [extractSymptomsTool, detectEmergencyTool],
  input: {schema: AnalyzeSymptomsInputSchema},
  output: {schema: AnalyzeSymptomsOutputSchema},
  prompt: `You are an AI assistant helping doctors to quickly understand patient situations.

  Analyze the following patient message, extract relevant symptoms, and detect potential emergencies.

  Message: {{{message}}}

  First, use the extractSymptoms tool to extract the symptoms from the message.
  Then, use the detectEmergency tool to determine if there is an emergency based on the extracted symptoms and the message.

  Return the symptoms, whether an emergency was detected, and the reason for the emergency if one was detected.
  `,
});

const analyzeSymptomsFlow = ai.defineFlow(
  {
    name: 'analyzeSymptomsFlow',
    inputSchema: AnalyzeSymptomsInputSchema,
    outputSchema: AnalyzeSymptomsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
