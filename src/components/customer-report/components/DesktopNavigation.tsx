import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { MessageSquare, RefreshCw } from 'lucide-react';
import React from 'react';
import { SECTIONS } from '../../customer-report/constants';
import { Button } from '@/components/ui/button';

interface DesktopNavigationProps {
  activeSection: string;
  shouldAllowChat: boolean;
  onSectionChange: (sectionId: string) => void;
  onRerunReport: () => void;
  onOpenChat?: () => void;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  activeSection,
  shouldAllowChat,
  onSectionChange,
  onRerunReport,
  onOpenChat = () => {},
}) => {
  return (
    <div className="hidden md:flex flex-col p-4 bg-background/95 backdrop-blur-sm flex-shrink-0">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Market Analysis Report</h1>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onOpenChat}
                size="sm"
                disabled={!shouldAllowChat}
                variant="outline"
                className="flex items-center gap-1 text-xs transition-all hover:bg-muted"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>AI Chat</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Chat with AI about this segment</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onRerunReport}
                size="sm"
                variant="outline"
                className="flex items-center gap-1 text-xs transition-all hover:bg-muted"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-run Report</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Re-run the report with new inputs</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex space-x-1 overflow-x-auto pb-2">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <Tooltip key={section.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onSectionChange(section.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-muted/50 text-foreground'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{section.label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{section.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default DesktopNavigation;
