import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SECTIONS } from '../../customer-report/constants';

interface MobileMenuProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ activeSection, onSectionChange, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex flex-col p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Report Sections</h2>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-2">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-all',
                isActive ? 'bg-primary/10 text-primary' : 'text-foreground'
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
              <div className="text-left">
                <div className={cn('font-medium', isActive && 'text-primary')}>{section.label}</div>
                <div className="text-xs text-muted-foreground">{section.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileMenu;
