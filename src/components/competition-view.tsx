/* eslint-disable @typescript-eslint/no-explicit-any */
import { Competitors } from '@/api/research';
import { Status } from '@/api/segment';
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
import { ExternalLink, Users } from 'lucide-react';
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
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
      ? [...competitorData.competitors].sort((a, b) => {
          const order = { direct: 0, indirect: 1, potential: 2 };
          return (
            order[a.category?.toLowerCase() as keyof typeof order] -
            order[b.category?.toLowerCase() as keyof typeof order]
          );
        })
      : competitorData.competitors.filter((c: any) => c.category === filterCategory);

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
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                              {competitorData.metadata.totalCompetitors}
                            </p>
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
                          {competitorData.comparativeAnalysis.marketOverview.entryBarriers.map(
                            (barrier: string, idx: number) => (
                              <li key={idx}>{barrier}</li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm sm:text-base font-medium mb-2">Key Trends</h3>
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg text-xs sm:text-sm">
                          <p className="text-gray-600 dark:text-gray-400">
                            {competitorData.comparativeAnalysis.marketOverview.keyTrends.map(
                              (line: string, idx: number) => (
                                <React.Fragment key={idx}>
                                  <span className="text-gray-600 dark:text-gray-400">•</span> {line}
                                  {idx < competitorData.comparativeAnalysis.marketOverview.keyTrends.length - 1 && (
                                    <br />
                                  )}
                                </React.Fragment>
                              )
                            ) || 'Key trends information not available.'}
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
                                      competitorData.competitors.filter(
                                        (c: any) => c.category.toLowerCase() === 'direct'
                                      ).length,
                                      competitorData.competitors.filter(
                                        (c: any) => c.category.toLowerCase() === 'indirect'
                                      ).length,
                                      competitorData.competitors.filter(
                                        (c: any) => c.category.toLowerCase() === 'potential'
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
            </TabsContent>

            <TabsContent value="competitors" className="mt-10">
              <div className="flex justify-end mb-4 sm:mb-6">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="max-w-[180px] w-full border border-gray-200 shadow-sm">
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Competitors</SelectItem>
                    <SelectItem value="Direct">Direct Competitors</SelectItem>
                    <SelectItem value="Indirect">Indirect Competitors</SelectItem>
                    <SelectItem value="Potential">Potential Competitors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Accordion type="multiple" className="w-full space-y-3 sm:space-y-4">
                {filteredCompetitors.map((competitor: any, idx: number) => (
                  <AccordionItem
                    key={idx}
                    value={`competitor-${idx}`}
                    className="border rounded-lg shadow-sm overflow-hidden bg-white dark:bg-gray-950"
                  >
                    <AccordionTrigger className="hover:no-underline px-3 py-2 sm:px-4 sm:py-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between w-full items-start sm:items-center gap-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Badge
                            variant={competitor.category.toLowerCase() === 'direct' ? 'default' : 'secondary'}
                            className={`text-xs sm:text-sm ${
                              competitor.category.toLowerCase() === 'direct'
                                ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                                : competitor.category.toLowerCase() === 'indirect'
                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}
                          >
                            {competitor.category.charAt(0).toUpperCase() + competitor.category.slice(1).toLowerCase()}
                          </Badge>
                          <span className="font-semibold text-sm sm:text-base">{competitor.name}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                          <ConfidenceIndicator
                            confidence={competitor.analysisConfidence}
                            tooltip={`Analysis confidence for ${competitor.name}`}
                            showLabel
                          />
                          <a
                            href={competitor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center gap-1.5 text-xs border border-blue-200 dark:border-blue-800/50 shadow-sm"
                          >
                            <span>View product</span>
                            <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </a>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 sm:px-4 pb-4 sm:pb-6 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                        <div className="space-y-4 sm:space-y-8">
                          <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Company Profile
                            </h4>
                            <div className="text-xs sm:text-sm space-y-2 sm:space-y-3">
                              <CompanyProfileItem
                                label="Founded"
                                value={competitor.companyProfile.foundedYear || 'N/A'}
                              />
                              <CompanyProfileItem
                                label="HQ"
                                value={competitor.companyProfile.headquartersLocation || 'Not specified'}
                              />
                              <CompanyProfileItem
                                label="Employees"
                                value={competitor.companyProfile.employeeCount || 'Not specified'}
                              />
                              <CompanyProfileItem
                                label="Funding"
                                value={`${competitor.companyProfile.fundingStatus || 'Not available'} (${
                                  competitor.companyProfile.lastFundingAmount || 'N/A'
                                })`}
                              />
                              {competitor.companyProfile.keyExecutives.length > 0 && (
                                <CompanyProfileItem
                                  label="Key Executives"
                                  value={competitor.companyProfile.keyExecutives.join(', ')}
                                />
                              )}
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              Market Position
                            </h4>
                            <div className="text-xs sm:text-sm space-y-2 sm:space-y-3">
                              <MarketPositionItem
                                label="Target Markets"
                                value={competitor.marketPosition.targetMarkets.join(', ')}
                              />
                              <MarketPositionItem
                                label="Geographic Presence"
                                value={competitor.marketPosition.geographicPresence.join(', ')}
                              />
                              <MarketPositionItem
                                label="Market Share"
                                value={competitor.marketPosition.marketShare || 'Not available'}
                              />
                              <MarketPositionItem
                                label="Growth Rate"
                                value={competitor.marketPosition.growthRate || 'Not available'}
                              />
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Product Details
                            </h4>
                            <div className="text-xs sm:text-sm space-y-3 sm:space-y-4">
                              <ProductDetailSection
                                title="Main Products"
                                items={competitor.productDetails.mainProducts}
                              />
                              <ProductDetailSection
                                title="Key Features"
                                items={competitor.productDetails.keyFeatures}
                              />
                              <ProductDetailSection
                                title="USPs"
                                items={competitor.productDetails.uniqueSellingPoints}
                              />
                              {competitor.productDetails.technologiesUsed.length > 0 && (
                                <div>
                                  <span className="font-medium text-gray-700 dark:text-gray-300">Technologies:</span>{' '}
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {competitor.productDetails.technologiesUsed.map((tech: string, i: number) => (
                                      <span
                                        key={i}
                                        className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 sm:space-y-8">
                          <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                              SWOT Analysis
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                              <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 p-2 sm:p-3 rounded-lg">
                                <h5 className="font-medium text-green-800 dark:text-green-300 flex items-center gap-2 mb-1 sm:mb-2 text-xs sm:text-sm">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  Strengths ({competitor.swotAnalysis.strengths.length})
                                </h5>
                                <div className="max-h-32 sm:max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                  <ul className="list-disc pl-4 text-xs space-y-1">
                                    {competitor.swotAnalysis.strengths.map((item: any, i: number) => (
                                      <li key={i} className="text-green-700 dark:text-green-400">
                                        <span className="font-medium">{item.point}</span>
                                        <div className="text-[10px] sm:text-xs text-green-600/80 dark:text-green-400/80 mt-0.5">
                                          {item.impact} <span className="italic">({item.evidence})</span>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 p-2 sm:p-3 rounded-lg">
                                <h5 className="font-medium text-red-800 dark:text-red-300 flex items-center gap-2 mb-1 sm:mb-2 text-xs sm:text-sm">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  Weaknesses ({competitor.swotAnalysis.weaknesses.length})
                                </h5>
                                <div className="max-h-32 sm:max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                  <ul className="list-disc pl-4 text-xs space-y-1">
                                    {competitor.swotAnalysis.weaknesses.map((item: any, i: number) => (
                                      <li key={i} className="text-red-700 dark:text-red-400">
                                        <span className="font-medium">{item.point}</span>
                                        <div className="text-[10px] sm:text-xs text-red-600/80 dark:text-red-400/80 mt-0.5">
                                          {item.impact} <span className="italic">({item.evidence})</span>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 p-2 sm:p-3 rounded-lg">
                                <h5 className="font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-1 sm:mb-2 text-xs sm:text-sm">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  Opportunities ({competitor.swotAnalysis.opportunities.length})
                                </h5>
                                <div className="max-h-32 sm:max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                  <ul className="list-disc pl-4 text-xs space-y-1">
                                    {competitor.swotAnalysis.opportunities.map((item: any, i: number) => (
                                      <li key={i} className="text-blue-700 dark:text-blue-400">
                                        <span className="font-medium">{item.point}</span>
                                        <div className="text-[10px] sm:text-xs text-blue-600/80 dark:text-blue-400/80 mt-0.5">
                                          {item.impact} <span className="italic">({item.evidence})</span>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 p-2 sm:p-3 rounded-lg">
                                <h5 className="font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-1 sm:mb-2 text-xs sm:text-sm">
                                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                  Threats ({competitor.swotAnalysis.threats.length})
                                </h5>
                                <div className="max-h-32 sm:max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                  <ul className="list-disc pl-4 text-xs space-y-1">
                                    {competitor.swotAnalysis.threats.map((item: any, i: number) => (
                                      <li key={i} className="text-amber-700 dark:text-amber-400">
                                        <span className="font-medium">{item.point}</span>
                                        <div className="text-[10px] sm:text-xs text-amber-600/80 dark:text-amber-400/80 mt-0.5">
                                          {item.impact} <span className="italic">({item.evidence})</span>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                              <h5 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                SWOT Distribution
                              </h5>
                              <div className="h-[100px] sm:h-[120px]">
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
                                        borderRadius: 4,
                                      },
                                    ],
                                  }}
                                  options={{
                                    scales: {
                                      y: { beginAtZero: true, grid: { display: false }, ticks: { font: { size: 8 } } },
                                      x: { grid: { display: false }, ticks: { font: { size: 8 } } },
                                    },
                                    plugins: {
                                      legend: { display: false },
                                      tooltip: {
                                        callbacks: {
                                          label: function (context) {
                                            return `Count: ${context.raw}`;
                                          },
                                        },
                                      },
                                    },
                                    maintainAspectRatio: false,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-8 space-y-4 sm:space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                          <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                              Pricing Strategy
                            </h4>
                            <div className="text-xs sm:text-sm space-y-2 sm:space-y-3">
                              <PricingItem label="Model" value={competitor.pricingStrategy.model || 'Not specified'} />
                              {competitor.pricingStrategy.pricePoints.length > 0 && (
                                <div>
                                  <span className="font-medium text-gray-700 dark:text-gray-300">Price Points:</span>
                                  <ul className="list-disc pl-4 mt-1 sm:mt-2 space-y-1">
                                    {competitor.pricingStrategy.pricePoints.map((price: string, i: number) => (
                                      <li key={i} className="text-gray-600 dark:text-gray-400">
                                        {price}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              <PricingItem label="Value" value={competitor.pricingStrategy.comparativeValue} />
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                              Customer Insights
                            </h4>
                            <div className="text-xs sm:text-sm space-y-3 sm:space-y-4">
                              <div>
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-gray-700 dark:text-gray-300">
                                    Satisfaction Score:
                                  </span>
                                  <span className="font-bold text-base sm:text-lg">
                                    {competitor.customerInsights.satisfaction.overallScore || 'N/A'}
                                    <span className="text-[10px] sm:text-xs text-gray-500">/10</span>
                                  </span>
                                </div>
                                <Progress
                                  value={competitor.customerInsights.satisfaction.overallScore * 10}
                                  className="h-1.5 sm:h-2 mt-1 sm:mt-2"
                                />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                                <CustomerThemeSection
                                  title="Positive Themes"
                                  items={competitor.customerInsights.satisfaction.positiveThemes}
                                  type="positive"
                                />
                                <CustomerThemeSection
                                  title="Negative Themes"
                                  items={competitor.customerInsights.satisfaction.negativeThemes}
                                  type="negative"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                          <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            Pain Points & Switching Costs
                          </h4>
                          <div className="text-xs sm:text-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  Customer Pain Points:
                                </span>
                                <ul className="list-disc pl-4 mt-1 sm:mt-2 space-y-1">
                                  {competitor.customerInsights.painPoints.map((pain: string, i: number) => (
                                    <li key={i} className="text-gray-600 dark:text-gray-400">
                                      {pain}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-amber-50 dark:bg-amber-900/20 p-2 sm:p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
                                <span className="font-medium text-amber-800 dark:text-amber-300">Switching Costs:</span>
                                <p className="mt-1 sm:mt-2 text-amber-700 dark:text-amber-400">
                                  {competitor.customerInsights.switchingCosts || 'Not assessed'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {competitor.recentDevelopments.length > 0 && (
                          <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                              Recent Developments
                            </h4>
                            <div className="text-xs sm:text-sm space-y-3 sm:space-y-4">
                              <div className="relative pl-4 sm:pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-4 sm:space-y-6">
                                {competitor.recentDevelopments.map((dev: any, i: number) => (
                                  <div key={i} className="relative">
                                    <div className="absolute -left-[19px] sm:-left-[25px] w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-blue-500"></div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200 text-xs sm:text-sm">
                                      {new Date(dev.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                      })}
                                      : {dev.development}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs">{dev.significance}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                          <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                            Sources
                          </h4>
                          <div className="grid gap-2">
                            {competitor.sources.map((source: any, i: number) => (
                              <a
                                key={i}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-2 sm:p-3 rounded-lg border hover:bg-blue-50 dark:hover:bg-blue-950/10 transition-colors"
                              >
                                <span className="text-blue-600 dark:text-blue-400 break-all sm:truncate sm:max-w-[70%] text-xs sm:text-sm">
                                  {source.url}
                                </span>
                                <Badge
                                  className={`mt-1 sm:mt-0 text-xs ${
                                    source.relevance >= 0.8
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                      : source.relevance >= 0.5
                                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                  }`}
                                >
                                  {(source.relevance * 100).toFixed(0)}% Relevance
                                </Badge>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="comparative" className="mt-10">
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg sm:text-xl">Feature Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      {/* Mobile view (card-based layout) */}
                      <div className="md:hidden space-y-4">
                        {competitorData.comparativeAnalysis.featureComparison.map((feature: any, idx: number) => (
                          <div key={idx} className="border rounded-lg p-3 shadow-sm bg-white dark:bg-gray-950">
                            <div className="flex flex-col mb-2">
                              <h4 className="font-semibold text-sm">{feature.feature}</h4>
                              <h4 className="text-xs mt-1">{feature.importance}</h4>
                            </div>
                            <div className="space-y-2 mt-3">
                              {feature.competitors.map((comp: any, i: number) => (
                                <div key={i} className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-md">
                                  <div className="flex flex-col">
                                    <span className="font-medium text-xs">{comp.name}</span>
                                    <span className="text-xs italic mt-1">{comp.implementation}</span>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{comp.notes}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop view (table layout) */}
                      <table className="w-full text-xs sm:text-sm hidden md:table">
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
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg sm:text-xl">Opportunity Spaces</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple">
                      {competitorData.comparativeAnalysis.opportunitySpaces.map((space: any, idx: number) => (
                        <AccordionItem key={idx} value={`space-${idx}`}>
                          <AccordionTrigger className="text-sm sm:text-base">{space.description}</AccordionTrigger>
                          <AccordionContent className="text-xs sm:text-sm mt-2">
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

            <TabsContent value="recommendations" className="mt-10">
              <div className="grid gap-4 sm:gap-6">
                {competitorData.recommendations.map((rec: any, idx: number) => (
                  <Card
                    key={idx}
                    className="overflow-hidden border-l-4 transition-all hover:shadow-md"
                    style={{
                      borderLeftColor:
                        rec.priority === 'high'
                          ? 'rgb(248, 113, 113)'
                          : rec.priority === 'medium'
                          ? 'rgb(251, 191, 36)'
                          : 'rgb(96, 165, 250)',
                    }}
                  >
                    <CardHeader className="pb-2 sm:pb-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <CardTitle className="text-base sm:text-lg">{rec.recommendation}</CardTitle>
                        <Badge
                          variant="outline"
                          className={`text-xs px-2 py-0.5 ${
                            rec.priority === 'high'
                              ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/10 dark:text-red-300 dark:border-red-800/20'
                              : rec.priority === 'medium'
                              ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/10 dark:text-amber-300 dark:border-amber-800/20'
                              : 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/10 dark:text-blue-300 dark:border-blue-800/20'
                          }`}
                        >
                          {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                        </Badge>
                      </div>
                      <CardDescription className="text-xs sm:text-sm mt-2">{rec.rationale}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Resources Required
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-900/30 p-2 sm:p-3 rounded-lg text-xs sm:text-sm">
                              {rec.resourceRequirements}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Implementation Timeline
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-900/30 p-2 sm:p-3 rounded-lg text-xs sm:text-sm">
                              {rec.timeline || 'Not specified'}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Potential Risks
                          </h4>
                          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/20 p-2 sm:p-3 rounded-lg">
                            <ul className="list-disc pl-4 text-xs sm:text-sm space-y-1 text-red-600 dark:text-red-300">
                              {rec.risks.map((risk: string, i: number) => (
                                <li key={i}>{risk}</li>
                              ))}
                            </ul>
                          </div>

                          {rec.benefits && rec.benefits.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Expected Benefits
                              </h4>
                              <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/20 p-2 sm:p-3 rounded-lg">
                                <ul className="list-disc pl-4 text-xs sm:text-sm space-y-1 text-green-600 dark:text-green-300">
                                  {rec.benefits.map((benefit: string, i: number) => (
                                    <li key={i}>{benefit}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {rec.competitiveAdvantage && (
                        <div className="mt-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20 p-2 sm:p-3 rounded-lg">
                          <h4 className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-300 mb-1">
                            Competitive Advantage
                          </h4>
                          <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-300">
                            {rec.competitiveAdvantage}
                          </p>
                        </div>
                      )}
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

// Helper Components
const CompanyProfileItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-baseline">
    <span className="font-medium text-gray-700 dark:text-gray-300 w-full sm:w-20 text-xs sm:text-sm">{label}:</span>
    <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{value}</span>
  </div>
);

const MarketPositionItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-baseline">
    <span className="font-medium text-gray-700 dark:text-gray-300 w-full sm:w-28 text-xs sm:text-sm">{label}:</span>
    <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{value}</span>
  </div>
);

const PricingItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-baseline">
    <span className="font-medium text-gray-700 dark:text-gray-300 w-full sm:w-16 text-xs sm:text-sm">{label}:</span>
    <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{value}</span>
  </div>
);

const ProductDetailSection = ({ title, items }: { title: string; items: string[] }) => (
  <div>
    <span className="font-medium text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{title}:</span>
    <ul className="list-disc pl-4 mt-1 sm:mt-2 space-y-1">
      {items.map((item: string, i: number) => (
        <li key={i} className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const CustomerThemeSection = ({
  title,
  items,
  type,
}: {
  title: string;
  items: string[];
  type: 'positive' | 'negative';
}) => (
  <div
    className={`p-2 sm:p-3 rounded-lg ${
      type === 'positive'
        ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30'
        : 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30'
    }`}
  >
    <span
      className={`font-medium text-xs sm:text-sm ${
        type === 'positive' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
      }`}
    >
      {title}:
    </span>
    <ul className="list-disc pl-4 mt-1 sm:mt-2 space-y-1">
      {items.map((theme: string, i: number) => (
        <li
          key={i}
          className={`text-xs sm:text-sm ${
            type === 'positive' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
          }`}
        >
          {theme}
        </li>
      ))}
    </ul>
  </div>
);

// Update the ConfidenceIndicator component to accept a showLabel prop
const ConfidenceIndicator = ({
  confidence,
  tooltip,
  showLabel = false,
}: {
  confidence: number;
  tooltip: string;
  showLabel?: boolean;
}) => {
  let color = 'bg-red-500';
  let textColor = 'text-red-700 dark:text-red-400';
  let bgColor = 'bg-red-100 dark:bg-red-900/30';

  if (confidence >= 0.8) {
    color = 'bg-green-500';
    textColor = 'text-green-700 dark:text-green-400';
    bgColor = 'bg-green-100 dark:bg-green-900/30';
  } else if (confidence >= 0.6) {
    color = 'bg-amber-500';
    textColor = 'text-amber-700 dark:text-amber-400';
    bgColor = 'bg-amber-100 dark:bg-amber-900/30';
  } else if (confidence >= 0.4) {
    color = 'bg-orange-500';
    textColor = 'text-orange-700 dark:text-orange-400';
    bgColor = 'bg-orange-100 dark:bg-orange-900/30';
  }

  return (
    <div className={`flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 ${bgColor} rounded-full shadow-sm`}>
      <div className="flex items-center gap-1">
        <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${color}`}></div>
        <span className={`text-xs sm:text-sm font-medium ${textColor}`} title={tooltip}>
          {showLabel ? `${(confidence * 100).toFixed(0)}%` : 'Confidence'}
        </span>
      </div>
    </div>
  );
};

export default CompetitorView;
