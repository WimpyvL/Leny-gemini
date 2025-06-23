'use client';

import type { Conversation } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mic } from 'lucide-react';
import { QuickActionsView } from './QuickActionsView';
import { mockRecentSearches, mockFavoriteActions, mockEmergencyProtocols } from '@/lib/mock-data';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (id: string) => void;
}

export function ConversationList({ conversations, selectedConversationId, onSelectConversation }: ConversationListProps) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleMicClick = () => {
    const lenyConversation = conversations.find(c => c.participants.some(p => p.id === 'assistant'));
    if (lenyConversation) {
      onSelectConversation(lenyConversation.id);
      setIsSearchActive(false); // Close the search view if it's open
    } else {
      console.log("Leny's conversation not found.");
    }
  };

  return (
    <div className="h-full w-full md:w-72 flex-shrink-0 flex flex-col bg-card border-r overflow-hidden">
      <div className="p-4 border-b">
        <div className="relative flex items-center gap-2">
            {isSearchActive && (
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => setIsSearchActive(false)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
          <div className="relative w-full">
            {!isSearchActive && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-primary pointer-events-none z-10">
                <span className="text-base font-bold text-primary-foreground">L</span>
              </div>
            )}
            <Input 
              placeholder="Search or start a new chat"
              className={cn(
                "h-11 rounded-full bg-muted border-none focus-visible:ring-primary text-base transition-all duration-300 pr-12",
                isSearchActive ? "pl-4" : "pl-12"
              )}
              onFocus={() => setIsSearchActive(true)}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                onClick={handleMicClick}
            >
                <Mic className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Chat with Leny</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        <motion.div
          animate={{ opacity: isSearchActive ? 0 : 1 }}
          transition={{ duration: 0.1 }}
          className="h-full overflow-y-auto"
        >
          <div className="p-2 space-y-1">
            {conversations.map(conv => {
              const doctor = conv.participants.find(p => p.role === 'doctor' || p.role === 'assistant');
              const lastMessage = conv.messages[conv.messages.length - 1];

              return (
                <div
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={cn(
                    "flex items-center p-2 cursor-pointer hover:bg-accent transition-colors rounded-lg",
                    selectedConversationId === conv.id && "bg-accent"
                  )}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={doctor?.avatar} alt={doctor?.name} data-ai-hint="doctor person" />
                    <AvatarFallback className={cn(doctor?.avatarColor, 'text-white')}>
                      {doctor?.icon ? <doctor.icon className="h-5 w-5" /> : doctor?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="w-full overflow-hidden">
                    <p className="font-semibold text-sm">{doctor?.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{lastMessage?.text || 'No messages yet'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
        
        <AnimatePresence>
          {isSearchActive && (
              <motion.div
                  key="quick-actions"
                  initial={{ y: "-100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute inset-0 bg-card z-10 overflow-y-auto"
              >
                  <QuickActionsView
                      onHide={() => setIsSearchActive(false)}
                      recentSearches={mockRecentSearches}
                      favorites={mockFavoriteActions}
                      emergencyProtocols={mockEmergencyProtocols}
                  />
              </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
