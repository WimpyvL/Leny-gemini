'use client';
import type { Conversation, User, Message } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageInput } from './MessageInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessageBubble } from './MessageBubble';

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
  
  const otherParticipants = allUsers.filter(u => conversation.participantIds.includes(u.id) && u.id !== currentUser.id);
  const isGroupChat = otherParticipants.length > 1;

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
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          {onBack && (
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
            </Button>
          )}
          
          <div className="flex -space-x-2 overflow-hidden">
            {otherParticipants.slice(0, 3).map(p => (
                <Avatar key={p.id} className="inline-block h-10 w-10 rounded-full ring-2 ring-card">
                    <AvatarImage src={p.avatar} alt={p.name}/>
                    <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                </Avatar>
            ))}
          </div>
          
          <div className="overflow-hidden">
             <h2 className="text-lg font-semibold tracking-tight truncate">{conversation.title}</h2>
             <p className="text-sm text-muted-foreground truncate">{conversation.participantString}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onAddParticipantClick}>
                <UserPlus className="h-5 w-5" />
                <span className="sr-only">Add participant</span>
            </Button>
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
                sender={allUsers.find(u => u.id === 'assistant')}
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
