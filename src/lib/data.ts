'use server';

import { mockConversations, mockUsers as fallbackUsers } from '@/lib/mock-data';
import type { User, Conversation } from '@/lib/types';
import { db } from './firebase';
import { doc, getDoc, setDoc, getDocs, collection, query, where, orderBy } from 'firebase/firestore';

// This file acts as a data service layer.
// In a real application, these functions would fetch data from a database like Firestore.

export async function createUserProfile(uid: string, data: Omit<User, 'id'>): Promise<void> {
  try {
    await setDoc(doc(db, 'users', uid), data);
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Could not create user profile.');
  }
}


export async function getUser(userId: string): Promise<User | undefined> {
  console.log(`Fetching user from Firestore: ${userId}`);
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return { id: userDocSnap.id, ...userDocSnap.data() } as User;
    } else {
      console.warn(`No user found with ID: ${userId}`);
      return undefined;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return undefined;
  }
}

export async function getAllUsers(): Promise<User[]> {
  console.log('Fetching all users from Firestore');
  try {
    const usersCollectionRef = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollectionRef);
    const users = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    
    // Add assistant user if not present
    if (!users.find(u => u.id === 'assistant')) {
        const assistantUser = fallbackUsers.find(u => u.id === 'assistant');
        if (assistantUser) {
            users.push(assistantUser);
        }
    }
    
    return users;
  } catch (error) {
    console.error('Error fetching all users:', error);
    return fallbackUsers; // Fallback to mock data on error
  }
}

export async function getConversationsForUser(userId: string): Promise<Conversation[]> {
  console.log(`Fetching conversations for user: ${userId}`);
  
  // For now, we use mock conversations and populate user details from Firestore
  const allUsers = await getAllUsers();
  
  const findUser = (id: string) => allUsers.find(u => u.id === id);

  const user = findUser(userId);
  if (!user) return [];

  let userMockConversations: Conversation[] = [];
  if (user.role === 'patient') {
    userMockConversations = mockConversations.filter(c => c.patientId === userId);
  } else if (user.role === 'doctor') {
    userMockConversations = mockConversations.filter(c => c.doctorId === userId);
  }

  // Populate participant details from the user list we fetched
  const populatedConversations = userMockConversations.map(conv => {
    const participants = conv.participantIds
      .map(id => findUser(id))
      .filter((u): u is User => !!u);
    return { ...conv, participants };
  });

  return populatedConversations;
}
