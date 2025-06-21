import { DashboardUI } from "./components/DashboardUI";
import { mockConversations, mockUsers } from "@/lib/mock-data";

export default function DoctorPage() {
  const doctor = mockUsers.find(u => u.id === 'doctor1');
  if (!doctor) return <div>Doctor not found.</div>;
  
  const conversations = mockConversations.filter(c => c.doctorId === doctor.id);
  const allPatients = mockUsers.filter(u => u.role === 'patient');

  return <DashboardUI user={doctor} conversations={conversations} allUsers={[...allPatients, doctor]} />;
}
