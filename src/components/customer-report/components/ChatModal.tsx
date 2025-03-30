import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X, Bot, Sparkles, MessageCircle, Lightbulb, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAnalytics } from '@/hooks/use-analytics';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

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

enum ChatState {
  UNINITIATED = 'uninitiated',
  INITIATED = 'initiated',
  ACTIVE = 'active',
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, segmentId, segmentTitle, currentSection }) => {
  const analytics = useAnalytics();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatState, setChatState] = useState<ChatState>(ChatState.UNINITIATED);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    `What are the main pain points for ${segmentTitle}?`,
    `How large is the market for ${segmentTitle}?`,
    `Who are the top competitors in the ${segmentTitle} space?`,
    `What market trends affect ${segmentTitle}?`,
  ];

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Track when chat panel is opened
  useEffect(() => {
    if (isOpen) {
      analytics.trackEvent(
        analytics.Event.SEGMENT_CHAT_OPENED,
        {
          segmentId,
          currentSection,
          chatState,
        },
        false
      );
    }
  }, [isOpen, analytics, segmentId, currentSection, chatState]);

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

  const initiateChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Hello! I'm your AI assistant for the "${segmentTitle}" segment. How can I help you understand the ${currentSection} data or any other aspect of this segment?`,
        timestamp: new Date(),
      },
    ]);
    setChatState(ChatState.INITIATED);

    // Track chat initiated in analytics
    analytics.trackEvent(
      analytics.Event.SEGMENT_CHAT_OPENED,
      {
        segmentId,
        currentSection,
      },
      true
    );
  };

  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Track the message in analytics
    analytics.trackEvent(
      analytics.Event.SEGMENT_CHAT_MESSAGE_SENT,
      {
        segmentId,
        currentSection,
        messageContent: content,
      },
      true
    );

    // Update chat state if this is the first user message
    if (chatState === ChatState.INITIATED) {
      setChatState(ChatState.ACTIVE);
    }

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

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render content based on chat state
  const renderChatContent = () => {
    switch (chatState) {
      case ChatState.UNINITIATED:
        return (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Segment Research Assistant</h3>
            <p className="text-muted-foreground mb-6 max-w-[280px]">
              Get insights and analysis about the "{segmentTitle}" segment with our AI research assistant.
            </p>
            <Button onClick={initiateChat} className="bg-primary hover:bg-primary/90 gap-2">
              <Sparkles className="h-4 w-4" />
              Start Conversation
            </Button>
          </div>
        );

      case ChatState.INITIATED:
        return (
          <>
            <ScrollArea className="flex-1 px-3 py-3" ref={scrollAreaRef}>
              <div className="flex flex-col gap-4 pb-2">
                {messages.map((message, index) => (
                  <MessageBubble key={index} message={message} />
                ))}

                <div className="mt-5">
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Suggested questions:</p>
                  <div className="flex flex-col gap-2">
                    {suggestedQuestions.map((question, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="w-full justify-start gap-2 text-left h-auto py-2 px-2.5 group hover:bg-primary/10 hover:text-primary text-xs"
                        onClick={() => handleSuggestedQuestion(question)}
                      >
                        <Lightbulb className="h-3 w-3 flex-shrink-0 text-muted-foreground group-hover:text-primary" />
                        <span className="truncate overflow-hidden pr-1">{question}</span>
                        <ChevronRight className="h-3 w-3 ml-auto flex-shrink-0 text-muted-foreground group-hover:text-primary" />
                      </Button>
                    ))}
                  </div>
                </div>

                {isLoading && <LoadingIndicator />}
              </div>
            </ScrollArea>
            <ChatInput
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSendMessage={handleSendMessage}
              handleKeyPress={handleKeyPress}
              isLoading={isLoading}
            />
          </>
        );

      case ChatState.ACTIVE:
        return (
          <>
            <ScrollArea className="flex-1 px-3 py-3" ref={scrollAreaRef}>
              <div className="flex flex-col gap-4 pb-2">
                {messages.map((message, index) => (
                  <MessageBubble key={index} message={message} />
                ))}
                {isLoading && <LoadingIndicator />}
              </div>
            </ScrollArea>
            <ChatInput
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSendMessage={handleSendMessage}
              handleKeyPress={handleKeyPress}
              isLoading={isLoading}
            />
          </>
        );
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
          'fixed top-0 right-0 z-50 w-full max-w-[420px] h-full border-l shadow-xl flex flex-col transition-transform duration-300 ease-in-out bg-background/97',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{
          backdropFilter: 'blur(8px)',
          boxShadow: 'rgba(0, 0, 0, 0.12) -5px 0px 24px',
          borderLeft: '1px solid rgba(var(--border), 0.3)',
        }}
      >
        <ChatHeader segmentTitle={segmentTitle} onClose={onClose} chatState={chatState} />
        {renderChatContent()}
      </div>
    </>
  );
};

