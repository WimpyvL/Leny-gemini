'use client';

import { useState } from 'react';
import { AiExpertList } from './AiExpertList';
import { AiExpertChatView } from './AiExpertChatView';
import { mockAiExperts, mockUsers } from '@/lib/mock-data';
import type { AiExpert, Message, User } from '@/lib/types';
import { runExpertChat } from '../actions';

export function AiExpertsView() {
    const [selectedExpert, setSelectedExpert] = useState<AiExpert | null>(mockAiExperts[0]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const currentUser = mockUsers.find(u => u.id === 'doctor1');

    const handleSelectExpert = (expert: AiExpert) => {
        setSelectedExpert(expert);
        setMessages([
          {
            id: 'initial',
            senderId: expert.name,
            text: `Hi, I am ${expert.name}. How can I help you today?`,
            timestamp: new Date(),
            type: 'user',
          }
        ]);
    };

    const handleSendMessage = async (text: string) => {
        if (!selectedExpert || !currentUser) return;

        const userMessage: Message = {
            id: `msg_user_${Date.now()}`,
            text,
            senderId: currentUser.id,
            timestamp: new Date(),
            type: 'user',
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const aiResponse = await runExpertChat(text, selectedExpert.expert_prompt);
            const aiMessage: Message = {
                id: `msg_ai_${Date.now()}`,
                text: aiResponse,
                senderId: selectedExpert.name,
                timestamp: new Date(),
                type: 'user',
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: `msg_err_${Date.now()}`,
                text: 'Sorry, I encountered an error. Please try again.',
                senderId: selectedExpert.name,
                timestamp: new Date(),
                type: 'user',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Set initial message for the default selected expert
    useState(() => {
        if (selectedExpert) {
            setMessages([
                {
                    id: 'initial',
                    senderId: selectedExpert.name,
                    text: `Hi, I am ${selectedExpert.name}, a specialist in ${selectedExpert.specialty}. How can I assist you today?`,
                    timestamp: new Date(),
                    type: 'user',
                }
            ]);
        }
    });

    return (
        <div className="flex h-full w-full bg-background">
            <div className="w-full md:w-[340px] flex-shrink-0 border-r border-border flex flex-col">
                <AiExpertList
                    experts={mockAiExperts}
                    selectedExpert={selectedExpert}
                    onSelectExpert={handleSelectExpert}
                />
            </div>
            <div className="flex-1 flex-col flex">
                {selectedExpert && currentUser ? (
                    <AiExpertChatView
                        expert={selectedExpert}
                        messages={messages}
                        currentUser={currentUser}
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-4">
                        <span className="text-6xl">🧠</span>
                        <p className="text-lg">Select an AI Expert to start a consultation.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
