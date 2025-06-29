'use server';

import { getLandingChatResponse } from '@/ai/flows/landing-chat-flow';
import { processQuery } from '@/ai/flows/query-flow';
import { getUserChatResponse } from '@/ai/flows/user-chat-flow';
import type { QueryInput, FormattedResponse } from '@/lib/types';


export async function runLandingChat(message: string, isFirstMessage: boolean): Promise<string> {
  try {
    const result = await getLandingChatResponse({ message, isFirstMessage });
    return result.response;
  } catch (error) {
    console.error('Error in landing page chat:', error);
    return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
  }
}

// This function can be used for non-medical, conversational chats.
export async function runUserChat(message: string, userName: string): Promise<string> {
  try {
    const result = await getUserChatResponse({ message, userName });
    return result.response;
  } catch (error) {
    console.error('Error in user chat:', error);
    return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
  }
}

// This function should be used for any query that might require deeper knowledge.
export async function runQuery(input: QueryInput): Promise<FormattedResponse> {
  try {
    const result = await processQuery(input);
    return result;
  } catch (error) {
     console.error('Error in user query:', error);
    return {
      content: 'An unexpected error occurred during AI analysis. Please manually review the case.',
      metadata: {
        responseMode: input.userRole === 'expert' ? 'professional' : 'consumer',
      },
    };
  }
}
