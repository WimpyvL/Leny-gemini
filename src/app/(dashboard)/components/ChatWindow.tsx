'use client';
import type { Conversation, User, Message } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageInput } from './MessageInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { MessageBubble } from './MessageBubble';
import { Logo } from '@/components/Logo';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: User;
  onSendMessage: (text: string) => void;
  allUsers: User[];
  isLoading?: boolean;
}

export function ChatWindow({ conversation, currentUser, onSendMessage, allUsers, isLoading }: ChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const assistant = allUsers.find(u => u.id === 'assistant');

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [conversation.messages, isLoading]);


  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex flex-row items-center justify-between p-3 border-b bg-card">
        <Logo />
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">Welcome, {currentUser.name}</p>
          <Avatar className="inline-block h-8 w-8 rounded-full">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name}/>
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </header>
      
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
          {isLoading && (
            <MessageBubble
                isOwnMessage={false}
                sender={assistant}
                message={{
                    id: 'loading',
                    senderId: 'assistant',
                    timestamp: new Date(),
                    type: 'user',
                    text: '...'
                }}
                isLoading={true}
            />
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t bg-card">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
