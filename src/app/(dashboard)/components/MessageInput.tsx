'use client';
import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp, Plus, Mic } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height to recalculate
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 128; // 8rem
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [text]);

  return (
    <div className="flex items-end gap-2 bg-card rounded-xl p-2 shadow-[0_4px_16px_rgba(0,0,0,0.07)] border">
      <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-primary rounded-lg h-9 w-9" onClick={() => alert('Feature not implemented yet.')}>
        <Plus className="h-5 w-5" />
        <span className="sr-only">Attach file</span>
      </Button>
      <Textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        className="flex-1 resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 py-2 text-base max-h-32 shadow-none self-center"
      />
      <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-primary rounded-lg h-9 w-9" onClick={() => alert('Feature not implemented yet.')}>
        <Mic className="h-5 w-5" />
        <span className="sr-only">Use microphone</span>
      </Button>
      <Button 
        size="icon" 
        onClick={handleSend} 
        className="shrink-0 rounded-lg h-9 w-9 bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground" 
        disabled={!text.trim()}
      >
        <ArrowUp className="h-5 w-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
}
