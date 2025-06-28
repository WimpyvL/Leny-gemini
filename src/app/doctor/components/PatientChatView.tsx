import type { Conversation, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, ArrowLeft, Plus } from 'lucide-react';
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
          <AvatarFallback className={cn(sender?.avatarColor, 'text-white')}>{sender?.name.charAt(0)}</AvatarFallback>
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
    <div className="p-4 bg-secondary">
        <div className="flex items-center gap-2 bg-white rounded-full p-2 shadow-sm border border-slate-200">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200">
                <Plus className="h-5 w-5 text-slate-500" />
            </Button>
            <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask General Medical AI..."
                rows={1}
                className="resize-none max-h-24 bg-transparent border-none focus-visible:ring-0 p-2"
            />
            <Button size="icon" onClick={handleSend} className="shrink-0 h-9 w-9 rounded-full" disabled={!text.trim()}>
                <Send className="h-5 w-5" />
                <span className="sr-only">Send message</span>
            </Button>
        </div>
    </div>
  );
}

export function PatientChatView({ conversation, currentUser, onSendMessage, allUsers, onBack }: PatientChatViewProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const getHeaderInfo = () => {
    if (conversation.id === 'conv_general_ai_doctor1') {
        const assistant = allUsers.find(u => u.id === 'assistant');
        return {
            avatar: assistant?.icon,
            color: assistant?.avatarColor,
            title: assistant?.name,
            subtitle: 'Ready to help with your questions'
        }
    }
    const patient = conversation.participants.find(p => p.role === 'patient');
    return {
        avatar: patient?.avatar || conversation.icon,
        color: patient?.avatarColor || conversation.avatarColor,
        title: patient?.name || conversation.title,
        subtitle: conversation.participantString
    }
  }

  const { avatar, color, title, subtitle } = getHeaderInfo();


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
      <header className="flex items-center gap-4 p-4 border-b bg-white">
          <Avatar className={cn("h-10 w-10", color)}>
            <AvatarFallback className={cn("text-white text-xl font-bold", color)}>{avatar}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
      </header>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {conversation.messages.length === 0 && (
             <div className="flex justify-center items-center h-full">
                <p className="text-muted-foreground">No messages yet.</p>
            </div>
          )}
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
      
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
}
