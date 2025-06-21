import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, User, Stethoscope } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-background to-secondary">
      <div className="flex flex-col items-center justify-center space-y-8">
        <Logo />
        <Card className="w-full max-w-md shadow-2xl backdrop-blur-sm bg-card/80">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Welcome to Leny Chat</CardTitle>
            <CardDescription className="text-lg">
              Please select your role to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild size="lg" className="w-full transition-transform hover:scale-105">
              <Link href="/patient">
                <User />
                I am a Patient
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full transition-transform hover:scale-105">
              <Link href="/doctor">
                <Stethoscope />
                I am a Doctor
                <ArrowRight />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
