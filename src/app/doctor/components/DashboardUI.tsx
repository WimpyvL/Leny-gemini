'use client';

import React, { useState, useEffect } from 'react';
import type { Conversation, User, Message } from '@/lib/types';
import { PatientList } from './PatientList';
import { PatientChatView } from './PatientChatView';
import { PatientNavRail, type PatientView } from '@/app/patient/components/PatientNavRail';
import { ClinicalAssistantPanel } from './ClinicalAssistantPanel';
import { AiExpertsView } from './AiExpertsView'; // To be replaced
import { DoctorProfile } from './DoctorProfile';

function EmptyChatPlaceholder() {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-muted-foreground bg-secondary p-8 text-center">
        <span className="text-5xl mb-4">🤖</span>
        <h2 className="text-2xl font-bold text-foreground">
            Clinical Assistant
        </h2>
        <p className="text-lg text-muted-foreground mt-1">Select a patient to begin your review.</p>
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
  const [activeView, setActiveView] = useState<PatientView>('chats');
  
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
                        <PatientList
                            conversations={conversations}
                            selectedConversationId={selectedConversation?.id}
                            onSelectConversation={handleSelectConversation}
                            currentUser={user}
                        />
                    </div>
                    <main className="flex-1 flex flex-col min-w-0">
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
                    <aside className="w-[380px] flex-shrink-0 border-l bg-card hidden lg:flex flex-col">
                        <ClinicalAssistantPanel conversation={selectedConversation} currentUser={user} />
                    </aside>
                </div>
            );
        case 'aiexperts':
            // This view is being replaced by the integrated clinical assistant.
            // Kept for structure, but should be phased out.
            return <AiExpertsView />;
        case 'profile':
            return <DoctorProfile user={user} />;
        default:
            return <EmptyChatPlaceholder />;
    }
  };
  
  return (
    <div className="flex h-screen w-full bg-background">
      <PatientNavRail
        currentUser={user}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      {renderMainContent()}
    </div>
  );
}
