import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle,
  ArrowDownUp,
  BarChart4,
  Building2,
  Clock,
  FlaskConical,
  Info,
  LineChart,
  Target,
  TrendingUp,
} from 'lucide-react';
import { MarketSize } from '../types';
import { getMaturityStyles } from '../utils';
import { ConfidenceIndicator } from './common/ConfidenceIndicator';
import { MetricCard } from './common/MetricCard';
import { MetricItem } from './common/MetricItem';

interface MarketOverviewProps {
  marketSize: MarketSize;
}

const MarketOverview = ({ marketSize }: MarketOverviewProps) => {
  const industry = marketSize.marketAnalysis?.industry || {};
  const analysisDate = marketSize.metadata?.analysisDate
    ? new Date(marketSize.metadata.analysisDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  const maturityInfo = getMaturityStyles(industry.industryMaturity || marketSize.metadata?.marketMaturity || 'growing');
  const tam = marketSize.marketAnalysis?.tam || {};
  const som = marketSize.marketAnalysis?.som || {};

  // Render the appropriate icon based on maturity
  const renderMaturityIcon = () => {
    switch (maturityInfo.icon) {
      case 'LineChart':
        return <LineChart className={`w-5 h-5 ${maturityInfo.iconColor}`} />;
      case 'TrendingUp':
        return <TrendingUp className={`w-5 h-5 ${maturityInfo.iconColor}`} />;
      case 'BarChart4':
        return <BarChart4 className={`w-5 h-5 ${maturityInfo.iconColor}`} />;
      case 'ArrowDownUp':
        return <ArrowDownUp className={`w-5 h-5 ${maturityInfo.iconColor}`} />;
      default:
        return <Info className={`w-5 h-5 ${maturityInfo.iconColor}`} />;
    }
  };

  return (
    <Card className="shadow-lg dark:bg-gray-900 max-w-full overflow-hidden">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-indigo-100 dark:bg-indigo-950/50 p-3 rounded-lg flex-shrink-0">
              <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-2xl dark:text-white break-words">Market Analysis</CardTitle>
              <CardDescription className="mt-2 dark:text-gray-300 break-words">
                {industry.primaryIndustry || 'Industry'} · Last updated: {analysisDate}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5">
              {renderMaturityIcon()}
              <span className={`text-sm font-medium capitalize ${maturityInfo.color} break-words`}>
                {industry.industryMaturity || marketSize.metadata?.marketMaturity || 'Growing'} Market
              </span>
            </div>
            <ConfidenceIndicator
              confidence={marketSize.metadata?.dataQuality?.score || 50}
              tooltip="Confidence in market data quality"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 w-full grid grid-cols-3 gap-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="industry" className="text-xs sm:text-sm">
              Industry
            </TabsTrigger>
            <TabsTrigger value="limitations" className="text-xs sm:text-sm">
              Limitations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <MetricCard
                icon={<Target className="w-4 h-4" />}
                label="Market Focus"
                value={industry.primaryIndustry || 'N/A'}
              />
              <MetricCard
                icon={<Clock className="w-4 h-4" />}
                label="Time to Market"
                value={som.timeToAchieve ? `${som.timeToAchieve} years` : 'N/A'}
              />
              <MetricCard
                icon={<TrendingUp className="w-4 h-4" />}
                label="Growth Rate"
                value={tam.growthRate ? `${tam.growthRate}% Annually` : 'N/A'}
              />
            </div>
          </TabsContent>

          <TabsContent value="industry">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 min-w-0">
                <h3 className="font-semibold text-lg dark:text-white break-words">Industry Classification</h3>

                <div>
                  <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 break-words">
                    Sub-Industries
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(industry.subIndustries || []).map((subIndustry, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-3 py-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 break-words"
                      >
                        {subIndustry}
                      </Badge>
                    ))}
                    {!industry.subIndustries?.length && (
                      <span className="text-sm text-gray-500">No sub-industries available</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 break-words">
                    Related Industries
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(industry.relatedIndustries || []).map((relatedIndustry, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 break-words"
                      >
                        {relatedIndustry}
                      </Badge>
                    ))}
                    {!industry.relatedIndustries?.length && (
                      <span className="text-sm text-gray-500">No related industries available</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border dark:border-gray-700 min-w-0">
                <h4 className="font-semibold mb-4 dark:text-white break-words">Industry Analysis</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 break-words">
                      Key Trends
                    </h5>
                    <ul className="space-y-1 pl-4 text-sm text-muted-foreground dark:text-gray-400">
                      {(industry.keyTrends || []).map((trend, index) => (
                        <li key={index} className="list-disc break-words">
                          {trend}
                        </li>
                      ))}
                      {!industry.keyTrends?.length && (
                        <li className="list-disc break-words">No key trends available</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 break-words">
                      Regulatory Factors
                    </h5>
                    <ul className="space-y-1 pl-4 text-sm text-muted-foreground dark:text-gray-400">
                      {(industry.regulatoryFactors || []).map((factor, index) => (
                        <li key={index} className="list-disc break-words">
                          {factor}
                        </li>
                      ))}
                      {!industry.regulatoryFactors?.length && (
                        <li className="list-disc break-words">No regulatory factors available</li>
                      )}
                    </ul>
                  </div>

                  <MetricItem
                    label="Data Quality"
                    value={marketSize.metadata?.dataQuality?.score || 0}
                    icon={<FlaskConical className="w-4 h-4" />}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="limitations">
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-medium text-amber-800 dark:text-amber-300 break-words">Data Limitations</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1 break-words">
                    Consider these factors when using the market analysis
                  </p>
                </div>
              </div>

              <ul className="space-y-2 pl-9">
                {(marketSize.metadata?.dataQuality?.limitations || []).map((limitation, index) => (
                  <li key={index} className="text-sm text-amber-700 dark:text-amber-400 list-disc break-words">
                    {limitation}
                  </li>
                ))}
                {!marketSize.metadata?.dataQuality?.limitations?.length && (
                  <li className="text-sm text-amber-700 dark:text-amber-400 list-disc break-words">
                    No specific limitations documented
                  </li>
                )}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketOverview;
