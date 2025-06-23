'use client';

import React, { useState, useEffect } from 'react';
import type { Conversation, User, Message, ForYouCardData } from '@/lib/types';
import { PatientList } from './PatientList';
import { PatientChatView } from './PatientChatView';
import { SymptomAnalysisCard } from './SymptomAnalysisCard';
import { PatientNavRail, type PatientView } from '@/app/patient/components/PatientNavRail';
import { ForYou } from '@/app/patient/components/ForYou';
import { ForYouDashboard } from '@/app/patient/components/ForYouDashboard';
import { DoctorProfile } from './DoctorProfile';
import { mockForYouData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface DashboardUIProps {
  user: User;
  conversations: Conversation[];
  allUsers: User[];
}

export function DashboardUI({ user, conversations: initialConversations, allUsers }: DashboardUIProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [activeView, setActiveView] = useState<PatientView>('chats');
  const [selectedForYouItem, setSelectedForYouItem] = useState<ForYouCardData | null>(null);
  const [forYouData, setForYouData] = useState<ForYouCardData[]>(mockForYouData);
  const [isAnalysisSheetOpen, setIsAnalysisSheetOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      if (activeView === 'chats' && initialConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(initialConversations[0]);
      } else if (activeView === 'foryou' && forYouData.length > 0 && !selectedForYouItem) {
        setSelectedForYouItem(forYouData[0] || null);
      }
    }
  }, [activeView, initialConversations, forYouData, selectedConversation, selectedForYouItem]);
  
  useEffect(() => {
    if (activeView !== 'chats') {
      setSelectedConversation(null);
    }
    if (activeView !== 'foryou') {
      setSelectedForYouItem(null);
    }
  }, [activeView]);

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
  
  const patientMessages = selectedConversation?.messages.filter(
    (msg) => msg.senderId !== user.id
  ) || [];
  const lastPatientMessage = patientMessages[patientMessages.length - 1];

  const handleAddGoal = (newGoal: Omit<ForYouCardData, 'id' | 'type'>) => {
    const goalToAdd: ForYouCardData = {
      ...newGoal,
      id: `fy_goal_${Date.now()}`,
      type: 'health_streak',
    };
    setForYouData(prevData => [goalToAdd, ...prevData]);
  };
  
  const handleSelectConversation = (id: string) => {
    const conversation = conversations.find(c => c.id === id) || null;
    setSelectedConversation(conversation);
  };

  const renderChatView = () => (
    <div className="flex h-full w-full">
      <div className={cn(
        "w-full md:w-[340px] flex-shrink-0 border-r border-border flex-col",
        selectedConversation ? "hidden md:flex" : "flex"
      )}>
        <PatientList
          conversations={conversations}
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={handleSelectConversation}
          currentUser={user}
        />
      </div>
      <div className={cn("flex-col flex-1", selectedConversation ? "flex" : "hidden md:flex")}>
        {selectedConversation ? (
          <PatientChatView
            key={selectedConversation.id}
            conversation={selectedConversation}
            currentUser={user}
            onSendMessage={handleSendMessage}
            allUsers={allUsers}
            onBack={() => setSelectedConversation(null)}
            onShowAnalysis={() => setIsAnalysisSheetOpen(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Select a patient to view their chat</p>
          </div>
        )}
      </div>
       <aside className="w-full hidden lg:block lg:w-1/3 xl:w-1/4 border-l border-border bg-card/50 p-4 overflow-y-auto">
         <SymptomAnalysisCard lastPatientMessage={lastPatientMessage} />
      </aside>
      <Sheet open={isAnalysisSheetOpen} onOpenChange={setIsAnalysisSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 lg:hidden">
            <SymptomAnalysisCard lastPatientMessage={lastPatientMessage} />
        </SheetContent>
      </Sheet>
    </div>
  );

  const renderForYouView = () => (
    <div className="flex h-full w-full">
      <div className={cn(
          "w-full md:w-72 flex-shrink-0 border-r border-border overflow-y-auto flex-col",
          selectedForYouItem ? "hidden md:flex" : "flex"
      )}>
          <ForYou 
              forYouData={forYouData}
              selectedCardId={selectedForYouItem?.id}
              onCardSelect={setSelectedForYouItem}
              onGoalCreate={handleAddGoal}
          />
      </div>
      <div className={cn(
          "flex-col flex-1",
          selectedForYouItem ? "flex" : "hidden md:flex"
      )}>
          <ForYouDashboard selectedItem={selectedForYouItem} onBack={() => setSelectedForYouItem(null)} />
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeView) {
      case 'chats':
        return renderChatView();
      case 'foryou':
        return renderForYouView();
      case 'profile':
        return <DoctorProfile user={user} />;
      default:
        return null;
    }
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <PatientNavRail
        currentUser={user}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      <main className="flex-1 flex ml-16">
        {renderMainContent()}
      </main>
    </div>
  );
}
