import { DashboardUI } from "./components/DashboardUI";
import { getConversationsForUser, getUser, getAllUsers } from "@/lib/data";

export default async function DoctorPage() {
  const doctor = await getUser('doctor1');
  if (!doctor) return <div>Doctor not found.</div>;
  
  const conversations = await getConversationsForUser(doctor.id);
  const allUsers = await getAllUsers();

  return <DashboardUI user={doctor} conversations={conversations} allUsers={allUsers} />;
}
