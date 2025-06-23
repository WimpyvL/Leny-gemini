import { ChatUI } from "./components/ChatUI";
import { getConversationsForUser, getUser } from "@/lib/data";

export default async function PatientPage() {
  const patient = await getUser('patient1');
  if (!patient) return <div>Patient not found.</div>;
  
  const conversations = await getConversationsForUser(patient.id);

  return <ChatUI user={patient} conversations={conversations} />;
}
