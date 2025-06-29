'use client';

import { mockUsers, mockConversations } from "@/lib/mock-data";
import { DashboardUI } from "@/app/dashboard/components/DashboardUI";
import type { User } from "@/lib/types";

// This component receives appUser from the layout
export default function DashboardPage({ appUser }: { appUser: User }) {
  
  if (!appUser) {
    // This should technically be handled by the layout, but it's good practice to check
    return <div>Loading...</div>;
  }
  
  const userConversations = mockConversations.filter(c => 
    c.participantIds.includes(appUser.id)
  );

  return <DashboardUI user={appUser} conversations={userConversations} allUsers={mockUsers} />;
}
