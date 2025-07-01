'use server';
import { analyzeSymptoms } from '@/ai/flows/analyze-symptoms';
import { getExpertChatResponse } from '@/ai/flows/expert-chat-flow';
import type { AnalyzeSymptomsOutput } from '@/ai/flows/analyze-symptoms';
import { routeExpert } from '@/ai/flows/expert-router-flow';
import type { ExpertRouterInput, ExpertRouterOutput } from '@/ai/flows/expert-router-flow';
import type { AiExpert } from '@/lib/types';


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

export async function runExpertRouter(history: ExpertRouterInput['history'], experts: AiExpert[]): Promise<ExpertRouterOutput> {
  const expertList = experts.map(e => ({ id: e.id, name: e.name, specialty: e.specialty }));
  try {
    const result = await routeExpert({ history, experts: expertList });
    return result;
  } catch (error) {
    console.error('Error in expert router flow:', error);
    return {
      response: "I'm sorry, I'm having trouble routing your request. Please select an expert manually.",
      suggestedExpertId: undefined,
      isUrgent: false,
      urgencyReason: '',
      quickActions: [],
      summaryForExpert: 'Error routing request.',
    };
  }
}
