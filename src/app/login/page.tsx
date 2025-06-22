'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/auth-context';
import { Stethoscope, User } from 'lucide-react';

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Log in</CardTitle>
            <CardDescription>Select your role to log in with Google.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <Button className="w-full h-12 text-base" type="button" onClick={() => signInWithGoogle('patient')}>
                <User className="mr-2 h-5 w-5" />
                Login as Patient / Family
            </Button>
            <Button variant="outline" className="w-full h-12 text-base" type="button" onClick={() => signInWithGoogle('provider')}>
                <Stethoscope className="mr-2 h-5 w-5" />
                Login as Provider
            </Button>
            <div className="mt-4 text-center text-sm !pt-4">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
