'use server';

import { mockConversations, mockUsers } from '@/lib/mock-data';
import type { User, Conversation } from '@/lib/types';

// This file acts as a data service layer.
// In a real application, these functions would fetch data from a database like Firestore.
// For now, they return mock data to keep the prototype functional.

export async function getUser(userId: string): Promise<User | undefined> {
  console.log(`Fetching user: ${userId}`);
  // TODO: Replace with actual database call to Firestore
  return mockUsers.find(u => u.id === userId);
}

export async function getAllUsers(): Promise<User[]> {
  console.log('Fetching all users');
  // TODO: Replace with actual database call to Firestore
  return mockUsers;
}

export async function getConversationsForUser(userId: string): Promise<Conversation[]> {
  console.log(`Fetching conversations for user: ${userId}`);
  // TODO: Replace with actual database call to Firestore
  const user = await getUser(userId);
  if (user?.role === 'patient') {
    return mockConversations.filter(c => c.patientId === userId);
  }
  if (user?.role === 'doctor') {
    return mockConversations.filter(c => c.doctorId === userId);
  }
  return [];
}
