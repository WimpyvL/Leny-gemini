'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-5.63 1.9-4.76 0-8.64-3.88-8.64-8.64s3.88-8.64 8.64-8.64c2.73 0 4.51.93 5.89 2.15l2.42-2.42C19.2 1.63 16.32 0 12.48 0 5.88 0 0 5.88 0 12.48s5.88 12.48 12.48 12.48c7.34 0 12.03-4.83 12.03-12.03 0-.78-.08-1.56-.21-2.31H12.48z"
    />
  </svg>
);

export default function SignupPage() {
  const [error] = useState<string | null>('Authentication has been temporarily disabled for development.');

  return (
    <Card className="mx-auto max-w-sm">
      <form onSubmit={(e) => e.preventDefault()}>
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Auth Disabled</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="John Doe" required disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
              disabled
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required disabled />
          </div>
          <div className="grid gap-2">
            <Label>I am a...</Label>
            <RadioGroup defaultValue="patient" name="userType" className="flex gap-4" disabled>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="patient" id="r-patient" />
                <Label htmlFor="r-patient">Patient</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="doctor" id="r-doctor" />
                <Label htmlFor="r-doctor">Doctor / Provider</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full mt-4" disabled>
            Create an account
          </Button>

           <div className="relative w-full mt-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-2" type="button" disabled>
            <GoogleIcon className="mr-2 h-4 w-4" />
            Sign up with Google
          </Button>
        </CardContent>
        <div className="mb-6 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </form>
    </Card>
  );
}
