'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { createUserProfile, getUser } from '@/lib/data';
import type { User } from '@/lib/types';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return redirect('/login?error=Email and password are required.');
  }

  let userCredential;
  try {
    userCredential = await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error('Firebase Login Error:', error);
    let errorMessage = 'Invalid credentials. Please try again.';
    if (error?.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password. Please check your credentials and try again.';
    }
    return redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
  }

  // Get user role from our database
  const profile = await getUser(userCredential.user.uid);
  if (!profile) {
    // This case should be rare, but handles if a user exists in Auth but not Firestore
    return redirect(`/login?error=${encodeURIComponent('User profile not found.')}`);
  }

  if (profile.role === 'doctor') {
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

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create the user profile in Firestore
    await createUserProfile(user.uid, { name, email, role: userType });

  } catch (error: any) {
    console.error('Firebase Signup Error:', error);
    let errorMessage = 'Could not create account. Please try again.';
    
    switch (error.code) {
        case 'auth/email-already-in-use':
            errorMessage = 'This email address is already in use by another account.';
            break;
        case 'auth/weak-password':
            errorMessage = 'The password is too weak. It must be at least 6 characters long.';
            break;
        case 'auth/invalid-email':
            errorMessage = 'The email address is not valid.';
            break;
        default:
            errorMessage = 'An unexpected error occurred. Please try again.';
    }

    return redirect(`/signup?error=${encodeURIComponent(errorMessage)}`);
  }

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
