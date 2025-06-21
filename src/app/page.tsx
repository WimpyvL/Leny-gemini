import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, MessageSquare, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="flex items-center gap-3 text-primary">
          <MessageSquare className="h-10 w-10" />
          <h1 className="text-5xl font-bold tracking-tighter">Family Health Chat</h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          A new way for families to manage their health together. Coordinate with family members, consult with health assistants, and connect with doctors, all in one place.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg" className="w-full text-lg py-7 px-8 transition-transform hover:scale-105">
            <Link href="/chat">
              Get Started
              <ArrowRight />
            </Link>
          </Button>
        </div>

        <Card className="w-full max-w-4xl mt-12 shadow-xl bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Features at a Glance</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6 text-left">
            <div className="flex flex-col gap-2">
              <Users className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">Group Chats</h3>
              <p className="text-muted-foreground">Keep everyone in the loop with dedicated family health chats.</p>
            </div>
            <div className="flex flex-col gap-2">
              <Bot className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">AI Health Assistant</h3>
              <p className="text-muted-foreground">Get instant summaries and answers to your health questions.</p>
            </div>
            <div className="flex flex-col gap-2">
              <ArrowRight className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">Doctor Access</h3>
              <p className="text-muted-foreground">Easily share information and chat with your healthcare providers.</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="relative w-full max-w-5xl mt-8">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            <Image 
                src="https://placehold.co/1200x600.png"
                alt="App Screenshot"
                width={1200}
                height={600}
                className="rounded-lg shadow-2xl border-4 border-white/80 z-10 relative"
                data-ai-hint="app screenshot"
            />
        </div>
      </div>
    </main>
  );
}

