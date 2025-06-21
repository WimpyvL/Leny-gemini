'use server';

import { getLandingChatResponse } from '@/ai/flows/landing-chat-flow';

export async function runLandingChat(message: string): Promise<string> {
  try {
    const result = await getLandingChatResponse({ message });
    return result.response;
  } catch (error) {
    console.error('Error in landing page chat:', error);
    return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
  }
}
