'use client';

import type { Conversation, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';
import { QuickActionsView } from '@/app/patient/components/QuickActionsView';
import { mockDoctorRecentSearches, mockDoctorFavoriteActions, mockDoctorImmediateAssistance } from '@/lib/mock-data';

interface PatientListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (id: string) => void;
  currentUser: User;
}

export function PatientList({ conversations, selectedConversationId, onSelectConversation }: PatientListProps) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="h-full flex flex-col bg-card">
      <CardHeader className="p-4 border-b space-y-4">
        <h2 className="text-xl font-bold font-headline">Patients</h2>
        <div className="relative flex items-center gap-2">
            {isSearchActive && (
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => setIsSearchActive(false)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
                <Input 
                  placeholder="Search patients..."
                  className="h-11 rounded-full bg-muted border-none focus-visible:ring-primary text-base pl-10"
                  onFocus={() => setIsSearchActive(true)}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
        </div>
      </CardHeader>
      
      <div className="flex-1 relative overflow-hidden">
        <motion.div
          animate={{ opacity: isSearchActive ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="h-full overflow-y-auto"
        >
           <ScrollArea className="h-full">
            <div className="p-2 space-y-1">
                {conversations.map(conv => {
                const patient = conv.participants.find(p => p.role === 'patient');
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
                        <AvatarImage src={patient?.avatar} alt={patient?.name} data-ai-hint="patient person" />
                        <AvatarFallback>{patient?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="w-full overflow-hidden">
                        <p className="font-semibold text-sm">{patient?.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{lastMessage?.text || 'No messages yet'}</p>
                    </div>
                    </div>
                );
                })}
            </div>
          </ScrollArea>
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
                      recentSearches={mockDoctorRecentSearches}
                      favorites={mockDoctorFavoriteActions}
                      emergencyProtocols={mockDoctorImmediateAssistance}
                  />
              </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
