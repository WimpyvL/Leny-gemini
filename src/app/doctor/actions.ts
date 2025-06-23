'use server';
import { analyzeSymptoms } from '@/ai/flows/analyze-symptoms';
import { getExpertChatResponse } from '@/ai/flows/expert-chat-flow';
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

export async function runExpertChat(message: string, expertPrompt: string): Promise<string> {
  try {
    const result = await getExpertChatResponse({ message, expertPrompt });
    return result.response;
  } catch (error) {
    console.error('Error in expert chat:', error);
    return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
  }
}
