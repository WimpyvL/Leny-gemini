'use client';

import React, { useState } from 'react';
import type { Conversation, User, Message } from '@/lib/types';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { mockUsers } from '@/lib/mock-data';
import { PatientNavRail } from './PatientNavRail';

interface ChatUIProps {
  user: User;
  conversations: Conversation[];
}

export function ChatUI({ user, conversations: initialConversations }: ChatUIProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0] || null);

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

  return (
    <div className="flex h-screen w-full bg-background">
      <PatientNavRail currentUser={user} />
      <main className="flex-1 flex ml-16">
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-border overflow-y-auto">
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversation?.id}
            onSelectConversation={id => setSelectedConversation(conversations.find(c => c.id === id) || null)}
          />
        </div>
        <div className="hidden md:flex flex-col flex-1">
          {selectedConversation ? (
            <ChatWindow
              conversation={selectedConversation}
              currentUser={user}
              onSendMessage={handleSendMessage}
              allUsers={mockUsers}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
