'use server';

import { createUserProfile, getUser, updateUser } from '@/lib/data';
import type { User } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function findOrCreateUser(userData: {
  uid: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
}): Promise<User> {
  const { uid, email, name, avatar } = userData;

  if (!uid) {
    throw new Error('User ID is required.');
  }

  let user = await getUser(uid);

  if (user) {
    return user;
  }

  // If user does not exist, create a new profile.
  // We'll default new Google signups to 'user' role.
  const newUser: Omit<User, 'id'> = {
    name: name || 'New User',
    email: email || '',
    avatar: avatar || `https://placehold.co/100x100.png`,
    role: 'user',
  };

  await createUserProfile(uid, newUser);
  
  revalidatePath('/');
  return { id: uid, ...newUser };
}

export async function createNewUser(uid: string, data: Omit<User, 'id' | 'avatar'>) {
    const newUser: Omit<User, 'id'> = {
        ...data,
        avatar: `https://placehold.co/100x100.png`,
    };
    await createUserProfile(uid, newUser);
    revalidatePath('/');
}

export async function getUserData(uid: string): Promise<User | undefined> {
    return await getUser(uid);
}

export async function upgradeToExpert(uid: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getUser(uid);
    if (!user) {
        return { success: false, error: "User not found." };
    }

    await updateUser(uid, {
      role: 'expert',
      expertInfo: {
        specialty: 'General Consultant',
        title: user.name,
        bio: `Joined as a new expert.`,
        officeHours: 'Mon-Fri, 9:00 AM - 5:00 PM',
        practiceAddress: '123 Innovation Drive',
        practiceName: 'Solutions Inc.',
      }
    });

    // Revalidate the root path to reload the dashboard with the new role
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error("Failed to upgrade user to expert:", error);
    return { success: false, error: "An unexpected error occurred during the upgrade process." };
  }
}
