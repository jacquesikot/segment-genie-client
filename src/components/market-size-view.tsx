/* eslint-disable @typescript-eslint/no-explicit-any */
import { MarketSize, ValidIndustry } from '@/api/research';
import { Status } from '@/api/segment';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Building2, CircleDollarSign, ExternalLink, TrendingUp } from 'lucide-react';
import SegmentLoader from './SegmentLoader';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Progress } from './ui/progress';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

interface Props {
  marketSize?: MarketSize;
  industry?: ValidIndustry;
  status: Status;
}

const MarketSizeView = ({ marketSize, status, industry }: Props) => {
  if (!marketSize || !industry) {
    return (
      <SegmentLoader
        progress={status.progress ? status.progress.toString() : '0'}
        statusText={status.message}
        isComplete={status.isComplete}
        title="Market size"
        error={status.progress < 0 ? status.message : undefined}
      />
    );
  }

  const lastUpdated = new Date(marketSize.metadata.lastUpdated).toDateString();

  return (
    <div className="space-y-8">
      {/* Industry Classification Card */}
      <Card className="border-l-4 border-l-blue-500 dark:border-l-blue-400 shadow-lg dark:bg-gray-900">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-950/50 p-3 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-2xl dark:text-white">Industry Classification</CardTitle>
                <CardDescription className="mt-2 dark:text-gray-300">
                  {industry.suggestedIndustry} · Last updated: {lastUpdated}
                </CardDescription>
              </div>
            </div>
            <ConfidenceIndicator
              confidence={industry.industryConfidence}
              tooltip="Confidence in industry classification accuracy"
            />
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {industry.alternativeClassifications.map((classification, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-3 py-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                >
                  {classification}
                </Badge>
              ))}
            </div>
            <div className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed">
              {industry.explanation}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border dark:border-gray-700">
            <h4 className="font-semibold mb-2 dark:text-white">Classification Metrics</h4>
            <div className="space-y-3">
              <MetricItem
                label="Data Confidence"
                value={marketSize.metadata.industryConfidence}
                icon={<TrendingUp className="w-4 h-4" />}
              />
              <MetricItem
                label="Source Reliability"
                value={marketSize.metadata.dataAvailability}
                icon={<CircleDollarSign className="w-4 h-4" />}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Size Visualization */}
      <div className="grid lg:grid-cols-3 gap-6">
        <MarketMetricCard
          title="TAM"
          value={marketSize.tam.revenue.value!}
          description="Total Addressable Market"
          growth={marketSize.tam.growthRate || ''}
          color="blue"
          explanation={marketSize.tam.explanation}
        />

        <MarketMetricCard
          title="SAM"
          value={marketSize.sam.revenue.value!}
          description="Serviceable Addressable Market"
          color="purple"
          percentage={marketSize.sam.revenue.value! / marketSize.tam.revenue.value!}
          explanation={marketSize.sam.explanation}
        />

        <MarketMetricCard
          title="SOM"
          value={marketSize.som.revenue.value!}
          description="Serviceable Obtainable Market"
          color="green"
          percentage={marketSize.som.revenue.value! / marketSize.sam.revenue.value!}
          explanation={marketSize.som.explanation}
        />
      </div>

      {/* Data Sources Section */}
      <Card className="dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-xl dark:text-white">Research Sources</CardTitle>
          <CardDescription className="dark:text-gray-300">Verified market data references</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {marketSize.metadata.sources.map((source, index) => (
            <SourceCard key={index} source={source} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

// Reusable Components
export const ConfidenceIndicator = ({ confidence, tooltip }: { confidence: number; tooltip: string }) => (
  <Tooltip>
    <TooltipTrigger>
      <div className="flex items-center gap-4">
        {/* Label */}
        <span className="text-sm font-medium text-muted-foreground">Confidence Level</span>

        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          <div className="relative w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-blue-600">{(confidence * 100).toFixed(0)}%</span>
        </div>
      </div>
    </TooltipTrigger>
    <TooltipContent>{tooltip}</TooltipContent>
  </Tooltip>
);

const MarketMetricCard = ({
  title,
  value,
  description,
  color,
  percentage,
  growth,
  explanation,
}: {
  title: string;
  value: number;
  description: string;
  color: string;
  percentage?: number;
  growth?: string;
  explanation: string;
}) => (
  <Card
    className={`border-l-4 border-l-${color}-500 dark:border-l-${color}-400 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-900`}
  >
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-lg dark:text-white">{title}</CardTitle>
          <CardDescription className="dark:text-gray-300">{description}</CardDescription>
        </div>
        <span className={`text-${color}-600 dark:text-${color}-400 font-semibold text-2xl`}>
          {formatCurrency(value)}
        </span>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {percentage && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm dark:text-gray-300">
            <span>Market Coverage</span>
            <span>{(percentage * 100).toFixed(1)}%</span>
          </div>
          <Progress value={percentage * 100} className={`h-2 bg-${color}-100 dark:bg-${color}-950/30`} />
        </div>
      )}
      {growth && (
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="font-medium dark:text-gray-300">{growth} Annual Growth</span>
        </div>
      )}
      <HoverCard>
        <HoverCardTrigger>
          <p className="text-sm text-muted-foreground dark:text-gray-400 line-clamp-3 hover:underline cursor-help">
            {explanation}
          </p>
        </HoverCardTrigger>
        <HoverCardContent className="w-96 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-sm dark:text-gray-200">{explanation}</p>
        </HoverCardContent>
      </HoverCard>
    </CardContent>
  </Card>
);

const SourceCard = ({ source }: { source: any }) => (
  <a
    href={source.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group border dark:border-gray-700 p-4 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors dark:bg-gray-800/50"
  >
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <div className="font-medium group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400 transition-colors">
          {source.title}
          <ExternalLink className="inline ml-2 w-4 h-4 opacity-70" />
        </div>
        <div className="text-sm text-muted-foreground dark:text-gray-400">
          Published: {new Date(source.datePublished).toLocaleDateString()}
        </div>
      </div>
      <div className="flex gap-2">
        <ScorePill value={source.credibilityScore} label="Cred" />
        <ScorePill value={source.relevanceScore} label="Rel" />
      </div>
    </div>
  </a>
);

const ScorePill = ({ value, label }: { value: number; label: string }) => (
  <div className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs dark:text-gray-200">
    {label}: <span className="font-medium">{(value * 100).toFixed(0)}%</span>
  </div>
);
interface MetricItemProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
}

export const MetricItem = ({ label, value, icon }: MetricItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
      <div className="flex items-center gap-3">
        {icon && <div className="text-blue-600 dark:text-blue-400">{icon}</div>}
        <span className="text-sm font-medium text-muted-foreground dark:text-gray-300">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold dark:text-gray-200">{(value * 100).toFixed(0)}%</span>
        <div className="relative w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="absolute h-full bg-blue-600 dark:bg-blue-500" style={{ width: `${value * 100}%` }} />
        </div>
      </div>
    </div>
  );
};

export default MarketSizeView;
