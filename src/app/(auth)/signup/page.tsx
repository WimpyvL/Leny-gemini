'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { AlertTriangle, Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { createNewUser, findOrCreateUser } from '@/app/auth/actions';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-5.63 1.9-4.76 0-8.64-3.88-8.64-8.64s3.88-8.64 8.64-8.64c2.73 0 4.51.93 5.89 2.15l2.42-2.42C19.2 1.63 16.32 0 12.48 0 5.88 0 0 5.88 0 12.48s5.88 12.48 12.48 12.48c7.34 0 12.03-4.83 12.03-12.03 0-.78-.08-1.56-.21-2.31H12.48z"
    />
  </svg>
);

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'user' | 'expert'>('user');

  const handleEmailSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
  
    if (!name || !email || !password || !userType) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      await createNewUser(uid, {
        name,
        email,
        role: userType,
      });

      router.push('/dashboard');
    } catch (err: any) {
        console.error(err.code, err.message);
        if (err.code === 'auth/email-already-in-use') {
            setError('This email address is already in use.');
        } else if (err.code === 'auth/weak-password') {
            setError('The password is too weak. Please use at least 6 characters.');
        } else {
            setError('An unexpected error occurred. Please try again.');
        }
        setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;
      await findOrCreateUser({
        uid: googleUser.uid,
        email: googleUser.email,
        name: googleUser.displayName,
        avatar: googleUser.photoURL,
        // When signing up with Google, we don't know the role yet. 
        // We'll default to 'user' and they can change it later if needed.
      });

      router.push('/dashboard');

    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
          setError('Failed to sign in with Google. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm border-border/50">
      <form onSubmit={handleEmailSignup}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Join S.A.N.I. and start exploring the world of AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Sign-up Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="John Doe" required disabled={isLoading} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required disabled={isLoading} />
          </div>
          <div className="grid gap-2">
            <Label>I want to join as a...</Label>
            <RadioGroup defaultValue="user" name="userType" className="flex gap-4" disabled={isLoading} onValueChange={(value) => setUserType(value as 'user' | 'expert')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="r-user" />
                <Label htmlFor="r-user">General User</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expert" id="r-expert" />
                <Label htmlFor="r-expert">Expert / Consultant</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create an account
          </Button>

           <div className="relative w-full mt-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or sign up with
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-2" type="button" onClick={handleGoogleSignIn} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
            Sign up with Google
          </Button>
        </CardContent>
        <div className="mb-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="underline text-foreground hover:text-primary">
            Sign in
          </Link>
        </div>
      </form>
    </Card>
  );
}
