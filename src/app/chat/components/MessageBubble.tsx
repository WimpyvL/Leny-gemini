'use client';
import type { Message, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AssistantSummary } from './AssistantSummary';
import { useEffect, useState } from 'react';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  sender?: User;
  currentUser: User;
}

export function MessageBubble({ message, isOwnMessage, sender, currentUser }: MessageBubbleProps) {
  const [formattedTimestamp, setFormattedTimestamp] = useState('');

  useEffect(() => {
    if (message.timestamp) {
      setFormattedTimestamp(format(message.timestamp, 'p'));
    }
  }, [message.timestamp]);
  
  if (message.type === 'assessment' && message.assessment) {
    return <AssistantSummary assessment={message.assessment} sender={sender} timestamp={message.timestamp} />;
  }

  const userForAvatar = isOwnMessage ? currentUser : sender;

  return (
    <div className={cn("flex items-start gap-3", isOwnMessage ? "justify-end" : "justify-start")}>
      {!isOwnMessage && userForAvatar && (
        <Avatar className="h-9 w-9">
          <AvatarFallback className={cn("text-white", userForAvatar.avatarColor)}>
            {userForAvatar.icon ? <span className="text-xl">{userForAvatar.icon}</span> : userForAvatar.avatar}
            </AvatarFallback>
        </Avatar>
      )}
      <div className={cn("flex flex-col gap-1", isOwnMessage ? "items-end" : "items-start")}>
        {!isOwnMessage && <p className="text-xs text-muted-foreground font-semibold">{sender?.name}</p>}
        <div
            className={cn(
            "max-w-md p-3 rounded-2xl shadow-sm",
            isOwnMessage
                ? "bg-primary text-primary-foreground rounded-br-none"
                : "bg-card text-card-foreground rounded-bl-none"
            )}
        >
            <p className="text-base whitespace-pre-wrap">{message.text}</p>
        </div>
        <p className="text-xs text-muted-foreground">
            {formattedTimestamp}
        </p>
      </div>
      {isOwnMessage && userForAvatar && (
        <Avatar className="h-9 w-9">
          <AvatarFallback className={cn("text-white", userForAvatar.avatarColor)}>{userForAvatar.avatar}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
