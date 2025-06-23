import { ChatUI } from "./components/ChatUI";
// We are temporarily using mock data to bypass Firebase during development.
import { mockUsers, mockConversations } from "@/lib/mock-data";
import type { User } from "@/lib/types";
import { getDoctors } from "@/lib/data";

export default async function PatientPage() {
  const patient = mockUsers.find(u => u.id === 'patient1');
  if (!patient) return <div>Patient not found.</div>;

  // Manually populate conversations from mock data
  const findUser = (id: string) => mockUsers.find(u => u.id === id);
  const userMockConversations = mockConversations.filter(c => c.participantIds.includes(patient.id));
  
  const populatedConversations = userMockConversations.map(conv => ({
      ...conv,
      participants: conv.participantIds.map(id => findUser(id)).filter((u): u is User => !!u)
  })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  const doctors = await getDoctors();

  return <ChatUI user={patient} conversations={populatedConversations} doctors={doctors} />;
}
