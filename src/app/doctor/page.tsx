
import { DashboardUI } from "./components/DashboardUI";
<<<<<<< HEAD
import { getUser, getConversationsForUser, getAllUsers } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function DoctorPage() {
  const doctorId = 'doctor1'; // Hardcode doctor user
  const userData = await getUser(doctorId);
  
  if (!userData) {
    redirect('/');
=======
import { mockUsers, mockConversations } from "@/lib/mock-data";

export default function DoctorPage() {
  const currentUser = mockUsers.find(u => u.id === 'doctor1');
  if (!currentUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        Doctor user not found in mock data.
      </div>
    );
>>>>>>> 4de5c1ea31c6afd7cb8b6b3e60a7b345ab82f1b4
  }
  
  const doctorConversations = mockConversations.filter(c => 
    c.participantIds.includes(currentUser.id) && 
    !c.participantIds.includes('assistant')
  );

<<<<<<< HEAD
  const [userConversations, allUsersData] = await Promise.all([
    getConversationsForUser(doctorId),
    getAllUsers(),
  ]);

  return <DashboardUI user={userData} conversations={userConversations} allUsers={allUsersData} />;
=======
  return <DashboardUI user={currentUser} conversations={doctorConversations} allUsers={mockUsers} />;
>>>>>>> 4de5c1ea31c6afd7cb8b6b3e60a7b345ab82f1b4
}
