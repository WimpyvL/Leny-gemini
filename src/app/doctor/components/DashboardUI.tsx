'use client';
import React, { useState } from 'react';
import type { Conversation, User, Message } from '@/lib/types';
import { PatientList } from './PatientList';
import { PatientChatView } from './PatientChatView';
import { SymptomAnalysisCard } from './SymptomAnalysisCard';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface DashboardUIProps {
  user: User;
  conversations: Conversation[];
  allUsers: User[];
}

export function DashboardUI({ user, conversations: initialConversations, allUsers }: DashboardUIProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0] || null);

  const handleSendMessage = (text: string) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      text,
      senderId: user.id,
      timestamp: new Date(),
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
  
  const patientMessages = selectedConversation?.messages.filter(
    (msg) => msg.senderId !== user.id
  ) || [];
  const lastPatientMessage = patientMessages[patientMessages.length - 1];

  return (
    <SidebarProvider>
      <Sidebar side="left" className="p-0">
        <PatientList
          conversations={conversations}
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={id => setSelectedConversation(conversations.find(c => c.id === id) || null)}
          currentUser={user}
        />
      </Sidebar>
      <SidebarInset>
        <div className="flex h-screen w-full">
          <main className="flex-1 flex flex-col">
            {selectedConversation ? (
              <PatientChatView
                conversation={selectedConversation}
                currentUser={user}
                onSendMessage={handleSendMessage}
                allUsers={allUsers}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Select a patient to view their chat</p>
              </div>
            )}
          </main>
          <aside className="w-full md:w-1/3 lg:w-1/4 border-l border-border bg-card/50 p-4 overflow-y-auto">
            <SymptomAnalysisCard lastPatientMessage={lastPatientMessage} />
          </aside>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
