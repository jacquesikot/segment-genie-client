/* eslint-disable @typescript-eslint/no-explicit-any */
import { Competitors } from '@/api/research';
import { Status } from '@/api/segment';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Building2,
  Calendar,
  Check,
  Clock,
  DollarSign,
  ExternalLink,
  Globe,
  Info,
  Lightbulb,
  Scale,
  ShieldAlert,
  Star,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import SegmentLoader from './SegmentLoader';

interface Props {
  data?: Competitors;
  status: Status;
}

const CompetitionView = ({ data, status }: Props) => {
  if (!data) {
    return (
      <SegmentLoader
        title="Competition Analysis"
        progress={status.progress.toString()}
        statusText={status.message}
        isComplete={status.isComplete}
        error={status.progress < 0 ? status.message : undefined}
      />
    );
  }

  const { metadata, competitors, comparativeAnalysis } = data;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6 rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Competitor Analysis</h1>
            <p className="text-muted-foreground mt-1 dark:text-gray-300">
              Last Updated: {formatDate(metadata.analysisDate)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <HoverCard>
              <HoverCardTrigger>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 cursor-help bg-white/80 dark:bg-blue-950/40 hover:bg-gray-50 dark:hover:bg-blue-900/50"
                >
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-600 dark:text-blue-400">
                    Confidence: {(metadata.confidenceScore * 100).toFixed(1)}%
                  </span>
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent className="text-sm dark:bg-gray-900">
                Analysis confidence based on data quality and source reliability
              </HoverCardContent>
            </HoverCard>
            <Badge
              variant="outline"
              className="bg-white/80 dark:bg-purple-950/40 hover:bg-gray-50 dark:hover:bg-purple-900/50"
            >
              {competitors.length} Competitors Analyzed
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Market Overview */}
          <Card className="shadow-lg dark:border-gray-800">
            <CardHeader className="bg-blue-50 dark:bg-blue-950/30 rounded-t-lg">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">Market Overview</CardTitle>
                  <CardDescription className="dark:text-blue-200/70">
                    Key market metrics and competitive landscape
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6 dark:bg-gray-900">
              <div className="grid md:grid-cols-3 gap-4">
                <MetricCard
                  title="Market Size"
                  value={comparativeAnalysis.marketOverview.totalAddressableMarket}
                  icon={DollarSign}
                  color="red"
                  darkClass="dark:bg-red-950/30 dark:border-red-900/30 dark:text-red-300"
                />
                <MetricCard
                  title="Growth Rate"
                  value={comparativeAnalysis.marketOverview.growthRate}
                  icon={TrendingUp}
                  color="green"
                  darkClass="dark:bg-green-950/30 dark:border-green-900/30 dark:text-green-300"
                />
                <MetricCard
                  title="Market Stage"
                  value={comparativeAnalysis.marketOverview.maturityStage}
                  icon={Activity}
                  color="yellow"
                  darkClass="dark:bg-yellow-950/30 dark:border-yellow-900/30 dark:text-yellow-300"
                />
              </div>

              <div className="space-y-4">
                <SectionBlock
                  title="Key Market Trends"
                  items={comparativeAnalysis.marketOverview.keyTrends}
                  icon={Check}
                  color="green"
                  darkTextClass="dark:text-green-300"
                />
                <SectionBlock
                  title="Entry Barriers"
                  items={comparativeAnalysis.marketOverview.entryBarriers}
                  icon={AlertCircle}
                  color="red"
                  darkTextClass="dark:text-red-300"
                />
              </div>
            </CardContent>
          </Card>

          {/* Competitor Analysis Tabs */}
          <Tabs defaultValue="direct" className="shadow-lg">
            <TabsList className="grid w-full grid-cols-3 bg-gray-50 dark:bg-gray-900">
              {['direct', 'indirect', 'potential'].map((type) => (
                <TabsTrigger
                  key={type}
                  value={type}
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-blue-950/30 data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            {['direct', 'indirect', 'potential'].map((type) => (
              <TabsContent key={type} value={type} className="mt-4">
                <div className="grid gap-4">
                  {competitors
                    .filter((comp) => comp.category === type)
                    .map((competitor, index) => (
                      <CompetitorCard key={index} competitor={competitor} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Feature Comparison */}
          <Card className="shadow-lg h-fit dark:border-gray-800">
            <CardHeader className="bg-purple-50 dark:bg-purple-950/30 rounded-t-lg">
              <div className="flex items-center gap-3">
                <Scale className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">Feature Comparison</CardTitle>
                  <CardDescription className="dark:text-purple-200/70">
                    Competitive feature analysis across companies
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 dark:bg-gray-900">
              <div className="space-y-6">
                {comparativeAnalysis.featureComparison.map((feature, index) => (
                  <FeatureComparisonBlock key={index} feature={feature} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Opportunities */}
          <Card className="shadow-lg h-fit dark:border-gray-800">
            <CardHeader className="bg-green-50 dark:bg-green-950/30 rounded-t-lg">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">Market Opportunities</CardTitle>
                  <CardDescription className="dark:text-green-200/70">
                    Identified gaps and growth potential
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 grid gap-4 dark:bg-gray-900">
              {comparativeAnalysis.opportunitySpaces.map((opportunity, index) => (
                <OpportunityCard key={index} opportunity={opportunity} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const MetricCard = ({ title, value, icon: Icon, color, darkClass }: any) => (
  <div className={cn(`p-4 rounded-lg bg-${color}-50 border border-${color}-100`, darkClass)}>
    <div className="flex items-center gap-2 mb-2">
      <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
      <span className={`text-sm font-medium text-${color}-700 dark:text-${color}-300`}>{title}</span>
    </div>
    <div className={`text-2xl font-semibold text-${color}-800 dark:text-${color}-200`}>{value}</div>
  </div>
);

const SectionBlock = ({ title, items, icon: Icon, color, darkTextClass }: any) => (
  <div className="space-y-3">
    <h3 className={cn('font-semibold flex items-center gap-2 text-gray-900 dark:text-white', darkTextClass)}>
      <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
      {title}
    </h3>
    <div className="space-y-2">
      {items.map((item: string, idx: number) => (
        <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground dark:text-gray-300">
          <span className="flex-shrink-0">•</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

const CompetitorCard = ({ competitor }: any) => {
  return (
    <Card className="hover:shadow-md transition-shadow dark:border-gray-700">
      <CardContent className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{competitor.name}</h3>
            </div>
            {competitor.website && (
              <a
                href={competitor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                {competitor.website}
              </a>
            )}
          </div>
          <Badge variant="outline" className="text-sm capitalize bg-white dark:bg-gray-800">
            {competitor.category} Competitor
          </Badge>
        </div>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <InfoBlock
              title="Company Profile"
              icon={Building2}
              items={[
                { icon: Calendar, label: 'Founded', value: competitor.companyProfile?.foundedYear || 'N/A' },
                { icon: Globe, label: 'HQ', value: competitor.companyProfile?.headquartersLocation || 'N/A' },
                { icon: Users, label: 'Size', value: competitor.companyProfile?.employeeCount || 'N/A' },
              ]}
            />

            {competitor.marketPosition && (
              <InfoBlock
                title="Market Position"
                icon={Target}
                items={[
                  {
                    content: (
                      <div className="space-y-2">
                        <Progress value={competitor.marketPosition.marketShare || 0} className="h-2" />
                        <div className="text-sm text-muted-foreground dark:text-gray-300">
                          {competitor.marketPosition.marketShare || 0}% Market Share
                        </div>
                      </div>
                    ),
                  },
                  {
                    icon: TrendingUp,
                    label: 'Growth Rate',
                    value: competitor.marketPosition.growthRate || 'N/A',
                  },
                ]}
              />
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {competitor.swotAnalysis && (
              <div className="space-y-4">
                <SectionBlock
                  title="Strengths"
                  items={competitor.swotAnalysis.strengths.map((s: any) => s.point)}
                  icon={Star}
                  color="green"
                />
                <SectionBlock
                  title="Weaknesses"
                  items={competitor.swotAnalysis.weaknesses.map((w: any) => w.point)}
                  icon={ShieldAlert}
                  color="red"
                />
              </div>
            )}
          </div>
        </div>

        {/* Additional Sections */}
        {competitor.recentDevelopments?.length > 0 && (
          <SectionBlock
            title="Recent Developments"
            items={competitor.recentDevelopments.map((d: any) => d.development)}
            icon={Clock}
            color="blue"
          />
        )}
      </CardContent>
    </Card>
  );
};

const InfoBlock = ({ title, icon: Icon, items }: any) => (
  <div className="space-y-3">
    <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      {title}
    </h4>
    <div className="space-y-2">
      {items.map((item: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-300">
          {item.icon && <item.icon className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />}
          {item.label && <span>{item.label}:</span>}
          {item.value ? <span>{item.value}</span> : item.content}
        </div>
      ))}
    </div>
  </div>
);

const FeatureComparisonBlock = ({ feature }: any) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="font-medium text-gray-900 dark:text-white">{feature.feature}</div>
      <Badge
        variant={
          feature.importance === 'Critical'
            ? 'destructive'
            : feature.importance === 'Important'
            ? 'default'
            : 'secondary'
        }
      >
        {feature.importance}
      </Badge>
    </div>
    <div className="space-y-2">
      {feature.competitors.map((comp: any) => (
        <div key={comp.name} className="flex items-center gap-4">
          <div className="w-32 text-sm text-muted-foreground dark:text-gray-300">{comp.name}</div>
          <Progress
            value={
              comp.implementation === 'Best-in-class'
                ? 100
                : comp.implementation === 'Advanced'
                ? 75
                : comp.implementation === 'Basic'
                ? 50
                : 0
            }
            className="flex-1"
          />
          <Badge variant="outline" className="w-28">
            {comp.implementation}
          </Badge>
        </div>
      ))}
    </div>
  </div>
);

const OpportunityCard = ({ opportunity }: any) => (
  <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 dark:border-gray-800">
    <CardContent className="p-4 space-y-3">
      <h3 className="font-semibold text-gray-900 dark:text-white">{opportunity.description}</h3>
      <div className="flex flex-wrap gap-2">
        {opportunity.unservedNeeds.map((need: string, idx: number) => (
          <Badge key={idx} variant="outline" className="bg-white/80 dark:bg-gray-800/50">
            {need}
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground dark:text-gray-300">
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          <span>{opportunity.potentialSize}</span>
        </div>
        <Badge
          variant="outline"
          className={cn(
            opportunity.entryDifficulty === 'High'
              ? 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400'
              : opportunity.entryDifficulty === 'Medium'
              ? 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-400'
              : 'bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400'
          )}
        >
          {opportunity.entryDifficulty}
        </Badge>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{opportunity.timeToMarket}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default CompetitionView;
