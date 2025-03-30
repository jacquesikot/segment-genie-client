import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAnalytics } from '@/hooks/use-analytics';
import { cn } from '@/lib/utils';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  segmentId: string;
  segmentTitle: string;
  currentSection: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, segmentId, segmentTitle, currentSection }) => {
  const analytics = useAnalytics();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your AI assistant for the "${segmentTitle}" segment. How can I help you understand the ${currentSection} data or any other aspect of this segment?`,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Add body class to prevent scrolling when panel is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden', 'md:overflow-auto');
    } else {
      document.body.classList.remove('overflow-hidden', 'md:overflow-auto');
    }
    return () => {
      document.body.classList.remove('overflow-hidden', 'md:overflow-auto');
    };
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Track the message in analytics
    analytics.trackEvent(
      analytics.Event.SEGMENT_CHAT_MESSAGE_SENT,
      {
        segmentId,
        currentSection,
        messageContent: inputValue,
      },
      true
    );

    setInputValue('');
    setIsLoading(true);

    // TODO: Replace with actual API call to your AI service
    // This is a placeholder for demonstration
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        role: 'assistant',
        content: `I'm analyzing the ${currentSection} data for your segment "${segmentTitle}" (ID: ${segmentId}). This is a placeholder response. Please implement the actual API integration.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Overlay for mobile only */}
      <div
        className={cn(
          'fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Side panel */}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 w-full max-w-[400px] h-full border-l shadow-xl flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{
          backgroundColor: 'rgba(var(--background), 0.97)',
          backdropFilter: 'blur(8px)',
          boxShadow: 'rgba(0, 0, 0, 0.12) -5px 0px 24px',
          borderLeft: '1px solid rgba(var(--border), 0.3)',
        }}
      >
        <div
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: 'rgba(var(--background), 0.98)' }}
        >
          <div>
            <h2 className="font-semibold text-lg">Research Assistant</h2>
            <p className="text-xs text-muted-foreground">Chat about the "{segmentTitle}" segment</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="ml-auto">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="flex flex-col gap-4 pb-2">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-lg ${
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  <div className="text-sm">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] p-3 rounded-lg bg-muted">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-bounce"></div>
                    <div
                      className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t mt-auto" style={{ backgroundColor: 'rgba(var(--background), 0.98)' }}>
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
              autoComplete="off"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatModal;
