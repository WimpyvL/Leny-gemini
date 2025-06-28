import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Paperclip, Send } from 'lucide-react';

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
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="flex items-end gap-3 bg-white border-2 border-slate-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 rounded-3xl p-2 transition-all">
      <Button variant="ghost" size="icon" className="shrink-0 text-slate-500 hover:text-primary rounded-full h-10 w-10" onClick={() => alert('File sharing not implemented yet.')}>
        <Paperclip />
        <span className="sr-only">Attach file</span>
      </Button>
      <Textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        className="resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 py-2.5 text-base max-h-36 shadow-none"
      />
      <Button size="icon" onClick={handleSend} className="shrink-0 rounded-full h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800" disabled={!text.trim()}>
        <Send />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
}
