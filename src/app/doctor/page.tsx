import { DashboardUI } from "./components/DashboardUI";
// We are temporarily using mock data to bypass Firebase during development.
import { mockUsers, mockConversations } from "@/lib/mock-data";
import type { User } from "@/lib/types";

export default async function DoctorPage() {
  const doctor = mockUsers.find(u => u.id === 'doctor1');
  if (!doctor) return <div>Doctor not found.</div>;

  // Manually populate conversations from mock data
  const findUser = (id: string) => mockUsers.find(u => u.id === id);
  let userMockConversations = mockConversations.filter(c => c.participantIds.includes(doctor.id));

  // The doctor shouldn't see chats with the assistant Leny in their patient list.
  if (doctor.role === 'doctor') {
    userMockConversations = userMockConversations.filter(c => !c.participantIds.includes('assistant'));
  }

  const populatedConversations = userMockConversations.map(conv => ({
    ...conv,
    participants: conv.participantIds.map(id => findUser(id)).filter((u): u is User => !!u)
  })).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());

  const allUsers = mockUsers;

  return <DashboardUI user={doctor} conversations={populatedConversations} allUsers={allUsers} />;
}
