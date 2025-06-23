'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/lib/firebase';
import {
  // createUserWithEmailAndPassword,
  // signInWithEmailAndPassword,
} from 'firebase/auth';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  // TODO: Implement actual Firebase login
  // try {
  //   await signInWithEmailAndPassword(auth, email, password);
  // } catch (error) {
  //   return { error: 'Invalid credentials. Please try again.' };
  // }

  console.log('Logging in with:', { email, password });

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
  
  if (!name || !email || !password) {
    return { error: 'All fields are required.' };
  }

  // TODO: Implement actual Firebase signup and user profile creation in Firestore
  // try {
  //   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  //   const user = userCredential.user;
  //   // Now, create a user document in Firestore with the user's name, role, etc.
  // } catch (error) {
  //   return { error: 'Could not create account. It might already exist.' };
  // }

  console.log('Signing up with:', { name, email, password, userType });

  if (userType === 'doctor') {
    redirect('/doctor');
  } else {
    redirect('/patient');
  }
}
