import React from 'react';
import { MessageSquare, RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SECTIONS } from '../../customer-report/constants';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  activeSection: string;
  shouldAllowChat: boolean;
  onSectionChange: (sectionId: string) => void;
  onClose: () => void;
  onRerunReport: () => void;
  onOpenChat?: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  activeSection,
  shouldAllowChat,
  onSectionChange,
  onClose,
  onRerunReport,
  onOpenChat = () => {},
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex flex-col p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Report Sections</h2>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-2 flex-1">
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

      {/* Action buttons at the bottom */}
      <div className="pt-4 mt-2 border-t space-y-2">
        <Button
          onClick={onOpenChat}
          disabled={!shouldAllowChat}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat with AI Assistant</span>
        </Button>

        <Button onClick={onRerunReport} variant="outline" className="w-full flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4" />
          <span>Re-run Report</span>
        </Button>
      </div>
    </div>
  );
};

export default MobileMenu;
