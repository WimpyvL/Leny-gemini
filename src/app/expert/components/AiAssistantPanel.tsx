'use client';

import { useEffect, useState, useTransition } from 'react';
import type { Conversation, User, FormattedResponse } from '@/lib/types';
import { runQuery } from '../actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AiAssistantPanelProps {
  conversation: Conversation | null;
  currentUser: User;
}

const LoadingState = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex flex-wrap gap-2">
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-24 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <Skeleton className="h-40 w-full" />
  </div>
);

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full p-8">
        <span className="text-5xl mb-4">🤖</span>
        <p className="text-lg font-medium">AI Assistant</p>
        <p className="text-sm">Select a user conversation to activate AI analysis and decision support.</p>
    </div>
);

export function AiAssistantPanel({ conversation, currentUser }: AiAssistantPanelProps) {
  const [analysis, setAnalysis] = useState<FormattedResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (conversation && conversation.messages.length > 0) {
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      if (lastMessage.senderId !== currentUser.id) { // Only analyze user messages
        startTransition(async () => {
          setAnalysis(null);
          const result = await runQuery({
            text: lastMessage.text || '',
            userRole: 'expert',
            conversationHistory: conversation.messages.slice(-5).map(m => `${m.senderId === currentUser.id ? 'Expert' : 'User'}: ${m.text}`),
          });
          setAnalysis(result);
        });
      }
    } else {
        setAnalysis(null);
    }
  }, [conversation, currentUser.id]);

  const renderContent = () => {
    if (!conversation) {
        return <EmptyState />;
    }

    if (isPending) {
      return <LoadingState />;
    }

    if (!analysis) {
       return (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full p-8">
            <span className="text-5xl mb-4">💬</span>
            <p className="text-lg font-medium">Ready for Analysis</p>
            <p className="text-sm">Waiting for a new message from the user to analyze.</p>
        </div>
      );
    }
    
    return (
      <>
        <div className="space-y-4 px-4">
            <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: analysis.content.replace(/\n/g, '<br />') }} />
        </div>
      </>
    );
  };

  return (
    <Card className="h-full border-0 rounded-none bg-transparent flex flex-col">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
        <CardDescription>Real-time decision support.</CardDescription>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent>
            {renderContent()}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
