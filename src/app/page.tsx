'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Mic, Paperclip, Pause } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";

const popularQuestions = [
  "What should I do about my child's fever?",
  "Is this chest pain serious?",
  "Safe foods during pregnancy?",
];

const helpTopics = [
  { initials: 'RA', text: 'Draft nutrition plan with Raya', color: 'bg-green-500' },
  { initials: 'AL', text: 'Create workout routine with Alex', color: 'bg-blue-500' },
  { initials: 'MY', text: 'Mental health check with...', color: 'bg-purple-500' },
]

const specialties = [
    { name: 'Pediatrics', color: 'text-green-500' },
    { name: 'Cardiology', color: 'text-red-500' },
    { name: 'Nutrition', color: 'text-orange-500' },
]

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground overflow-hidden">
      <div className="absolute inset-0 bg-gray-300 dark:bg-gray-800 z-0 flex items-center justify-center">
        <h2 className="text-2xl font-medium text-muted-foreground">Loading video...</h2>
      </div>
      <Button variant="ghost" size="icon" className="absolute bottom-4 right-4 z-20 bg-black/30 text-white/70 hover:bg-black/50 hover:text-white rounded-full">
        <Pause className="h-5 w-5" />
      </Button>
      
      <header className="relative z-10 p-4 sm:p-6">
        <nav className="flex items-center justify-between">
          <Logo />
          <Button asChild size="lg" className="rounded-full px-6 text-base">
            <Link href="#">Sign up</Link>
          </Button>
        </nav>
      </header>

      <main className="relative z-10 flex-1 flex items-center p-4 sm:p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
          <div className="flex justify-center md:justify-start">
            <Card className="w-full max-w-md shadow-2xl rounded-2xl transition-all duration-300 ease-in-out">
              <CardContent className="p-4 space-y-4">
                <div className="relative" onFocus={() => setIsExpanded(true)}>
                  <Paperclip className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Input 
                    placeholder="Ask me anything..."
                    className="pl-10 pr-20 h-12 rounded-full text-base"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                      <Mic className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <Link href="/chat">
                      <Button size="icon" className="rounded-full h-9 w-9">
                        <ArrowRight />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <Separator className="my-2" />
                      
                      <div className="space-y-3">
                          <p className="text-xs font-semibold text-muted-foreground text-center">Or get help with</p>
                          <div className="flex items-center justify-around gap-2">
                              {helpTopics.map((topic) => (
                                  <Button key={topic.text} variant="outline" className="flex-1 justify-start h-auto py-2 px-3 rounded-lg border-gray-200 hover:border-primary/50 hover:bg-accent">
                                      <Avatar className="h-6 w-6 mr-2">
                                          <AvatarFallback className={`${topic.color} text-white text-xs font-bold`}>{topic.initials}</AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm truncate">{topic.text}</span>
                                  </Button>
                              ))}
                          </div>
                      </div>

                      <div className="space-y-3 pt-2">
                          <p className="text-xs font-semibold text-muted-foreground">POPULAR QUESTIONS</p>
                          <div className="space-y-2">
                              {popularQuestions.map((q, i) => (
                                  <div key={i} className="flex justify-between items-center text-sm hover:text-primary cursor-pointer">
                                      <span>{q}</span>
                                      <div className="flex items-center gap-2">
                                          {specialties.map(s => (
                                              <div key={s.name} className="flex items-center gap-1">
                                                  <span className={`h-2 w-2 rounded-full ${s.color.replace('text-', 'bg-')}`}></span>
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              ))}
                          </div>
                          <div className="text-right">
                              <Button variant="link" size="sm" className="text-muted-foreground">more</Button>
                          </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-center bg-muted p-1 rounded-full">
                    <Button variant="ghost" size="sm" className="flex-1 rounded-full bg-background shadow">Patient</Button>
                    <Button asChild variant="ghost" size="sm" className="flex-1 rounded-full text-muted-foreground">
                        <Link href="/doctor">Provider</Link>
                    </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4 text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-tight text-foreground/90">
              Because every question matters to someone
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Include those you trust in the conversation
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
