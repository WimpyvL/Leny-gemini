'use client';

import { ChatUI } from "./components/ChatUI";
import { mockUsers, mockConversations } from "@/lib/mock-data";

export default function PatientPage() {
  const currentUser = mockUsers.find(u => u.id === 'patient1');
  const doctors = mockUsers.filter(u => u.role === 'doctor');
  
  if (!currentUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        Patient user not found in mock data.
      </div>
    );
  }

  const patientConversations = mockConversations.filter(c => 
    c.participantIds.includes(currentUser.id)
  );

  return <ChatUI user={currentUser} conversations={patientConversations} doctors={doctors} />;
}
