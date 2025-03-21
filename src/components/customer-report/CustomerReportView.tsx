/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResearchReport } from '@/api/research';
import { SegmentStatus } from '@/api/segment';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAnalytics } from '@/hooks/use-analytics';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import CompetitionView from '../competition-view/CompetitionView';
import MarketSizeView from '../market-size/MarketSizeView';
import MarketTrendsView from '../market-trends/MarketTrendsView';
import PainPointsView from '../pain-points-view/PainPointsView';
import ComingSoonSection from './components/ComingSoonSection';
import DesktopNavigation from './components/DesktopNavigation';
import MobileMenu from './components/MobileMenu';
import MobileNavigation from './components/MobileNavigation';
import { SECTIONS } from './constants';
interface CustomerReportViewProps {
  report?: ResearchReport;
  status: SegmentStatus;
  segmentId: string;
}

const CustomerReportView: React.FC<CustomerReportViewProps> = ({ report, status, segmentId }) => {
  const [activeSection, setActiveSection] = useState('marketSize');
  const activeSectionRef = useRef('marketSize');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const previousActiveSectionRef = useRef<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
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
        return <ComingSoonSection title={SECTIONS.find((s) => s.id === activeSection)?.label || ''} />;
    }
  };

  const handleRetry = async () => {
    await axios.post(`${import.meta.env.VITE_API_URL}/research/retry/${segmentId}/${activeSection}`);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col flex-1 bg-background/50 overflow-hidden">
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <MobileMenu activeSection={activeSection} onSectionChange={handleSectionChange} onClose={toggleMobileMenu} />
        )}

        {/* Desktop Navigation */}
        <DesktopNavigation activeSection={activeSection} onSectionChange={handleSectionChange} />

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto p-4 md:p-4">{renderContent()}</div>
        </div>

        {/* Mobile Navigation */}
        <MobileNavigation
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          onOpenMenu={toggleMobileMenu}
        />
      </div>
    </TooltipProvider>
  );
};

export default CustomerReportView;
