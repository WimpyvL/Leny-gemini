'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Mic, Paperclip, Pause } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";

// Expanded data pools for dynamic content
const allPopularQuestions = [
  "What should I do about my child's fever?",
  "Is this chest pain serious?",
  "What are the safe foods during pregnancy?",
  "What are the symptoms of the flu?",
  "How can I lower my cholesterol?",
  "Best exercises for weight loss?",
  "How to treat a sprained ankle?",
  "Signs of a heart attack to watch for.",
];

const allHelpTopics = [
  { initials: 'RA', text: 'Draft nutrition plan with Raya', color: 'bg-green-500' },
  { initials: 'AL', text: 'Create workout routine with Alex', color: 'bg-blue-500' },
  { initials: 'MY', text: 'Mental health check with Dr. Myles', color: 'bg-purple-500' },
  { initials: 'SK', text: 'Get skincare advice from Dr. Chloe', color: 'bg-pink-500' },
  { initials: 'PT', text: 'Discuss physical therapy with Jordan', color: 'bg-yellow-500' },
];

// Utility function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  // State for dynamic content
  const [popularQuestions, setPopularQuestions] = useState(allPopularQuestions.slice(0, 3));
  const [helpTopics, setHelpTopics] = useState(allHelpTopics.slice(0, 3));

  // Shuffle content on client-side mount to avoid hydration errors
  useEffect(() => {
    handleShuffle();
  }, []);

  const handleShuffle = () => {
    setPopularQuestions(shuffleArray(allPopularQuestions).slice(0, 3));
    setHelpTopics(shuffleArray(allHelpTopics).slice(0, 3));
  };
  
  const handleQuestionClick = (question: string) => {
    setInputValue(question);
    if(!isExpanded) setIsExpanded(true);
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground overflow-hidden">
      <div className="absolute inset-0 bg-gray-300 dark:bg-gray-800 z-0 flex items-center justify-center">
        <h2 className="text-xl font-medium text-muted-foreground">Loading video...</h2>
      </div>
      <Button variant="ghost" size="icon" className="absolute bottom-4 right-4 z-20 bg-black/30 text-white/70 hover:bg-black/50 hover:text-white rounded-full">
        <Pause className="h-4 w-4" />
      </Button>
      
      <header className="relative z-10 p-4 sm:p-6">
        <nav className="flex items-center justify-between">
          <Logo />
          <Button asChild size="lg" className="rounded-full px-6 text-sm">
            <Link href="/chat">Sign up</Link>
          </Button>
        </nav>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-start justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-xl space-y-4">
          <div className="space-y-1 text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground/90">
              Because every question matters to someone
            </h1>
            <p className="text-sm text-muted-foreground">
              Include those you trust in the conversation
            </p>
          </div>
          
          <Card className="w-full shadow-2xl rounded-2xl transition-all duration-300 ease-in-out">
            <CardContent className="p-4 space-y-3">
              <div className="relative" onFocus={() => setIsExpanded(true)}>
                <Paperclip className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input 
                  placeholder="Ask me anything..."
                  className="pl-10 pr-20 h-11 rounded-full text-sm"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center">
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <Mic className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Link href="/chat">
                    <Button size="icon" className="rounded-full h-8 w-8">
                      <ArrowRight className="h-4 w-4"/>
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
                    
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground text-center">Or get help with</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {helpTopics.map((topic) => (
                                <Button key={topic.text} asChild variant="outline" className="w-full justify-start h-auto py-2 px-3 rounded-lg border-gray-200 hover:border-primary/50 hover:bg-accent">
                                    <Link href="/chat">
                                      <Avatar className="h-5 w-5 mr-2 flex-shrink-0">
                                          <AvatarFallback className={`${topic.color} text-white text-xs font-bold`}>{topic.initials}</AvatarFallback>
                                      </Avatar>
                                      <span className="text-xs truncate">{topic.text}</span>
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 pt-3">
                        <p className="text-xs font-semibold text-muted-foreground">POPULAR QUESTIONS</p>
                        <div className="space-y-1.5">
                            {popularQuestions.map((q, i) => (
                                <div key={i} onClick={() => handleQuestionClick(q)} className="flex justify-between items-center text-xs hover:text-primary cursor-pointer group">
                                    <span className="group-hover:underline">{q}</span>
                                    <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"/>
                                </div>
                            ))}
                        </div>
                        <div className="text-right">
                            <Button variant="link" size="sm" className="text-xs text-muted-foreground" onClick={handleShuffle}>more</Button>
                        </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-center bg-muted p-1 rounded-full text-sm">
                  <Button variant="ghost" size="sm" className="flex-1 rounded-full bg-background shadow text-xs h-8">Patient</Button>
                  <Button asChild variant="ghost" size="sm" className="flex-1 rounded-full text-muted-foreground text-xs h-8">
                      <Link href="/doctor">Provider</Link>
                  </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
