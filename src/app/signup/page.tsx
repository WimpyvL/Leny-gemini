'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/auth-context';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512S0 403.3 0 261.8 106.5 11.8 244 11.8c67.7 0 120.4 25.4 159.2 60.5l-64.8 54.3c-22.3-20.9-53.7-36.5-94.4-36.5-73.8 0-134.2 61.5-134.2 137S170.2 400 244 400c77.9 0 119.5-54.3 124.9-82.9H244v-75.5h236.4c2.5 13.1 4.6 27.6 4.6 43.1z"></path>
  </svg>
);

export default function SignupPage() {
  const { signInWithGoogle } = useAuth();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>Choose your role and enter your details to sign up.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Button variant="outline" className="w-full" type="button" onClick={signInWithGoogle}>
                <GoogleIcon />
                Sign up with Google
              </Button>
               <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>I am a...</Label>
                <RadioGroup defaultValue="patient" className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="patient" id="patient" className="peer sr-only" />
                    <Label
                      htmlFor="patient"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      Patient
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="provider" id="provider" className="peer sr-only" />
                    <Label
                      htmlFor="provider"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      Provider
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
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
