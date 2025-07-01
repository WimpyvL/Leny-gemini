'use server';

import { mockConversations, mockUsers } from '@/lib/mock-data';
import type { User, Conversation } from '@/lib/types';
import { db } from './firebase';
import { doc, getDoc, setDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';

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

export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, data);
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Could not update user profile.');
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
      // If user not found in DB, just return the mock user. Don't try to write.
      console.warn(`No user found with ID: ${userId} in Firestore. Falling back to mock data.`);
      return mockUsers.find(u => u.id === userId);
    }
  } catch (error) {
    console.error(`Error fetching user from Firestore (${userId}):`, error);
    console.warn(`Falling back to mock data for user ID: ${userId}`);
    return mockUsers.find(u => u.id === userId);
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
        const assistantUser = mockUsers.find(u => u.id === 'assistant');
        if (assistantUser) {
            users.push(assistantUser);
        }
    }
    
    return users.length > 0 ? users : mockUsers;
  } catch (error) {
    console.error('Error fetching all users from Firestore:', error);
    console.warn('Falling back to mock user data.');
    return mockUsers; // Fallback to mock data on error
  }
}

export async function getDoctors(): Promise<User[]> {
  console.log('Fetching all doctors from Firestore');
  try {
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, where("role", "==", "doctor"));
    const doctorsSnapshot = await getDocs(q);

    if (doctorsSnapshot.empty) {
      console.warn("No doctors found in Firestore. Falling back to mock data.");
      return mockUsers.filter(u => u.role === 'doctor');
    }

    const doctors = doctorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    return doctors;
  } catch (error) {
    console.error('Error fetching doctors from Firestore:', error);
    console.warn("Falling back to mock doctor data.");
    // Fallback to mock data on error
    return mockUsers.filter(u => u.role === 'doctor');
  }
}


export async function getConversationsForUser(userId: string): Promise<Conversation[]> {
  console.log(`Fetching conversations for user: ${userId}`);
  
  // For now, we use mock conversations and populate user details from Firestore
  const allUsers = await getAllUsers();
  
  const findUser = (id: string) => allUsers.find(u => u.id === id);

  const user = await getUser(userId); // This will also create the user if they're a mock user and don't exist
  if (!user) return [];

  let userMockConversations = mockConversations.filter(c => c.participantIds.includes(userId));

  // The doctor shouldn't see chats with the assistant Leny in their patient list.
  if (user.role === 'doctor') {
    userMockConversations = userMockConversations.filter(c => !c.participantIds.includes('assistant'));
  }

  // Populate participant details from the user list we fetched
  const populatedConversations = userMockConversations.map(conv => {
    const participants = conv.participantIds
      .map(id => findUser(id))
      .filter((u): u is User => !!u);
    return { ...conv, participants };
  });

  return populatedConversations.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
}
