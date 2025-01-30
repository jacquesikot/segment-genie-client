/* eslint-disable @typescript-eslint/no-explicit-any */
import { PainPoints } from '@/api/research';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  BarChart3,
  Brain,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Frown,
  Link2,
  MapPin,
  Meh,
  SmilePlus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import React from 'react';
import SegmentLoader from './SegmentLoader';
import { Status } from '@/api/segment';

// Sentiment Indicator component remains the same
const SentimentIndicator = ({ score }: any) => {
  const getSentimentInfo = (score: any) => {
    if (score >= 0.3) return { icon: SmilePlus, color: 'text-green-500', text: 'Positive' };
    if (score <= -0.3) return { icon: Frown, color: 'text-red-500', text: 'Negative' };
    return { icon: Meh, color: 'text-yellow-500', text: 'Neutral' };
  };

  const { icon: Icon, color, text } = getSentimentInfo(score);

  return (
    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
      <Icon className={`w-8 h-8 ${color}`} />
      <div className="space-y-1">
        <div className="text-sm font-medium">Overall Sentiment: {text}</div>
        <div className="flex items-center gap-2">
          <Progress value={(score + 1) * 50} className="w-32 h-2" />
          <span className="text-sm text-muted-foreground">{score.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

const PlatformBreakdown = ({ platforms }: any) => (
  <div className="space-y-3">
    {platforms.map((platform: any, index: number) => (
      <div key={index} className="flex items-center justify-between">
        <span className="text-sm">{platform.platform}</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{platform.sourceCount} sources</span>
          <Progress
            value={(platform.sourceCount / Math.max(...platforms.map((p: any) => p.sourceCount))) * 100}
            className="w-24 h-2"
          />
        </div>
      </div>
    ))}
  </div>
);

const ClusterCard = ({ cluster }: any) => (
  <Card className="bg-muted/50">
    <CardContent className="p-4">
      <h4 className="font-medium mb-2">{cluster.clusterName}</h4>
      <p className="text-sm text-muted-foreground mb-3">{cluster.description}</p>
      <div className="flex flex-wrap gap-2">
        {cluster.relatedPainPoints.map((point: any, idx: number) => (
          <Badge key={idx} variant="secondary" className="text-xs">
            {point}
          </Badge>
        ))}
      </div>
    </CardContent>
  </Card>
);

const SourceList = ({ sources }: any) => (
  <div className="space-y-3">
    {sources.map((source: any, idx: number) => (
      <div key={idx} className="bg-muted rounded-lg p-3">
        <div className="flex items-start justify-between gap-4 mb-2">
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <Link2 className="w-4 h-4" />
            <span>{source.platform}</span>
            <span>•</span>
            <span>{new Date(source.date).toLocaleDateString()}</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          <Badge variant="outline">{source.authorType}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-2">"{source.excerpt}"</p>
        <div className="flex items-center gap-4 text-sm">
          {source.engagement.upvotes && <span className="text-muted-foreground">👍 {source.engagement.upvotes}</span>}
          {source.engagement.replies && <span className="text-muted-foreground">💬 {source.engagement.replies}</span>}
        </div>
      </div>
    ))}
  </div>
);

const TrendInfo = ({ trends }: any) => (
  <div className="flex flex-wrap gap-4">
    {trends.seasonal && (
      <Badge variant="outline" className="flex items-center gap-1">
        <Clock className="w-3 h-3" /> Seasonal
      </Badge>
    )}
    <Badge
      variant="outline"
      className={`flex items-center gap-1 ${trends.increasing ? 'text-green-500' : 'text-red-500'}`}
    >
      {trends.increasing ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {trends.increasing ? 'Increasing' : 'Decreasing'}
    </Badge>
    {trends.geography.length > 0 && (
      <HoverCard>
        <HoverCardTrigger>
          <Badge variant="outline" className="flex items-center gap-1 cursor-help">
            <MapPin className="w-3 h-3" />
            {trends.geography.length} Regions
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="text-sm">{trends.geography.join(', ')}</div>
        </HoverCardContent>
      </HoverCard>
    )}
  </div>
);

const PainPointCard = ({ point }: any) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Card className="overflow-hidden transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="rounded-full p-3 bg-muted h-fit">
            <AlertCircle
              className={`w-5 h-5 ${
                point.intensity >= 4.5
                  ? 'text-red-500'
                  : point.intensity >= 3.5
                  ? 'text-orange-500'
                  : point.intensity >= 2.5
                  ? 'text-yellow-500'
                  : 'text-blue-500'
              }`}
            />
          </div>
          <div className="space-y-4 w-full">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">{point.description}</h3>
                  <Badge variant="outline" className="text-xs">
                    {point.cluster}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={`
                    ${
                      point.frequency === 'Ubiquitous'
                        ? 'bg-red-100 text-red-800'
                        : point.frequency === 'Common'
                        ? 'bg-orange-100 text-orange-800'
                        : point.frequency === 'Occasional'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }
                  `}
                  >
                    {point.frequency}
                  </Badge>
                  {point.emotions.map((emotion: any, idx: number) => (
                    <Badge key={idx} variant="secondary">
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button variant="ghost" size="sm" className="mt-1" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>

            {isExpanded && (
              <>
                <Separator />

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Impact Analysis</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Business Size Impact</h5>
                        <div className="flex gap-2">
                          {point.impact.businessSize.map((size: any, idx: number) => (
                            <Badge key={idx} variant="outline">
                              {size}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {point.impact.monetaryMentions.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">Monetary Impact</h5>
                          <ul className="text-sm text-muted-foreground">
                            {point.impact.monetaryMentions.map((mention: any, idx: number) => (
                              <li key={idx}>{mention}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Trends & Patterns</h4>
                    <TrendInfo trends={point.trends} />
                    <div className="mt-4">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        Confidence: {(point.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                </div>

                {point.existingSolutions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Existing Solutions</h4>
                    <div className="space-y-3">
                      {point.existingSolutions.map((solution: any, idx: number) => (
                        <div key={idx} className="bg-muted rounded-lg p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="font-medium">{solution.name}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{solution.description}</p>
                            </div>
                            <Badge variant="outline">Effectiveness: {(solution.effectiveness * 100).toFixed(0)}%</Badge>
                          </div>
                          {solution.limitations.length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <h6 className="text-sm font-medium mb-2">Limitations</h6>
                              <div className="flex flex-wrap gap-2">
                                {solution.limitations.map((limitation: any, lidx: number) => (
                                  <Badge key={lidx} variant="secondary" className="text-xs">
                                    {limitation}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-3">Sources & Evidence</h4>
                  <SourceList sources={point.sources} />
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
        title="Pain points"
        progress={status.progress.toString()}
        statusText={status.message}
        isComplete={status.isComplete}
        error={status.progress < 0 ? status.message : undefined}
      />
    );
  }

  const { metadata, painPoints, painPointClusters } = data;

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-500" />
              <div>
                <CardTitle>Pain Points Analysis</CardTitle>
                <CardDescription>
                  Data from {new Date(metadata.dateRange.earliest).toLocaleDateString()} to{' '}
                  {new Date(metadata.dateRange.latest).toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{metadata.totalSourcesAnalyzed} Sources Analyzed</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* Key Metrics */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SentimentIndicator score={metadata.sentimentScore} />

              <div className="p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Source Diversity</h3>
                  <Progress value={metadata.sourceDiversity * 100} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {(metadata.sourceDiversity * 100).toFixed(0)}% diverse sources
                  </p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Validation Score</h3>
                  <Progress value={metadata.validationScore * 100} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {(metadata.validationScore * 100).toFixed(0)}% confidence
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Platform Distribution */}
            <div>
              <h3 className="text-lg font-medium mb-4">Platform Distribution</h3>
              <PlatformBreakdown platforms={metadata.platformBreakdown} />
            </div>

            <Separator />

            {/* Pain Point Clusters */}
            <div>
              <h3 className="text-lg font-medium mb-4">Pain Point Clusters</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {painPointClusters.map((cluster, index) => (
                  <ClusterCard key={index} cluster={cluster} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pain Points List */}
      <div className="space-y-4">
        {painPoints.map((point) => (
          <PainPointCard key={point.id} point={point} />
        ))}
      </div>
    </div>
  );
};

export default PainPointsView;
