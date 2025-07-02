'use client';

import type { Conversation, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
        const dist = formatDistanceToNow(conv.timestamp, { addSuffix: true });
        if (dist === 'less than a minute ago') {
            setRelativeTime('now');
        } else {
            setRelativeTime(dist.replace('about ', '').replace(' ago', ''));
        }
      }
    };
    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 60000);
    return () => clearInterval(interval);
  }, [conv.timestamp, hasMounted]);
  
  const otherParticipants = conv.participants.filter(p => p.id !== 'expert1');

  return (
    <div
      onClick={() => onSelectConversation(conv.id)}
      className={cn(
        "flex items-start p-3 cursor-pointer rounded-lg hover:bg-accent/50 transition-colors gap-3 mx-2",
        selected && "bg-accent border-primary/50 border"
      )}
    >
      <Avatar className={cn("h-12 w-12 rounded-full flex-shrink-0 relative", conv.avatarColor)}>
        <AvatarFallback className={cn("rounded-full text-white text-2xl font-bold", conv.avatarColor)}>
            {conv.icon ? <span>{conv.icon}</span> : conv.title.charAt(0)}
        </AvatarFallback>
        {conv.id.includes('group') && (
            <div className="absolute -right-1 -bottom-1 flex -space-x-3">
                {otherParticipants.slice(0, 2).map(p => (
                    <Avatar key={p.id} className="h-5 w-5 rounded-full border-2 border-card">
                        <AvatarFallback className={cn(p.avatarColor, 'text-white text-[8px] font-bold')}>{p.avatar}</AvatarFallback>
                    </Avatar>
                ))}
            </div>
        )}
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


interface UserListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (id: string) => void;
  currentUser: User;
}

export function UserList({ conversations, selectedConversationId, onSelectConversation, currentUser }: UserListProps) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b space-y-4">
        <div className="relative flex items-center gap-2">
            <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search users..."
                  className="h-11 rounded-full bg-muted border-none focus-visible:ring-primary text-base pl-11 pr-24"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <Mic className="h-5 w-5 text-muted-foreground" />
                    </Button>
                     <Avatar className={cn("h-8 w-8", currentUser.avatarColor)}>
                        <AvatarFallback className="text-white font-bold text-sm">{currentUser.avatar}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="secondary" className="rounded-full bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 h-8 px-4">
                <span className="mr-1.5">🔥</span> Trending Topics
            </Button>
            <Button variant="secondary" className="rounded-full bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 h-8 px-4">
                <span className="mr-1.5">💡</span> New Insights
            </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="py-2 space-y-1">
            {conversations.map(conv => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                onSelectConversation={onSelectConversation}
                selected={selectedConversationId === conv.id}
              />
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
