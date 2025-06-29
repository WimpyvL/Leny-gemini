'use client';

import { ChatUI } from "./components/ChatUI";
import { mockUsers, mockConversations } from "@/lib/mock-data";

export default function UserPage() {
  const currentUser = mockUsers.find(u => u.id === 'user1');
  const experts = mockUsers.filter(u => u.role === 'expert');
  
  if (!currentUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        User not found in mock data.
      </div>
    );
  }

  const userConversations = mockConversations.filter(c => 
    c.participantIds.includes(currentUser.id)
  );

  return <ChatUI user={currentUser} conversations={userConversations} experts={experts} />;
}
