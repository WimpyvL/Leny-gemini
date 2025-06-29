'use client';
import { useState } from 'react';
import { Bot, MessageSquare, Settings, User as UserIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { User } from '@/lib/types';

type View = 'chats' | 'profile';

interface SidebarProps {
  user: User;
}

export function Sidebar({ user }: SidebarProps) {
  const [activeView, setActiveView] = useState<View>('chats');
  
  const navItems = [
    { view: 'chats' as View, icon: MessageSquare, label: 'Conversations' },
    { view: 'profile' as View, icon: Settings, label: 'Settings' },
  ];

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`;
    return name.substring(0, 2);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="h-screen z-20 flex flex-col items-center border-r bg-card text-card-foreground w-16 p-2 gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="h-6 w-6" />
        </div>
        
        <nav className="flex flex-1 flex-col gap-2 items-center">
          {navItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => setActiveView(item.view)}
                  className={cn(
                    "h-10 w-10 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    activeView === item.view && "bg-accent text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
        
        <div className="mt-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => setActiveView('profile')}
                className={cn(
                  "h-10 w-10 rounded-full",
                  activeView === 'profile' && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Profile & Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
