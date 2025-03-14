import { MarketTrends } from '@/api/research';
import { Badge } from '@/components/ui/badge';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { BarChart2, Calendar, TrendingUp } from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface HeaderProps {
  data: MarketTrends;
}

const Header = ({ data }: HeaderProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/50 p-2 sm:p-3 rounded-lg shadow-sm">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold dark:text-white">Market Trends Analysis</CardTitle>
            <CardDescription className="mt-1 sm:mt-2 dark:text-gray-300 text-xs sm:text-sm">
              {data.currentTrends?.length} Trends Analyzed • {formatDate(data.metadata.analysisDate)}
            </CardDescription>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/20"
          >
            <Calendar className="w-3 h-3 mr-1" />
            Data as of {data.metadata.dataFreshness?.mostRecent}
          </Badge>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/20"
          >
            <BarChart2 className="w-3 h-3 mr-1" />
            {(data.metadata.confidenceScore * 100).toFixed(0)}% Confidence
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Header;
