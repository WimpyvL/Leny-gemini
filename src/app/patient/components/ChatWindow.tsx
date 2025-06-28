'use client';
import type { Conversation, User, Message } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/Icon';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: User;
  onSendMessage: (text: string) => void;
  allUsers: User[];
  isLoading?: boolean;
  onBack?: () => void;
  onAddParticipantClick?: () => void;
}

export function ChatWindow({ conversation, currentUser, onSendMessage, allUsers, isLoading, onBack, onAddParticipantClick }: ChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const otherParticipants = conversation.participants.filter(p => p.id !== currentUser.id);
  const isGroupChat = otherParticipants.length > 1;
  const isAiChat = conversation.participants.some(p => p.id === 'assistant');
  const assistantUser = allUsers.find(u => u.id === 'assistant');

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [conversation.messages, isLoading]);


  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-orange-50 to-amber-100/50">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-gradient-to-br from-white to-slate-50 shadow-sm">
        <div className="flex items-center gap-4 flex-1 overflow-hidden">
          {onBack && (
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
            </Button>
          )}
          <Avatar className="h-12 w-12">
            <AvatarImage src={!isGroupChat ? otherParticipants[0]?.avatar : undefined} alt={conversation.title} data-ai-hint="doctor person" />
            <AvatarFallback className={cn(conversation.avatarColor, 'text-white font-bold')}>
              {conversation.icon ? <Icon name={conversation.icon} className="h-6 w-6" /> : conversation.title.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
             <CardTitle className="text-xl font-semibold tracking-tight truncate">{conversation.title}</CardTitle>
             <p className="text-sm text-muted-foreground truncate">{conversation.participantString}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            {isGroupChat && (
                 <div className="flex -space-x-2 overflow-hidden">
                    {otherParticipants.slice(0,3).map(p => (
                        <Avatar key={p.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-background">
                            <AvatarImage src={p.avatar} alt={p.name}/>
                            <AvatarFallback className={cn("text-white text-xs", p.avatarColor)}>{p.avatar}</AvatarFallback>
                        </Avatar>
                    ))}
                 </div>
            )}
            {!isAiChat && (
                <Button variant="ghost" size="icon" onClick={onAddParticipantClick}>
                    <UserPlus className="h-5 w-5" />
                    <span className="sr-only">Add participant</span>
                </Button>
            )}
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {conversation.messages.map(message => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === currentUser.id}
              sender={allUsers.find(u => u.id === message.senderId)}
              isAiChat={isAiChat}
            />
          ))}
          {isLoading && assistantUser && (
            <div className="flex items-end gap-2 justify-start">
              <Avatar className="h-8 w-8">
                <AvatarFallback className={cn(assistantUser.avatarColor, 'text-white')}>
                  {assistantUser.icon ? <Icon name={assistantUser.icon} className="h-5 w-5" /> : assistantUser.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl shadow-md bg-card text-card-foreground rounded-bl-none">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground"></div>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.2s]"></div>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t bg-transparent">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
