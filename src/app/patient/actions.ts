'use server';

import { getPatientChatResponse } from '@/ai/flows/patient-chat-flow';

export async function runPatientChat(message: string, patientName: string): Promise<string> {
  try {
    const result = await getPatientChatResponse({ message, patientName });
    return result.response;
  } catch (error) {
    console.error('Error in patient chat:', error);
    return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
  }
}
