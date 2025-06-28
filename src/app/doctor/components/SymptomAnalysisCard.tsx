'use client';
import { useEffect, useState, useTransition } from 'react';
import { runAnalysis } from '../actions';
import type { AnalyzeSymptomsOutput } from '@/ai/flows/analyze-symptoms';
import type { Message } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SymptomAnalysisCardProps {
  lastPatientMessage?: Message;
}

export function SymptomAnalysisCard({ lastPatientMessage }: SymptomAnalysisCardProps) {
  const [analysis, setAnalysis] = useState<AnalyzeSymptomsOutput | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (lastPatientMessage?.text) {
      startTransition(async () => {
        setAnalysis(null);
        const result = await runAnalysis(lastPatientMessage.text);
        setAnalysis(result);
      });
    }
  }, [lastPatientMessage]);

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-24 w-full" />
        </div>
      );
    }

    if (!analysis) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full p-8">
            <span className="text-5xl mb-4">🧠</span>
            <p className="text-lg font-medium">No Analysis Available</p>
            <p className="text-sm">Select a patient with recent messages to begin AI analysis.</p>
        </div>
      );
    }
    
    return (
      <>
        {analysis.emergencyDetected && (
          <Alert variant="destructive" className="mb-4">
            <span className="text-xl mr-2">🚨</span>
            <div>
              <AlertTitle>Potential Emergency Detected!</AlertTitle>
              <AlertDescription>{analysis.urgencyReason || 'Urgent action may be required.'}</AlertDescription>
            </div>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold font-headline">
              <span>📝</span>
              Extracted Symptoms
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {analysis.symptoms.length > 0 ? (
                analysis.symptoms.map(symptom => (
                  <Badge key={symptom} variant="secondary" className="text-base py-1 px-3">{symptom}</Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No specific symptoms extracted from the last message.</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold font-headline">
              {analysis.emergencyDetected ? <span className="text-destructive">🫀</span> : <span className="text-green-400">✅</span>}
              Urgency Level
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {analysis.emergencyDetected ? 'High - Immediate attention recommended' : 'Normal'}
            </p>
          </div>
        </div>
      </>
    );
  };

  return (
    <Card className="h-full border-0 rounded-none bg-transparent">
      <CardHeader>
        <CardTitle>AI-Powered Analysis</CardTitle>
        <CardDescription>Analysis of the latest patient message.</CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
