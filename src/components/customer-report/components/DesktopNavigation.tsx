import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import React from 'react';
import { SECTIONS } from '../../customer-report/constants';

interface DesktopNavigationProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ activeSection, onSectionChange }) => {
  return (
    <div className="hidden md:flex flex-col p-4 border-b bg-background/95 backdrop-blur-sm flex-shrink-0">
      <h1 className="text-2xl font-bold mb-4">Market Analysis Report</h1>
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
