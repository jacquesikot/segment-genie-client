/* eslint-disable @typescript-eslint/no-explicit-any */
import { PainPoints } from '@/api/research';
import { Status } from '@/api/segment';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  ArrowUpRight,
  BarChart,
  Brain,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Flame,
  Frown,
  Info,
  Link2,
  Meh,
  SmilePlus,
  TrendingUp,
  Users,
} from 'lucide-react';
import React from 'react';
import SegmentLoader from './SegmentLoader';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';

const SentimentIndicator = ({ score }: any) => {
  const getSentimentInfo = (score: any) => {
    if (score >= 0.3) return { icon: SmilePlus, color: 'text-green-500', text: 'Positive' };
    if (score <= -0.3) return { icon: Frown, color: 'text-red-500', text: 'Negative' };
    return { icon: Meh, color: 'text-yellow-500', text: 'Neutral' };
  };

  const { icon: Icon, color, text } = getSentimentInfo(score);

  return (
    <div className="flex items-center gap-3 p-4 bg-background rounded-lg border">
      <Icon className={`w-6 h-6 ${color}`} />
      <div className="space-y-1">
        <div className="text-sm font-medium">{text} Sentiment</div>
        <div className="flex items-center gap-2">
          <Progress value={(score + 1) * 50} className="w-24 h-2" />
          <span className="text-xs font-mono text-muted-foreground">{score.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

const PlatformBreakdown = ({ platforms }: any) => (
  <div className="space-y-3">
    {platforms.map((platform: any) => (
      <div key={platform.platform} className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm w-32">
          <span className="text-muted-foreground">{platform.platform}</span>
          <span className="text-muted-foreground/70">({platform.sourceCount})</span>
        </div>
        <div className="flex-1">
          <Progress
            value={(platform.sourceCount / Math.max(...platforms.map((p: any) => p.sourceCount))) * 100}
            className="h-2"
            // indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
          />
        </div>
      </div>
    ))}
  </div>
);

const ClusterChip = ({ cluster }: any) => (
  <div className="p-3 bg-background rounded-lg border">
    <div className="flex items-center gap-2 mb-2">
      <Flame className="w-4 h-4 text-orange-500" />
      <h4 className="font-medium text-sm">{cluster.clusterName}</h4>
    </div>
    <p className="text-sm text-muted-foreground mb-3">{cluster.description}</p>
    <div className="flex flex-wrap gap-2">
      {cluster.relatedPainPoints.map((point: any) => (
        <Badge key={point} variant="outline" className="text-xs py-1 px-2 font-normal">
          {point}
        </Badge>
      ))}
    </div>
  </div>
);

const SourceItem = ({ source }: any) => (
  <div className="group bg-background rounded-lg border p-3 hover:border-primary/50 transition-colors">
    <div className="flex items-start justify-between gap-2 mb-2">
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
      >
        <span className="inline-flex items-center gap-1.5">
          <Link2 className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{source.platform}</span>
        </span>
        <span className="text-muted-foreground/70 text-xs">{new Date(source.date).toLocaleDateString()}</span>
        <ExternalLink className="w-3 h-3 ml-1 text-muted-foreground/70" />
      </a>
      <Badge variant="outline" className="text-xs capitalize">
        {source.authorType.toLowerCase()}
      </Badge>
    </div>
    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">"{source.excerpt}"</p>
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      {source.engagement.upvotes > 0 && (
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> {source.engagement.upvotes}
        </span>
      )}
      <SentimentBadge score={source.sentiment} />
    </div>
  </div>
);

const SentimentBadge = ({ score }: any) => {
  const getSentimentColor = (score: number) => {
    if (score >= 0.3) return 'bg-green-500/20 text-green-600';
    if (score <= -0.3) return 'bg-red-500/20 text-red-600';
    return 'bg-yellow-500/20 text-yellow-600';
  };

  return (
    <span
      className={cn('px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1', getSentimentColor(score))}
    >
      {score >= 0.3 ? 'Positive' : score <= -0.3 ? 'Negative' : 'Neutral'}
    </span>
  );
};

const PainPointCard = ({ point }: any) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:border-primary/30">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="flex flex-col items-center gap-2">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                point.intensity >= 4.5
                  ? 'bg-red-500/20 text-red-500'
                  : point.intensity >= 3.5
                  ? 'bg-orange-500/20 text-orange-500'
                  : 'bg-blue-500/20 text-blue-500'
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

          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium">{point.description}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs py-1 px-2">
                    {point.cluster}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    {point.impact.businessSize.join(', ')}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 p-2 h-auto text-muted-foreground"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>

            {isExpanded && (
              <>
                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-sm">
                        <BarChart className="w-4 h-4" />
                        Impact Analysis
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Tooltip content="Estimated financial impact including potential losses, costs, or revenue impact">
                            <span className="text-muted-foreground">Monetary Impact:</span>
                          </Tooltip>
                          <span className="font-medium text-red-500">{point.impact.monetaryMentions.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Tooltip content="Estimated time wasted due to this issue, converted to business impact">
                            <span className="text-muted-foreground">Time Wasted:</span>
                          </Tooltip>
                          <span className="font-medium">{point.impact.timeWasted.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4" />
                        Trends & Patterns
                      </h4>
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
                            Confidence: {(point.confidence * 100).toFixed(0)}%
                          </Badge>
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {point.existingSolutions.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2 text-sm">
                          <ArrowUpRight className="w-4 h-4" />
                          Existing Solutions
                        </h4>
                        <div className="space-y-2">
                          {point.existingSolutions.map((solution: any) => (
                            <div key={solution.name} className="bg-muted/30 rounded p-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{solution.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {(solution.effectiveness * 100).toFixed(0)}% Effective
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{solution.description}</p>
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
                    {point.sources.map((source: any) => (
                      <SourceItem key={source.url} source={source} />
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

interface Props {
  data?: PainPoints;
  status: Status;
}

const PainPointsView = ({ data, status }: Props) => {
  if (!data) {
    return (
      <SegmentLoader
        progress={status.progress.toString()}
        statusText={status.message}
        isComplete={status.isComplete}
        error={status.progress < 0 ? status.message : undefined}
        title="Pain points"
      />
    );
  }

  const { metadata, painPoints, painPointClusters } = data;

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Pain Points Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SentimentIndicator score={metadata.sentimentScore} />
              <MetricCard
                title="Sources Analyzed"
                value={metadata.totalSourcesAnalyzed}
                icon={<Link2 className="w-5 h-5 text-blue-500" />}
                tooltip="Total number of sources analyzed for this research"
              />
              <MetricCard
                title="Source Diversity"
                value={`${(metadata.sourceDiversity * 100).toFixed(0)}%`}
                icon={<Users className="w-5 h-5 text-green-500" />}
                tooltip="Measure of how diverse the sources are across different platforms"
              />
              <MetricCard
                title="Validation Score"
                value={`${(metadata.validationScore * 100).toFixed(0)}%`}
                icon={<Flame className="w-5 h-5 text-orange-500" />}
                tooltip="Confidence level in the accuracy and reliability of the data"
              />
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Platform Distribution</h3>
              <PlatformBreakdown platforms={metadata.platformBreakdown} />
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Key Clusters</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {painPointClusters.map((cluster) => (
                  <ClusterChip key={cluster.clusterName} cluster={cluster} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pain Points List */}
      <div className="space-y-3">
        {painPoints.map((point) => (
          <PainPointCard key={point.id} point={point} />
        ))}
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, tooltip }: any) => (
  <div className="bg-background rounded-lg border p-4 flex items-center gap-3">
    <div className="p-2 rounded-full bg-muted">{icon}</div>
    <div>
      <div className="text-sm text-muted-foreground flex items-center gap-1">
        {title}
        {tooltip && (
          <Tooltip content={tooltip}>
            <span></span>
          </Tooltip>
        )}
      </div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  </div>
);

const Tooltip = ({ children, content }: any) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <span className="inline-flex items-center gap-1 cursor-help">
        {children}
        <Info className="w-3.5 h-3.5 text-muted-foreground/70" />
      </span>
    </HoverCardTrigger>
    <HoverCardContent className="text-sm p-3 max-w-[280px]">{content}</HoverCardContent>
  </HoverCard>
);

export default PainPointsView;
