'use client';

import React, { useState } from 'react';
import type { Conversation, User, Message } from '@/lib/types';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { mockUsers } from '@/lib/mock-data';
import { PatientNavRail, type PatientView } from './PatientNavRail';
import { ForYou } from './ForYou';
import { Sparkles } from 'lucide-react';

interface ChatUIProps {
  user: User;
  conversations: Conversation[];
}

export function ChatUI({ user, conversations: initialConversations }: ChatUIProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0] || null);
  const [activeView, setActiveView] = useState<PatientView>('chats');

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
      <PatientNavRail 
        currentUser={user}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      <main className="flex-1 flex ml-16">
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-border overflow-y-auto">
          {activeView === 'chats' ? (
            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversation?.id}
              onSelectConversation={id => setSelectedConversation(conversations.find(c => c.id === id) || null)}
            />
          ) : (
            <ForYou />
          )}
        </div>
        <div className="hidden md:flex flex-col flex-1">
          {activeView === 'chats' ? (
            selectedConversation ? (
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
            )
          ) : (
             <div className="flex flex-col items-center justify-center h-full bg-secondary text-center p-8">
                <Sparkles className="h-16 w-16 text-primary mb-4" />
                <h2 className="text-2xl font-bold">Welcome to Your Space</h2>
                <p className="text-muted-foreground mt-2 max-w-md">This is your personal health dashboard. Select an item from the "For You" list to see more details here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
