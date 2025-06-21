import { ChatLayout } from "./components/ChatLayout";
import { mockConversations, mockUsers } from "@/lib/mock-data";

export default function ChatPage() {
  const currentUser = mockUsers.find(u => u.id === 'alex');
  if (!currentUser) return <div>User not found.</div>;
  
  return <ChatLayout user={currentUser} conversations={mockConversations} allUsers={mockUsers} />;
}
