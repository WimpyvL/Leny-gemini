'use client';
import type { Conversation, User, Message } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: User;
  onSendMessage: (text: string) => void;
  allUsers: User[];
  isLoading?: boolean;
}

export function ChatWindow({ conversation, currentUser, onSendMessage, allUsers, isLoading }: ChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const otherUser = conversation.participants.find(p => p.id !== currentUser.id);
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
    <div className="flex flex-col h-screen bg-secondary">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={otherUser?.avatar} alt={otherUser?.name} data-ai-hint="doctor person" />
            <AvatarFallback className={cn(otherUser?.avatarColor, 'text-white')}>
              {otherUser?.icon ? <otherUser.icon className="h-5 w-5" /> : otherUser?.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl font-headline">{otherUser?.name}</CardTitle>
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
            />
          ))}
          {isLoading && assistantUser && (
            <div className="flex items-end gap-2 justify-start">
              <Avatar className="h-8 w-8">
                <AvatarFallback className={cn(assistantUser.avatarColor, 'text-white')}>
                  {assistantUser.icon ? <assistantUser.icon className="h-5 w-5" /> : assistantUser.avatar}
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
      
      <div className="p-4 border-t bg-card">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
