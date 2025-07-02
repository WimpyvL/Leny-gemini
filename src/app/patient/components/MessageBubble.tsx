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
  isAiChat?: boolean;
}

export function MessageBubble({ message, isOwnMessage, sender, isAiChat }: MessageBubbleProps) {
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
  
  const isAssistantMessage = sender?.id === 'assistant';

  return (
    <div className={cn("flex items-end gap-2", isOwnMessage ? "justify-end" : "justify-start")}>
      {!isOwnMessage && sender && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={sender.avatar} alt={sender.name} data-ai-hint="person" />
          <AvatarFallback className={cn(sender.avatarColor, 'text-white font-semibold')}>
            {sender.icon ? <span className="text-lg">{sender.icon}</span> : sender.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-[1.125rem] shadow-md", // 18px radius
                isOwnMessage
                  ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-br-sm"
                  : isAssistantMessage
                  ? "bg-gradient-to-br from-sky-50 to-sky-100 text-slate-800 border border-sky-200 rounded-bl-sm"
                  : "bg-slate-50 text-slate-800 border border-slate-200 rounded-bl-sm"
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
