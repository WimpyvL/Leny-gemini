'use server';

import { processMedicalQuery } from '@/ai/flows/medical-query-flow';
import { getPatientChatResponse } from '@/ai/flows/patient-chat-flow';

// This function can be used for non-medical, conversational chats.
export async function runPatientChat(message: string, patientName: string): Promise<string> {
  try {
    const result = await getPatientChatResponse({ message, patientName });
    return result.response;
  } catch (error) {
    console.error('Error in patient chat:', error);
    return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
  }
}

// This function should be used for any query that might be medical in nature.
export async function runMedicalPatientQuery(text: string, conversationHistory: string[] = []): Promise<string> {
  try {
    const result = await processMedicalQuery({
        text,
        userType: 'patient',
        conversationHistory,
    });
    return result.content;
  } catch (error) {
     console.error('Error in medical patient query:', error);
    return "I'm sorry, I'm having a little trouble with my medical knowledge base right now. Please try again in a moment.";
  }
}
