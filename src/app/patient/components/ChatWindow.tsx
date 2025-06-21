import type { Conversation, User, Message } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: User;
  onSendMessage: (text: string) => void;
  allUsers: User[];
}

export function ChatWindow({ conversation, currentUser, onSendMessage, allUsers }: ChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const otherUser = conversation.participants.find(p => p.id !== currentUser.id);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [conversation.messages]);


  return (
    <div className="flex flex-col h-screen bg-secondary">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={otherUser?.avatar} alt={otherUser?.name} data-ai-hint="doctor person" />
            <AvatarFallback>{otherUser?.name.charAt(0)}</AvatarFallback>
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
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t bg-card">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
