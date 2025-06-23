'use client';

import type { QuickAction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Star, ArrowDown, Rocket, ArrowUp, Siren } from 'lucide-react';
import React from 'react';

interface QuickActionsViewProps {
  onHide: () => void;
  recentSearches: string[];
  favorites: QuickAction[];
  emergencyProtocols: QuickAction[];
}

const QuickActionCard = ({ action }: { action: QuickAction }) => (
  <Card className={cn("p-2 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer relative", action.cardColor)}>
    {action.isStarred && <Star className="absolute top-1.5 right-1.5 h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />}
    <CardContent className="p-2 flex flex-col items-center justify-center gap-2">
      <action.icon className={cn("h-6 w-6", action.iconColor)} />
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
                <Rocket className="h-4 w-4 mr-2" /> Hide Quick Actions <ArrowUp className="h-4 w-4 ml-2" />
            </Button>

            <div>
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2 px-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" /> Favorites
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    {favorites.map(action => <QuickActionCard key={action.id} action={action} />)}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2 px-1">
                    <Siren className="h-4 w-4 text-red-500" /> Emergency Protocols
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    {emergencyProtocols.map(action => <QuickActionCard key={action.id} action={action} />)}
                </div>
            </div>
        </div>
    );
}
