'use client';
import type { Conversation, User } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';

function ConversationItem({
  conv,
  onSelectConversation,
  selected,
}: {
  conv: Conversation;
  onSelectConversation: (id: string) => void;
  selected: boolean;
}) {
  const [relativeTime, setRelativeTime] = useState('');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const updateRelativeTime = () => {
      if (conv.timestamp) {
        setRelativeTime(formatDistanceToNow(conv.timestamp, { addSuffix: false }));
      }
    };

    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 60000);

    return () => clearInterval(interval);
  }, [conv.timestamp, hasMounted]);

  return (
    <div
      onClick={() => onSelectConversation(conv.id)}
      className={cn(
        "flex items-start p-3 cursor-pointer rounded-lg hover:bg-muted transition-colors gap-3",
        selected && "bg-secondary"
      )}
    >
      <Avatar className={cn("h-12 w-12 rounded-lg flex-shrink-0", conv.avatarColor)}>
        <AvatarFallback className={cn("rounded-lg text-white", conv.avatarColor)}>
          {conv.icon && <span className="text-2xl">{conv.icon}</span>}
        </AvatarFallback>
      </Avatar>
      <div className="w-full overflow-hidden">
        <div className="flex items-baseline justify-between">
          <p className="font-semibold text-foreground truncate">{conv.title}</p>
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            {hasMounted ? relativeTime : ''}
          </p>
        </div>
        <p className="text-sm text-muted-foreground truncate">{conv.participantString}</p>
      </div>
    </div>
  );
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (id: string) => void;
  currentUser: User;
}

export function ConversationList({ conversations, selectedConversationId, onSelectConversation, currentUser }: ConversationListProps) {
  return (
    <aside className="w-[340px] flex-shrink-0 border-r border-border bg-sidebar flex flex-col">
      <header className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                    <AvatarFallback className={cn("text-white", currentUser.avatarColor)}>{currentUser.avatar}</AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-semibold">{currentUser.name}</h2>
            </div>
        </div>
        <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Ask or Search here" className="pl-10 h-10 rounded-full bg-muted border-none focus-visible:ring-primary" />
        </div>
      </header>
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {conversations.map(conv => (
            <ConversationItem
              key={conv.id}
              conv={conv}
              onSelectConversation={onSelectConversation}
              selected={selectedConversationId === conv.id}
            />
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
