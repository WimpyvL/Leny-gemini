'use client';

import { useState, useEffect } from 'react';
import { ChatUI } from "./components/ChatUI";
import { getUser, getConversationsForUser, getDoctors } from "@/lib/data";
import type { User, Conversation } from "@/lib/types";
import { Loader2 } from 'lucide-react';

export default function PatientPage() {
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const patientId = 'patient1'; // Hardcode patient user
      const userData = await getUser(patientId);
      
      if (userData) {
        setUser(userData);
        const [userConversations, allDoctors] = await Promise.all([
          getConversationsForUser(patientId),
          getDoctors(),
        ]);
        setConversations(userConversations);
        setDoctors(allDoctors);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return <ChatUI user={user} conversations={conversations} doctors={doctors} />;
}
