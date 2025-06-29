'use client';

import { useState } from 'react';
import type { User } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExpertCard } from './ExpertCard';

interface FindExpertViewProps {
  experts: User[];
}

export function FindExpertView({ experts }: FindExpertViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExperts = experts.filter(expert => {
    const term = searchTerm.toLowerCase();
    return (
      expert.name.toLowerCase().includes(term) ||
      expert.expertInfo?.specialty?.toLowerCase().includes(term) ||
      expert.expertInfo?.practiceName?.toLowerCase().includes(term) ||
      expert.expertInfo?.practiceAddress?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="h-full flex flex-col bg-secondary">
      <header className="p-4 border-b bg-card space-y-4">
        <h1 className="text-2xl font-bold font-headline">Find an Expert</h1>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-muted-foreground">🔍</span>
          <Input
            placeholder="Search by name, specialty, or topic..."
            className="h-11 rounded-full bg-input pl-10 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>
      <ScrollArea className="flex-1">
        {filteredExperts.length > 0 ? (
          <div className="p-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredExperts.map(expert => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
            <p className="text-lg font-medium">No Experts Found</p>
            <p className="text-sm">Try adjusting your search terms.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
