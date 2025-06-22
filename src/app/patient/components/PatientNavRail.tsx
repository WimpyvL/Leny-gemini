'use client';

import { MessageSquare, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { User as UserType } from '@/lib/types';

interface PatientNavRailProps {
    currentUser: UserType;
}

export function PatientNavRail({ currentUser }: PatientNavRailProps) {
    return (
        <div className="flex h-screen w-16 flex-col items-center border-r bg-sidebar text-sidebar-foreground p-2 gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <span className="text-xl font-bold text-primary-foreground">L</span>
            </div>
            <TooltipProvider delayDuration={0}>
                <nav className="flex flex-1 flex-col items-center gap-4 pt-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-12 w-12 bg-sidebar-accent text-sidebar-accent-foreground rounded-lg">
                                <MessageSquare className="h-6 w-6" />
                                <span className="sr-only">Chats</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Chats</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-12 w-12 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg">
                                <Sparkles className="h-6 w-6" />
                                <span className="sr-only">For you</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>For you</p>
                        </TooltipContent>
                    </Tooltip>
                </nav>
                <div className="mt-auto">
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Avatar className="h-12 w-12 cursor-pointer">
                                <AvatarFallback className={cn("text-white", currentUser.avatarColor)}>{currentUser.avatar}</AvatarFallback>
                           </Avatar>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Profile</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    );
}
