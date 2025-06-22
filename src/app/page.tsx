'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Mic, Paperclip } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { runLandingChat } from "./actions";

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
  const [helpTopics, setHelpTopics] = useState<typeof allHelpTopics>([]);
  
  const chatCardRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    handleShuffle();
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
    setHelpTopics(shuffleArray(allHelpTopics).slice(0, 3));
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
      setMessages((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'ai', text: "Apologies, I'm having a little trouble right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  }

  const handleHelpTopicClick = (topicText: string) => {
    handleSendMessage(`I'd like to get help with: ${topicText}`);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground overflow-hidden">
       <div className="absolute inset-0 h-full w-full bg-gray-300 dark:bg-gray-800 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
            poster="https://placehold.co/1920x1080.png"
            data-ai-hint="medical doctor"
          >
            {/* Provide video sources here */}
          </video>
          <div className="absolute inset-0 bg-black/40" />
       </div>
      
      <header className="relative z-10 p-4 sm:p-6">
        <nav className="flex items-center justify-between">
          <Logo />
          <Button asChild size="lg" className="rounded-full px-6 text-sm">
            <Link href="/signup">Sign up</Link>
          </Button>
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
                        
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground text-center">Or get help with</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {helpTopics.map((topic) => (
                                    <Button key={topic.text} variant="outline" className="w-full justify-start h-auto py-2 px-3 rounded-lg border-gray-200 hover:border-primary/50 hover:bg-accent" onClick={() => handleHelpTopicClick(topic.text)}>
                                        <Avatar className="h-5 w-5 mr-2 flex-shrink-0">
                                            <AvatarFallback className={`${topic.color} text-white text-xs font-bold`}>{topic.initials}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs truncate">{topic.text}</span>
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
                                <Button variant="link" size="sm" className={cn("text-xs text-muted-foreground transition-all", isExpanded && "animate-pulse font-semibold text-primary")} onClick={handleShuffle}>more</Button>
                            </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="flex items-center justify-center p-0.5 rounded-md">
                  <Button asChild variant="ghost" size="sm" className="flex-1 h-auto py-1 px-2 text-xs rounded-md">
                      <Link href="/signup">Patient</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="flex-1 text-muted-foreground h-auto py-1 px-2 text-xs rounded-md">
                      <Link href="/login">Provider</Link>
                  </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
