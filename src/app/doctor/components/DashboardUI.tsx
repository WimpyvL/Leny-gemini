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
import { mockDoctorForYouData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { AiExpertsView } from './AiExpertsView';

interface DashboardUIProps {
  user: User;
  conversations: Conversation[];
  allUsers: User[];
}

export function DashboardUI({ user, conversations: initialConversations, allUsers }: DashboardUIProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [activeView, setActiveView] = useState<PatientView>('aiexperts');
  const [selectedForYouItem, setSelectedForYouItem] = useState<ForYouCardData | null>(null);
  const [forYouData, setForYouData] = useState<ForYouCardData[]>(mockDoctorForYouData);
  const [isAnalysisSheetOpen, setIsAnalysisSheetOpen] = useState(false);
  const [isAnalysisSidebarOpen, setIsAnalysisSidebarOpen] = useState(true);

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

    const conversationId = selectedConversation.id;
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      text,
      senderId: user.id,
      timestamp: new Date(),
      type: 'user',
    };

    setConversations(prev => {
      const updated = prev.map(c => 
        c.id === conversationId 
          ? { ...c, messages: [...c.messages, newMessage] } 
          : c
      );
      const newSelected = updated.find(c => c.id === conversationId) || null;
      setSelectedConversation(newSelected);
      return updated;
    });
  };
  
  const patientMessages = selectedConversation?.messages.filter(
    (msg) => msg.senderId !== user.id
  ) || [];
  const lastPatientMessage = patientMessages[patientMessages.length - 1];

  const handleAddGoal = (newGoal: Omit<ForYouCardData, 'id' | 'type'>) => {
    // This is a patient-specific action and won't be used in the doctor view,
    // but we keep it for component compatibility.
    console.log("Adding goal (not implemented for doctors):", newGoal);
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

       <div className="hidden lg:flex items-stretch bg-background">
          <aside className={cn(
              "bg-card/50 overflow-hidden transition-all duration-300 ease-in-out",
              isAnalysisSidebarOpen ? "w-[350px] p-4 border-l" : "w-0 p-0"
          )}>
              <div className="w-[calc(350px-2rem)] h-full overflow-y-auto">
                  <SymptomAnalysisCard lastPatientMessage={lastPatientMessage} />
              </div>
          </aside>
          <div className="flex-shrink-0 border-l bg-card">
              <Button variant="ghost" size="icon" className="h-full w-12 rounded-none" onClick={() => setIsAnalysisSidebarOpen(!isAnalysisSidebarOpen)}>
                  {isAnalysisSidebarOpen ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
              </Button>
          </div>
      </div>

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
              showCreateGoal={false}
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
      case 'aiexperts':
        return <AiExpertsView />;
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
