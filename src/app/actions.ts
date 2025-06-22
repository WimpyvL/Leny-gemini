'use server';

import { getLandingChatResponse } from '@/ai/flows/landing-chat-flow';

export async function runLandingChat(message: string, isFirstMessage: boolean): Promise<string> {
  try {
    const result = await getLandingChatResponse({ message, isFirstMessage });
    return result.response;
  } catch (error) {
    console.error('Error in landing page chat:', error);
    return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
  }
}
