'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockForYouData } from '@/lib/mock-data';
import type { ForYouCardData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

function ForYouCard({ card }: { card: ForYouCardData }) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-start gap-4">
                    <div className="bg-muted p-2 rounded-lg">
                        <card.icon className={cn("h-6 w-6", card.iconColor)} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-card-foreground">{card.title}</h3>
                        <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                </div>
                {card.timestamp && (
                    <p className="text-xs text-muted-foreground font-medium">
                        {card.type === 'appointment' ? 'On' : 'Received'}: {format(card.timestamp, 'MMM d, yyyy @ p')}
                    </p>
                )}
                <Button variant="ghost" size="sm" className="self-end -mr-2 -mb-2 text-primary hover:text-primary">
                    {card.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    );
}


export function ForYou() {
  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold font-headline">For You</h2>
        <p className="text-sm text-muted-foreground">Personalized health insights & reminders.</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {mockForYouData.map(card => (
          <ForYouCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
