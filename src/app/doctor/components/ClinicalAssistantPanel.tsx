'use client';

import { useEffect, useState, useTransition } from 'react';
import type { Conversation, User } from '@/lib/types';
import type { FormattedClinicalResponse } from '@/ai/flows/medical-query-flow';
import { runMedicalQuery } from '../actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ClinicalAssistantPanelProps {
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
        <p className="text-lg font-medium">Clinical Assistant</p>
        <p className="text-sm">Select a patient conversation to activate AI analysis and decision support.</p>
    </div>
);

export function ClinicalAssistantPanel({ conversation, currentUser }: ClinicalAssistantPanelProps) {
  const [analysis, setAnalysis] = useState<FormattedClinicalResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (conversation && conversation.messages.length > 0) {
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      if (lastMessage.senderId !== currentUser.id) { // Only analyze patient messages
        startTransition(async () => {
          setAnalysis(null);
          const result = await runMedicalQuery({
            text: lastMessage.text || '',
            userType: 'provider',
            specialtyHint: 'cardiology', // This could be dynamic in a real app
            conversationHistory: conversation.messages.slice(-5).map(m => `${m.senderId === currentUser.id ? 'Doctor' : 'Patient'}: ${m.text}`),
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
            <p className="text-sm">Waiting for a new message from the patient to analyze.</p>
        </div>
      );
    }
    
    return (
      <>
        {analysis.escalationTriggered && (
          <Alert variant="destructive" className="mx-4 mb-4">
            <span className="text-xl mr-2">🚨</span>
            <div>
              <AlertTitle>Potential Emergency Detected!</AlertTitle>
              <AlertDescription>{analysis.metadata.classification.reason || 'Urgent action may be required.'}</AlertDescription>
            </div>
          </Alert>
        )}
        
        <div className="space-y-4 px-4">
            <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">Analysis</h3>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Specialty: {analysis.metadata.classification.specialty.replace('_', ' ')}</Badge>
                    <Badge variant="secondary">Context: {analysis.metadata.classification.context}</Badge>
                </div>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: analysis.content.replace(/\n/g, '<br />') }} />
        </div>
      </>
    );
  };

  return (
    <Card className="h-full border-0 rounded-none bg-transparent flex flex-col">
      <CardHeader>
        <CardTitle>AI Clinical Assistant</CardTitle>
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
