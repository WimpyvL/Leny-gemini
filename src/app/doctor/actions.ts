'use server';
<<<<<<< HEAD
import { analyzeSymptoms } from '@/ai/flows/analyze-symptoms';
import { getExpertChatResponse, type ExpertChatOutput } from '@/ai/flows/expert-chat-flow';
import type { AnalyzeSymptomsOutput } from '@/ai/flows/analyze-symptoms';
import { routeExpert } from '@/ai/flows/expert-router-flow';
import type { ExpertRouterInput, ExpertRouterOutput } from '@/ai/flows/expert-router-flow';
import type { AiExpert, Message, User } from '@/lib/types';
import { getExpertConsultation, type ExpertConsultationOutput } from '@/ai/flows/expert-consultation-flow';


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
=======
import { processMedicalQuery } from '@/ai/flows/medical-query-flow';
import type { MedicalQueryInput, FormattedClinicalResponse } from '@/lib/types';
import { getExpertChatResponse } from '@/ai/flows/expert-chat-flow';
>>>>>>> 4de5c1ea31c6afd7cb8b6b3e60a7b345ab82f1b4

export async function runExpertChat(message: string, expert: AiExpert): Promise<ExpertChatOutput> {
  try {
    const result = await getExpertChatResponse({ message, expertPrompt: expert.expert_prompt, expertId: expert.id });
    return result;
  } catch (error) {
    console.error('Error in expert chat:', error);
    return {
      evidenceSummary: 'An error occurred while fetching the analysis.',
      confidenceInEvidence: 'N/A',
      clinicalBottomLine: "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.",
      contraryOrUnanswered: 'N/A',
      quickActions: [],
      citations: [],
    };
  }
}

<<<<<<< HEAD
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

export async function runExpertConsultation(history: Message[], consultant: AiExpert, allExperts: AiExpert[], currentUser: User): Promise<ExpertConsultationOutput> {
    const formattedHistory = history.map(msg => {
        let senderName = '';
        if (msg.senderId === currentUser.id) {
            senderName = 'Doctor';
        } else {
            const expert = allExperts.find(e => e.id === msg.senderId);
            senderName = expert?.name || 'AI Expert';
        }
        return {
            senderName,
            text: msg.structuredResponse ? JSON.stringify(msg.structuredResponse) : msg.text || '',
        };
    });

    try {
        const result = await getExpertConsultation({
            history: formattedHistory,
            consultant: {
                id: consultant.id,
                name: consultant.name,
                specialty: consultant.specialty,
                expert_prompt: consultant.expert_prompt,
            },
        });
        return result;
    } catch (error) {
        console.error('Error in expert consultation flow:', error);
        return {
            evidenceSummary: 'An error occurred during the consultation.',
            confidenceInEvidence: 'N/A',
            clinicalBottomLine: "I'm sorry, I encountered an error during the consultation.",
            contraryOrUnanswered: 'N/A',
            quickActions: [],
            citations: [],
        };
    }
}
=======
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
      sources: [],
    };
  }
}
>>>>>>> 4de5c1ea31c6afd7cb8b6b3e60a7b345ab82f1b4
