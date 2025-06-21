import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 relative">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Message the family..."
        className="rounded-full h-12 pr-14 text-base"
      />
      <Button 
        size="icon" 
        onClick={handleSend} 
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-9 w-9 shrink-0" 
        disabled={!text.trim()}
      >
        <ArrowUp className="h-5 w-5"/>
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
}
