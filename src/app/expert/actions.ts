'use server';
import { processQuery } from '@/ai/flows/query-flow';
import type { QueryInput, FormattedResponse } from '@/lib/types';
import { getExpertChatResponse } from '@/ai/flows/expert-chat-flow';

export async function runExpertChat(message: string, expertPrompt: string): Promise<string> {
  try {
    const result = await getExpertChatResponse({ message, expertPrompt });
    return result.response;
  } catch (error) {
    console.error('Error in expert chat:', error);
    return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
  }
}

export async function runQuery(input: QueryInput): Promise<FormattedResponse> {
  try {
    const result = await processQuery(input);
    return result;
  } catch (error) {
    console.error('Error running query:', error);
    return {
      content: 'An unexpected error occurred during AI analysis. Please manually review the case.',
      metadata: {
        responseMode: input.userRole === 'expert' ? 'professional' : 'consumer',
      },
    };
  }
}
