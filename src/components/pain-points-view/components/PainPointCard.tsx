import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { AlertCircle, ArrowUpRight, ChevronDown, ChevronUp, TrendingUp, Users } from 'lucide-react';
import React from 'react';
import SourceItem from './common/SourceItem';
import Tooltip from './common/Tooltip';

// Define a type for the source item
interface Source {
  url: string;
  date: string;
  platform: string;
  excerpt: string;
  authorType: 'User' | 'Expert' | 'Business' | 'Unknown';
  engagement: {
    upvotes?: number;
    replies?: number;
    shares?: number;
  };
  sentiment: number;
}

// Update the PainPoint interface to use the Source type
interface PainPoint {
  id: string;
  description: string;
  cluster: string;
  intensity: number;
  frequency: 'Ubiquitous' | 'Common' | 'Rare' | 'Occasional';
  confidence: number;
  impact: {
    businessSize?: string[];
    monetaryMentions: string[];
    timeWasted: string[];
  };
  trends?: {
    increasing: boolean;
  };
  existingSolutions: Array<{
    name: string;
    effectiveness: number;
    description: string;
  }>;
  sources: Source[];
}

const PainPointCard = ({ point }: { point: PainPoint }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md dark:hover:border-primary/30 border">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex sm:flex-col items-center sm:items-center gap-2">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                point.intensity >= 4.5
                  ? 'bg-red-100 dark:bg-red-950/50 text-red-500'
                  : point.intensity >= 3.5
                  ? 'bg-orange-100 dark:bg-orange-950/50 text-orange-500'
                  : 'bg-blue-100 dark:bg-blue-950/50 text-blue-500'
              )}
            >
              <AlertCircle className="w-5 h-5" />
            </div>
            <Badge
              variant="outline"
              className={cn(
                'text-xs py-1 px-2 h-auto',
                point.frequency === 'Ubiquitous'
                  ? 'border-red-500/30 text-red-600'
                  : point.frequency === 'Common'
                  ? 'border-orange-500/30 text-orange-600'
                  : 'border-blue-500/30 text-blue-600'
              )}
            >
              {point.frequency}
            </Badge>
          </div>

          <div className="flex-1 space-y-3 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-medium break-words">{point.description}</h3>
                <div className="flex flex-col gap-2 mt-1">
                  <Badge variant="outline" className="text-xs py-1 px-2 w-fit">
                    {point.cluster}
                  </Badge>
                  {point.impact.businessSize && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{point.impact.businessSize.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 p-2 h-auto text-muted-foreground flex-shrink-0"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>

            {isExpanded && (
              <>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 overflow-x-hidden">
                  <div className="space-y-4 min-w-0">
                    {/* <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-sm">
                        <BarChart className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">Impact Analysis</span>
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Tooltip content="Estimated financial impact including potential losses, costs, or revenue impact">
                            <span className="text-muted-foreground whitespace-nowrap">Monetary Impact:</span>
                          </Tooltip>
                          <span className="font-medium text-red-500 break-words">
                            {point.impact.monetaryMentions.join(', ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Tooltip content="Estimated time wasted due to this issue, converted to business impact">
                            <span className="text-muted-foreground whitespace-nowrap">Time Wasted:</span>
                          </Tooltip>
                          <span className="font-medium break-words">{point.impact.timeWasted.join(', ')}</span>
                        </div>
                      </div>
                    </div> */}

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">Trends & Patterns</span>
                      </h4>
                      {point.trends && (
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-xs py-1 px-2',
                              point.trends.increasing
                                ? 'text-green-500 border-green-500/30'
                                : 'text-red-500 border-red-500/30'
                            )}
                          >
                            {point.trends.increasing ? 'Increasing' : 'Decreasing'}
                          </Badge>
                          <Tooltip content="Statistical confidence in the accuracy of this data point">
                            <Badge variant="outline" className="text-xs py-1 px-2">
                              Confidence: {((point.confidence ?? 0) * 100).toFixed(0)}%
                            </Badge>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 min-w-0">
                    {point.existingSolutions.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2 text-sm">
                          <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">Existing Solutions</span>
                        </h4>
                        <div className="space-y-2">
                          {point.existingSolutions.map((solution) => (
                            <div key={solution.name} className="bg-muted/30 rounded p-2">
                              <div className="flex items-center justify-between flex-wrap gap-1">
                                <span className="text-sm font-medium break-words mb-2">{solution.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {((solution.effectiveness ?? 0) * 100).toFixed(0)}% Effective
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-2">{solution.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Supporting Evidence</h4>
                  <div className="grid gap-2">
                    {point.sources.map((source) => (
                      <SourceItem
                        key={source.url}
                        source={{
                          ...source,
                          engagement: {
                            ...source.engagement,
                            upvotes: source.engagement?.upvotes ?? 0,
                          },
                        }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PainPointCard;
