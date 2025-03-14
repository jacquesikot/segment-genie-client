import { MarketTrends } from '@/api/research';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { BarChart2, Calendar, TrendingUp } from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface HeaderProps {
  data: MarketTrends;
}

const Header = ({ data }: HeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="bg-indigo-100 dark:bg-indigo-950/50 p-3 rounded-lg flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-2xl dark:text-white break-words">Market Trends Analysis</CardTitle>
            <CardDescription className="mt-2 dark:text-gray-300 break-words">
              {data.currentTrends?.length} Trends Analyzed · Last updated: {formatDate(data.metadata.analysisDate)}
            </CardDescription>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center px-2.5 py-1 text-sm text-blue-700 dark:text-blue-300 rounded">
            <Calendar className="w-3 h-3 mr-1" />
            Data as of {data.metadata.dataFreshness?.mostRecent}
          </div>
          <div className="flex items-center px-2.5 py-1 text-sm text-green-700 dark:text-green-300 rounded">
            <BarChart2 className="w-3 h-3 mr-1" />
            {(data.metadata.confidenceScore * 100).toFixed(0)}% Confidence
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
