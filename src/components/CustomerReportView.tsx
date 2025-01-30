import { ResearchReport } from '@/api/research';
import { SegmentStatus } from '@/api/segment';
import { Card, CardContent } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { BarChart3, Brain, Building2, Clock, Target, Users2 } from 'lucide-react';
import React, { useState } from 'react';
import MarketSizeView from './market-size-view';
import PainPointsView from './pain-points-view';

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

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background/50">
        {/* Navigation Sidebar */}
        <div className="w-64 border-r bg-background p-4 space-y-2">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Report Sections</h2>
            <p className="text-sm text-muted-foreground">Explore different aspects of the market analysis</p>
          </div>
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-colors',
                  'hover:bg-muted',
                  activeSection === section.id ? 'bg-muted' : 'transparent'
                )}
              >
                <Icon
                  className={cn('w-5 h-5', activeSection === section.id ? 'text-primary' : 'text-muted-foreground')}
                />
                <div className="text-left">
                  <div className={cn('font-medium', activeSection === section.id ? 'text-primary' : 'text-foreground')}>
                    {section.label}
                  </div>
                  <div className="text-xs text-muted-foreground hidden md:block">{section.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {activeSection === 'industry-market' ? (
            <MarketSizeView
              marketSize={report ? report.marketSize : undefined}
              industry={report ? report.validIndustry : undefined}
              status={status.marketSize}
            />
          ) : activeSection === 'pain-points' ? (
            <PainPointsView data={report ? report.painPoints : undefined} status={status.painPoints} />
          ) : (
            <ComingSoonSection title={SECTIONS.find((s) => s.id === activeSection)?.label || ''} />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CustomerReportView;
