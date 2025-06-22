import type { Conversation } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (id: string) => void;
}

export function ConversationList({ conversations, selectedConversationId, onSelectConversation }: ConversationListProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold font-headline text-foreground">Chats</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map(conv => {
          const doctor = conv.participants.find(p => p.role === 'doctor');
          const lastMessage = conv.messages[conv.messages.length - 1];

          return (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={cn(
                "flex items-center p-4 cursor-pointer hover:bg-accent transition-colors",
                selectedConversationId === conv.id && "bg-accent"
              )}
            >
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={doctor?.avatar} alt={doctor?.name} data-ai-hint="doctor person" />
                <AvatarFallback>{doctor?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="w-full overflow-hidden">
                <p className="font-bold font-headline">{doctor?.name}</p>
                <p className="text-sm text-muted-foreground truncate">{lastMessage?.text || 'No messages yet'}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
