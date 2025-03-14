import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar } from 'react-chartjs-2';
import ConfidenceIndicator from '../common/ConfidenceIndicator';

interface Competitor {
  category: string;
}

export interface CompetitorData {
  metadata: {
    totalCompetitors: number;
    confidenceScore: number;
    dataFreshness: {
      averageAge: string;
    };
  };
  comparativeAnalysis: {
    marketOverview: {
      entryBarriers: string[];
      keyTrends: string[];
    };
  };
  competitors: Competitor[];
}

interface OverviewTabProps {
  competitorData: CompetitorData;
  analysisDate: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ competitorData, analysisDate }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl">Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm sm:text-base font-medium mb-2">Report Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-2 sm:p-3 rounded-lg">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Total Competitors:</span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{competitorData.metadata.totalCompetitors}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-2 sm:p-3 rounded-lg">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Analysis Date:</span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{analysisDate}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-2 sm:p-3 rounded-lg">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Confidence Score:</span>
                  <div className="mt-1">
                    <ConfidenceIndicator
                      confidence={competitorData.metadata.confidenceScore}
                      tooltip="Overall confidence in competitor analysis"
                      showLabel={true}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-2 sm:p-3 rounded-lg">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Data Freshness:</span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {competitorData.metadata.dataFreshness.averageAge}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-medium mb-2">Entry Barriers</h3>
              <ul className="list-disc pl-4 text-xs sm:text-sm text-muted-foreground">
                {competitorData.comparativeAnalysis.marketOverview.entryBarriers.map((barrier: string, idx: number) => (
                  <li key={idx}>{barrier}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm sm:text-base font-medium mb-2">Key Trends</h3>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg text-xs sm:text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  {competitorData.comparativeAnalysis.marketOverview.keyTrends.map((line: string, idx: number) => (
                    <React.Fragment key={idx}>
                      <span className="text-gray-600 dark:text-gray-400">•</span> {line}
                      {idx < competitorData.comparativeAnalysis.marketOverview.keyTrends.length - 1 && <br />}
                    </React.Fragment>
                  )) || 'Key trends information not available.'}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-medium mb-2">Competitor Distribution</h3>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="h-[140px]">
                  <Bar
                    data={{
                      labels: ['Direct', 'Indirect', 'Potential'],
                      datasets: [
                        {
                          label: 'Competitors',
                          data: [
                            competitorData.competitors.filter((c: Competitor) => c.category.toLowerCase() === 'direct')
                              .length,
                            competitorData.competitors.filter(
                              (c: Competitor) => c.category.toLowerCase() === 'indirect'
                            ).length,
                            competitorData.competitors.filter(
                              (c: Competitor) => c.category.toLowerCase() === 'potential'
                            ).length,
                          ],
                          backgroundColor: ['#F87171', '#FBBF24', '#60A5FA'],
                          borderRadius: 4,
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        y: { beginAtZero: true, grid: { display: false }, ticks: { font: { size: 10 } } },
                        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                      },
                      plugins: {
                        legend: { display: false },
                      },
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewTab;
