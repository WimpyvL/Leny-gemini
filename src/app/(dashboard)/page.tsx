'use client';

import { mockUsers, mockConversations } from "@/lib/mock-data";
import { DashboardUI } from "./components/DashboardUI";
import type { User } from "@/lib/types";
import { useState, useEffect } from "react";

// This component receives appUser from the layout and searchParams from Next.js
export default function DashboardPage({
  appUser: initialAppUser,
  searchParams,
}: {
  appUser: User;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [appUser, setAppUser] = useState(initialAppUser);

  useEffect(() => {
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
  }, [searchParams, initialAppUser]);
  
  if (!appUser) {
    // This should technically be handled by the layout, but it's good practice to check
    return <div>Loading...</div>;
  }
  
  const userConversations = mockConversations.filter(c => 
    c.participantIds.includes(appUser.id)
  );

  return <DashboardUI user={appUser} conversations={userConversations} allUsers={mockUsers} />;
}
