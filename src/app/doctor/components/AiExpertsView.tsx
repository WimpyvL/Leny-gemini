'use client';

import { mockAiExperts } from '@/lib/mock-data';
import type { AiExpert } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

function AiExpertCard({ expert }: { expert: AiExpert }) {
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };
  
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="text-lg bg-muted-foreground/20 text-foreground">
            {getInitials(expert.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{expert.name}</CardTitle>
          <CardDescription>{expert.specialty}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground italic">"{expert.personality}"</p>
      </CardContent>
    </Card>
  );
}


export function AiExpertsView() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredExperts = mockAiExperts.filter(expert =>
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-secondary h-full flex flex-col">
      <div className="p-4 border-b border-border bg-card">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-headline">AI Experts</h2>
        </div>
        <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search by name or specialty..."
              className="pl-10 h-10 rounded-full bg-muted border-none focus-visible:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredExperts.map((expert, index) => (
            <AiExpertCard key={index} expert={expert} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
