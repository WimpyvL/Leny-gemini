'use client';
import type { Conversation, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function ConversationItem({
  conv,
  onSelectConversation,
  selected,
  allUsers,
  currentUserId,
}: {
  conv: Conversation;
  onSelectConversation: (id: string) => void;
  selected: boolean;
  allUsers: User[],
  currentUserId: string;
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
        setRelativeTime(formatDistanceToNow(conv.timestamp, { addSuffix: true }));
      }
    };
    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 60000);
    return () => clearInterval(interval);
  }, [conv.timestamp, hasMounted]);
  
  const otherParticipant = allUsers.find(u => u.id === conv.participantIds.find(pId => pId !== currentUserId));
  const displayUser = otherParticipant || allUsers.find(u => u.id === 'assistant');
  const lastMessage = conv.messages[conv.messages.length - 1];

  return (
    <div
      onClick={() => onSelectConversation(conv.id)}
      className={cn(
        "flex items-center p-3 cursor-pointer rounded-lg hover:bg-accent transition-colors gap-3 mx-2",
        selected && "bg-accent"
      )}
    >
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarImage src={displayUser?.avatar} alt={displayUser?.name} />
        <AvatarFallback className='font-semibold'>
            {displayUser?.name?.charAt(0) || 'A'}
        </AvatarFallback>
      </Avatar>
      <div className="w-full overflow-hidden">
        <div className="flex items-baseline justify-between">
          <p className="font-semibold text-foreground truncate">{conv.title}</p>
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            {hasMounted ? relativeTime : ''}
          </p>
        </div>
        <p className="text-sm text-muted-foreground truncate">{lastMessage?.text || 'No messages yet'}</p>
      </div>
    </div>
  );
}


interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string | null;
  onSelectConversation: (id: string) => void;
  currentUser: User;
  allUsers: User[];
}

export function ConversationList({ conversations, selectedConversationId, onSelectConversation, currentUser, allUsers }: ConversationListProps) {
  const [searchValue, setSearchValue] = useState("");

  const filteredConversations = conversations.filter(conv => 
    conv.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b space-y-4">
        <h2 className="text-2xl font-bold">Conversations</h2>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search conversations..."
              className="h-10 rounded-full bg-background border-border pl-10"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="py-2 space-y-1">
            {filteredConversations.map(conv => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                onSelectConversation={onSelectConversation}
                selected={selectedConversationId === conv.id}
                allUsers={allUsers}
                currentUserId={currentUser.id}
              />
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
