'use client';

import { useState } from 'react';
import { MessageSquare, Sparkles, ChevronsLeft, ChevronsRight, BrainCircuit, MapPin } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { User as UserType } from '@/lib/types';

export type PatientView = 'chats' | 'foryou' | 'profile' | 'aiexperts' | 'find-doctor';

interface PatientNavRailProps {
    currentUser: UserType;
    activeView: PatientView;
    onViewChange: (view: PatientView) => void;
}

export function PatientNavRail({ currentUser, activeView, onViewChange }: PatientNavRailProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const navItems = [
        { view: 'chats' as PatientView, icon: MessageSquare, label: 'Chats', roles: ['patient', 'doctor'] },
        { view: 'foryou' as PatientView, icon: Sparkles, label: 'For you', roles: ['patient', 'doctor'] },
        { view: 'find-doctor' as PatientView, icon: MapPin, label: 'Find a Doctor', roles: ['patient'] },
        { view: 'aiexperts' as PatientView, icon: BrainCircuit, label: 'AI Experts', roles: ['doctor'] },
    ];

    const filteredNavItems = navItems.filter(item => item.roles.includes(currentUser.role));

    const commonTooltipProps = isExpanded ? { open: false } : {};

    return (
        <TooltipProvider delayDuration={0}>
            <div
                className={cn(
                    "absolute top-0 left-0 h-screen z-20 flex flex-col border-r bg-gradient-to-b from-slate-50 to-slate-100 text-slate-700 transition-all duration-300 ease-in-out",
                    isExpanded ? "w-56 p-4 items-start" : "w-[72px] p-2 items-center"
                )}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-12 w-12 text-slate-600 hover:bg-slate-200/50 hover:text-primary rounded-xl mb-4",
                        isExpanded && "self-end"
                    )}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? <ChevronsLeft className="h-6 w-6" /> : <ChevronsRight className="h-6 w-6" />}
                    <span className="sr-only">Toggle Sidebar</span>
                </Button>

                <nav className={cn("flex flex-1 flex-col gap-2", isExpanded ? "items-stretch w-full" : "items-center")}>
                    {filteredNavItems.map((item) => (
                        <div key={item.label}>
                             <Tooltip {...commonTooltipProps}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        onClick={() => onViewChange(item.view)}
                                        className={cn(
                                            "h-12 rounded-xl text-slate-600 hover:bg-primary/10 hover:text-primary relative",
                                            isExpanded ? "w-full justify-start px-3 gap-3" : "w-12 justify-center",
                                            activeView === item.view && "bg-primary/10 text-primary"
                                        )}
                                    >
                                        {activeView === item.view && (
                                            <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-r-full"></div>
                                        )}
                                        <item.icon className="h-6 w-6" />
                                        <span className={cn("sr-only", isExpanded && "not-sr-only font-semibold")}>{item.label}</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>{item.label}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    ))}
                </nav>

                <div className={cn("mt-auto", isExpanded && "w-full")}>
                     <Tooltip {...commonTooltipProps}>
                        <TooltipTrigger asChild>
                           <Button
                                variant="ghost"
                                onClick={() => onViewChange('profile')}
                                className={cn(
                                    "h-12 rounded-xl text-slate-600 hover:bg-primary/10 hover:text-primary",
                                    isExpanded ? "w-full justify-start px-3 gap-3" : "w-12 justify-center",
                                    activeView === 'profile' && "bg-primary/10 text-primary"
                                )}
                           >
                               <Avatar className="h-9 w-9">
                                    <AvatarFallback className={cn("text-white font-semibold", currentUser.avatarColor)}>{currentUser.avatar}</AvatarFallback>
                               </Avatar>
                               <span className={cn("sr-only", isExpanded && "not-sr-only font-semibold")}>Profile</span>
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
