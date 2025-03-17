/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ResearchReport } from '@/api/research';
import { SegmentStatus } from '@/api/segment';
import MarketSizeView from '../market-size/MarketSizeView';
import CompetitionView from '../competition-view/CompetitionView';
import PainPointsView from '../pain-points-view/PainPointsView';
import { SECTIONS } from './constants';
import ComingSoonSection from './components/ComingSoonSection';
import MobileMenu from './components/MobileMenu';
import DesktopNavigation from './components/DesktopNavigation';
import MobileNavigation from './components/MobileNavigation';
import axios from 'axios';
import MarketTrendsView from '../market-trends/MarketTrendsView';

interface CustomerReportViewProps {
  report?: ResearchReport;
  status: SegmentStatus;
  segmentId: string;
}

const CustomerReportView: React.FC<CustomerReportViewProps> = ({ report, status, segmentId }) => {
  const [activeSection, setActiveSection] = useState('marketSize');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
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
