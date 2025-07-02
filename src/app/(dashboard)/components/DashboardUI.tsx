'use client';
import { useState } from 'react';
import { ChatWindow } from './ChatWindow';
import type { Conversation, User, Message } from '@/lib/types';
import { runQuery } from '@/app/actions';

interface DashboardUIProps {
  user: User;
  conversation: Conversation | null;
  allUsers: User[];
}

export function DashboardUI({ user, conversation: initialConversation, allUsers }: DashboardUIProps) {
  const [conversation, setConversation] = useState<Conversation | null>(initialConversation);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    if (!conversation) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      text,
      senderId: user.id,
      timestamp: new Date(),
      type: 'user',
    };

    // Update the local state immediately for a responsive feel
    setConversation(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);
    setIsLoading(true);

    try {
      const conversationHistory = conversation.messages.slice(-5).map(m => m.text || '');
      const aiResponse = await runQuery({
        text,
        userRole: user.role,
        conversationHistory
      });

      const aiMessage: Message = {
        id: `msg_ai_${Date.now()}`,
        text: aiResponse.content,
        senderId: 'assistant',
        timestamp: new Date(),
        type: 'user',
      };
      
      setConversation(prev => prev ? { ...prev, messages: [...prev.messages, aiMessage] } : null);

    } catch (error) {
      console.error("Failed to get AI response", error);
      const errorMessage: Message = {
          id: `msg_err_${Date.now()}`,
          text: 'Sorry, I had trouble getting a response. Please try again.',
          senderId: 'assistant',
          timestamp: new Date(),
          type: 'user',
      };
      setConversation(prev => prev ? { ...prev, messages: [...prev.messages, errorMessage] } : null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!conversation) {
    return (
        <div className="flex flex-col h-screen items-center justify-center text-center p-4">
            <div className="text-5xl mb-4">💬</div>
            <h2 className="text-2xl font-bold">No conversation found</h2>
            <p className="text-muted-foreground">Could not load the chat with S.A.N.I.</p>
        </div>
    );
  }
  
  return (
    <div className="flex h-screen w-full bg-background text-sm">
      <main className="flex-1 flex-col min-w-0 flex">
        <ChatWindow
            key={conversation.id}
            conversation={conversation}
            currentUser={user}
            allUsers={allUsers}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
        />
      </main>
    </div>
  );
}
