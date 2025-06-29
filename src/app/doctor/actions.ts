'use server';
import { processMedicalQuery, type MedicalQueryInput, type FormattedClinicalResponse } from '@/ai/flows/medical-query-flow';

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
    };
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
