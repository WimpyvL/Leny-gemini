'use client';

import React, { useState, useEffect } from 'react';
import type { Conversation, User, Message, ForYouCardData } from '@/lib/types';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { mockUsers, mockForYouData } from '@/lib/mock-data';
import { PatientNavRail, type PatientView } from './PatientNavRail';
import { ForYou } from './ForYou';
import { ForYouDashboard } from './ForYouDashboard';
import { Profile } from './Profile';

interface ChatUIProps {
  user: User;
  conversations: Conversation[];
}

export function ChatUI({ user, conversations: initialConversations }: ChatUIProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0] || null);
  const [activeView, setActiveView] = useState<PatientView>('chats');
  
  const [forYouData, setForYouData] = useState<ForYouCardData[]>(mockForYouData);
  const [selectedForYouItem, setSelectedForYouItem] = useState<ForYouCardData | null>(null);

  useEffect(() => {
    if (activeView === 'chats') {
      setSelectedForYouItem(null);
    } else if (activeView === 'foryou') {
      const firstStreak = forYouData.find(item => item.type === 'health_streak');
      const firstItem = forYouData[0];
      setSelectedForYouItem(firstStreak || firstItem || null);
    }
  }, [activeView, forYouData]);

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
  
  const handleAddGoal = (newGoal: Omit<ForYouCardData, 'id' | 'type'>) => {
    const goalToAdd: ForYouCardData = {
      ...newGoal,
      id: `fy_goal_${Date.now()}`,
      type: 'health_streak',
    };
    setForYouData(prevData => [goalToAdd, ...prevData]);
  };

  const renderLeftSidebar = () => {
    switch (activeView) {
      case 'chats':
        return (
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversation?.id}
            onSelectConversation={id => setSelectedConversation(conversations.find(c => c.id === id) || null)}
          />
        );
      case 'foryou':
      case 'profile':
        return (
           <ForYou 
              forYouData={forYouData}
              selectedCardId={selectedForYouItem?.id}
              onCardSelect={setSelectedForYouItem}
              onGoalCreate={handleAddGoal}
            />
        );
      default:
        return null;
    }
  }

  const renderMainContent = () => {
    switch (activeView) {
      case 'chats':
        return selectedConversation ? (
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
        );
      case 'foryou':
        return <ForYouDashboard selectedItem={selectedForYouItem} />;
      case 'profile':
        return <Profile user={user} />;
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
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-border overflow-y-auto">
          {renderLeftSidebar()}
        </div>
        <div className="hidden md:flex flex-col flex-1">
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
}
