'use server';
import { analyzeSymptoms } from '@/ai/flows/analyze-symptoms';
import type { AnalyzeSymptomsOutput } from '@/ai/flows/analyze-symptoms';

export async function runAnalysis(message: string): Promise<AnalyzeSymptomsOutput> {
  try {
    const result = await analyzeSymptoms({ message });
    return result;
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    return {
      symptoms: [],
      emergencyDetected: false,
      urgencyReason: 'An error occurred during AI analysis.'
    };
  }
}
