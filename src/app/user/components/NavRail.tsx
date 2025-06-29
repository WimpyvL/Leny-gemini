'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { User as UserType } from '@/lib/types';

export type AppView = 'chats' | 'foryou' | 'profile' | 'aiexperts' | 'find-expert';

interface NavRailProps {
    currentUser: UserType;
    activeView: AppView;
    onViewChange: (view: AppView) => void;
}

export function NavRail({ currentUser, activeView, onViewChange }: NavRailProps) {
    const navItems = [
        { view: 'chats' as AppView, icon: '💬', label: 'Chats', roles: ['user', 'expert'], badge: 27 },
        { view: 'foryou' as AppView, icon: '✨', label: 'For you', roles: ['user', 'expert'] },
        { view: 'find-expert' as AppView, icon: '📍', label: 'Find an Expert', roles: ['user'] },
        { view: 'aiexperts' as AppView, icon: '🧠', label: 'AI Experts', roles: ['expert'] },
    ];

    const filteredNavItems = navItems.filter(item => item.roles.includes(currentUser.role));

    return (
        <TooltipProvider delayDuration={0}>
            <div
                className={cn(
                    "h-screen z-20 flex flex-col items-center border-r bg-card text-card-foreground transition-all duration-300 ease-in-out w-[72px] p-2"
                )}
            >
                <div className="my-4" />

                <nav className={cn("flex flex-1 flex-col gap-2 items-center")}>
                    {filteredNavItems.map((item) => (
                        <div key={item.label}>
                             <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        onClick={() => onViewChange(item.view)}
                                        className={cn(
                                            "h-12 w-12 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary relative",
                                            activeView === item.view && "bg-primary/10 text-primary"
                                        )}
                                    >
                                        <span className="text-2xl">{item.icon}</span>
                                        {item.badge && (
                                            <span className="absolute top-1 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold border-2 border-card">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>{item.label}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    ))}
                </nav>

                <div className={cn("mt-auto")}>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Button
                                variant="ghost"
                                onClick={() => onViewChange('profile')}
                                className={cn(
                                    "h-12 w-12 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary",
                                     activeView === 'profile' && "bg-primary/10 text-primary"
                                )}
                           >
                               <Avatar className={cn("h-10 w-10", currentUser.avatarColor)}>
                                    <AvatarFallback className={cn("text-white font-semibold", currentUser.avatarColor)}>{currentUser.avatar}</AvatarFallback>
                               </Avatar>
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Profile</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </TooltipProvider>
    );
}
