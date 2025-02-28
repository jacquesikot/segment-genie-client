import { ResearchReport } from '@/api/research';
import { SegmentStatus } from '@/api/segment';
import { Card, CardContent } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { BarChart3, Brain, Building2, Clock, Menu, Target, Users2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import MarketSizeView from './market-size-view';
import CompetitionView from './competition-view';

const SECTIONS = [
  {
    id: 'industry-market',
    label: 'Industry & Market Size',
    icon: Building2,
    description: 'Market segmentation and size analysis',
  },
  {
    id: 'competition',
    label: 'Competition',
    icon: Target,
    description: 'Competitive landscape analysis',
  },
  {
    id: 'pain-points',
    label: 'Pain Points',
    icon: Brain,
    description: 'Customer challenges and needs',
  },
  {
    id: 'consumer-behavior',
    label: 'Consumer Behavior',
    icon: Users2,
    description: 'Customer preferences and patterns',
  },
  {
    id: 'trends',
    label: 'Market Trends',
    icon: BarChart3,
    description: 'Industry trends and forecasts',
  },
];

const ComingSoonSection = ({ title }: { title: string }) => (
  <Card className="border-2 border-dashed">
    <CardContent className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Clock className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title} - Coming Soon</h3>
      <p className="text-muted-foreground text-center max-w-md">
        We're working on bringing you detailed insights about {title.toLowerCase()}. Stay tuned for comprehensive
        analysis and data.
      </p>
    </CardContent>
  </Card>
);

interface Props {
  report?: ResearchReport;
  status: SegmentStatus;
}

const CustomerReportView: React.FC<Props> = ({ report, status }) => {
  const [activeSection, setActiveSection] = useState('industry-market');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    if (isMobile) setIsSidebarOpen(false);
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background/50">
        {/* Navigation Sidebar */}
        <div
          className={cn(
            `w-64 ${!isMobile && 'border-r'} bg-background/95 backdrop-blur-sm p-4 space-y-2`,
            'fixed md:relative md:translate-x-0 z-40 h-full',
            'transition-transform duration-300 ease-in-out',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Report Sections</h2>
            <button onClick={toggleSidebar} className="md:hidden p-1 hover:bg-muted rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-all',
                  'hover:bg-muted/50 hover:pl-4',
                  isActive ? 'bg-primary/10 border-l-4 border-primary pl-4 text-primary' : 'pl-3 text-foreground'
                )}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
                <div className="text-left">
                  <div className={cn('font-medium', isActive && 'text-primary')}>{section.label}</div>
                  <div className="text-xs text-muted-foreground hidden md:block">{section.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 transition-all duration-300">
          {/* Mobile Navigation Button - Moved to Top of Main Content */}
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h1 className="text-2xl font-bold">Market Analysis Report</h1>
            <button onClick={toggleSidebar} className="p-2 rounded-lg bg-background border shadow-sm">
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Overlay for mobile sidebar */}
          {isSidebarOpen && <div onClick={toggleSidebar} className="md:hidden fixed inset-0 bg-black/50 z-30" />}

          {/* Content remains the same */}
          {activeSection === 'industry-market' ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <MarketSizeView marketSize={report ? (report.marketSize as any) : undefined} status={status.marketSize} />
          ) : activeSection === 'competition' ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <CompetitionView data={report ? (report.competitors as any) : undefined} status={status.competitors} />
          ) : (
            <ComingSoonSection title={SECTIONS.find((s) => s.id === activeSection)?.label || ''} />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CustomerReportView;
