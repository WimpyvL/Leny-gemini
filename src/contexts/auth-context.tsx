'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type Role = 'patient' | 'provider';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: (role: Role) => Promise<void>;
  signUpWithEmail: (email: string, password: string, role: Role) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (role: Role) => {
    if (role === 'provider') {
      router.push('/doctor');
    } else {
      router.push('/chat');
    }
  };

  const handleAuthError = (error: any) => {
    console.error("Authentication Error", error);
    let description = 'An unknown error occurred.';
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          description = 'This email is already in use. Please log in or use a different email.';
          break;
        case 'auth/invalid-email':
          description = 'The email address is not valid.';
          break;
        case 'auth/weak-password':
          description = 'The password is too weak. Please use a stronger password.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          description = 'Invalid email or password. Please try again.';
          break;
        default:
          description = error.message;
      }
    }
    toast({
      title: 'Authentication Error',
      description,
      variant: 'destructive',
    });
  };

  const signInWithGoogle = async (role: Role) => {
    if (!auth || !googleProvider) {
      toast({
        title: 'Authentication Disabled',
        description: 'Firebase is not configured.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      handleAuthSuccess(role);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, role: Role) => {
    if (!auth) {
      toast({ title: 'Authentication Disabled', description: 'Firebase is not configured.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      handleAuthSuccess(role);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) {
      toast({ title: 'Authentication Disabled', description: 'Firebase is not configured.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // We don't know the role here, so we default to patient dashboard.
      // A real app would store role in a database (e.g., Firestore).
      handleAuthSuccess('patient');
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };


  const logout = async () => {
    if (!auth) {
      console.error("Firebase not configured. Cannot log out.");
      return;
    }
    await signOut(auth);
    router.push('/login');
  };

  const value = { user, loading, signInWithGoogle, signUpWithEmail, signInWithEmail, logout };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
