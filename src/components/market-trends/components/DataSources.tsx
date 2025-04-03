import { MarketTrends } from '@/api/research';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface DataSourcesProps {
  data: MarketTrends;
}

const DataSources = ({ data }: DataSourcesProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper function to get credibility badge styling
  const getCredibilityBadgeStyle = (score: number) => {
    if (score >= 0.8) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    } else if (score >= 0.6) {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    } else {
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  const sourceCount = data.metadata?.sources?.length || 0;

  return (
    <Card className="shadow-md dark:bg-gray-900 border-0 overflow-hidden">
      <CardHeader
        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Data Sources ({sourceCount})
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </CardTitle>
      </CardHeader>
      {isOpen && (
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {data.metadata?.sources?.map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col sm:flex-row justify-between gap-2 p-3 rounded-lg border hover:bg-indigo-50 dark:hover:bg-indigo-950/10 transition-colors"
              >
                <div className="flex flex-col max-w-full">
                  <span className="text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm break-words">
                    {source.title}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{source.url}</span>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <Badge variant="outline" className="text-xs capitalize">
                      {source.type}
                    </Badge>
                    <span>{source.publicationDate}</span>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 sm:gap-0 mt-1 sm:mt-0">
                  <Badge className={`text-xs whitespace-nowrap ${getCredibilityBadgeStyle(source.credibilityScore)}`}>
                    {(source.credibilityScore * 100).toFixed(0)}% Credibility
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap sm:mt-1">
                    {(source.relevanceScore * 100).toFixed(0)}% Relevance
                  </span>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DataSources;
