'use client';
import type { AiExpert, Message, User } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CardHeader, CardTitle, CardDescription, Card, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, BrainCircuit, AlertTriangle, Users } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { ExpertRouterOutput } from '@/ai/flows/expert-router-flow';
import { mockAiExperts } from '@/lib/mock-data';
import { ConsultExpertDialog } from './ConsultExpertDialog';

interface AiExpertChatViewProps {
  expert: AiExpert;
  allExperts: AiExpert[];
  messages: Message[];
  currentUser: User;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  suggestion: ExpertRouterOutput | null;
  onConsultExpert: (expertId: string, summary: string) => void;
  onConsultAnotherExpert: (expert: AiExpert) => void;
}

function MessageBubble({ message, isOwnMessage, sender, expert }: { message: Message; isOwnMessage: boolean; sender?: User; expert?: AiExpert }) {
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`;
    return name.substring(0, 2);
  };
  
  const renderStructuredResponse = (response: import('@/lib/types').StructuredResponse) => {
    return (
      <div className="space-y-3 text-sm">
        <div>
          <h4 className="font-bold text-card-foreground">Evidence Summary</h4>
          <p className="text-card-foreground/90">{response.evidenceSummary}</p>
        </div>
        <div>
          <h4 className="font-bold text-card-foreground">Confidence in Evidence</h4>
          <p className="text-card-foreground/90">{response.confidenceInEvidence}</p>
        </div>
        <div>
          <h4 className="font-bold text-card-foreground">Clinical Bottom Line</h4>
          <p className="text-card-foreground/90">{response.clinicalBottomLine}</p>
        </div>
        <div>
          <h4 className="font-bold text-card-foreground">Contrary or Unanswered Questions</h4>
          <p className="text-card-foreground/90">{response.contraryOrUnanswered}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex items-end gap-2", isOwnMessage ? "justify-end" : "justify-start")}>
      {!isOwnMessage && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-muted-foreground/20 text-foreground">{getInitials(expert?.name || 'AI')}</AvatarFallback>
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
              {message.structuredResponse ? (
                renderStructuredResponse(message.structuredResponse)
              ) : (
                <p className="text-base whitespace-pre-wrap">{message.text}</p>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side={isOwnMessage ? 'left' : 'right'}>
            <p>{format(message.timestamp, 'p, dd/MM/yy')}</p>
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

export function AiExpertChatView({ expert, allExperts, messages, currentUser, onSendMessage, isLoading, suggestion, onConsultExpert, onConsultAnotherExpert }: AiExpertChatViewProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isConsulting, setIsConsulting] = useState(false);
  
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

  const suggestedExpertInfo = suggestion?.suggestedExpertId ? mockAiExperts.find(e => e.id === suggestion.suggestedExpertId) : null;

  const getExpertForMessage = (message: Message): AiExpert | undefined => {
    if(message.senderId === currentUser.id) return undefined;
    return allExperts.find(e => e.id === message.senderId) ?? expert;
  }

  return (
    <div className="flex flex-col h-screen bg-secondary">
      <ConsultExpertDialog
        isOpen={isConsulting}
        onOpenChange={setIsConsulting}
        onConsult={(newExpert) => {
          onConsultAnotherExpert(newExpert);
          setIsConsulting(false);
        }}
        allExperts={allExperts}
        currentExpertId={expert.id}
      />
      <CardHeader className="flex flex-row items-center justify-between gap-4 p-4 border-b bg-card">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-muted-foreground/20 text-foreground">{getInitials(expert.name)}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-xl font-headline">{expert.name}</CardTitle>
                <CardDescription>{expert.specialty}</CardDescription>
            </div>
          </div>
          {expert.id !== 'leny-router' && (
            <Button variant="outline" size="sm" onClick={() => setIsConsulting(true)}>
                <Users className="mr-2 h-4 w-4" />
                Add Expert
            </Button>
          )}
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              <MessageBubble
                message={message}
                isOwnMessage={message.senderId === currentUser.id}
                sender={currentUser}
                expert={getExpertForMessage(message)}
              />
              {message.quickActions && message.quickActions.length > 0 && message.senderId !== currentUser.id && (
                <div className="flex flex-wrap gap-2 mt-2 ml-10">
                  {message.quickActions.map((action, i) => (
                    <Button key={i} variant="outline" size="sm" onClick={() => onSendMessage(action)}>
                      {action}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-end gap-2 justify-start">
                <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted-foreground/20 text-foreground">{getInitials(expert.name)}</AvatarFallback>
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
      
      {expert.id === 'leny-router' && suggestion && (
        <div className="p-4 border-t bg-card space-y-3">
            {suggestion.isUrgent && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Urgent Action Recommended</AlertTitle>
                    <AlertDescription>{suggestion.urgencyReason}</AlertDescription>
                </Alert>
            )}
            {suggestedExpertInfo && (
                <Card className="bg-accent">
                    <CardHeader className="p-4">
                        <CardDescription>Suggested Consultation</CardDescription>
                        <CardTitle className="flex items-center gap-3">
                           <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-muted-foreground/20 text-foreground">{getInitials(suggestedExpertInfo.name)}</AvatarFallback>
                           </Avatar>
                           <div>
                            {suggestedExpertInfo.name}
                            <p className="text-sm font-normal text-muted-foreground">{suggestedExpertInfo.specialty}</p>
                           </div>
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0">
                         <Button className="w-full" onClick={() => onConsultExpert(suggestedExpertInfo.id, suggestion.summaryForExpert)}>
                            <Users className="mr-2 h-4 w-4"/>
                            Consult {suggestedExpertInfo.name}
                        </Button>
                    </CardFooter>
                </Card>
            )}
             {suggestion.quickActions.length > 0 && (
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Quick Actions</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestion.quickActions.map((action, index) => (
                            <Button key={index} variant="outline" size="sm" onClick={() => onSendMessage(action)}>
                                {action}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
      )}

      <div className="p-4 border-t bg-card">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
