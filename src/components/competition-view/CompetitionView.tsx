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
import OverviewTab from './tabs/OverviewTab';
import CompetitorsTab from './tabs/CompetitorsTab';
import ComparativeTab from './tabs/ComparativeTab';
import RecommendationsTab from './tabs/RecommendationsTab';

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
    <div className="space-y-6 px-2">
      <Card className="shadow-lg dark:bg-gray-900 border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 pb-4 sm:pb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 sm:p-3 rounded-lg shadow-sm">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-bold dark:text-white">Competitor Research</CardTitle>
                  <CardDescription className="mt-1 sm:mt-2 dark:text-gray-300 text-xs sm:text-sm">
                    {competitorData.metadata.totalCompetitors} Competitors Analyzed
                  </CardDescription>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4 sm:mb-6 w-full grid grid-cols-2 sm:grid-cols-4 gap-1">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="competitors" className="text-xs sm:text-sm">
                Competitors
              </TabsTrigger>
              <TabsTrigger value="comparative" className="text-xs sm:text-sm">
                Comparison
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="text-xs sm:text-sm">
                Recommendations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-10">
              <OverviewTab competitorData={competitorData} analysisDate={analysisDate} />
            </TabsContent>

            <TabsContent value="competitors" className="mt-10">
              <CompetitorsTab
                competitors={filteredCompetitors}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
              />
            </TabsContent>

            <TabsContent value="comparative" className="mt-10">
              <ComparativeTab comparativeAnalysis={competitorData.comparativeAnalysis} />
            </TabsContent>

            <TabsContent value="recommendations" className="mt-10">
              <RecommendationsTab recommendations={competitorData.recommendations} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitionView;
