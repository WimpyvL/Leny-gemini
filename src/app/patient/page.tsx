
import { ChatUI } from "./components/ChatUI";
<<<<<<< HEAD
import { getUser, getConversationsForUser, getDoctors } from "@/lib/data";
import { redirect } from 'next/navigation';

export default async function PatientPage() {
  const patientId = 'patient1'; // Hardcode patient user
  const userData = await getUser(patientId);
  
  if (!userData) {
    redirect('/');
  }

  const [userConversations, allDoctors] = await Promise.all([
    getConversationsForUser(patientId),
    getDoctors(),
  ]);

  return <ChatUI user={userData} conversations={userConversations} doctors={allDoctors} />;
=======
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
>>>>>>> 4de5c1ea31c6afd7cb8b6b3e60a7b345ab82f1b4
}
