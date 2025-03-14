import { MarketTrends } from '@/api/research';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface DataSourcesProps {
  data: MarketTrends;
}

const DataSources = ({ data }: DataSourcesProps) => {
  return (
    <Card className="shadow-md border-0 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-blue-500" />
          Data Sources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.metadata?.sources?.map((source, index) => (
            <a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between items-center p-2 rounded-lg border hover:bg-blue-50 dark:hover:bg-blue-950/10 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm truncate max-w-[280px]">
                  {source.url.replace(/(https?:\/\/)?(www\.)?/, '')}
                </span>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <Badge variant="outline" className="text-xs capitalize">
                    {source.type}
                  </Badge>
                  <span>{source.publicationDate}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Badge
                  className={`text-xs ${
                    source.credibilityScore >= 0.8
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : source.credibilityScore >= 0.6
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {(source.credibilityScore * 100).toFixed(0)}% Credibility
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {(source.relevanceScore * 100).toFixed(0)}% Relevance
                </span>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSources;
