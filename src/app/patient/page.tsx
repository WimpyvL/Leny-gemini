import { ChatUI } from "./components/ChatUI";
import { mockConversations, mockUsers } from "@/lib/mock-data";

export default function PatientPage() {
  const patient = mockUsers.find(u => u.id === 'patient1');
  if (!patient) return <div>Patient not found.</div>;
  
  const conversations = mockConversations.filter(c => c.patientId === patient.id);

  return <ChatUI user={patient} conversations={conversations} />;
}
