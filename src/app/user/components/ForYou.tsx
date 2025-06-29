'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ForYouCardData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { GoalCreator } from './GoalCreator';

function ForYouCard({ card, isSelected, onSelect }: { card: ForYouCardData, isSelected: boolean, onSelect: () => void }) {
    const [formattedTimestamp, setFormattedTimestamp] = useState('');
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (hasMounted && card.timestamp) {
            const prefix = card.type === 'consultation' ? 'On' : 'Received';
            setFormattedTimestamp(`${prefix}: ${format(card.timestamp, 'MMM d, yyyy @ p')}`);
        }
    }, [card.timestamp, card.type, hasMounted]);
    
    return (
        <Card 
            onClick={onSelect}
            className={cn(
                "hover:shadow-md transition-all cursor-pointer",
                isSelected ? "shadow-md border-primary ring-2 ring-primary" : "border-card"
            )}
        >
            <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-start gap-4">
                    <div className="bg-muted p-2 rounded-lg">
                        <span className={cn("text-2xl", card.iconColor)}>{card.icon}</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-card-foreground">{card.title}</h3>
                        <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                </div>

                {card.type === 'goal_streak' && card.currentStreak !== undefined && card.goal !== undefined && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span className="flex items-center gap-1.5"><span className="text-orange-400">🔥</span> Streak Progress</span>
                            <span>{card.currentStreak} / {card.goal} {card.title.includes('Workout') ? 'Workouts' : 'Days'}</span>
                        </div>
                        <Progress value={(card.currentStreak / card.goal) * 100} className="h-2" />
                    </div>
                )}

                {hasMounted && formattedTimestamp && (
                    <p className="text-xs text-muted-foreground font-medium">
                        {formattedTimestamp}
                    </p>
                )}
                <div className="self-end -mr-2 -mb-2">
                     <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                        {card.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

interface ForYouProps {
    forYouData: ForYouCardData[];
    selectedCardId?: string;
    onCardSelect: (card: ForYouCardData) => void;
    onGoalCreate?: (goal: Omit<ForYouCardData, 'id' | 'type'>) => void;
    showCreateGoal?: boolean;
}

export function ForYou({ forYouData, selectedCardId, onCardSelect, onGoalCreate, showCreateGoal = true }: ForYouProps) {
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);

  const streaks = forYouData.filter(item => item.type === 'goal_streak');
  const otherItems = forYouData.filter(item => item.type !== 'goal_streak');

  const handleSaveGoal = (goal: Omit<ForYouCardData, 'id' | 'type'>) => {
    onGoalCreate?.(goal);
    setIsCreatingGoal(false);
  };
  
  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold font-headline">For You</h2>
        {showCreateGoal && (
            <Button variant="ghost" size="sm" onClick={() => setIsCreatingGoal(true)}>
                <span className="mr-2">➕</span>
                New Goal
            </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isCreatingGoal && showCreateGoal ? (
          <GoalCreator onSave={handleSaveGoal} onCancel={() => setIsCreatingGoal(false)} />
        ) : (
          <div className="space-y-4">
            {streaks.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-base font-semibold text-foreground px-1">Your Goals</h3>
                    {streaks.map(card => (
                      <ForYouCard 
                        key={card.id} 
                        card={card}
                        isSelected={selectedCardId === card.id}
                        onSelect={() => onCardSelect(card)}
                      />
                    ))}
                </div>
            )}
            
            {streaks.length > 0 && otherItems.length > 0 && <Separator />}

            {otherItems.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-base font-semibold text-foreground px-1">Inbox</h3>
                    {otherItems.map(card => (
                    <ForYouCard 
                        key={card.id} 
                        card={card} 
                        isSelected={selectedCardId === card.id}
                        onSelect={() => onCardSelect(card)}
                    />
                    ))}
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
