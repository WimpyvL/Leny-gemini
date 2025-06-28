import { useState, useEffect } from 'react';
import type { Message, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  sender?: User;
}

export function MessageBubble({ message, isOwnMessage, sender }: MessageBubbleProps) {
  const [formattedTimestamp, setFormattedTimestamp] = useState('');
  
  useEffect(() => {
    setFormattedTimestamp(format(message.timestamp, 'p, dd/MM/yy'));
  }, [message.timestamp]);
  
  return (
    <div className={cn("flex items-end gap-2", isOwnMessage ? "justify-end" : "justify-start")}>
      {!isOwnMessage && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={sender?.avatar} alt={sender?.name} data-ai-hint="person" />
          <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
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
              <p className="text-base">{message.text}</p>
            </div>
          </TooltipTrigger>
          <TooltipContent side={isOwnMessage ? 'left' : 'right'}>
            <p>{formattedTimestamp}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
