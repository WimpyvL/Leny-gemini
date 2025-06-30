'use client';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import type { Conversation, User, Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { runQuery } from '@/app/actions';
import { mockUsers } from '@/lib/mock-data';
import { AiAssistantPanel } from './AiAssistantPanel';

interface DashboardUIProps {
  user: User;
  conversations: Conversation[];
  allUsers: User[];
}

export function DashboardUI({ user, conversations: initialConversations, allUsers: initialAllUsers }: DashboardUIProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [allUsers, setAllUsers] = useState<User[]>(initialAllUsers);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId) || null;

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      text,
      senderId: user.id,
      timestamp: new Date(),
      type: 'user',
    };

    const updatedConversationsWithUserMessage = conversations.map(c => {
      if (c.id === selectedConversation.id) {
        return { ...c, messages: [...c.messages, newMessage], timestamp: new Date() };
      }
      return c;
    }).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());

    setConversations(updatedConversationsWithUserMessage);

    const isAiChat = selectedConversation.participantIds.includes('assistant');

    if (isAiChat) {
      setIsLoading(true);
      try {
        const conversationHistory = selectedConversation.messages.slice(-5).map(m => m.text || '');
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

        setConversations(prevConvos => {
            const finalConvos = prevConvos.map(c => {
                if (c.id === selectedConversation!.id) {
                    return { ...c, messages: [...c.messages, aiMessage] };
                }
                return c;
            });
            return finalConvos;
        });

      } catch (error) {
        console.error("Failed to get AI response", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const showDetailView = !!selectedConversation;
  
  return (
    <div className="flex h-screen w-full bg-background text-sm">
      <Sidebar user={user} />
      <div className={cn(
        "w-full flex-shrink-0 border-r bg-card flex-col md:w-[320px]",
        showDetailView ? "hidden md:flex" : "flex"
      )}>
        <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            allUsers={allUsers}
            currentUser={user}
        />
      </div>
      <main className={cn(
        "flex-1 flex-col min-w-0",
        showDetailView ? "flex" : "hidden md:flex"
      )}>
        {selectedConversation ? (
            <ChatWindow
                key={selectedConversation.id}
                conversation={selectedConversation}
                currentUser={user}
                allUsers={allUsers}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                onBack={() => setSelectedConversationId(null)}
            />
        ) : (
            <div className="flex flex-col h-full items-center justify-center text-center p-4">
                <div className="text-5xl mb-4">👋</div>
                <h2 className="text-2xl font-bold">Welcome, {user.name.split(' ')[0]}!</h2>
                <p className="text-muted-foreground">Select a conversation to get started.</p>
            </div>
        )}
      </main>
      {user.role === 'expert' && (
        <aside className="w-[380px] flex-shrink-0 border-l bg-card hidden lg:flex flex-col">
            <AiAssistantPanel conversation={selectedConversation} currentUser={user} />
        </aside>
      )}
    </div>
  );
}
