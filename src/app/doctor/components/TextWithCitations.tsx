'use client';

import type { Citation } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import React from 'react';

interface TextWithCitationsProps {
  text: string;
  citations?: Citation[];
  className?: string;
}

// Function to escape regex special characters
const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

export function TextWithCitations({ text, citations, className }: TextWithCitationsProps) {
  if (!citations || citations.length === 0) {
    return <p className={className}>{text}</p>;
  }

  // Sort citations by term length, descending, to match longer terms first
  const sortedCitations = [...citations].sort((a, b) => b.term.length - a.term.length);
  const terms = sortedCitations.map(c => escapeRegExp(c.term));
  
  // Do not create a regex if there are no terms, as it would be invalid.
  if (terms.length === 0) {
    return <p className={className}>{text}</p>;
  }
  
  const regex = new RegExp(`(${terms.join('|')})`, 'g');
  
  const parts = text.split(regex);

  return (
    <p className={className}>
      <TooltipProvider delayDuration={100}>
        {parts.map((part, index) => {
          const citation = sortedCitations.find(c => c.term === part);
          if (citation) {
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <span className="underline decoration-dotted cursor-help font-semibold text-primary/90">
                    {part}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>{citation.source}</p>
                </TooltipContent>
              </Tooltip>
            );
          }
          return <React.Fragment key={index}>{part}</React.Fragment>;
        })}
      </TooltipProvider>
    </p>
  );
}
