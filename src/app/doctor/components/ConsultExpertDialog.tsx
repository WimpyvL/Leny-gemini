'use client';

import { useState } from 'react';
import type { AiExpert } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check } from 'lucide-react';

interface ConsultExpertDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConsult: (expert: AiExpert) => void;
  allExperts: AiExpert[];
  currentExpertId: string;
}

const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`;
    return name.substring(0, 2);
};

export function ConsultExpertDialog({ isOpen, onOpenChange, onConsult, allExperts, currentExpertId }: ConsultExpertDialogProps) {
  const [selectedExpert, setSelectedExpert] = useState<AiExpert | null>(null);

  const availableExperts = allExperts.filter(
    (expert) => expert.id !== currentExpertId && expert.id !== 'leny-router'
  );

  const handleConsultClick = () => {
    if (selectedExpert) {
      onConsult(selectedExpert);
      setSelectedExpert(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Consult Another Expert</DialogTitle>
          <DialogDescription>
            Get a second opinion from another AI specialist. They will review the current chat and provide their analysis.
          </DialogDescription>
        </DialogHeader>
        <Command>
            <CommandInput placeholder="Search for an expert..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                 <ScrollArea className="h-64">
                    <CommandGroup>
                    {availableExperts.map((expert) => (
                        <CommandItem
                        key={expert.id}
                        value={expert.name}
                        onSelect={() => setSelectedExpert(expert)}
                        className="flex items-center justify-between"
                        >
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-muted-foreground/20 text-foreground">{getInitials(expert.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{expert.name}</p>
                                <p className="text-xs text-muted-foreground">{expert.specialty}</p>
                            </div>
                        </div>
                        {selectedExpert?.id === expert.id && <Check className="h-4 w-4" />}
                        </CommandItem>
                    ))}
                    </CommandGroup>
                </ScrollArea>
            </CommandList>
        </Command>
        
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConsultClick} disabled={!selectedExpert}>
            Consult {selectedExpert?.name.split(' ')[1] || ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
