'use client';

import { mockUsers, mockConversations } from "@/lib/mock-data";
import { DashboardUI } from "./components/DashboardUI";
import type { User } from "@/lib/types";
import { useState, useEffect } from "react";

// This component now fetches its own data and handles dev_role
export default function DashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [appUser, setAppUser] = useState<User | null>(null);

  useEffect(() => {
    // Default to the 'user' role mock user for development.
    const initialAppUser = mockUsers.find(u => u.id === 'user1');
    if (!initialAppUser) return;

    const devRole = searchParams?.dev_role;
    if (devRole === 'expert' || devRole === 'user') {
      const newUser = { ...initialAppUser, role: devRole as 'user' | 'expert' };
      if (devRole === 'expert' && !newUser.expertInfo) {
        newUser.expertInfo = {
            specialty: 'General Consultant',
            title: newUser.name,
            bio: `Viewing in expert developer mode.`,
            officeHours: 'Mon-Fri, 9:00 AM - 5:00 PM',
            practiceAddress: '123 Innovation Drive',
            practiceName: 'Solutions Inc.',
        };
      }
      setAppUser(newUser);
    } else {
      setAppUser(initialAppUser);
    }
  }, [searchParams]);
  
  if (!appUser) {
    // This will show while the user state is being set in useEffect
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="text-xl">Loading dashboard...</div>
        </div>
    );
  }
  
  const userConversations = mockConversations.filter(c => 
    c.participantIds.includes(appUser.id)
  );

  return <DashboardUI user={appUser} conversations={userConversations} allUsers={mockUsers} />;
}
