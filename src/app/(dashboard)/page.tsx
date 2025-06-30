'use client';

import { mockUsers, mockConversations } from "@/lib/mock-data";
import { DashboardUI } from "./components/DashboardUI";
import type { User } from "@/lib/types";

// This component now fetches its own data and handles dev_role
export default function DashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // This logic now runs synchronously, avoiding useEffect-based hydration issues.
  const devRole = searchParams?.dev_role;
  let appUser: User | undefined = mockUsers.find(u => u.id === 'user1');

  if (!appUser) {
    // This is an error state, as the mock user should always exist.
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="text-xl text-destructive">Error: Default user 'user1' not found in mock data.</div>
        </div>
    );
  }

  if (devRole === 'expert' || devRole === 'user') {
    const newUser = { ...appUser, role: devRole as 'user' | 'expert' };
    if (devRole === 'expert' && !newUser.expertInfo) {
      newUser.expertInfo = {
          specialty: 'General Consultant',
          title: newUser.name,
          bio: `Viewing in expert developer mode.`,
          officeHours: 'Mon-Fri, 9:00 AM - 5:00 PM',
          practiceAddress: '123 Innovation Drive',
          practiceName: 'Solutions Inc.',
      };
    }
    appUser = newUser;
  }
  
  const userConversations = mockConversations.filter(c => 
    c.participantIds.includes(appUser!.id)
  );

  return <DashboardUI user={appUser} conversations={userConversations} allUsers={mockUsers} />;
}
