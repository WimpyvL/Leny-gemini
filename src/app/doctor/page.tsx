'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { DashboardUI } from "./components/DashboardUI";
import { getUserData } from '@/app/auth/actions';
import { getConversationsForUser, getAllUsers } from "@/lib/data";
import type { User, Conversation } from "@/lib/types";
import { Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase';


export default function DoctorPage() {
  const { user: authUser, isLoading: isAuthLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }
    if (!authUser) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      const userData = await getUserData(authUser.uid);

      if (userData?.role === 'patient') {
        router.push('/patient');
        return;
      }
      
      if (userData) {
        setUser(userData);
        const [userConversations, allUsersData] = await Promise.all([
          getConversationsForUser(authUser.uid),
          getAllUsers(),
        ]);
        setConversations(userConversations);
        setAllUsers(allUsersData);
      } else {
        await auth.signOut();
        router.push('/login');
      }
      setIsLoading(false);
    };

    fetchData();
  }, [authUser, isAuthLoading, router]);

  if (isLoading || isAuthLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <DashboardUI user={user} conversations={conversations} allUsers={allUsers} />;
}
