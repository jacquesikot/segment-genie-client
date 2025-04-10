/* eslint-disable @typescript-eslint/no-explicit-any */
import { rerunResearch, ResearchReport } from '@/api/research';
import { Segment, SegmentStatus } from '@/api/segment';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAnalytics } from '@/hooks/use-analytics';
import axios from 'axios';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import CompetitionView from '../competition-view/CompetitionView';
import MarketSizeView from '../market-size/MarketSizeView';
import MarketTrendsView from '../market-trends/MarketTrendsView';
import PainPointsView from '../pain-points-view/PainPointsView';
import ComingSoonSection from './components/ComingSoonSection';
import DesktopNavigation from './components/DesktopNavigation';
import MobileMenu from './components/MobileMenu';
import MobileNavigation from './components/MobileNavigation';
import RerunModal from './components/RerunModal';
import { SECTIONS } from './constants';
import { z } from 'zod';
import { researchInputForm } from '@/pages/schemas';
import ChatModal from './components/ChatModal';
import FloatingChatButton from './components/FloatingChatButton';

interface CustomerReportViewProps {
  report?: ResearchReport;
  status: SegmentStatus;
  segmentId: string;
  segment?: Segment;
  refetchSegment: () => void;
}

const CustomerReportView: React.FC<CustomerReportViewProps> = ({
  report,
  status,
  segmentId,
  segment,
  refetchSegment,
}) => {
  const [activeSection, setActiveSection] = useState('painPoints');
  const activeSectionRef = useRef('marketSize');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const previousActiveSectionRef = useRef<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isRerunModalOpen, setIsRerunModalOpen] = useState(false);
  const [isRerunLoading, setIsRerunLoading] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const analytics = useAnalytics();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    analytics.trackEvent(analytics.Event.SEGMENT_VIEWED, {
      segmentId,
    });

    return () => {
      analytics.trackEvent(
        analytics.Event.SEGMENT_REPORT_TAB_CHANGED,
        {
          activeReportTab: '',
          previousReportTab: activeSectionRef.current,
        },
        true
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSectionChange = (sectionId: string) => {
    previousActiveSectionRef.current = activeSection;
    setActiveSection(sectionId);
    activeSectionRef.current = sectionId;

    analytics.trackEvent(
      analytics.Event.SEGMENT_REPORT_TAB_CHANGED,
      {
        activeReportTab: sectionId,
        previousReportTab: previousActiveSectionRef.current,
      },
      true
    );
    if (isMobile) setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'marketSize':
        return (
          <MarketSizeView
            marketSize={report ? (report.marketSize as any) : undefined}
            status={status.marketSize}
            onRetry={handleRetry}
          />
        );
      case 'competitors':
        return (
          <CompetitionView
            data={report ? (report.competitors as any) : undefined}
            status={status.competitors}
            onRetry={handleRetry}
          />
        );
      case 'painPoints':
        return (
          <PainPointsView
            data={report ? (report.painPoints as any) : undefined}
            status={status.painPoints}
            onRetry={handleRetry}
          />
        );
      case 'marketTrends':
        return (
          <MarketTrendsView
            onRetry={handleRetry}
            data={report ? (report.marketTrends as any) : undefined}
            status={
              status && status.marketTrends
                ? (status.marketTrends as any)
                : {
                    progress: 0,
                    message: 'No data available',
                    isComplete: false,
                    error: 'No data available',
                  }
            }
          />
        );
      default:
        return (
          <ComingSoonSection
            title={SECTIONS.find((s) => s.id === activeSection)?.label || ''}
          />
        );
    }
  };

  const handleRetry = async () => {
    await axios.post(
      `${
        import.meta.env.VITE_API_URL
      }/research/retry/${segmentId}/${activeSection}`
    );
  };

  const handleRerunReport = () => {
    setIsRerunModalOpen(true);
  };

  const handleRerunConfirm = async (
    values: z.infer<typeof researchInputForm>
  ) => {
    setIsRerunLoading(true);
    await rerunResearch(segmentId, {
      title: segment?.title || '',
      userId: segment?.userId || '',
      query: segment?.query || '',
      input: {
        customerProfile: {
          segment: values.segment,
          demographics: values.demographics,
          painPoints: values.painPoints,
        },
        solutionOverview: {
          problemToSolve: values.problem,
          solutionOffered: values.solution,
          uniqueFeatures: values.features,
        },
        marketContext: {
          industry: values.industry,
          competitors: values.competitors,
          channels: values.channels,
        },
      },
    });
    refetchSegment();
    analytics.trackEvent(
      analytics.Event.SEGMENT_REPORT_RERUN,
      {
        segmentId,
        newInput: values,
      },
      true
    );

    setIsRerunLoading(false);
    setIsRerunModalOpen(false);
  };

  const handleCloseRerunModal = () => {
    setIsRerunModalOpen(false);
  };

  const handleOpenChat = () => {
    setIsChatModalOpen(true);
    analytics.trackEvent(
      analytics.Event.SEGMENT_CHAT_OPENED,
      {
        segmentId,
        currentSection: activeSection,
      },
      true
    );
  };

  const handleCloseChat = () => {
    setIsChatModalOpen(false);
  };

  const shouldAllowChat = useMemo(() => {
    return segment?.data?.marketSize &&
      segment?.data?.competitors &&
      segment?.data?.painPoints &&
      segment?.data?.marketTrends
      ? true
      : false;
  }, [segment?.data]);

  return (
    <TooltipProvider>
      <div className='flex flex-col flex-1 bg-background/50 overflow-hidden transition-all duration-300'>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <MobileMenu
            shouldAllowChat={shouldAllowChat}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            onClose={toggleMobileMenu}
            onRerunReport={handleRerunReport}
            onOpenChat={handleOpenChat}
            isRerunLoading={isRerunLoading}
          />
        )}

        {/* Desktop Navigation */}
        <DesktopNavigation
          shouldAllowChat={shouldAllowChat}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          onRerunReport={handleRerunReport}
          onOpenChat={handleOpenChat}
          isRerunLoading={isRerunLoading}
        />

        {/* Main Content Area */}
        <div className='flex-1 overflow-hidden'>
          <div className='h-full overflow-auto p-4 md:p-4'>
            {renderContent()}
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileNavigation
          shouldAllowChat={shouldAllowChat}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          onOpenMenu={toggleMobileMenu}
          onRerunReport={handleRerunReport}
          onOpenChat={handleOpenChat}
          isRerunLoading={isRerunLoading}
        />

        {/* Floating Chat Button - appears when scrolling */}
        <FloatingChatButton
          shouldAllowChat={shouldAllowChat}
          onOpenChat={handleOpenChat}
          isChatModalOpen={isChatModalOpen}
        />

        {/* Chat Modal */}
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={handleCloseChat}
          segmentId={segmentId}
          segmentTitle={segment?.title || ''}
          currentSection={activeSection}
        />

        {/* Rerun Modal */}
        <RerunModal
          isOpen={isRerunModalOpen}
          onClose={handleCloseRerunModal}
          onConfirm={handleRerunConfirm}
          segment={segment}
          isLoading={isRerunLoading}
        />
      </div>
    </TooltipProvider>
  );
};

export default CustomerReportView;
