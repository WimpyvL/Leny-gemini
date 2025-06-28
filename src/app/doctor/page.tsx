'use client';

import { DashboardUI } from "./components/DashboardUI";
import { mockUsers, mockConversations } from "@/lib/mock-data";

export default function DoctorPage() {
  const currentUser = mockUsers.find(u => u.id === 'doctor1');
  if (!currentUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        Doctor user not found in mock data.
      </div>
    );
  }
  
  const doctorConversations = mockConversations.filter(c => 
    c.participantIds.includes(currentUser.id) && 
    !c.participantIds.includes('assistant')
  );

  return <DashboardUI user={currentUser} conversations={doctorConversations} allUsers={mockUsers} />;
}
