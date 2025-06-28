'use client';
import type { AiExpert, Message, User } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AiExpertChatViewProps {
  expert: AiExpert;
  messages: Message[];
  currentUser: User;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

function MessageBubble({ message, isOwnMessage, sender, expert }: { message: Message; isOwnMessage: boolean; sender?: User; expert?: AiExpert }) {
  const [formattedTimestamp, setFormattedTimestamp] = useState('');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      setFormattedTimestamp(format(message.timestamp, 'p, dd/MM/yy'));
    }
  }, [message.timestamp, hasMounted]);
  
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`;
    return name.substring(0, 2);
  };
  
  return (
    <div className={cn("flex items-end gap-2", isOwnMessage ? "justify-end" : "justify-start")}>
      {!isOwnMessage && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className={cn("text-white", expert?.avatarColor)}>{getInitials(expert?.name || 'AI')}</AvatarFallback>
        </Avatar>
      )}
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl shadow-md",
                isOwnMessage
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-card text-card-foreground rounded-bl-none"
              )}
            >
              <p className="text-base whitespace-pre-wrap">{message.text}</p>
            </div>
          </TooltipTrigger>
          <TooltipContent side={isOwnMessage ? 'left' : 'right'}>
            <p>{hasMounted ? formattedTimestamp : ''}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

function MessageInput({ onSendMessage }: { onSendMessage: (text: string) => void }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={`Message ${'Dr. ' + (text.includes(' ') ? text.split(' ')[1] : text)}...`}
        rows={1}
        className="resize-none max-h-24 bg-input"
      />
      <Button size="icon" onClick={handleSend} className="shrink-0" disabled={!text.trim()}>
        <Send />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
}

export function AiExpertChatView({ expert, messages, currentUser, onSendMessage, isLoading }: AiExpertChatViewProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages, isLoading]);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`;
    return name.substring(0, 2);
  };


  return (
    <div className="flex flex-col h-screen bg-secondary">
      <CardHeader className="flex flex-row items-center gap-4 p-4 border-b bg-card">
          <Avatar className="h-10 w-10">
            <AvatarFallback className={cn("text-white", expert.avatarColor)}>{getInitials(expert.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-headline">{expert.name}</CardTitle>
            <CardDescription>{expert.specialty}</CardDescription>
          </div>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              isOwnMessage={message.senderId === currentUser.id}
              sender={currentUser}
              expert={expert}
            />
          ))}
          {isLoading && (
             <div className="flex items-end gap-2 justify-start">
                <Avatar className="h-8 w-8">
                    <AvatarFallback className={cn("text-white", expert.avatarColor)}>{getInitials(expert.name)}</AvatarFallback>
                </Avatar>
                <div className="max-w-xs p-3 rounded-2xl shadow-md bg-card text-card-foreground rounded-bl-none">
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
