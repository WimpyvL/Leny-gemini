'use server';

import { processQuery } from '@/ai/flows/query-flow';
import { getUserChatResponse } from '@/ai/flows/user-chat-flow';

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
export async function runUserQuery(text: string, conversationHistory: string[] = []): Promise<string> {
  try {
    const result = await processQuery({
        text,
        userRole: 'user',
        conversationHistory,
    });
    return result.content;
  } catch (error) {
     console.error('Error in user query:', error);
    return "I'm sorry, I'm having a little trouble with my knowledge base right now. Please try again in a moment.";
  }
}
