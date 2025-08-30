'use client';

import { useState, useRef, useEffect, SetStateAction } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  ScanLine,
  ShieldCheck,
  IndianRupee,
  MessageSquare,
  ArrowUpIcon,
  Paperclip,
  Mic,
  Bot,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Helper Hook for Auto-Resizing Textarea ---
const useAutoResizeTextarea = ({
  minHeight = 60,
  maxHeight = 200,
}: {
  minHeight?: number;
  maxHeight?: number;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = (reset = false) => {
    const textarea = textareaRef.current;
    if (textarea) {
      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }
      textarea.style.height = 'auto';
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
    }
  };

  return { textareaRef, adjustHeight };
};


// --- Main Chat Page Component ---
interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hello! How can I help you today? You can ask me to pay a bill, check your balance, or get financial advice.' }
  ]);
  const [input, setInput] = useState('');
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = { sender: 'bot', text: `You said: "${input}". This is a mocked response. In a real app, I would process this.` };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInput('');
    adjustHeight(true); // Reset textarea height
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center p-4 py-8 sm:space-y-4">
      <h1 className="text-foreground text-center text-2xl font-bold sm:text-4xl flex items-center gap-2">
        <MessageSquare className="text-green-500" />
        Ask DigiSaathi Anything
      </h1>

      {/* Chat Messages Display */}
      <div 
        ref={chatContainerRef}
        className="w-full h-[50vh] overflow-y-auto space-y-4 p-4 my-4 rounded-lg bg-secondary/20 border border-border"
      >
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'bot' && <Bot className="w-6 h-6 text-green-500 flex-shrink-0" />}
            <div className={cn(
              'rounded-lg px-4 py-2 max-w-[80%]',
              msg.sender === 'user' ? 'bg-green-600 text-white' : 'bg-card'
            )}>
              {msg.text}
            </div>
            {msg.sender === 'user' && <User className="w-6 h-6 text-gray-500 flex-shrink-0" />}
          </div>
        ))}
      </div>

      {/* Chat Input Area */}
      <div className="w-full">
        <div className="border-border bg-secondary/20 relative rounded-xl border">
          <div className="overflow-y-auto">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e: { target: { value: SetStateAction<string>; }; }) => {
                setInput(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask me to pay your electricity bill..."
              className={cn(
                'w-full px-4 py-3',
                'resize-none bg-transparent border-none text-sm',
                'focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
                'placeholder:text-sm min-h-[60px]',
              )}
              style={{ overflow: 'hidden' }}
            />
          </div>

          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="group hover:bg-secondary/50 flex items-center gap-1 rounded-lg p-2"
              >
                <Paperclip className="h-4 w-4" />
                <span className="hidden text-xs transition-opacity group-hover:inline">
                  Attach
                </span>
              </Button>
               <Button
                type="button"
                size="sm"
                variant="outline"
                className="group hover:bg-secondary/50 flex items-center gap-1 rounded-lg p-2"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim()}
                className={cn(
                  'flex items-center justify-center rounded-lg p-2 transition-colors',
                  input.trim() ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-secondary text-muted-foreground cursor-not-allowed',
                )}
              >
                <ArrowUpIcon className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="-mx-4 mt-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex flex-col flex-wrap items-start gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-3 sm:overflow-x-auto sm:pb-2">
            <ActionButton
              icon={<ScanLine className="h-4 w-4" />}
              label="Scan a Bill or QR"
            />
            <ActionButton
              icon={<IndianRupee className="h-4 w-4" />}
              label="Check Balance"
            />
            <ActionButton
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Check for Scams"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Reusable Action Button Component ---
interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
}

function ActionButton({ icon, label }: ActionButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      className="border-border bg-secondary/20 flex w-full flex-shrink-0 items-center gap-2 rounded-full border px-3 py-2 whitespace-nowrap transition-colors hover:bg-secondary/50 sm:w-auto sm:px-4"
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Button>
  );
}
