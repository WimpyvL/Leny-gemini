'use client';
import { useState, useEffect } from 'react';
import type { Message, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  sender?: User;
  isLoading?: boolean;
}

export function MessageBubble({ message, isOwnMessage, sender, isLoading }: MessageBubbleProps) {
  const [formattedTimestamp, setFormattedTimestamp] = useState('');
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  useEffect(() => {
    if (hasMounted) {
      const updateTimestamp = () => {
        if (message.timestamp) {
          setFormattedTimestamp(format(message.timestamp, 'p'));
        }
      };
      updateTimestamp();
    }
  }, [message.timestamp, hasMounted]);
  
  return (
    <div className={cn("flex items-end gap-3", isOwnMessage ? "justify-end" : "justify-start")}>
      {!isOwnMessage && sender && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={sender.avatar} alt={sender.name} />
          <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div className={cn("flex flex-col gap-1", isOwnMessage ? 'items-end' : 'items-start')}>
        <div
            className={cn(
            "max-w-md lg:max-w-xl p-3 px-4 rounded-2xl shadow-sm",
            isOwnMessage
                ? "bg-primary text-primary-foreground rounded-br-none"
                : "bg-card text-card-foreground border rounded-bl-none"
            )}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground"></div>
                    <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.2s]"></div>
                    <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.4s]"></div>
                </div>
            ) : (
                <p className="text-base whitespace-pre-wrap">{message.text}</p>
            )}
        </div>
        <p className="text-xs text-muted-foreground px-1">
            {hasMounted ? formattedTimestamp : ''}
        </p>
      </div>
    </div>
  );
}
