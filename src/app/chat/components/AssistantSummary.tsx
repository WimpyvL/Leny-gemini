'use client';
import type { Assessment, User } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { Icon } from '@/components/Icon';

interface AssistantSummaryProps {
  assessment: Assessment;
  sender?: User;
  timestamp: Date;
}

export function AssistantSummary({ assessment, sender, timestamp }: AssistantSummaryProps) {
  const [formattedTimestamp, setFormattedTimestamp] = useState('');

  useEffect(() => {
    if (timestamp) {
      setFormattedTimestamp(format(timestamp, 'p'));
    }
  }, [timestamp]);

  return (
    <div className="flex items-start gap-3">
        {sender && (
            <Avatar className="h-9 w-9">
                <AvatarFallback className={cn("text-white", sender.avatarColor)}>
                    {sender.icon && <Icon name={sender.icon} className="h-5 w-5" />}
                </AvatarFallback>
            </Avatar>
        )}
        <div className="w-full">
            <p className="text-xs text-muted-foreground font-semibold flex justify-between w-full">
                <span>{sender?.name}</span>
                <span>{formattedTimestamp}</span>
            </p>
            <Card className="bg-secondary mt-1 border-secondary-foreground/20">
            <CardContent className="p-4 space-y-3">
                <h3 className="font-bold text-secondary-foreground">{assessment.title}</h3>
                <div className="text-secondary-foreground/90 space-y-1">
                    {assessment.summary.map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </div>
                <p className="text-secondary-foreground/90"><span className="font-bold">Recommendations:</span> {assessment.recommendations}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                {assessment.suggestions.map((suggestion) => (
                    <Button key={suggestion} variant="outline" size="sm" className="bg-accent text-accent-foreground border-accent-foreground/30 hover:bg-accent/80 h-auto py-1 px-3">
                    {suggestion}
                    </Button>
                ))}
                </div>
            </CardContent>
            </Card>
        </div>
    </div>
  );
}
