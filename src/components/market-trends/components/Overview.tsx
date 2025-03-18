import { MarketTrends } from '@/api/research';
import { Card, CardTitle } from '@/components/ui/card';
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
