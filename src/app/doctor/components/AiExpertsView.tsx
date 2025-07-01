'use client';

import { useState, useEffect } from 'react';
import { AiExpertList } from './AiExpertList';
import { AiExpertChatView } from './AiExpertChatView';
import { mockAiExperts, mockUsers } from '@/lib/mock-data';
import type { AiExpert, Message, User } from '@/lib/types';
import { runExpertChat, runExpertRouter, runExpertConsultation } from '../actions';
import type { ExpertRouterOutput } from '@/ai/flows/expert-router-flow';
import { BrainCircuit } from 'lucide-react';

// Helper to convert message format for AI flow
const toHistory = (messages: Message[]) => {
  return messages.map(msg => ({
    role: msg.senderId.startsWith('dr-') ? 'model' as const : 'user' as const,
    text: msg.text ?? '',
  }));
};

export function AiExpertsView() {
    const lenyExpert = mockAiExperts.find(e => e.id === 'leny-router')!;
    const [selectedExpert, setSelectedExpert] = useState<AiExpert>(lenyExpert);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const currentUser = mockUsers.find(u => u.id === 'doctor1');

    // State for Leny's suggestions
    const [suggestion, setSuggestion] = useState<ExpertRouterOutput | null>(null);

    const handleSelectExpert = (expert: AiExpert) => {
        setSelectedExpert(expert);
        setMessages([
          {
            id: 'initial',
            senderId: expert.id,
            text: `Hi, I am ${expert.name}. How can I help you today?`,
            timestamp: new Date(),
            type: 'user',
          }
        ]);
        // Always reset suggestions when a new expert is selected to start a clean chat
        setSuggestion(null);
    };
    
    // Initial message from Leny
    useEffect(() => {
      handleSelectExpert(lenyExpert);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSendMessage = async (text: string) => {
        if (!selectedExpert || !currentUser) return;

        const userMessage: Message = {
            id: `msg_user_${Date.now()}`,
            text,
            senderId: currentUser.id,
            timestamp: new Date(),
            type: 'user',
        };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            if (selectedExpert.id === 'leny-router') {
                const result = await runExpertRouter(toHistory(newMessages), mockAiExperts);
                const aiMessage: Message = {
                    id: `msg_ai_${Date.now()}`,
                    text: result.response,
                    senderId: selectedExpert.id,
                    timestamp: new Date(),
                    type: 'user',
                };
                setMessages(prev => [...prev, aiMessage]);
                setSuggestion(result);
            } else {
                const result = await runExpertChat(text, selectedExpert.expert_prompt);
                const aiMessage: Message = {
                    id: `msg_ai_${Date.now()}`,
                    text: result.response,
                    senderId: selectedExpert.id,
                    timestamp: new Date(),
                    type: 'user',
                    quickActions: result.quickActions,
                };
                setMessages(prev => [...prev, aiMessage]);
            }
        } catch (error) {
            console.error('Error in expert chat:', error);
            const errorMessage: Message = {
                id: `msg_err_${Date.now()}`,
                text: 'Sorry, I encountered an error. Please try again.',
                senderId: selectedExpert.id,
                timestamp: new Date(),
                type: 'user',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConsultExpert = async (expertId: string, summary: string) => {
        const expert = mockAiExperts.find(e => e.id === expertId);
        if (!expert || !currentUser) return;

        setSelectedExpert(expert);
        setIsLoading(true);
        setSuggestion(null); // Clear suggestions

        // Initial message for the new expert is the summary from Leny
        const initialMessage: Message = {
          id: `msg_summary_${Date.now()}`,
          text: summary,
          senderId: currentUser.id,
          timestamp: new Date(),
          type: 'user'
        };
        setMessages([initialMessage]);
        
        try {
            const result = await runExpertChat(summary, expert.expert_prompt);
            const aiMessage: Message = {
                id: `msg_ai_initial_${Date.now()}`,
                text: result.response,
                senderId: expert.id,
                timestamp: new Date(),
                type: 'user',
                quickActions: result.quickActions,
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
             console.error('Error in initial expert chat:', error);
             const errorMessage: Message = {
                id: `msg_err_initial_${Date.now()}`,
                text: 'Sorry, I encountered an error. Please try again.',
                senderId: expert.id,
                timestamp: new Date(),
                type: 'user',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConsultAnotherExpert = async (consultant: AiExpert) => {
        if (!selectedExpert || !currentUser) return;

        setIsLoading(true);

        const systemMessage: Message = {
            id: `msg_system_${Date.now()}`,
            text: `Bringing in ${consultant.name} for a consultation...`,
            senderId: 'leny-router',
            timestamp: new Date(),
            type: 'user',
        };
        setMessages(prev => [...prev, systemMessage]);

        try {
            const consultationResponse = await runExpertConsultation(messages, consultant, mockAiExperts, currentUser);
            
            const expertMessage: Message = {
                id: `msg_consult_${Date.now()}`,
                text: consultationResponse.response,
                senderId: consultant.id,
                timestamp: new Date(),
                type: 'user',
                quickActions: consultationResponse.quickActions,
            };
            setMessages(prev => [...prev, expertMessage]);

        } catch (error) {
            console.error('Error in expert consultation:', error);
            const errorMessage: Message = {
                id: `msg_err_${Date.now()}`,
                text: `Sorry, I couldn't get a response from ${consultant.name}. Please try again.`,
                senderId: 'leny-router',
                timestamp: new Date(),
                type: 'user',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

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
                        key={selectedExpert.id}
                        expert={selectedExpert}
                        messages={messages}
                        currentUser={currentUser}
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        suggestion={suggestion}
                        onConsultExpert={handleConsultExpert}
                        onConsultAnotherExpert={handleConsultAnotherExpert}
                        allExperts={mockAiExperts}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-4">
                        <BrainCircuit className="h-16 w-16" />
                        <p className="text-lg">Select an AI Expert to start a consultation.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
