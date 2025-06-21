import type { Conversation, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';

interface PatientListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (id: string) => void;
  currentUser: User;
}

export function PatientList({ conversations, selectedConversationId, onSelectConversation, currentUser }: PatientListProps) {
  return (
    <div className="h-full flex flex-col bg-sidebar text-sidebar-foreground">
      <CardHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
            <Logo />
        </div>
        <p className="text-sm text-sidebar-foreground/80 pt-2">Welcome, {currentUser.name}</p>
      </CardHeader>
      <ScrollArea className="flex-1">
        <h2 className="p-4 text-lg font-semibold font-headline text-sidebar-foreground">Patients</h2>
        {conversations.map(conv => {
          const patient = conv.participants.find(p => p.role === 'patient');
          const lastMessage = conv.messages[conv.messages.length - 1];

          return (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={cn(
                "flex items-center p-4 cursor-pointer hover:bg-sidebar-accent transition-colors",
                selectedConversationId === conv.id && "bg-sidebar-accent"
              )}
            >
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={patient?.avatar} alt={patient?.name} data-ai-hint="patient person" />
                <AvatarFallback>{patient?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="w-full overflow-hidden">
                <p className="font-semibold text-sidebar-accent-foreground">{patient?.name}</p>
                <p className="text-sm text-sidebar-foreground/70 truncate">{lastMessage?.text || 'No messages yet'}</p>
              </div>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
}
