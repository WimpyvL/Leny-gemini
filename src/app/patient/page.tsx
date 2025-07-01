
import { ChatUI } from "./components/ChatUI";
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
}
