'use server';
import { processMedicalQuery } from '@/ai/flows/medical-query-flow';
import type { MedicalQueryInput, FormattedClinicalResponse } from '@/lib/types';
import { getExpertChatResponse } from '@/ai/flows/expert-chat-flow';
import { analyzeSymptoms, type AnalyzeSymptomsOutput } from '@/ai/flows/analyze-symptoms';

export async function runExpertChat(message: string, expertPrompt: string): Promise<string> {
  try {
    const result = await getExpertChatResponse({ message, expertPrompt });
    return result.response;
  } catch (error) {
    console.error('Error in expert chat:', error);
    return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
  }
}

export async function runAnalysis(message: string): Promise<AnalyzeSymptomsOutput> {
  try {
    const result = await analyzeSymptoms({ message });
    return result;
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    return {
      symptoms: [],
      emergencyDetected: true,
      urgencyReason: 'An error occurred during analysis.'
    };
  }
}

export async function runMedicalQuery(input: MedicalQueryInput): Promise<FormattedClinicalResponse> {
  try {
    const result = await processMedicalQuery(input);
    return result;
  } catch (error) {
    console.error('Error running medical query:', error);
    const classification = {
      context: 'other',
      specialty: 'internal_medicine',
      hasRedFlags: true,
      reason: 'AI system error.'
    } as const;
    return {
      content: 'An unexpected error occurred during AI analysis. Please manually review the case.',
      metadata: {
        classification,
        responseMode: input.userType === 'provider' ? 'professional' : 'consumer',
      },
      escalationTriggered: true,
    };
  }
}
