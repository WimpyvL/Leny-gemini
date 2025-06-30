'use client';

import { useState, useEffect } from 'react';
import { DashboardUI } from "./components/DashboardUI";
import { getUser, getConversationsForUser, getAllUsers } from "@/lib/data";
import type { User, Conversation } from "@/lib/types";
import { Loader2 } from 'lucide-react';


export default function DoctorPage() {
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const doctorId = 'doctor1'; // Hardcode doctor user
      const userData = await getUser(doctorId);
      
      if (userData) {
        setUser(userData);
        const [userConversations, allUsersData] = await Promise.all([
          getConversationsForUser(doctorId),
          getAllUsers(),
        ]);
        setConversations(userConversations);
        setAllUsers(allUsersData);
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

  return <DashboardUI user={user} conversations={conversations} allUsers={allUsers} />;
}
