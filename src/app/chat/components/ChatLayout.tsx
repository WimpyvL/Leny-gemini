'use client';
import React, { useState } from 'react';
import type { Conversation, User, Message } from '@/lib/types';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';

interface ChatLayoutProps {
  user: User;
  conversations: Conversation[];
  allUsers: User[];
}

export function ChatLayout({ user, conversations: initialConversations, allUsers }: ChatLayoutProps) {
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
        // Create a new messages array
        const newMessages = [...c.messages, newMessage];
        
        // Return a new conversation object
        return { 
          ...c, 
          messages: newMessages,
          timestamp: new Date(), // Update conversation timestamp
        };
      }
      return c;
    });

    // Sort conversations by most recent message
    updatedConversations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    setConversations(updatedConversations);
    setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id) || null);
  };

  return (
    <div className="flex h-screen w-full bg-background text-sm">
      <ConversationList
        conversations={conversations}
        selectedConversationId={selectedConversation?.id}
        onSelectConversation={id => setSelectedConversation(conversations.find(c => c.id === id) || null)}
        currentUser={user}
      />
      <main className="flex-1 flex flex-col">
        {selectedConversation ? (
          <ChatWindow
            key={selectedConversation.id}
            conversation={selectedConversation}
            currentUser={user}
            onSendMessage={handleSendMessage}
            allUsers={allUsers}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
}
