'use client';

import React, { useState, useEffect } from 'react';
import type { Conversation, User, Message, ForYouCardData } from '@/lib/types';
import { PatientList } from './PatientList';
import { PatientChatView } from './PatientChatView';
import { PatientNavRail, type PatientView } from '@/app/patient/components/PatientNavRail';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface DashboardUIProps {
  user: User;
  conversations: Conversation[];
  allUsers: User[];
}

function EmptyChatPlaceholder() {
    const assistant = mockUsers.find(u => u.id === 'assistant');
    if (!assistant) return null;

    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-muted-foreground bg-secondary p-8 text-center">
        <Avatar className={cn("h-16 w-16 mb-4", assistant.avatarColor)}>
            <AvatarFallback className={cn("text-white text-3xl", assistant.avatarColor)}>
                {assistant.icon}
            </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold text-foreground">
            {assistant.name}
        </h2>
        <p className="text-lg text-muted-foreground mt-1">Ready to help with your questions</p>
      </div>
    );
}

export function DashboardUI({ user, conversations: initialConversations, allUsers }: DashboardUIProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [activeView, setActiveView] = useState<PatientView>('chats');
  
  useEffect(() => {
    if (activeView === 'chats' && initialConversations.length > 0 && !selectedConversation) {
        const generalAiChat = initialConversations.find(c => c.id === 'conv_general_ai_doctor1');
        setSelectedConversation(generalAiChat || initialConversations[0]);
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
        return { ...c, messages: [...c.messages, newMessage] };
      }
      return c;
    });

    setConversations(updatedConversations);
    setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id) || null);
  };
  
  const handleSelectConversation = (id: string) => {
    const conversation = conversations.find(c => c.id === id) || null;
    setSelectedConversation(conversation);
  };
  
  return (
    <div className="flex h-screen w-full bg-background">
      <PatientNavRail
        currentUser={user}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      <div className="w-[340px] flex-shrink-0 border-r border-border flex flex-col bg-card">
         <PatientList
          conversations={conversations}
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={handleSelectConversation}
          currentUser={user}
        />
      </div>
      <main className="flex-1 flex flex-col">
        {selectedConversation ? (
          <PatientChatView
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
    </div>
  );
}
