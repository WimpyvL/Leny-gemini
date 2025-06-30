'use client';

import Link from "next/link";
// import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Bot, Mic } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { runLandingChat } from "./actions";
// import { useAuth } from "@/hooks/use-auth";

const allPopularQuestions = [
  "How can AI improve my team's productivity?",
  "Explain how large language models work in simple terms.",
  "What are the ethical implications of widespread AI?",
  "How can I use AI to help me learn a new skill faster?",
  "What are some free AI tools I can use today?",
  "Give me a 5-step plan to integrate AI into my small business.",
  "How does generative AI create images?",
  "What is prompt engineering?",
];

const allHelpTopics = [
  { initials: '🚀', text: 'Get startup advice supercharged by AI', color: 'bg-green-500' },
  { initials: '📈', text: 'Generate a marketing plan with a virtual CMO', color: 'bg-blue-500' },
  { initials: '💡', text: 'Brainstorm new ideas with a creative AI partner', color: 'bg-purple-500' },
  { initials: '💰', text: 'Analyze financial data with an AI assistant', color: 'bg-pink-500' },
  { initials: '👥', text: 'Learn to build better prompts for any AI', color: 'bg-yellow-500' },
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
  
  const [popularQuestions, setPopularQuestions] = useState<string[] | null>(null);
  const [helpTopics, setHelpTopics] = useState<(typeof allHelpTopics) | null>(null);
  
  const chatCardRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // const { user, isLoading: isAuthLoading } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   // Redirect logged-in users to the dashboard
  //   if (!isAuthLoading && user) {
  //     router.push('/dashboard');
  //   }
  // }, [user, isAuthLoading, router]);

  useEffect(() => {
    // This now runs only on the client, preventing hydration errors
    setPopularQuestions(shuffleArray(allPopularQuestions).slice(0, 3));
    setHelpTopics(shuffleArray(allHelpTopics).slice(0, 3));
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

  const handleHelpTopicClick = (topicText: string) => {
    handleSendMessage(topicText);
  };

  // // Don't render the page for logged-in users, let the redirect handle it.
  // if (isAuthLoading || user) {
  //   return (
  //       <div className="flex h-screen w-full items-center justify-center bg-background">
  //           <div className="text-xl">Loading...</div>
  //       </div>
  //   );
  // }

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground overflow-hidden">
       <div className="absolute inset-0 h-full w-full z-0 pointer-events-none bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900" />
      
      <header className="relative z-10 p-4 sm:p-6">
        <nav className="flex items-center justify-between">
          <Logo />
           <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="outline" className="text-white border-white/20 bg-white/10 hover:bg-white/20 hover:text-white backdrop-blur-sm">Login</Button>
              </Link>
              <Link href="/dashboard">
                <Button className="backdrop-blur-sm">Dashboard</Button>
              </Link>
            </div>
        </nav>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-start justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-lg space-y-4">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Bridge the gap between people and AI.
            </h1>
            <p className="text-lg text-white/70">
              S.A.N.I. makes artificial intelligence accessible, understandable, and genuinely useful.
            </p>
          </div>
          
          <Card ref={chatCardRef} className={cn("w-full shadow-2xl rounded-2xl transition-all duration-300 ease-in-out bg-background/80 backdrop-blur-lg border-white/20", isExpanded ? "max-w-lg" : "max-w-md")}>
            <CardContent className="p-4 space-y-3">
              <div className="relative" onFocus={() => setIsExpanded(true)}>
                <Bot className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5"/>
                <Input 
                  placeholder="Ask S.A.N.I. anything..."
                  className="pl-11 pr-20 h-12 rounded-full text-base"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendMessage(inputValue); } }}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                  <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                    <Mic className="h-5 w-5 text-muted-foreground"/>
                  </Button>
                  <Button size="icon" className="rounded-full h-9 w-9" onClick={() => handleSendMessage(inputValue)} disabled={isLoading || !inputValue.trim()}>
                    <ArrowRight className="h-5 w-5"/>
                  </Button>
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
                        <Separator className="my-3" />
                        
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground text-center">Or get help with</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {helpTopics && helpTopics.map((topic) => (
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
                                {popularQuestions && popularQuestions.map((q, i) => (
                                    <div key={i} onClick={() => handleQuestionClick(q)} className="flex justify-between items-center text-sm hover:text-primary cursor-pointer group">
                                        <span className="group-hover:underline">{q}</span>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"/>
                                    </div>
                                ))}
                            </div>
                            <div className="text-right">
                                <Button variant="link" size="sm" className="text-xs text-muted-foreground" onClick={handleShuffle}>more</Button>
                            </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
