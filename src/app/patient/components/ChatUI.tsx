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
import { runMedicalPatientQuery, runPatientChat } from '../actions';
import { cn } from '@/lib/utils';
import { InviteDialog } from './InviteDialog';
import { useToast } from '@/hooks/use-toast';
import { AddParticipantDialog } from './AddParticipantDialog';
import { FindDoctorView } from './FindDoctorView';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatUIProps {
  user: User;
  conversations: Conversation[];
  doctors: User[];
}

export function ChatUI({ user, conversations: initialConversations, doctors }: ChatUIProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [activeView, setActiveView] = useState<PatientView>('chats');
  const [isLoading, setIsLoading] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isAddParticipantDialogOpen, setIsAddParticipantDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const [forYouData, setForYouData] = useState<ForYouCardData[]>(mockForYouData);
  const [selectedForYouItem, setSelectedForYouItem] = useState<ForYouCardData | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile === false) { 
      if (activeView === 'chats' && initialConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(initialConversations[0]);
      } else if (activeView === 'foryou' && forYouData.length > 0 && !selectedForYouItem) {
        const firstStreak = forYouData.find(item => item.type === 'health_streak');
        const firstItem = forYouData[0];
        setSelectedForYouItem(firstStreak || firstItem || null);
      }
    }
  }, [isMobile, activeView, initialConversations, forYouData, selectedConversation, selectedForYouItem]);
  
  useEffect(() => {
<<<<<<< HEAD
    // When the active view (e.g., Chats, For You) changes, clear any specific
    // item selections to return to the list view on mobile.
    if (activeView !== 'chats') {
      setSelectedConversation(null);
    }
    if (activeView !== 'foryou') {
      setSelectedForYouItem(null);
    }
=======
    setSelectedConversation(null);
    setSelectedForYouItem(null);
>>>>>>> 4de5c1ea31c6afd7cb8b6b3e60a7b345ab82f1b4
  }, [activeView]);

  const generateParticipantString = (participants: User[], currentUserId: string): string => {
    const otherParticipants = participants.filter(p => p.id !== currentUserId && p.id !== 'assistant');
    if (participants.some(p => p.id === 'assistant') && otherParticipants.length === 0) {
        return 'Your AI Health Companion';
    }
    if (otherParticipants.length === 1) {
        return `Chat with ${otherParticipants[0].name}`;
    }
    const names = otherParticipants.map(p => p.name.split(' ')[0]);
    const participantNames = [ 'You', ...names ];

    if (participantNames.length <= 3) {
      return participantNames.join(', ');
    }
    return `${participantNames.slice(0, 3).join(', ')} & ${participantNames.length - 3} others`;
  };


  const handleSendMessage = async (text: string) => {
    if (!selectedConversation) return;

    const conversationId = selectedConversation.id;

    const userMessage: Message = {
      id: `msg_user_${Date.now()}`,
      text,
      senderId: user.id,
      timestamp: new Date(),
      type: 'user',
    };

<<<<<<< HEAD
    setConversations(prev => {
        const updated = prev.map(c => 
            c.id === conversationId 
                ? { ...c, messages: [...c.messages, userMessage] }
                : c
        );
        setSelectedConversation(updated.find(c => c.id === conversationId) || null);
        return updated;
    });

    const isAiChat = selectedConversation.participants.some(p => p.id === 'assistant') && selectedConversation.participants.length === 2;
=======
    const updatedConversationsWithUserMessage = conversations.map(c => {
      if (c.id === selectedConversation.id) {
        return { ...c, messages: [...c.messages, newMessage], timestamp: new Date() };
      }
      return c;
    }).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());

    setConversations(updatedConversationsWithUserMessage);
    setSelectedConversation(updatedConversationsWithUserMessage.find(c => c.id === selectedConversation.id) || null);

    const isAiChat = selectedConversation.participants.some(p => p.id === 'assistant');
