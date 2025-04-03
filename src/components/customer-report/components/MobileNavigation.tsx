import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Menu, MessageSquare, RefreshCw } from 'lucide-react';
import React from 'react';
import { SECTIONS } from '../../customer-report/constants';

interface MobileNavigationProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  onOpenMenu: () => void;
  onRerunReport: () => void;
  onOpenChat?: () => void;
  shouldAllowChat: boolean;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeSection,
  shouldAllowChat,
  onSectionChange,
  onOpenMenu,
  onRerunReport,
  onOpenChat = () => {},
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around bg-background border-t p-2 z-40">
      {SECTIONS.map((section, index) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        // Only show first 2 items in the bottom nav to leave space for chat and re-run button
        if (index > 1) return null;

        return (
          <Tooltip key={section.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  'flex flex-col items-center p-2 rounded-lg',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{section.label.split(' ')[0]}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{section.description}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}

      {/* AI Chat button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onOpenChat}
            disabled={!shouldAllowChat}
            className="flex flex-col items-center p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageSquare className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">AI Chat</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Chat with AI about this segment</p>
        </TooltipContent>
      </Tooltip>

      {/* Re-run button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onRerunReport}
            className="flex flex-col items-center p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors"
          >
            <RefreshCw className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Re-run</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Re-run the report with new inputs</p>
        </TooltipContent>
      </Tooltip>

      {/* More button if there are more than 3 sections */}
      <button onClick={onOpenMenu} className="flex flex-col items-center p-2 rounded-lg text-muted-foreground">
        <Menu className="w-5 h-5 mb-1" />
        <span className="text-xs font-medium">More</span>
      </button>
    </div>
  );
};

export default MobileNavigation;
