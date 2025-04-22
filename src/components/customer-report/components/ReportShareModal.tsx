import React, { useState } from 'react';
import ShareModal from './ShareModal';

interface ReportShareModalProps {
  reportId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReportShareModal: React.FC<ReportShareModalProps> = ({ reportId, open, onOpenChange }) => {
  return <ShareModal open={open} onOpenChange={onOpenChange} reportId={reportId} />;
};

// This exports both the component and the handler function
export { ReportShareModal };
export const useShareModal = (reportId: string) => {
  const [isOpen, setIsOpen] = useState(false);

  const openShareModal = () => {
    setIsOpen(true);
  };

  const closeShareModal = () => {
    setIsOpen(false);
  };

  const ShareModalComponent = () => <ShareModal open={isOpen} onOpenChange={setIsOpen} reportId={reportId} />;

  return {
    openShareModal,
    closeShareModal,
    ShareModalComponent,
  };
};
