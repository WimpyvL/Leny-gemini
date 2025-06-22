'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type Role = 'patient' | 'provider';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: (role: Role) => Promise<void>;
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

  const signInWithGoogle = async (role: Role) => {
    if (!auth || !googleProvider) {
      toast({
        title: 'Authentication Disabled',
        description: 'Firebase is not configured. Please add credentials to your .env file.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      if (role === 'provider') {
        router.push('/doctor');
      } else {
        router.push('/chat');
      }
    } catch (error) {
      console.error("Error signing in with Google", error);
      toast({
        title: 'Sign-in Error',
        description: 'Could not sign in with Google. Please check the console and try again.',
        variant: 'destructive',
      });
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

  const value = { user, loading, signInWithGoogle, logout };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