>>>>>>> 4de5c1ea31c6afd7cb8b6b3e60a7b345ab82f1b4

    if (isAiChat) {
      setIsLoading(true);
      try {
<<<<<<< HEAD
        const aiResponse = await runPatientChat(text, user.name);
=======
        const conversationHistory = selectedConversation.messages.slice(-5).map(m => m.text || '');
        const aiResponse = await runMedicalPatientQuery(text, conversationHistory);

>>>>>>> 4de5c1ea31c6afd7cb8b6b3e60a7b345ab82f1b4
        const aiMessage: Message = {
          id: `msg_ai_${Date.now()}`,
          text: aiResponse,
          senderId: 'assistant',
          timestamp: new Date(),
          type: 'user',
        };
<<<<<<< HEAD
        
        setConversations(prev => {
            const updated = prev.map(c => 
                c.id === conversationId 
                    ? { ...c, messages: [...c.messages, aiMessage] }
                    : c
            );
            setSelectedConversation(updated.find(c => c.id === conversationId) || null);
            return updated;
=======

        setConversations(prevConvos => {
            const finalConvos = prevConvos.map(c => {
                if (c.id === selectedConversation!.id) {
                    return { ...c, messages: [...c.messages, aiMessage] };
                }
                return c;
            });
            setSelectedConversation(finalConvos.find(c => c.id === selectedConversation!.id) || null);
            return finalConvos;
>>>>>>> 4de5c1ea31c6afd7cb8b6b3e60a7b345ab82f1b4
        });

      } catch (error) {
        console.error("Failed to get AI response", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleAddGoal = (newGoal: Omit<ForYouCardData, 'id' | 'type'>) => {
    const goalToAdd: ForYouCardData = {
      ...newGoal,
      id: `fy_goal_${Date.now()}`,
      type: 'health_streak',
    };
    setForYouData(prevData => [goalToAdd, ...prevData]);
  };

  const handleAddParticipants = (userIds: string[]) => {
    if (!selectedConversation) return;

    const usersToAdd = allUsers.filter(u => userIds.includes(u.id) && !selectedConversation.participants.some(p => p.id === u.id));
    if (usersToAdd.length === 0) return;

    const updatedParticipants = [...selectedConversation.participants, ...usersToAdd];

    const systemMessageText = `${user.name} added ${usersToAdd.map(u => u.name).join(', ')} to the chat.`;

    const systemMessage: Message = {
      id: `msg_system_${Date.now()}`,
      senderId: 'assistant',
      text: systemMessageText,
      timestamp: new Date(),
      type: 'user',
    };
    
    const newParticipantString = generateParticipantString(updatedParticipants, user.id);

    const updatedConversations = conversations.map(c => {
      if (c.id === selectedConversation.id) {
        return {
          ...c,
          title: 'Group Chat',
          participants: updatedParticipants,
          participantString: newParticipantString,
          messages: [...c.messages, systemMessage],
          icon: '👨‍👩‍👧',
          avatarColor: 'bg-gray-500',
        };
      }
      return c;
    });

    setConversations(updatedConversations);
    setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id) || null);
    setIsAddParticipantDialogOpen(false);
    toast({ title: 'Participants Added', description: `${usersToAdd.map(u => u.name).join(', ')} added to the chat.` });
  };


  const handleSendInvite = (email: string) => {
    let invitedUser = allUsers.find(u => u.email === email);
    let currentUsers = allUsers;

    if (invitedUser?.id === user.id) {
      toast({ title: "You can't invite yourself.", variant: 'destructive' });
      return;
    }

    if (!invitedUser) {
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: email.split('@')[0],
        avatar: email.substring(0, 2).toUpperCase(),
        avatarColor: 'bg-gray-500',
        role: 'patient',
        email: email,
      };
      invitedUser = newUser;
      currentUsers = [...allUsers, newUser];
      setAllUsers(currentUsers);
    }

    const existingConversation = conversations.find(c =>
      c.participants.length === 2 &&
      c.participants.some(p => p.id === invitedUser!.id) &&
      c.participants.some(p => p.id === user.id)
    );

    if (existingConversation) {
      toast({ title: 'Chat already exists.', description: 'Selecting the existing conversation.' });
      setSelectedConversation(existingConversation);
      setActiveView('chats');
      setIsInviteDialogOpen(false);
      return;
    }

    const newParticipants = [user, invitedUser];
    const newConversation: Conversation = {
      id: `conv_${user.id}_${invitedUser.id}`,
      title: invitedUser.name,
      participants: newParticipants,
      participantIds: newParticipants.map(p => p.id),
      participantString: generateParticipantString(newParticipants, user.id),
      messages: [{
        id: `msg_system_${Date.now()}`,
        senderId: 'assistant',
        text: `You are now connected with ${invitedUser.name}.`,
        timestamp: new Date(),
        type: 'user',
      }],
      timestamp: new Date(),
      patientId: user.id,
      avatar: invitedUser.avatar,
      avatarColor: invitedUser.avatarColor,
      icon: invitedUser.icon,
    };

    const updatedConversations = [newConversation, ...conversations];
    setConversations(updatedConversations);
    setSelectedConversation(newConversation);
    setActiveView('chats');
    setIsInviteDialogOpen(false);
    toast({ title: 'Invite Sent!', description: `You can now chat with ${invitedUser.name}.` });
  };


  const renderLeftSidebar = () => {
    switch (activeView) {
      case 'chats':
        return (
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversation?.id}
            onSelectConversation={id => setSelectedConversation(conversations.find(c => c.id === id) || null)}
            onInviteClick={() => setIsInviteDialogOpen(true)}
          />
        );
      case 'foryou':
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
            key={selectedConversation.id}
            conversation={selectedConversation}
            currentUser={user}
            onSendMessage={handleSendMessage}
            allUsers={allUsers}
            isLoading={isLoading}
            onBack={() => setSelectedConversation(null)}
            onAddParticipantClick={() => setIsAddParticipantDialogOpen(true)}
          />
        ) : (
          <div className="hidden md:flex items-center justify-center h-full text-muted-foreground">
            <p>Select a conversation to start chatting</p>
          </div>
        );
      case 'foryou':
        return <ForYouDashboard selectedItem={selectedForYouItem} onBack={() => setSelectedForYouItem(null)}/>;
      case 'find-doctor':
        return <FindDoctorView doctors={doctors} />;
      case 'profile':
        return <Profile user={user} />;
      default:
        return null;
    }
  }

  const showDetailView = (activeView === 'chats' && !!selectedConversation) || (activeView === 'foryou' && !!selectedForYouItem);
  const fullWidthView = activeView === 'profile' || activeView === 'find-doctor';

  return (
    <div className="flex h-screen w-full bg-background">
      <PatientNavRail 
        currentUser={user}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      <InviteDialog
        isOpen={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onInvite={handleSendInvite}
      />
      {selectedConversation && (
        <AddParticipantDialog
          isOpen={isAddParticipantDialogOpen}
          onOpenChange={setIsAddParticipantDialogOpen}
          onAddParticipants={handleAddParticipants}
          allUsers={allUsers}
          currentParticipants={selectedConversation.participants}
          currentUser={user}
        />
      )}
      <main className="flex-1 flex ml-16">
        {fullWidthView ? (
            <div className="flex-1">
              {renderMainContent()}
            </div>
          ) : (
          <>
            <div className={cn(
              "w-full md:w-72 flex-shrink-0 border-r border-border overflow-y-auto flex-col",
              showDetailView ? "hidden md:flex" : "flex"
            )}>
              {renderLeftSidebar()}
            </div>
            <div className={cn(
              "flex-col flex-1",
              showDetailView ? "flex" : "hidden md:flex"
            )}>
              {renderMainContent()}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
