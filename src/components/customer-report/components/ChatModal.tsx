import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAnalytics } from '@/hooks/use-analytics';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { initialiseChat, newChat, getChatBySegmentId, getChatMessages, sendMessage } from '@/api/chat';
import { useAuth } from '@/lib/auth-context';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css';
import { Textarea } from '@/components/ui/textarea';
import { Send, X, Bot, Sparkles, MessageCircle, Lightbulb, ChevronRight, GripVertical } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  segmentId: string;
  segmentTitle: string;
  currentSection: string;
}

interface ChatMessage {
  sender: 'user' | 'system';
  content: string;
  timestamp: Date;
  _id?: string; // Add ID for server messages
}

enum ChatState {
  UNINITIATED = 'uninitiated',
  INITIATED = 'initiated',
  ACTIVE = 'active',
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, segmentId, segmentTitle, currentSection }) => {
  const analytics = useAnalytics();
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatState, setChatState] = useState<ChatState>(ChatState.UNINITIATED);
  const [chatId, setChatId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const [isCursorInModal, setIsCursorInModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [modalWidth, setModalWidth] = useState<number | null>(null);

  const suggestedQuestions = [
    `What are the main pain points for ${segmentTitle}?`,
    `How large is the market for ${segmentTitle}?`,
    `Who are the top competitors in the ${segmentTitle} space?`,
    `What market trends affect ${segmentTitle}?`,
  ];

  // Load saved width from localStorage on mount
  useEffect(() => {
    const savedWidth = localStorage.getItem('chatModalWidth');
    if (savedWidth) {
      // Validate that the saved width is still within current constraints
      const windowWidth = window.innerWidth;
      const parsedWidth = parseInt(savedWidth, 10);
      const maxWidth = windowWidth * 0.5;

      if (parsedWidth >= 420 && parsedWidth <= maxWidth) {
        setModalWidth(parsedWidth);
      }
    }
  }, []);

  // Handle resizing of the modal
  useEffect(() => {
    // Only apply resize functionality for desktop screens
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (!isDesktop || !isOpen) return;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();

      // Add a class to indicate resizing state (for CSS transitions and visual feedback)
      if (modalRef.current) {
        modalRef.current.classList.add('resizing');
      }

      setIsResizing(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      // Calculate width based on mouse position
      const windowWidth = window.innerWidth;
      const newWidth = windowWidth - e.clientX;

      // Set min and max width constraints
      const minWidth = 420; // Minimum width in px
      const maxWidth = windowWidth * 0.5; // Maximum width: 50% of viewport

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setModalWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);

      // Save current width to localStorage
      if (modalWidth) {
        localStorage.setItem('chatModalWidth', modalWidth.toString());
      }

      // Remove the resizing class for smooth transitions when not actively resizing
      if (modalRef.current) {
        modalRef.current.classList.remove('resizing');
      }
    };

    // Add event listeners for resize handle
    const resizeHandle = resizeHandleRef.current;
    if (resizeHandle) {
      resizeHandle.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      if (resizeHandle) {
        resizeHandle.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isOpen, isResizing, modalWidth]);

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

  // Handle scroll behavior based on cursor position
  useEffect(() => {
    // Function to prevent default scroll behavior
    const preventScroll = (e: WheelEvent) => {
      if (isCursorInModal) {
        // When cursor is in modal, allow modal to scroll but not main page
        e.stopPropagation();
      } else if (isOpen) {
        // When modal is open but cursor is not in it, prevent modal from scrolling
        const modalElement = modalRef.current;
        if (modalElement) {
          const scrollElements = modalElement.querySelectorAll('[data-radix-scroll-area-viewport]');
          scrollElements.forEach((el) => {
            (el as HTMLElement).style.overflowY = 'hidden';
          });
        }
      }
    };

    // Functions to track cursor position
    const handleMouseEnter = () => {
      setIsCursorInModal(true);
      // Re-enable scrolling in modal
      const modalElement = modalRef.current;
      if (modalElement) {
        const scrollElements = modalElement.querySelectorAll('[data-radix-scroll-area-viewport]');
        scrollElements.forEach((el) => {
          (el as HTMLElement).style.overflowY = 'auto';
        });
      }
    };

    const handleMouseLeave = () => {
      setIsCursorInModal(false);
    };

    // Body class setup for mobile
    if (isOpen) {
      document.body.classList.add('overflow-hidden', 'md:overflow-auto');

      // Add event listeners when modal is open
      const modalElement = modalRef.current;
      if (modalElement) {
        modalElement.addEventListener('mouseenter', handleMouseEnter);
        modalElement.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('wheel', preventScroll, { passive: false });
      }
    } else {
      document.body.classList.remove('overflow-hidden', 'md:overflow-auto');
    }

    return () => {
      document.body.classList.remove('overflow-hidden', 'md:overflow-auto');

      // Clean up event listeners
      const modalElement = modalRef.current;
      if (modalElement) {
        modalElement.removeEventListener('mouseenter', handleMouseEnter);
        modalElement.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('wheel', preventScroll);
      }
    };
  }, [isOpen, isCursorInModal]);

  // Check initial chat state when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setIsInitializing(true);
      checkChatState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, segmentId]);

  // Function to check if chat already exists for this segment
  const checkChatState = async () => {
    try {
      setIsLoading(true);
      const response = await getChatBySegmentId(segmentId);

      if (response.data && response.data.length > 0) {
        // Chat has been initialized
        const mostRecentChat = response.data.sort(
          (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        )[0];
        setChatId(mostRecentChat._id);

        // Fetch messages for this chat
        const messagesResponse = await getChatMessages(mostRecentChat._id);

        if (messagesResponse.data && messagesResponse.data.length > 0) {
          // Chat has messages, set state to ACTIVE
          const formattedMessages = messagesResponse.data.map((msg) => ({
            sender: msg.sender,
            content: msg.content,
            timestamp: msg.createdAt ? new Date(msg.createdAt) : new Date(),
            _id: msg._id,
          }));

          setMessages(formattedMessages);
          setChatState(ChatState.ACTIVE);
        } else {
          // Chat exists but no messages, set state to INITIATED
          setChatState(ChatState.INITIATED);
          setMessages([
            {
              sender: 'system',
              content: `Hello! I'm your AI assistant for the "${segmentTitle}" segment. How can I help you understand the ${currentSection} data or any other aspect of this segment?`,
              timestamp: new Date(),
            },
          ]);
        }
      } else {
        // No chat exists yet
        setChatState(ChatState.UNINITIATED);
        // Clear any existing messages
        setMessages([]);
      }
    } catch (error) {
      console.error('Error checking chat state:', error);
      setChatState(ChatState.UNINITIATED);
      // Show error message to user
      setMessages([
        {
          sender: 'system',
          content: 'Sorry, I encountered an error loading the conversation. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsInitializing(false);
    }
  };

  const initiateChat = async () => {
    try {
      setIsInitializing(true);
      await initialiseChat(segmentId);
      const chatResponse = await newChat(segmentId, user!.id, segmentTitle);

      if (chatResponse.data) {
        setChatId(chatResponse.data._id);
      }

      setMessages([
        {
          sender: 'system',
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
    } catch (error) {
      console.error('Error initiating chat:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim() || !chatId) return;

    const trimmedContent = content.trim();

    // Add user message to chat immediately for responsive UI
    const userMessage: ChatMessage = {
      sender: 'user',
      content: trimmedContent,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Track the message in analytics
    analytics.trackEvent(
      analytics.Event.SEGMENT_CHAT_MESSAGE_SENT,
      {
        segmentId,
        currentSection,
        messageContent: trimmedContent,
      },
      true
    );

    // Update chat state if this is the first user message
    if (chatState === ChatState.INITIATED) {
      setChatState(ChatState.ACTIVE);
    }

    // Clear input field and show loading state
    setInputValue('');
    setIsLoading(true);

    try {
      // Send message to the API
      const response = await sendMessage(segmentId, chatId, trimmedContent);

      if (response.data) {
        // Create AI response message
        const aiResponse: ChatMessage = {
          sender: 'system',
          content: response.data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);

        // If user has scrolled up, don't auto-scroll to bottom
        if (scrollAreaRef.current) {
          const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
          if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to the chat
      setMessages((prev) => [
        ...prev,
        {
          sender: 'system',
          content: 'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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

  // Function to reset modal width to default
  const resetModalWidth = () => {
    setModalWidth(null);
    localStorage.removeItem('chatModalWidth');
  };

  // Render content based on chat state
  const renderChatContent = () => {
    // Show loading indicator while initializing
    if (isInitializing) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Bot className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold mb-4">Loading conversation...</h3>
          <div className="flex space-x-3 py-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-bounce"></div>
            <div
              className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
            <div
              className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-bounce"
              style={{ animationDelay: '0.4s' }}
            ></div>
          </div>
        </div>
      );
    }

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
        ref={modalRef}
        className={cn(
          'fixed top-0 right-0 z-50 w-full md:max-w-[420px] h-full border-l shadow-xl flex flex-col bg-background/97',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
          isResizing ? 'transition-none' : 'transition-all'
        )}
        style={{
          backdropFilter: 'blur(8px)',
          boxShadow: 'rgba(0, 0, 0, 0.12) -5px 0px 24px',
          borderLeft: '1px solid rgba(var(--border), 0.3)',
          width: modalWidth ? `${modalWidth}px` : undefined,
          maxWidth: modalWidth ? 'none' : undefined,
        }}
      >
        {/* Resize handle (desktop only) */}
        <div
          ref={resizeHandleRef}
          className={cn(
            'hidden md:block absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize transition-colors',
            'hover:bg-primary/10',
            isResizing ? 'bg-primary/20' : ''
          )}
          title="Drag to resize"
        >
          <div
            className={cn(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity',
              isResizing ? 'opacity-100' : 'opacity-30 hover:opacity-70'
            )}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <ChatHeader
          segmentTitle={segmentTitle}
          onClose={onClose}
          chatState={chatState}
          hasCustomWidth={!!modalWidth}
          onResetWidth={resetModalWidth}
        />
        {renderChatContent()}
      </div>
    </>
  );
};

// Component for message bubbles
// All assistant responses are automatically rendered with markdown formatting
// Supports headings, lists, tables, code blocks, blockquotes, and other markdown elements
const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  // Format timestamp to show time
  const formattedTime = message.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Ensure content is string for markdown processing
  const content = typeof message.content === 'string' ? message.content : '';

  return (
    <div
      className={`flex items-end gap-2.5 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} w-full mb-3`}
    >
      {message.sender === 'system' && (
        <Avatar className="w-8 h-8 justify-center align-middle items-center flex-shrink-0 border border-border/50 shadow-sm">
          <Bot className="h-4 w-4 text-primary" />
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[85%] p-3 rounded-2xl shadow-sm',
          message.sender === 'user'
            ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-none'
            : 'bg-muted/80 backdrop-blur-sm border border-border/40 rounded-tl-none'
        )}
      >
        {message.sender === 'system' ? (
          <article
            className={cn(
              'prose prose-sm dark:prose-invert max-w-none !text-foreground text-sm',
              'prose-headings:text-foreground prose-headings:font-bold prose-headings:my-2',
              'prose-h1:text-lg prose-h2:text-base prose-h2:border-b prose-h2:pb-1 prose-h3:text-sm',
              'prose-p:my-1.5 prose-p:text-foreground/90',
              'prose-a:text-primary',
              'prose-pre:bg-muted/60 prose-pre:rounded prose-pre:p-2',
              'prose-code:text-primary prose-code:bg-muted/70 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none',
              'prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-2.5 prose-blockquote:text-muted-foreground',
              'prose-ol:my-2 prose-ul:my-2 prose-ul:list-disc prose-ol:list-decimal prose-li:my-0.5 prose-li:marker:text-primary/70',
              'prose-table:border-collapse prose-table:border prose-table:border-border/30 prose-table:my-3 prose-table:w-full',
              'prose-thead:bg-muted/30',
              'prose-th:bg-muted/50 prose-th:p-2 prose-th:border prose-th:border-border/30 prose-th:font-semibold',
              'prose-td:p-2 prose-td:border prose-td:border-border/30',
              'prose-hr:my-4 prose-hr:border-muted-foreground/20',
              'prose-strong:font-semibold prose-strong:text-foreground'
            )}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Override pre rendering for better code block styling
                pre: ({ children }) => (
                  <pre className="bg-muted/30 p-3 rounded-md overflow-x-auto my-3">{children}</pre>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        ) : (
          <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">{content}</div>
        )}
        <div className="text-[10px] opacity-70 mt-1.5 text-right font-medium">{formattedTime}</div>
      </div>
      {message.sender === 'user' && (
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
      <Textarea
        placeholder="Type your message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={isLoading}
        className="flex-1 py-2 px-3 shadow-sm border-muted-foreground/20 focus-visible:ring-primary text-sm min-h-[100px] resize-none"
        autoComplete="off"
      />
      <Button
        onClick={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
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
  hasCustomWidth?: boolean;
  onResetWidth?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ segmentTitle, onClose, chatState, hasCustomWidth, onResetWidth }) => (
  <div className="p-3 flex items-center justify-between bg-background/98">
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
    <div className="flex items-center gap-1">
      {/* Reset width button (only shown when width has been customized) */}
      {hasCustomWidth && onResetWidth && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onResetWidth}
          className="hidden md:flex flex-shrink-0 h-8 w-8"
          title="Reset panel width"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current"
          >
            <path
              d="M3 8V5C3 3.89543 3.89543 3 5 3H8M21 8V5C21 3.89543 20.1046 3 19 3H16M16 21H19C20.1046 21 21 20.1046 21 19V16M8 21H5C3.89543 21 3 20.1046 3 19V16"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      )}
      <Button variant="ghost" size="icon" onClick={onClose} className="ml-auto flex-shrink-0">
        <X className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default ChatModal;
