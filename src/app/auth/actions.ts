'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return redirect('/login?error=Email and password are required.');
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Firebase Login Error:', error);
    return redirect('/login?error=Invalid credentials. Please try again.');
  }

  // For the prototype, we will just redirect based on a mock role.
  // In a real app, you'd get the user role from your database after login.
  if (email.startsWith('dr')) {
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
    // In a real app, you would now create a user document in Firestore 
    // with the user's name, role (userType), and other details.
    // e.g., await createUserProfile(user.uid, { name, email, role: userType });
    console.log('User created:', user.uid, { name, userType });
  } catch (error) {
    console.error('Firebase Signup Error:', error);
    return redirect('/signup?error=Could not create account. It might already exist.');
  }

  if (userType === 'doctor') {
    redirect('/doctor');
  } else {
    redirect('/patient');
  }
}
