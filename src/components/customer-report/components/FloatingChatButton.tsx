import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface FloatingChatButtonProps {
  onOpenChat: () => void;
  shouldAllowChat: boolean;
  isChatModalOpen: boolean;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onOpenChat, shouldAllowChat, isChatModalOpen }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if we're on desktop
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.matchMedia('(min-width: 768px)').matches);
    };

    // Set initially
    checkIfDesktop();

    // Add listener for window resize
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    mediaQuery.addEventListener('change', checkIfDesktop);

    return () => {
      mediaQuery.removeEventListener('change', checkIfDesktop);
    };
  }, []);

  useEffect(() => {
    // Only add scroll handler if on desktop
    if (!isDesktop) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show button when:
      // 1. User scrolls down more than 200px
      // 2. OR user is scrolling down from current position (for better UX when reading)
      if (currentScrollY > 200 || (currentScrollY > lastScrollY && currentScrollY > 100)) {
        setIsVisible(true);
      } else if (currentScrollY < 100) {
        // Hide when near the top of the page
        setIsVisible(false);
      }

      // Update last scroll position
      setLastScrollY(currentScrollY);
    };

    // Add scroll event listener with throttling to improve performance
    let timeout: number;
    const throttledScroll = () => {
      if (!timeout) {
        timeout = window.setTimeout(() => {
          handleScroll();
          timeout = 0;
        }, 100);
      }
    };

    window.addEventListener('scroll', throttledScroll);

    // Clean up
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.clearTimeout(timeout);
    };
  }, [lastScrollY, isDesktop]);

  // Don't render the button if:
  // 1. Not on desktop
  // 2. Button shouldn't be visible based on scroll position
  // 3. Chat modal is already open
  if (!isDesktop || !isVisible || isChatModalOpen) return null;

  return (
    <div className="fixed right-4 bottom-6 z-30">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onOpenChat}
            size="sm"
            disabled={!shouldAllowChat}
            variant="outline"
            className={cn(
              'flex items-center gap-1 shadow-sm',
              'bg-background/90 text-foreground backdrop-blur-sm',
              'transition-all duration-300 hover:bg-muted',
              'animate-in slide-in-from-bottom-5 fade-in duration-300',
              'px-3 py-1.5 text-xs'
            )}
          >
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            <span>AI Chat</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Chat with AI about this segment</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default FloatingChatButton;
