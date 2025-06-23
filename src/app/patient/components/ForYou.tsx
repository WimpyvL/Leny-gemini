'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockForYouData } from '@/lib/mock-data';
import type { ForYouCardData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowRight, Flame } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

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

                {card.type === 'health_streak' && card.currentStreak !== undefined && card.goal !== undefined && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span className="flex items-center gap-1.5"><Flame className="h-4 w-4 text-orange-400" /> Streak Progress</span>
                            <span>{card.currentStreak} / {card.goal} {card.title.includes('Workout') ? 'Workouts' : 'Days'}</span>
                        </div>
                        <Progress value={(card.currentStreak / card.goal) * 100} className="h-2" />
                    </div>
                )}

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
  const streaks = mockForYouData.filter(item => item.type === 'health_streak');
  const otherItems = mockForYouData.filter(item => item.type !== 'health_streak');

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold font-headline">For You</h2>
        <p className="text-sm text-muted-foreground">Personalized health insights & reminders.</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {streaks.length > 0 && (
            <div className="space-y-3">
                <h3 className="text-base font-semibold text-foreground px-1">Your Health Streaks</h3>
                {streaks.map(card => (
                  <ForYouCard key={card.id} card={card} />
                ))}
            </div>
        )}
        
        {streaks.length > 0 && otherItems.length > 0 && <Separator className="my-4" />}

        {otherItems.length > 0 && (
            <div className="space-y-3">
                 <h3 className="text-base font-semibold text-foreground px-1">Inbox</h3>
                {otherItems.map(card => (
                <ForYouCard key={card.id} card={card} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
