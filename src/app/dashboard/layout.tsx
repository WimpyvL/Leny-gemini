'use client';
import React from 'react';
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

// --- AUTH LOGIC COMMENTED OUT FOR DEVELOPMENT ---
// import { useAuth } from '@/hooks/use-auth';
// import { redirect } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { getUserData } from '../auth/actions';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
  
  // Default to the 'user' role mock user for development.
  // You can switch to the expert view with ?dev_role=expert
  const appUser = mockUsers.find(u => u.id === 'user1');

  if (!appUser) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <p>Could not load default mock user. Please check mock-data.ts</p>
        </div>
    );
  }

  // Pass the loaded appUser to children via a cloned element
  return React.cloneElement(children as React.ReactElement, { appUser });
}
