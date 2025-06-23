import type { Conversation, User } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/Icon';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: User;
  onSendMessage: (text: string) => void;
  allUsers: User[];
}

export function ChatWindow({ conversation, currentUser, onSendMessage, allUsers }: ChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [conversation.messages]);

  const otherParticipants = conversation.participants.filter(p => p.id !== currentUser.id);

  return (
    <div className="flex flex-col h-screen bg-muted/50">
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <Avatar className={cn("h-10 w-10 rounded-lg", conversation.avatarColor)}>
              <AvatarFallback className={cn("rounded-lg text-white", conversation.avatarColor)}>
                  {conversation.icon && <Icon name={conversation.icon} className="h-5 w-5" />}
              </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-bold">{conversation.title}</h2>
            <p className="text-sm text-muted-foreground">{conversation.participantString}</p>
          </div>
        </div>
        <div className="flex -space-x-2 overflow-hidden">
          {otherParticipants.map(p => (
            <Avatar key={p.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-background">
                <AvatarFallback className={cn("text-white text-xs", p.avatarColor)}>{p.avatar}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </header>
      
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-6">
          {conversation.messages.map(message => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === currentUser.id}
              sender={allUsers.find(u => u.id === message.senderId)}
              currentUser={currentUser}
            />
          ))}
        </div>
      </ScrollArea>
      
      <footer className="p-4 border-t bg-card">
        <MessageInput onSendMessage={onSendMessage} />
      </footer>
    </div>
  );
}
