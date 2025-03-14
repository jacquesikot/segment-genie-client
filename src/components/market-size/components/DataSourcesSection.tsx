import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Calendar, ExternalLink } from 'lucide-react';
import { Source } from '../types';
import { ScorePill } from './common/ScorePill';

interface DataSourcesSectionProps {
  sources: Source[];
}

const DataSourcesSection = ({ sources }: DataSourcesSectionProps) => {
  return (
    <Card className="dark:bg-gray-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl dark:text-white">Research Sources</CardTitle>
        <CardDescription className="dark:text-gray-300">Verified market data references</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {sources.map((source, index) => (
            <SourceCard key={index} source={source} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Source Card Component
const SourceCard = ({ source }: { source: Source }) => {
  const publishDate = source.datePublished
    ? new Date(source.datePublished).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      })
    : 'N/A';

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col sm:flex-row sm:justify-between items-start p-4 rounded-lg border dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/10 transition-colors dark:bg-gray-800/50"
    >
      {/* Mobile scores - shown only on small screens */}
      <div className="flex justify-between items-center w-full mb-2 sm:hidden">
        <div className="flex gap-2">
          {source.credibilityScore !== undefined && <ScorePill value={source.credibilityScore} label="Cred" />}
          {source.relevanceScore !== undefined && <ScorePill value={source.relevanceScore} label="Rel" />}
        </div>
        <ExternalLink className="w-4 h-4 opacity-70" />
      </div>

      <div className="space-y-1 w-full">
        <div className="font-medium group-hover:text-indigo-600 dark:text-gray-200 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-2">
          {source.title || 'Unknown Source'}
          <ExternalLink className="w-4 h-4 opacity-70 sm:inline hidden" />
        </div>
        <div className="text-sm text-muted-foreground dark:text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
          {source.publisher && (
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {source.publisher}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {publishDate}
          </span>
        </div>
      </div>

      {/* Desktop scores - hidden on small screens */}
      <div className="hidden sm:flex gap-2 w-full justify-end">
        {source.credibilityScore !== undefined && <ScorePill value={source.credibilityScore} label="Cred" />}
        {source.relevanceScore !== undefined && <ScorePill value={source.relevanceScore} label="Rel" />}
      </div>
    </a>
  );
};

export default DataSourcesSection;
