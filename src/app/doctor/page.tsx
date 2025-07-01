
import { DashboardUI } from "./components/DashboardUI";
import { getUser, getConversationsForUser, getAllUsers } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function DoctorPage() {
  const doctorId = 'doctor1'; // Hardcode doctor user
  const userData = await getUser(doctorId);
  
  if (!userData) {
    redirect('/');
  }

  const [userConversations, allUsersData] = await Promise.all([
    getConversationsForUser(doctorId),
    getAllUsers(),
  ]);

  return <DashboardUI user={userData} conversations={userConversations} allUsers={allUsersData} />;
}
