'use client';
import Link from 'next/link';
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
import { signup } from '@/app/auth/actions';

export default function SignupPage() {
  return (
    <Card className="mx-auto max-w-sm">
      <form action={signup}>
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="John Doe" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="grid gap-2">
            <Label>I am a...</Label>
            <RadioGroup defaultValue="patient" name="userType" className="flex gap-4">
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
          <Button type="submit" className="w-full mt-4">
            Create an account
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
