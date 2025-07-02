'use client';

import { mockUsers, mockConversations } from "@/lib/mock-data";
import { DashboardUI } from "./components/DashboardUI";
import type { User, Conversation } from "@/lib/types";

export default function DashboardPage() {
  // For this simplified view, we always use the default mock user.
  let appUser: User | undefined = mockUsers.find(u => u.id === 'user1');

  if (!appUser) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="text-xl text-destructive">Error: Default user 'user1' not found in mock data.</div>
        </div>
    );
  }
  
  // Find the primary conversation with the AI assistant.
  const aiConversation = mockConversations.find(c => 
    c.participantIds.includes(appUser!.id) && c.participantIds.includes('assistant')
  );

  return <DashboardUI user={appUser} conversation={aiConversation} allUsers={mockUsers} />;
}
