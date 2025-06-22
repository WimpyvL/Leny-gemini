'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512S0 403.3 0 261.8 106.5 11.8 244 11.8c67.7 0 120.4 25.4 159.2 60.5l-64.8 54.3c-22.3-20.9-53.7-36.5-94.4-36.5-73.8 0-134.2 61.5-134.2 137S170.2 400 244 400c77.9 0 119.5-54.3 124.9-82.9H244v-75.5h236.4c2.5 13.1 4.6 27.6 4.6 43.1z"></path>
  </svg>
);

export default function SignupPage() {
  const { signInWithGoogle } = useAuth();
  const [role, setRole] = useState<'patient' | 'provider'>('patient');

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>First, choose your role. Then, sign up with Google.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <Label>I am a...</Label>
                <RadioGroup defaultValue="patient" className="grid grid-cols-2 gap-4" onValueChange={(value: 'patient' | 'provider') => setRole(value)}>
                  <div>
                    <RadioGroupItem value="patient" id="patient" className="peer sr-only" />
                    <Label
                      htmlFor="patient"
                      className="flex h-full flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      Patient / Family
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="provider" id="provider" className="peer sr-only" />
                    <Label
                      htmlFor="provider"
                      className="flex h-full flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      Provider
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <Button variant="outline" className="w-full h-12 text-base" type="button" onClick={() => signInWithGoogle(role)}>
                <GoogleIcon />
                Sign up with Google
              </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
