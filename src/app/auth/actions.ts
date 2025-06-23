'use server';

import { redirect } from 'next/navigation';
import { createUserProfile, getUser } from '@/lib/data';
import type { User } from '@/lib/types';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return redirect('/login?error=Email and password are required.');
  }

  // Dev mode: bypass Firebase auth.
  // Use an email containing "doctor" to log in as a doctor.
  if (email.toLowerCase().includes('doctor')) {
    redirect('/doctor');
  } else {
    redirect('/patient');
  }
}

export async function signup(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const userType = formData.get('userType') as 'patient' | 'doctor';
  
  if (!name || !email || !password || !userType) {
    return redirect('/signup?error=All fields are required.');
  }

  // Dev mode: bypass Firebase auth.
  if (userType === 'doctor') {
    redirect('/doctor');
  } else {
    redirect('/patient');
  }
}

interface GoogleUser {
  uid: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
}

export async function findOrCreateUser(userData: GoogleUser): Promise<User> {
  const { uid, email, name, avatar } = userData;

  if (!uid) {
    throw new Error('User ID is required.');
  }

  let user = await getUser(uid);

  if (user) {
    return user;
  }

  // If user does not exist, create a new profile.
  // We'll default new Google signups to 'patient' role.
  const newUser: Omit<User, 'id'> = {
    name: name || 'New User',
    email: email || '',
    avatar: avatar || uid.substring(0,2).toUpperCase(),
    avatarColor: `bg-blue-500`, // Default color
    role: 'patient',
  };

  await createUserProfile(uid, newUser);

  return { id: uid, ...newUser };
}
