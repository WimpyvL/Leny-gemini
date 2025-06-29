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
    avatar: avatar || name?.substring(0,2).toUpperCase() || '??',
    avatarColor: `bg-blue-500`, // Default color
    role: 'user',
  };

  await createUserProfile(uid, newUser);

  return { id: uid, ...newUser };
}

export async function createNewUser(uid: string, data: Omit<User, 'id' | 'avatar' | 'avatarColor'>) {
    const newUser: Omit<User, 'id'> = {
        ...data,
        avatar: data.name.substring(0,2).toUpperCase(),
        avatarColor: 'bg-green-500',
    };
    await createUserProfile(uid, newUser);
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

    // Revalidate paths to ensure data is fresh
    revalidatePath('/user');
    revalidatePath('/expert');

    return { success: true };
  } catch (error) {
    console.error("Failed to upgrade user to expert:", error);
    return { success: false, error: "An unexpected error occurred during the upgrade process." };
  }
}
