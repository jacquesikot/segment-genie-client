import { Status } from '@/api/segment';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cva } from 'class-variance-authority';
import {
  AlertTriangle,
  ArrowDownUp,
  ArrowUpRight,
  BarChart4,
  BookOpen,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  FlaskConical,
  Info,
  LineChart,
  ShieldAlert,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import SegmentLoader from './SegmentLoader';

interface Industry {
  primaryIndustry: string;
  subIndustries: string[];
  relatedIndustries: string[];
  industryMaturity: 'emerging' | 'growing' | 'mature' | 'declining';
  keyTrends: string[];
  regulatoryFactors: string[];
}

interface MarketSize {
  metadata: {
    analysisDate: string;
    marketMaturity: 'emerging' | 'growing' | 'mature' | 'declining';
    dataQuality: {
      score: number;
      limitations: string[];
    };
    sources: Array<{
      url?: string;
      title?: string;
      credibilityScore?: number;
      datePublished?: string | null;
      publisher?: string;
      relevanceScore?: number;
    }>;
  };
  marketAnalysis: {
    industry: Industry;
    tam: {
      marketSize: {
        value: number;
        currency: string;
        unit: 'trillion' | 'billion' | 'million' | 'thousand';
      };
      growthRate?: number;
      keyDrivers: string[];
      risks: string[];
      methodology: string;
    };
    sam: {
      marketSize: {
        value: number;
        currency: string;
        unit: 'trillion' | 'billion' | 'million' | 'thousand';
      };
      percentageOfTAM: number;
      targetSegments: string[];
      exclusionCriteria: string[];
      methodology: string;
    };
    som: {
      marketSize: {
        value: number;
        currency: string;
        unit: 'trillion' | 'billion' | 'million' | 'thousand';
      };
      percentageOfSAM: number;
      timeToAchieve: number;
      competitiveDynamics: string[];
      methodology: string;
    };
  };
}

interface Props {
  marketSize?: MarketSize;
  status: Status;
}

const formatCurrency = (value: number, currency: string, unit: string) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let formattedValue = formatter.format(value);

  switch (unit) {
    case 'trillion':
      formattedValue += 'T';
      break;
    case 'billion':
      formattedValue += 'B';
      break;
    case 'million':
      formattedValue += 'M';
      break;
    case 'thousand':
      formattedValue += 'K';
      break;
  }

  return formattedValue;
};

const getMaturityStyles = (maturity: string) => {
  switch (maturity) {
    case 'emerging':
      return {
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-100 dark:bg-emerald-950/30',
        icon: <LineChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      };
    case 'growing':
      return {
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-950/30',
        icon: <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      };
    case 'mature':
      return {
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-100 dark:bg-amber-950/30',
        icon: <BarChart4 className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      };
    case 'declining':
      return {
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-950/30',
        icon: <ArrowDownUp className="w-5 h-5 text-red-600 dark:text-red-400" />,
      };
    default:
      return {
        color: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        icon: <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
      };
  }
};

const marketCardVariants = cva('border shadow-sm hover:shadow-md transition-shadow dark:bg-gray-900 h-full', {
  variants: {
    type: {
      tam: 'border-l-4 border-l-blue-500 dark:border-l-blue-400',
      sam: 'border-l-4 border-l-purple-500 dark:border-l-purple-400',
      som: 'border-l-4 border-l-green-500 dark:border-l-green-400',
    },
  },
  defaultVariants: {
    type: 'tam',
  },
});

