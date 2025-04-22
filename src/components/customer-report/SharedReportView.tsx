/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResearchReport } from '@/api/research';
import { SegmentStatus } from '@/api/segment';
import { TooltipProvider } from '@/components/ui/tooltip';
import React, { useState } from 'react';
import CompetitionView from '../competition-view/CompetitionView';
import MarketSizeView from '../market-size/MarketSizeView';
import MarketTrendsView from '../market-trends/MarketTrendsView';
import PainPointsView from '../pain-points-view/PainPointsView';
import ComingSoonSection from './components/ComingSoonSection';
import { SECTIONS } from './constants';

interface SharedReportViewProps {
  report?: ResearchReport;
  status: SegmentStatus;
}

const SharedReportView: React.FC<SharedReportViewProps> = ({ report, status }) => {
  const [activeSection, setActiveSection] = useState('painPoints');

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'marketSize':
        return (
          <MarketSizeView
            marketSize={report ? (report.marketSize as any) : undefined}
            status={status.marketSize}
            onRetry={() => {}}
          />
        );
      case 'competitors':
        return (
          <CompetitionView
            data={report ? (report.competitors as any) : undefined}
            status={status.competitors}
            onRetry={() => {}}
          />
        );
      case 'painPoints':
        return (
          <PainPointsView
            data={report ? (report.painPoints as any) : undefined}
            status={status.painPoints}
            onRetry={() => {}}
          />
        );
      case 'marketTrends':
        return (
          <MarketTrendsView
            onRetry={() => {}}
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

  return (
    <TooltipProvider>
      <div className="flex flex-col flex-1 bg-background/50 overflow-hidden transition-all duration-300">
        {/* Simple Navigation */}
        <nav className="border-b border-border p-4">
          <div className="flex flex-wrap gap-3">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto p-4 md:p-4">{renderContent()}</div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SharedReportView;
