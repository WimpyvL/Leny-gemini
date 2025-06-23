'use client';

import { useState } from 'react';
import type { AiExpert } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface AiExpertListProps {
  experts: AiExpert[];
  selectedExpert: AiExpert | null;
  onSelectExpert: (expert: AiExpert) => void;
}

export function AiExpertList({ experts, selectedExpert, onSelectExpert }: AiExpertListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExperts = experts.filter(expert =>
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b space-y-4">
        <h2 className="text-xl font-bold font-headline">AI Experts</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or specialty..."
            className="h-11 rounded-full bg-muted border-none focus-visible:ring-primary text-base pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredExperts.map((expert, index) => (
            <div
              key={index}
              onClick={() => onSelectExpert(expert)}
              className={cn(
                "flex items-center p-2 cursor-pointer hover:bg-accent transition-colors rounded-lg",
                selectedExpert?.name === expert.name && "bg-accent"
              )}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarFallback className="bg-muted-foreground/20 text-foreground">
                    {getInitials(expert.name)}
                </AvatarFallback>
              </Avatar>
              <div className="w-full overflow-hidden">
                <p className="font-semibold text-sm">{expert.name}</p>
                <p className="text-sm text-muted-foreground truncate">{expert.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