const MarketSizeView = ({ marketSize, status }: Props) => {
  if (!marketSize) {
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

  const industry = marketSize.marketAnalysis.industry;
  const analysisDate = new Date(marketSize.metadata.analysisDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const maturityStyles = getMaturityStyles(industry.industryMaturity || marketSize.metadata.marketMaturity);
  const tam = marketSize.marketAnalysis.tam;
  const sam = marketSize.marketAnalysis.sam;
  const som = marketSize.marketAnalysis.som;

  return (
    <div className="space-y-8">
      {/* Market Overview Card */}
      <Card className="shadow-lg dark:bg-gray-900">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-950/50 p-3 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-2xl dark:text-white">Market Analysis</CardTitle>
                <CardDescription className="mt-2 dark:text-gray-300">
                  {industry.primaryIndustry} · Last updated: {analysisDate}
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5`}>
                {maturityStyles.icon}
                <span className={`text-sm font-medium capitalize ${maturityStyles.color}`}>
                  {industry.industryMaturity || marketSize.metadata.marketMaturity} Market
                </span>
              </div>
              <ConfidenceIndicator
                confidence={marketSize.metadata.dataQuality.score}
                tooltip="Confidence in market data quality"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="industry">Industry</TabsTrigger>
              <TabsTrigger value="limitations">Data Limitations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <MetricCard
                  icon={<Target className="w-4 h-4" />}
                  label="Market Focus"
                  value={industry.primaryIndustry}
                />
                <MetricCard
                  icon={<Clock className="w-4 h-4" />}
                  label="Time to Market"
                  value={`${som.timeToAchieve} years`}
                />
                <MetricCard
                  icon={<TrendingUp className="w-4 h-4" />}
                  label="Growth Rate"
                  value={tam.growthRate ? `${tam.growthRate}% Annually` : 'N/A'}
                />
              </div>
            </TabsContent>

            <TabsContent value="industry">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg dark:text-white">Industry Classification</h3>

                  <div>
                    <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Sub-Industries</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {industry.subIndustries.map((subIndustry, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="px-3 py-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                        >
                          {subIndustry}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Related Industries</h4>
                    <div className="flex flex-wrap gap-2">
                      {industry.relatedIndustries.map((relatedIndustry, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        >
                          {relatedIndustry}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border dark:border-gray-700">
                  <h4 className="font-semibold mb-4 dark:text-white">Industry Analysis</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Key Trends</h5>
                      <ul className="space-y-1 pl-4 text-sm text-muted-foreground dark:text-gray-400">
                        {industry.keyTrends.map((trend, index) => (
                          <li key={index} className="list-disc">
                            {trend}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Regulatory Factors</h5>
                      <ul className="space-y-1 pl-4 text-sm text-muted-foreground dark:text-gray-400">
                        {industry.regulatoryFactors.map((factor, index) => (
                          <li key={index} className="list-disc">
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <MetricItem
                      label="Data Quality"
                      value={marketSize.metadata.dataQuality.score}
                      icon={<FlaskConical className="w-4 h-4" />}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="limitations">
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-800 dark:text-amber-300">Data Limitations</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                      Consider these factors when using the market analysis
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 pl-9">
                  {marketSize.metadata.dataQuality.limitations.map((limitation, index) => (
                    <li key={index} className="text-sm text-amber-700 dark:text-amber-400 list-disc">
                      {limitation}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Market Size Visualization */}
      <div className="grid lg:grid-cols-3 gap-6">
        <MarketMetricCard
          title="TAM"
          value={{
            amount: tam.marketSize.value,
            currency: tam.marketSize.currency,
            unit: tam.marketSize.unit,
          }}
          description="Total Addressable Market"
          type="tam"
          growthRate={tam.growthRate}
          keyDrivers={tam.keyDrivers}
          risks={tam.risks}
          methodology={tam.methodology}
        />

        <MarketMetricCard
          title="SAM"
          value={{
            amount: sam.marketSize.value,
            currency: sam.marketSize.currency,
            unit: sam.marketSize.unit,
          }}
          description="Serviceable Addressable Market"
          type="sam"
          percentage={sam.percentageOfTAM / 100}
          targetSegments={sam.targetSegments}
          exclusionCriteria={sam.exclusionCriteria}
          methodology={sam.methodology}
        />

        <MarketMetricCard
          title="SOM"
          value={{
            amount: som.marketSize.value,
            currency: som.marketSize.currency,
            unit: som.marketSize.unit,
          }}
          description="Serviceable Obtainable Market"
          type="som"
          percentage={som.percentageOfSAM / 100}
          timeToAchieve={som.timeToAchieve}
          competitiveDynamics={som.competitiveDynamics}
          methodology={som.methodology}
        />
      </div>

      {/* Data Sources Section */}
      <Card className="dark:bg-gray-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl dark:text-white">Research Sources</CardTitle>
          <CardDescription className="dark:text-gray-300">Verified market data references</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {marketSize.metadata.sources.map((source, index) => (
              <SourceCard key={index} source={source} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Simple metric card for overview tab
const MetricCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">{icon}</div>
    <div>
      <div className="text-sm text-muted-foreground dark:text-gray-400">{label}</div>
      <div className="font-medium dark:text-white">{value}</div>
    </div>
  </div>
);

// Component for displaying confidence
export const ConfidenceIndicator = ({ confidence, tooltip }: { confidence: number; tooltip: string }) => (
  <Tooltip>
    <TooltipTrigger>
      <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Confidence</span>
        <div className="flex items-center gap-2">
          <div className="relative w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{(confidence * 100).toFixed(0)}%</span>
        </div>
      </div>
    </TooltipTrigger>
    <TooltipContent className="p-3 max-w-xs">{tooltip}</TooltipContent>
  </Tooltip>
);

// Component for Market Metrics Cards (TAM/SAM/SOM)
const MarketMetricCard = ({
  title,
  value,
  description,
  type,
  percentage,
  growthRate,
  keyDrivers,
  risks,
  targetSegments,
  exclusionCriteria,
  competitiveDynamics,
  timeToAchieve,
  methodology,
}: {
  title: string;
  value: { currency: string; amount: number; unit: string };
  description: string;
  type: 'tam' | 'sam' | 'som';
  percentage?: number;
  growthRate?: number;
  keyDrivers?: string[];
  risks?: string[];
  targetSegments?: string[];
  exclusionCriteria?: string[];
  competitiveDynamics?: string[];
  timeToAchieve?: number;
  methodology: string;
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'tam':
        return {
          icon: <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-100 dark:bg-blue-950/30',
          progressColor: 'bg-blue-600 dark:bg-blue-500',
          progressBgColor: 'bg-blue-100 dark:bg-blue-950/30',
        };
      case 'sam':
        return {
          icon: <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
          color: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-100 dark:bg-purple-950/30',
          progressColor: 'bg-purple-600 dark:bg-purple-500',
          progressBgColor: 'bg-purple-100 dark:bg-purple-950/30',
        };
      case 'som':
        return {
          icon: <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-950/30',
          progressColor: 'bg-green-600 dark:bg-green-500',
          progressBgColor: 'bg-green-100 dark:bg-green-950/30',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <Card className={marketCardVariants({ type })}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <div className={`p-2 rounded-lg ${styles.bgColor}`}>{styles.icon}</div>
            <div>
              <CardTitle className="text-lg dark:text-white">{title}</CardTitle>
              <CardDescription className="dark:text-gray-300">{description}</CardDescription>
            </div>
          </div>
          <span className={`${styles.color} font-semibold text-xl`}>
            {formatCurrency(value.amount, value.currency, value.unit)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {percentage !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm dark:text-gray-300">
              <span>Market Coverage</span>
              <span>{(percentage * 100).toFixed(1)}%</span>
            </div>
            <Progress value={percentage * 100} className={`h-2 ${styles.progressBgColor}`} />
          </div>
        )}

        {growthRate !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className={`w-4 h-4 ${styles.color}`} />
            <span className="font-medium dark:text-gray-300">{growthRate}% Annual Growth</span>
          </div>
        )}

        {timeToAchieve !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className={`w-4 h-4 ${styles.color}`} />
            <span className="font-medium dark:text-gray-300">Est. {timeToAchieve} years to achieve</span>
          </div>
        )}

        <Accordion type="single" collapsible className="w-full">
          {keyDrivers && keyDrivers.length > 0 && (
            <AccordionItem value="key-drivers" className="border-b-0">
              <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Key Growth Drivers</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="mt-2">
                <ul className="space-y-1 pl-6 text-sm text-muted-foreground dark:text-gray-400">
                  {keyDrivers.map((driver, idx) => (
                    <li key={idx} className="list-disc">
                      {driver}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {risks && risks.length > 0 && (
            <AccordionItem value="risks" className="border-b-0">
              <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Market Risks</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="mt-2">
                <ul className="space-y-1 pl-6 text-sm text-muted-foreground dark:text-gray-400">
                  {risks.map((risk, idx) => (
                    <li key={idx} className="list-disc">
                      {risk}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {targetSegments && targetSegments.length > 0 && (
            <AccordionItem value="segments" className="border-b-0">
              <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Target Segments</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="mt-2">
                <ul className="space-y-1 pl-6 text-sm text-muted-foreground dark:text-gray-400">
                  {targetSegments.map((segment, idx) => (
                    <li key={idx} className="list-disc">
                      {segment}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {exclusionCriteria && exclusionCriteria.length > 0 && (
            <AccordionItem value="exclusions" className="border-b-0">
              <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Exclusion Criteria</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="mt-2">
                <ul className="space-y-1 pl-6 text-sm text-muted-foreground dark:text-gray-400">
                  {exclusionCriteria.map((criteria, idx) => (
                    <li key={idx} className="list-disc">
                      {criteria}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {competitiveDynamics && competitiveDynamics.length > 0 && (
            <AccordionItem value="dynamics" className="border-b-0">
              <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Competitive Dynamics</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="mt-2">
                <ul className="space-y-1 pl-6 text-sm text-muted-foreground dark:text-gray-400">
                  {competitiveDynamics.map((dynamic, idx) => (
                    <li key={idx} className="list-disc">
                      {dynamic}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem value="methodology" className="border-b-0">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Methodology</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="mt-2">
              <p className="text-sm text-muted-foreground dark:text-gray-400">{methodology}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

// Source Card Component
const SourceCard = ({
  source,
}: {
  source: {
    url?: string;
    title?: string;
    credibilityScore?: number;
    datePublished?: string | null;
    publisher?: string;
    relevanceScore?: number;
  };
}) => {
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
      className="group flex justify-between items-start p-4 rounded-lg border dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/10 transition-colors dark:bg-gray-800/50"
    >
      <div className="space-y-1">
        <div className="font-medium group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
          {source.title || 'Unknown Source'}
          <ExternalLink className="inline w-4 h-4 opacity-70" />
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
      <div className="flex gap-2">
        {source.credibilityScore !== undefined && <ScorePill value={source.credibilityScore} label="Cred" />}
        {source.relevanceScore !== undefined && <ScorePill value={source.relevanceScore} label="Rel" />}
      </div>
    </a>
  );
};

// Score Pill Component
const ScorePill = ({ value, label }: { value: number; label: string }) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-950/30';
    if (score >= 0.6) return 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/30';
    if (score >= 0.4) return 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/30';
    return 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/30';
  };

  const colorClass = getScoreColor(value);

  return (
    <div className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {label}: <span>{(value * 100).toFixed(0)}%</span>
    </div>
  );
};

// Metric Item Component
export const MetricItem = ({ label, value, icon }: { label: string; value: number; icon?: React.ReactNode }) => {
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
