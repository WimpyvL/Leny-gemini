import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Paperclip, Send } from 'lucide-react';

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="shrink-0" onClick={() => alert('File sharing not implemented yet.')}>
        <Paperclip />
        <span className="sr-only">Attach file</span>
      </Button>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        rows={1}
        className="resize-none max-h-24"
      />
      <Button size="icon" onClick={handleSend} className="shrink-0" disabled={!text.trim()}>
        <Send />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
}
