import { MarketTrends } from '@/api/research';
import { Badge } from '@/components/ui/badge';
import { Card, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Globe } from 'lucide-react';

interface OverviewProps {
  data: MarketTrends;
}

const Overview = ({ data }: OverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Market Overview Card */}
      <Card className="shadow-md dark:bg-gray-900 border-0 overflow-hidden sm:p-0">
        <div className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Market Overview
          </CardTitle>
        </div>
        <div className="text-sm">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{data.marketOverview?.currentState}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="font-medium text-sm mb-3 text-gray-800 dark:text-gray-200">Key Metrics</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-900/50 py-3 px-1 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">SaaS Market Growth</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Growth
                    </Badge>
                  </div>
                  <p className="font-semibold text-sm">{data.marketOverview?.keyMetrics?.SaaSMarketGrowth}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 py-3 px-1 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">MicroSaaS Market Growth</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Growth
                    </Badge>
                  </div>
                  <p className="font-semibold text-sm">{data.marketOverview?.keyMetrics?.MicroSaaSMarketGrowth}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 py-3 px-1 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">AI Integration Adoption</span>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Adoption</Badge>
                  </div>
                  <p className="font-semibold text-sm">{data.marketOverview?.keyMetrics?.AIIntegrationAdoption}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm mb-3 text-gray-800 dark:text-gray-200">Market Dynamics</h3>
              <div className="bg-gray-50 dark:bg-gray-900/50 py-3 px-1 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Adoption Cycle</span>
                  <div className="capitalize text-gray-500 dark:text-gray-400">
                    {data.marketOverview?.adoptionCycle}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-900/50 py-3 px-1 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Disruption Potential</span>
                    <span className="font-semibold text-sm">
                      {((data.marketOverview?.disruptionPotential || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={(data.marketOverview?.disruptionPotential || 0) * 100} className="h-1.5 mt-2" />
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 py-3 px-1 rounded-lg">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-2">Source Diversity</span>
                  <div className="flex items-center gap-2">
                    <Progress value={(data.metadata.sourceDiversity || 0) * 100} className="h-1.5 flex-1" />
                    <span className="text-sm font-medium">
                      {((data.metadata.sourceDiversity || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium text-sm mb-3 text-gray-800 dark:text-gray-200">Dominant Trends</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {data.marketOverview?.dominantTrends?.map((trend, index) => (
                <div
                  key={index}
                  className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg p-2 flex items-center"
                >
                  <ChevronRight className="w-4 h-4 text-blue-500 mr-1 flex-shrink-0" />
                  <span className="text-xs text-blue-700 dark:text-blue-300">{trend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Overview;
