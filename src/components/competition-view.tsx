/* eslint-disable @typescript-eslint/no-explicit-any */
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Calendar, ExternalLink, Users } from 'lucide-react';
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { ConfidenceIndicator } from './market-size-view'; // Reuse from sample
import { Status } from '@/api/segment';
import { Competitors } from '@/api/research';
import SegmentLoader from './SegmentLoader';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

interface Props {
  data?: Competitors;
  status: Status;
}

const CompetitorView: React.FC<Props> = ({ data: competitorData, status }) => {
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

  const filteredCompetitors =
    filterCategory === 'All'
      ? competitorData.competitors
      : competitorData.competitors.filter((c: any) => c.category === filterCategory);

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <Card className="shadow-lg dark:bg-gray-900">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-950/50 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-2xl dark:text-white">Competitor Research</CardTitle>
                <CardDescription className="mt-2 dark:text-gray-300">
                  Analysis Date: {analysisDate} · {competitorData.metadata.totalCompetitors} Competitors
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-3">
              <ConfidenceIndicator
                confidence={competitorData.metadata.confidenceScore}
                tooltip="Overall confidence in competitor analysis"
              />
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Data Freshness: {competitorData.metadata.dataFreshness.averageAge}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="competitors">Competitors</TabsTrigger>
              <TabsTrigger value="comparative">Comparative Analysis</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <MetricItem
                        label="TAM"
                        value={competitorData.comparativeAnalysis.marketOverview.totalAddressableMarket}
                      />
                      <MetricItem
                        label="Growth Rate"
                        value={competitorData.comparativeAnalysis.marketOverview.growthRate}
                      />
                      <MetricItem
                        label="Maturity Stage"
                        value={competitorData.comparativeAnalysis.marketOverview.maturityStage}
                      />
                      <div>
                        <h4 className="text-sm font-medium mb-2">Key Trends</h4>
                        <ul className="list-disc pl-4 text-sm text-muted-foreground">
                          {competitorData.comparativeAnalysis.marketOverview.keyTrends.map(
                            (trend: string, idx: number) => (
                              <li key={idx}>{trend}</li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Entry Barriers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-4 text-sm text-muted-foreground">
                      {competitorData.comparativeAnalysis.marketOverview.entryBarriers.map(
                        (barrier: string, idx: number) => (
                          <li key={idx}>{barrier}</li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Competitors Tab */}
            <TabsContent value="competitors">
              <div className="flex justify-end mb-4">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Direct">Direct</SelectItem>
                    <SelectItem value="Indirect">Indirect</SelectItem>
                    <SelectItem value="Potential">Potential</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Accordion type="multiple" className="w-full">
                {filteredCompetitors.map((competitor: any, idx: number) => (
                  <AccordionItem key={idx} value={`competitor-${idx}`} className="border-b">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex justify-between w-full items-center">
                        <div className="flex items-center gap-3">
                          <Badge variant={competitor.category === 'Direct' ? 'default' : 'secondary'}>
                            {competitor.category}
                          </Badge>
                          <span>{competitor.name}</span>
                        </div>
                        <a
                          href={competitor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Product Details</h4>
                          <ul className="list-disc pl-4 text-sm">
                            {competitor.productDetails.keyFeatures.map((feature: string, i: number) => (
                              <li key={i}>{feature}</li>
                            ))}
                          </ul>
                          <h4 className="font-semibold mt-4 mb-2">Unique Selling Points</h4>
                          <ul className="list-disc pl-4 text-sm">
                            {competitor.productDetails.uniqueSellingPoints.map((usp: string, i: number) => (
                              <li key={i}>{usp}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">SWOT Analysis</h4>
                          <Bar
                            data={{
                              labels: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'],
                              datasets: [
                                {
                                  label: 'Count',
                                  data: [
                                    competitor.swotAnalysis.strengths.length,
                                    competitor.swotAnalysis.weaknesses.length,
                                    competitor.swotAnalysis.opportunities.length,
                                    competitor.swotAnalysis.threats.length,
                                  ],
                                  backgroundColor: ['#34D399', '#F87171', '#60A5FA', '#FBBF24'],
                                },
                              ],
                            }}
                            options={{ scales: { y: { beginAtZero: true } } }}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Customer Satisfaction</h4>
                        <Progress value={competitor.customerInsights.satisfaction.overallScore * 10} className="h-2" />
                        <p className="text-sm mt-1">
                          Score: {competitor.customerInsights.satisfaction.overallScore}/10
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            {/* Comparative Analysis Tab */}
            <TabsContent value="comparative">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Feature Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="p-2 text-left">Feature</th>
                            <th className="p-2 text-left">Importance</th>
                            <th className="p-2 text-left">Competitors</th>
                          </tr>
                        </thead>
                        <tbody>
                          {competitorData.comparativeAnalysis.featureComparison.map((feature: any, idx: number) => (
                            <tr key={idx} className="border-b">
                              <td className="p-2">{feature.feature}</td>
                              <td className="p-2">{feature.importance}</td>
                              <td className="p-2">
                                {feature.competitors.map((comp: any, i: number) => (
                                  <div key={i}>
                                    <strong>{comp.name}</strong>: {comp.implementation} ({comp.notes})
                                  </div>
                                ))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Opportunity Spaces</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple">
                      {competitorData.comparativeAnalysis.opportunitySpaces.map((space: any, idx: number) => (
                        <AccordionItem key={idx} value={`space-${idx}`}>
                          <AccordionTrigger>{space.description}</AccordionTrigger>
                          <AccordionContent>
                            <p>Potential Size: {space.potentialSize}</p>
                            <p>Entry Difficulty: {space.entryDifficulty}</p>
                            <p>Time to Market: {space.timeToMarket}</p>
                            <ul className="list-disc pl-4">
                              {space.unservedNeeds.map((need: string, i: number) => (
                                <li key={i}>{need}</li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations">
              <div className="grid gap-4">
                {competitorData.recommendations.map((rec: any, idx: number) => (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex justify-between">
                        <CardTitle>{rec.recommendation}</CardTitle>
                        <Badge variant={rec.priority === 'high' ? 'default' : 'secondary'}>{rec.priority}</Badge>
                      </div>
                      <CardDescription>{rec.rationale}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">Resources: {rec.resourceRequirements}</p>
                      <ul className="list-disc pl-4 text-sm mt-2">
                        {rec.risks.map((risk: string, i: number) => (
                          <li key={i}>{risk}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Simple Metric Item
const MetricItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm">
    <span className="font-medium">{label}</span>
    <span>{value}</span>
  </div>
);

export default CompetitorView;
