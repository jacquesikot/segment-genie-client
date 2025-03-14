import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import React from 'react';
import { SECTIONS } from '../../customer-report/constants';

interface MobileNavigationProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  onOpenMenu: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeSection, onSectionChange, onOpenMenu }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around bg-background border-t p-2 z-40">
      {SECTIONS.map((section, index) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        // Only show first 4 items in the bottom nav to avoid overcrowding
        if (index > 3) return null;

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

      {/* More button if there are more than 4 sections */}
      {SECTIONS.length > 4 && (
        <button onClick={onOpenMenu} className="flex flex-col items-center p-2 rounded-lg text-muted-foreground">
          <Menu className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">More</span>
        </button>
      )}
    </div>
  );
};

export default MobileNavigation;
