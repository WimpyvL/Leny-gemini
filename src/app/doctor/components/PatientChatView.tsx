import type { Conversation, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Paperclip, Send, ArrowLeft, BrainCircuit } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PatientChatViewProps {
  conversation: Conversation;
  currentUser: User;
  onSendMessage: (text: string) => void;
  allUsers: User[];
  onBack?: () => void;
  onShowAnalysis?: () => void;
}

function MessageBubble({ message, isOwnMessage, sender }: { message: any; isOwnMessage: boolean; sender?: User }) {
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
      <Button variant="ghost" size="icon" className="shrink-0" onClick={() => alert('File sharing not implemented yet.')}>
        <Paperclip className="text-foreground/70" />
        <span className="sr-only">Attach file</span>
      </Button>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
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

export function PatientChatView({ conversation, currentUser, onSendMessage, allUsers, onBack, onShowAnalysis }: PatientChatViewProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const patient = conversation.participants.find(p => p.role === 'patient');

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
          {onBack && (
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
            </Button>
          )}
          <Avatar>
            <AvatarImage src={patient?.avatar} alt={patient?.name} data-ai-hint="patient person" />
            <AvatarFallback>{patient?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl font-headline">{patient?.name}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onShowAnalysis}>
          <BrainCircuit className="h-5 w-5" />
          <span className="sr-only">Show Analysis</span>
        </Button>
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
