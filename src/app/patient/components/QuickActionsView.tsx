'use client';

import type { QuickAction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import React from 'react';

interface QuickActionsViewProps {
  onHide: () => void;
  recentSearches: string[];
  favorites: QuickAction[];
  emergencyProtocols: QuickAction[];
}

const QuickActionCard = ({ action }: { action: QuickAction }) => (
  <Card className={cn("p-2 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer relative", action.cardColor)}>
    {action.isStarred && <span className="absolute top-1 right-1 text-sm text-yellow-400">⭐</span>}
    <CardContent className="p-2 flex flex-col items-center justify-center gap-2">
      <span className={cn("text-2xl", action.iconColor)}>{action.icon}</span>
      <span className="text-xs font-medium text-center">{action.label}</span>
    </CardContent>
  </Card>
);

export function QuickActionsView({ onHide, recentSearches, favorites, emergencyProtocols }: QuickActionsViewProps) {
    return (
        <div className="p-4 space-y-6">
            <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-3 px-1">RECENT</h3>
                <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                        <div key={index} className="p-2 rounded-md text-sm cursor-pointer hover:bg-accent">{search}</div>
                    ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground">
                    More <ArrowDown className="h-4 w-4 ml-2" />
                </Button>
            </div>

            <Button onClick={onHide} className="w-full bg-orange-400 hover:bg-orange-500 text-primary-foreground font-semibold">
                <span className="mr-2">🚀</span> Hide Quick Actions <ArrowUp className="h-4 w-4 ml-2" />
            </Button>

            <div>
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2 px-1">
                    <span className="text-yellow-500">⭐</span> Favorites
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    {favorites.map(action => <QuickActionCard key={action.id} action={action} />)}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2 px-1">
                    <span className="text-red-500">🚨</span> Immediate Assistance
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    {emergencyProtocols.map(action => <QuickActionCard key={action.id} action={action} />)}
                </div>
            </div>
        </div>
    );
}
