import type { Conversation, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface PatientListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (id: string) => void;
  currentUser: User;
}

export function PatientList({ conversations, selectedConversationId, onSelectConversation }: PatientListProps) {
  return (
    <div className="h-full flex flex-col bg-card">
      <CardHeader className="p-4 border-b">
        <h2 className="text-xl font-bold font-headline">Patients</h2>
      </CardHeader>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
            {conversations.map(conv => {
            const patient = conv.participants.find(p => p.role === 'patient');
            const lastMessage = conv.messages[conv.messages.length - 1];

            return (
                <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={cn(
                    "flex items-center p-2 cursor-pointer hover:bg-accent transition-colors rounded-lg",
                    selectedConversationId === conv.id && "bg-accent"
                )}
                >
                <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={patient?.avatar} alt={patient?.name} data-ai-hint="patient person" />
                    <AvatarFallback>{patient?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="w-full overflow-hidden">
                    <p className="font-semibold text-sm">{patient?.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{lastMessage?.text || 'No messages yet'}</p>
                </div>
                </div>
            );
            })}
        </div>
      </ScrollArea>
    </div>
  );
}
