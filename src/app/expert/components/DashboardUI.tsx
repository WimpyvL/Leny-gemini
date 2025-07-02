'use client';

import React, { useState, useEffect } from 'react';
import type { Conversation, User, Message } from '@/lib/types';
import { UserList } from './UserList';
import { UserChatView } from './UserChatView';
import { NavRail, type AppView } from '@/app/user/components/NavRail';
import { AiAssistantPanel } from './AiAssistantPanel';
import { AiExpertsView } from './AiExpertsView'; 
import { ExpertProfile } from './ExpertProfile';

function EmptyChatPlaceholder() {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-muted-foreground bg-secondary p-8 text-center">
        <span className="text-5xl mb-4">🤖</span>
        <h2 className="text-2xl font-bold text-foreground">
            AI Assistant
        </h2>
        <p className="text-lg text-muted-foreground mt-1">Select a user to begin your review.</p>
      </div>
    );
}

interface DashboardUIProps {
  user: User;
  conversations: Conversation[];
  allUsers: User[];
}

export function DashboardUI({ user, conversations: initialConversations, allUsers }: DashboardUIProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [activeView, setActiveView] = useState<AppView>('chats');
  
  useEffect(() => {
    if (activeView === 'chats' && initialConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(initialConversations[0]);
    }
  }, [activeView, initialConversations, selectedConversation]);

  const handleSendMessage = (text: string) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      text,
      senderId: user.id,
      timestamp: new Date(),
      type: 'user',
    };

    const updatedConversations = conversations.map(c => {
      if (c.id === selectedConversation.id) {
        // Create a new messages array and update timestamp
        const newMessages = [...c.messages, newMessage];
        return { 
          ...c, 
          messages: newMessages,
          timestamp: new Date(),
        };
      }
      return c;
    });

    // Sort conversations to bring the updated one to the top
    updatedConversations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    setConversations(updatedConversations);
    setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id) || null);
  };
  
  const handleSelectConversation = (id: string) => {
    const conversation = conversations.find(c => c.id === id) || null;
    setSelectedConversation(conversation);
  };

  const renderMainContent = () => {
    switch (activeView) {
        case 'chats':
            return (
                <div className="flex flex-1 min-w-0">
                    <div className="w-[340px] flex-shrink-0 border-r border-border flex flex-col bg-card">
                        <UserList
                            conversations={conversations}
                            selectedConversationId={selectedConversation?.id}
                            onSelectConversation={handleSelectConversation}
                            currentUser={user}
                        />
                    </div>
                    <main className="flex-1 flex flex-col min-w-0">
                        {selectedConversation ? (
                        <UserChatView
                            key={selectedConversation.id}
                            conversation={selectedConversation}
                            currentUser={user}
                            onSendMessage={handleSendMessage}
                            allUsers={allUsers}
                        />
                        ) : (
                        <EmptyChatPlaceholder />
                        )}
                    </main>
                    <aside className="w-[380px] flex-shrink-0 border-l bg-card hidden lg:flex flex-col">
                        <AiAssistantPanel conversation={selectedConversation} currentUser={user} />
                    </aside>
                </div>
            );
        case 'aiexperts':
            return <AiExpertsView />;
        case 'profile':
            return <ExpertProfile user={user} />;
        default:
            return <EmptyChatPlaceholder />;
    }
  };
  
  return (
    <div className="flex h-screen w-full bg-background">
      <NavRail
        currentUser={user}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      {renderMainContent()}
    </div>
  );
}
