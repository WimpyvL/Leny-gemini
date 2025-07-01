
'use client';

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Mic, Paperclip, User, Stethoscope } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { runLandingChat } from "./actions";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

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

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

type Message = {
  sender: 'user' | 'ai';
  text: string;
};

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [popularQuestions, setPopularQuestions] = useState<string[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  
  const chatCardRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    handleShuffle();
    setHasMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatCardRef.current && !chatCardRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleShuffle = () => {
    setPopularQuestions(shuffleArray(allPopularQuestions).slice(0, 3));
  };
  
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    if (!isExpanded) setIsExpanded(true);
    
    const isFirstMessage = messages.length === 0;
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setIsLoading(true);
    setInputValue(''); 
    
    try {
      const aiResponse = await runLandingChat(text, isFirstMessage);
      if (aiResponse) {
        setMessages((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'ai', text: "I'm not sure how to respond to that. Can you try rephrasing?" }]);
      }
    } catch (error) {
      console.error("Landing page chat error:", error);
      setMessages((prev) => [...prev, { sender: 'ai', text: "Apologies, I'm having a little trouble right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground overflow-hidden">
       <div className="absolute inset-0 h-full w-full bg-gray-300 dark:bg-gray-800 z-0 pointer-events-none">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/EiYMmakg6-s?autoplay=1&mute=1&controls=0&loop=1&playlist=EiYMmakg6-s&end=50&playsinline=1&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="background video"
          ></iframe>
          <div className="absolute inset-0 bg-black/40" />
       </div>
      
      <header className="relative z-10 p-4 sm:p-6">
        <nav className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "text-white/90 hover:bg-white/10 hover:text-white")}>
              Login
            </Link>
            <Link href="/signup" className={cn(buttonVariants({ variant: "default" }), "bg-white/90 text-primary hover:bg-white")}>
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-start justify-start p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-lg space-y-4">
          <div className="space-y-1 text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white/90">
              Because every question matters to someone
            </h1>
            <p className="text-sm text-white/70">
              Include those you trust in the conversation
            </p>
          </div>
          
          <Card ref={chatCardRef} className={cn("w-full shadow-2xl rounded-2xl transition-all duration-300 ease-in-out bg-background/80 backdrop-blur-lg border-white/20", isExpanded ? "max-w-lg" : "max-w-md")}>
            <CardContent className="p-4 space-y-3">
              <div className="relative" onFocus={() => setIsExpanded(true)}>
                <Paperclip className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input 
                  placeholder="Ask me anything..."
                  className="pl-10 pr-20 h-11 rounded-full text-sm"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendMessage(inputValue); } }}
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center">
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <Mic className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button size="icon" className="rounded-full h-8 w-8" onClick={() => handleSendMessage(inputValue)} disabled={isLoading || !inputValue.trim()}>
                    <ArrowRight className="h-4 w-4"/>
                  </Button>
                </div>
              </div>
              
              <AnimatePresence>
                {isExpanded ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    {messages.length > 0 ? (
                      <ScrollArea className="h-48 w-full pr-4 my-2">
                        <div className="flex flex-col gap-3">
                          {messages.map((msg, index) => (
                            <div key={index} className={cn("flex", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                              <div className={cn(
                                "max-w-xs rounded-2xl p-3 text-sm shadow-sm",
                                msg.sender === 'user'
                                  ? "bg-primary text-primary-foreground rounded-br-none"
                                  : "bg-card text-card-foreground rounded-bl-none border"
                              )}>
                                {msg.text}
                              </div>
                            </div>
                          ))}
                          {isLoading && (
                              <div className="flex justify-start">
                                  <div className="max-w-xs rounded-2xl p-3 text-sm bg-card text-card-foreground rounded-bl-none border">
                                      <div className="flex items-center gap-2">
                                          <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground"></div>
                                          <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.2s]"></div>
                                          <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.4s]"></div>
                                      </div>
                                  </div>
                              </div>
                          )}
                        </div>
                        <div ref={scrollRef} />
                      </ScrollArea>
                    ) : (
                      <>
                        <Separator className="my-2" />
                        
                        {!hasMounted ? (
                          <div className="space-y-4 py-2">
                            <div className="space-y-2">
                              <Skeleton className="h-3 w-28 mx-auto" />
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                              </div>
                            </div>
                            <div className="space-y-2 pt-3">
                              <Skeleton className="h-3 w-36" />
                              <div className="space-y-2">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-5/6" />
                                <Skeleton className="h-3 w-full" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                             <div className="space-y-3 p-2">
                                <p className="text-sm font-semibold text-muted-foreground text-center">First, select your role to get started:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <Link href="/patient" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'flex-col h-auto py-4')}>
                                        <User className="h-6 w-6 mb-1" />
                                        <span>I'm a Patient</span>
                                    </Link>
                                    <Link href="/doctor" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'flex-col h-auto py-4')}>
                                        <Stethoscope className="h-6 w-6 mb-1" />
                                        <span>I'm a Doctor</span>
                                    </Link>
                                </div>
                              </div>

                              <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                <div className="relative flex justify-center text-xs uppercase">
                                  <span className="bg-background/80 px-2 text-muted-foreground">Or ask a question</span>
                                </div>
                              </div>

                            <div className="space-y-2 pt-1">
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
                                <Button variant="link" size="sm" className={cn("text-xs text-muted-foreground transition-all", isExpanded && "animate-pulse font-semibold text-primary")} onClick={handleShuffle}>more</Button>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>

            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