// Component for message bubbles
const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  return (
    <div className={`flex items-end gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'} w-full mb-3`}>
      {message.role === 'assistant' && (
        <Avatar className="w-8 h-8 justify-center align-middle items-center flex-shrink-0 border border-border/50 shadow-sm">
          <Bot className="h-4 w-4 text-primary" />
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[85%] p-3 rounded-2xl shadow-sm',
          message.role === 'user'
            ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-none'
            : 'bg-muted/80 backdrop-blur-sm border border-border/40 rounded-tl-none'
        )}
      >
        <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</div>
        <div className="text-[10px] opacity-70 mt-1.5 text-right font-medium">
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
      {message.role === 'user' && (
        <Avatar className="w-8 h-8 justify-center align-middle items-center flex-shrink-0 bg-primary/90 shadow-sm ring-2 ring-primary/20">
          <div className="font-semibold text-xs text-primary-foreground">You</div>
        </Avatar>
      )}
    </div>
  );
};

// Component for loading indicator
const LoadingIndicator: React.FC = () => (
  <div className="flex justify-start items-end gap-2.5 w-full mb-3">
    <Avatar className="w-8 h-8 flex-shrink-0 border border-border/50 shadow-sm">
      <Bot className="h-4 w-4 text-primary" />
    </Avatar>
    <div className="max-w-[85%] p-3 rounded-2xl rounded-tl-none bg-muted/80 backdrop-blur-sm border border-border/40 shadow-sm">
      <div className="flex space-x-2 py-0.5">
        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"></div>
        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  </div>
);

// Component for chat input
interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  handleSendMessage,
  handleKeyPress,
  isLoading,
}) => (
  <div className="p-3 border-t mt-auto bg-background/98">
    <div className="flex gap-2">
      <Input
        placeholder="Type your message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={isLoading}
        className="flex-1 py-5 shadow-sm border-muted-foreground/20 focus-visible:ring-primary text-sm"
        autoComplete="off"
      />
      <Button
        onClick={handleSendMessage}
        disabled={!inputValue.trim() || isLoading}
        size="icon"
        className="bg-primary hover:bg-primary/90 transition-all duration-200 transform active:scale-95 flex-shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

// Component for chat header
interface ChatHeaderProps {
  segmentTitle: string;
  onClose: () => void;
  chatState: ChatState;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ segmentTitle, onClose, chatState }) => (
  <div className="p-3 flex items-center justify-between border-b bg-background/98">
    <div className="flex items-center gap-2.5">
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 flex-shrink-0">
        <Bot className="h-3.5 w-3.5 text-primary" />
      </div>
      <div>
        <h2 className="font-semibold">Research Assistant</h2>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">"{segmentTitle}" segment</p>
          {chatState !== ChatState.UNINITIATED && (
            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
              {chatState === ChatState.INITIATED ? 'New' : 'Active'}
            </Badge>
          )}
        </div>
      </div>
    </div>
    <Button variant="ghost" size="icon" onClick={onClose} className="ml-auto flex-shrink-0">
      <X className="h-4 w-4" />
    </Button>
  </div>
);

export default ChatModal;
