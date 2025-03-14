/* eslint-disable @typescript-eslint/no-explicit-any */
import { Competitors } from '@/api/research';
import { Status } from '@/api/segment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Tooltip as ChartTooltip,
  Legend,
  LinearScale,
  Title,
} from 'chart.js';
import { Users } from 'lucide-react';
import React, { useState } from 'react';
import SegmentLoader from '../SegmentLoader';
import ComparativeTab from './tabs/ComparativeTab';
import CompetitorsTab, { Competitor } from './tabs/CompetitorsTab';
import OverviewTab, { CompetitorData } from './tabs/OverviewTab';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

interface Props {
  data?: Competitors;
  status: Status;
}

const CompetitionView: React.FC<Props> = ({ data: competitorData, status }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');

  if (!competitorData) {
    return (
      <SegmentLoader
        title="Competition Analysis"
        progress={status.progress.toString()}
        statusText={status.message}
        isComplete={status.isComplete}
        error={status.progress < 0 ? status.message : undefined}
      />
    );
  }

  const analysisDate = new Date(competitorData.metadata.analysisDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const finalCompetitors = competitorData.competitors.filter((c) => c.name);

  const filteredCompetitors =
    filterCategory === 'All'
      ? [...finalCompetitors].sort((a, b) => {
          const order = { direct: 0, indirect: 1, potential: 2 };
          return (
            order[a.category?.toLowerCase() as keyof typeof order] -
            order[b.category?.toLowerCase() as keyof typeof order]
          );
        })
      : finalCompetitors.filter((c: any) => c.category.toLowerCase() === filterCategory.toLowerCase());

  return (
    <div className="space-y-6 pb-20">
      <Card className="shadow-lg dark:bg-gray-900 border-0 overflow-hidden">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 dark:bg-indigo-950/50 p-3 rounded-lg flex-shrink-0">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-2xl dark:text-white break-words">Competitor Research</CardTitle>
                <CardDescription className="mt-2 dark:text-gray-300 break-words">
                  {competitorData.metadata.totalCompetitors} Competitors Analyzed · Last updated: {analysisDate}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 w-full grid grid-cols-3 gap-1">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="competitors" className="text-xs sm:text-sm">
                Competitors
              </TabsTrigger>
              <TabsTrigger value="comparative" className="text-xs sm:text-sm">
                Comparison
              </TabsTrigger>
              {/* <TabsTrigger value="recommendations" className="text-xs sm:text-sm">
                Recommendations
              </TabsTrigger> */}
            </TabsList>

            <TabsContent value="overview" className="mt-10">
              <OverviewTab competitorData={competitorData as CompetitorData} analysisDate={analysisDate} />
            </TabsContent>

            <TabsContent value="competitors" className="mt-10">
              <CompetitorsTab
                competitors={filteredCompetitors as unknown as Competitor[]}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
              />
            </TabsContent>

            <TabsContent value="comparative" className="mt-10">
              <ComparativeTab comparativeAnalysis={competitorData.comparativeAnalysis} />
            </TabsContent>

            {/* <TabsContent value="recommendations" className="mt-10">
              <RecommendationsTab recommendations={competitorData.recommendations as unknown as Recommendation[]} />
            </TabsContent> */}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitionView;
