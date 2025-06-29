'use client';

import { DashboardUI } from "./components/DashboardUI";
import { mockUsers, mockConversations } from "@/lib/mock-data";

export default function ExpertPage() {
  const currentUser = mockUsers.find(u => u.id === 'expert1');
  if (!currentUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        Expert user not found in mock data.
      </div>
    );
  }
  
  const expertConversations = mockConversations.filter(c => 
    c.participantIds.includes(currentUser.id) && 
    !c.participantIds.includes('assistant')
  );

  return <DashboardUI user={currentUser} conversations={expertConversations} allUsers={mockUsers} />;
}
