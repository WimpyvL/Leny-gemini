'use server';

import { mockConversations, mockUsers } from '@/lib/mock-data';
import type { User, Conversation } from '@/lib/types';
import { db, isFirebaseEnabled } from './firebase';
import { doc, getDoc, setDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';

// This file acts as a data service layer.
// In a real application, these functions would fetch data from a database like Firestore.
// If Firebase is not configured, it gracefully falls back to using mock data.

export async function createUserProfile(uid: string, data: Omit<User, 'id'>): Promise<void> {
  if (!isFirebaseEnabled || !db) {
    console.warn("Firebase not enabled. Skipping createUserProfile.");
    return;
  }
  try {
    await setDoc(doc(db, 'users', uid), data);
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Could not create user profile.');
  }
}

export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
  if (!isFirebaseEnabled || !db) {
    console.warn("Firebase not enabled. Skipping updateUser.");
    return;
  }
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, data);
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Could not update user profile.');
  }
}

export async function getUser(userId: string): Promise<User | undefined> {
  if (!isFirebaseEnabled || !db) {
    console.warn(`Firebase disabled. Falling back to mock data for getUser(${userId}).`);
    return mockUsers.find(u => u.id === userId);
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return { id: userDocSnap.id, ...userDocSnap.data() } as User;
    } else {
      console.warn(`User ${userId} not in Firestore. Falling back to mock data.`);
      return mockUsers.find(u => u.id === userId);
    }
  } catch (error) {
    console.error(`Firestore connection error for getUser(${userId}). Falling back to mock data.`, error);
    return mockUsers.find(u => u.id === userId);
  }
}

export async function getAllUsers(): Promise<User[]> {
  if (!isFirebaseEnabled || !db) {
    console.warn("Firebase disabled. Falling back to mock data for getAllUsers.");
    return mockUsers;
  }

  try {
    const usersCollectionRef = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollectionRef);
    
    if (userSnapshot.empty) {
      console.warn("No users found in Firestore. Falling back to mock user data.");
      return mockUsers;
    }

    const users = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    
    // Add assistant user if not present in the DB, as it's a core part of the app
    if (!users.find(u => u.id === 'assistant')) {
        const assistantUser = mockUsers.find(u => u.id === 'assistant');
        if (assistantUser) {
            users.push(assistantUser);
        }
    }
    
    return users;

  } catch (error) {
    console.error('Firestore connection error for getAllUsers. Falling back to mock data.', error);
    return mockUsers;
  }
}

<<<<<<< HEAD
export async function getDoctors(): Promise<User[]> {
  if (!isFirebaseEnabled || !db) {
    console.warn("Firebase disabled. Falling back to mock data for getDoctors.");
    return mockUsers.filter(u => u.role === 'doctor');
  }

=======
export async function getExperts(): Promise<User[]> {
  console.log('Fetching all experts from Firestore');
>>>>>>> 4de5c1ea31c6afd7cb8b6b3e60a7b345ab82f1b4
  try {
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, where("role", "==", "expert"));
    const expertsSnapshot = await getDocs(q);

<<<<<<< HEAD
    if (!doctorsSnapshot.empty) {
      return doctorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
=======
    if (expertsSnapshot.empty) {
      console.warn("No experts found in Firestore. Falling back to mock data.");
      return mockUsers.filter(u => u.role === 'expert');
>>>>>>> 4de5c1ea31c6afd7cb8b6b3e60a7b345ab82f1b4
    }
    
    console.warn("No doctors found in Firestore. Falling back to mock doctor data.");
    return mockUsers.filter(u => u.role === 'doctor');

<<<<<<< HEAD
  } catch (error) {
    console.error('Firestore connection error for getDoctors. Falling back to mock data.', error);
    return mockUsers.filter(u => u.role === 'doctor');
=======
    const experts = expertsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    return experts;
  } catch (error) {
    console.error('Error fetching experts:', error);
    // Fallback to mock data on error
    return mockUsers.filter(u => u.role === 'expert');
>>>>>>> 4de5c1ea31c6afd7cb8b6b3e60a7b345ab82f1b4
  }
}


export async function getConversationsForUser(userId: string): Promise<Conversation[]> {
  // This function will use other data functions which already have fallbacks.
  const allUsers = await getAllUsers();
  
  const findUser = (id: string) => allUsers.find(u => u.id === id);
  const user = await getUser(userId);
  if (!user) return [];

  // Use mock conversations as the base, as conversation data isn't in Firestore yet.
  let userMockConversations = mockConversations.filter(c => c.participantIds.includes(userId));

<<<<<<< HEAD
  if (user.role === 'doctor') {
=======
  // The expert shouldn't see chats with the assistant S.A.N.I in their user list.
  if (user.role === 'expert') {
>>>>>>> 4de5c1ea31c6afd7cb8b6b3e60a7b345ab82f1b4
    userMockConversations = userMockConversations.filter(c => !c.participantIds.includes('assistant'));
  }

  const populatedConversations = userMockConversations.map(conv => {
    const participants = conv.participantIds
      .map(id => findUser(id))
      .filter((u): u is User => !!u);
    return { ...conv, participants };
  });

  return populatedConversations.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
}
