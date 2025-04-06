import React from 'react';
import { Loader2, MessageSquare, RefreshCw, X } from 'lucide-react';
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
  isRerunLoading: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  activeSection,
  shouldAllowChat,
  onSectionChange,
  onClose,
  onRerunReport,
  onOpenChat = () => {},
  isRerunLoading,
}) => {
  return (
    <div className='fixed inset-0 bg-background z-50 md:hidden'>
      <div className='flex flex-col h-full'>
        <div className='flex items-center justify-between p-4 border-b'>
          <h2 className='text-lg font-semibold'>Menu</h2>
          <button onClick={onClose} className='p-2 rounded-lg hover:bg-muted'>
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-4'>
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  'w-full p-4 rounded-lg mb-2 text-left transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted text-muted-foreground'
                )}
              >
                <div className='flex items-center gap-3'>
                  <Icon className='w-5 h-5' />
                  <div>
                    <div className='font-medium'>{section.label}</div>
                    <div className='text-xs text-muted-foreground'>
                      {section.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action buttons at the bottom */}
        <div className='pt-4 mt-2 border-t space-y-2'>
          <Button
            onClick={onOpenChat}
            disabled={!shouldAllowChat}
            variant='outline'
            className='w-full flex items-center justify-center gap-2'
          >
            <MessageSquare className='w-4 h-4' />
            <span>Chat with AI Assistant</span>
          </Button>
          <Button
            onClick={onRerunReport}
            disabled={isRerunLoading}
            variant='outline'
            className='w-full flex items-center justify-center gap-2'
          >
            {isRerunLoading ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin' />
                <span>Re-running Report...</span>
              </>
            ) : (
              <>
                <RefreshCw className='w-4 h-4' />
                <span>Re-run Report</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
