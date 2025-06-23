'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { ChatUI } from "./components/ChatUI";
import { getUserData } from '@/app/auth/actions';
import { getConversationsForUser, getDoctors } from "@/lib/data";
import type { User, Conversation } from "@/lib/types";
import { Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase';

export default function PatientPage() {
  const { user: authUser, isLoading: isAuthLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
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
      
      if (userData?.role === 'doctor') {
        router.push('/doctor');
        return;
      }

      if (userData) {
        setUser(userData);
        const [userConversations, allDoctors] = await Promise.all([
          getConversationsForUser(authUser.uid),
          getDoctors(),
        ]);
        setConversations(userConversations);
        setDoctors(allDoctors);
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
  
  return <ChatUI user={user} conversations={conversations} doctors={doctors} />;
}
