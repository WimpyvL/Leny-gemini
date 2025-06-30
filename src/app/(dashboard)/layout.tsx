'use client';
import React from 'react';
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

// import { useAuth } from '@/hooks/use-auth';
// import { redirect } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { getUserData } from '../auth/actions';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- AUTH LOGIC COMMENTED OUT FOR DEVELOPMENT ---
  // const { user: firebaseUser, isLoading: isAuthLoading } = useAuth();
  // const [appUser, setAppUser] = useState<User | null>(null);
  // const [isUserLoading, setIsUserLoading] = useState(true);

  // useEffect(() => {
  //   if (!isAuthLoading) {
  //     if (!firebaseUser) {
  //       redirect('/login');
  //     } else {
  //       getUserData(firebaseUser.uid)
  //         .then(user => {
  //           if (user) {
  //             setAppUser(user);
  //           } else {
  //             // Handle case where user data might not be found, maybe redirect
  //             redirect('/login');
  //           }
  //         })
  //         .finally(() => setIsUserLoading(false));
  //     }
  //   }
  // }, [firebaseUser, isAuthLoading]);

  // if (isAuthLoading || isUserLoading) {
  //   return (
  //     <div className="flex h-screen w-full items-center justify-center bg-background">
  //       <div className="text-xl">Loading your dashboard...</div>
  //     </div>
  //   );
  // }
  
  const appUser = mockUsers.find(u => u.id === 'user1');

  if (!appUser) {
    // This case should ideally be handled by the redirect, but as a fallback
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <p>Could not load default mock user. Please check mock-data.ts</p>
        </div>
    );
  }

  // Pass the loaded appUser to children via a cloned element
  return React.cloneElement(children as React.ReactElement, { appUser });
}
