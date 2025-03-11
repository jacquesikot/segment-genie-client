/* eslint-disable @typescript-eslint/no-explicit-any */
import { Competitors } from '@/api/research';
import { Status } from '@/api/segment';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import {
  AlertCircle,
  BarChart3,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Filter,
  Globe,
  Info,
  Lightbulb,
  Scale,
  Search,
  ShieldAlert,
  Star,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import SegmentLoader from './SegmentLoader';

interface Props {
  data?: Competitors;
  status: Status;
}

const CompetitionView = ({ data, status }: Props) => {
  const [expandedCompetitors, setExpandedCompetitors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

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

  const toggleCompetitor = (name: string) => {
    setExpandedCompetitors((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  // Filter competitors based on search query
  const filteredCompetitors = competitors.filter((comp) => {
    const matchesSearch = searchQuery === '' || comp.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters = activeFilters.length === 0 || activeFilters.includes(comp.category?.toLowerCase() || '');

    return matchesSearch && matchesFilters;
  });

  const handleFilterChange = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]));
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header Section with Quick Stats */}
      <Card className="shadow-sm overflow-hidden">
        <div className="bg-primary/5 border-b p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Competitor Analysis</h1>
              <p className="text-muted-foreground mt-1">Last Updated: {formatDate(metadata.analysisDate)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <HoverCard>
                <HoverCardTrigger>
                  <Badge variant="outline" className="flex items-center gap-1 cursor-help">
                    <Info className="w-4 h-4" />
                    <span>Confidence: {(metadata.confidenceScore * 100).toFixed(1)}%</span>
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent className="text-sm">
                  Analysis confidence based on data quality and source reliability
                </HoverCardContent>
              </HoverCard>
              <Badge variant="outline">{competitors.length} Competitors Analyzed</Badge>
            </div>
          </div>
        </div>

        {/* Summary Dashboard */}
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x">
            {[
              {
                title: 'Direct Competitors',
                count: competitors.filter((c) => c.category?.toLowerCase() === 'direct').length,
                icon: Target,
                color: 'text-primary',
                bgColor: 'bg-primary/10',
              },
              {
                title: 'Indirect Competitors',
                count: competitors.filter((c) => c.category?.toLowerCase() === 'indirect').length,
                icon: Building2,
                color: 'text-primary',
                bgColor: 'bg-primary/10',
              },
              {
                title: 'Potential Entrants',
                count: competitors.filter((c) => c.category?.toLowerCase() === 'potential').length,
                icon: TrendingUp,
                color: 'text-primary',
                bgColor: 'bg-primary/10',
              },
              {
                title: 'Market Growth',
                value: comparativeAnalysis.marketOverview.growthRate,
                subtext: 'Annual growth rate',
                icon: BarChart3,
                color: 'text-primary',
                bgColor: 'bg-primary/10',
              },
            ].map((stat, i) => (
              <div key={i} className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">{stat.title}</div>
                  <div className="text-2xl font-bold mt-1">{stat.value || stat.count}</div>
                  {stat.subtext && <div className="text-xs text-muted-foreground mt-1">{stat.subtext}</div>}
                  {stat.count !== undefined && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {Math.round((stat.count / competitors.length) * 100)}% of total
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Market Overview */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle className="text-xl">Market Overview</CardTitle>
                  <CardDescription>Key market metrics and competitive landscape</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Check className="w-5 h-5" />
                    <h3 className="font-semibold">Key Market Trends</h3>
                  </div>
                  <div className="space-y-2 bg-muted p-4 rounded-md">
                    {comparativeAnalysis.marketOverview.keyTrends.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <span className="flex-shrink-0 text-primary">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    <h3 className="font-semibold">Entry Barriers</h3>
                  </div>
                  <div className="space-y-2 bg-destructive/5 p-4 rounded-md">
                    {comparativeAnalysis.marketOverview.entryBarriers.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <span className="flex-shrink-0 text-destructive">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search competitors..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="text-muted-foreground w-4 h-4" />
              <span className="text-sm font-medium">Filter:</span>
              {['direct', 'indirect', 'potential'].map((type) => (
                <Badge
                  key={type}
                  variant={activeFilters.includes(type) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleFilterChange(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Competitors Cards - Now with collapsible sections */}
          <div className="space-y-4">
            {filteredCompetitors.length > 0 ? (
              filteredCompetitors.map((competitor, index) => (
                <Card key={index} className="shadow-sm overflow-hidden">
                  {/* Competitor Header - Always visible */}
                  <div
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-muted/30 border-b"
                    onClick={() => toggleCompetitor(competitor.name)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full
                        ${
                          competitor.category === 'direct'
                            ? 'bg-primary/10 text-primary'
                            : competitor.category === 'indirect'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{competitor.name}</h3>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {competitor.category} Competitor
                          </Badge>
                          {competitor.companyProfile?.foundedYear && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Founded {competitor.companyProfile.foundedYear}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {competitor.marketPosition && (
                        <div className="hidden md:flex items-center gap-2">
                          <span className="text-sm font-medium">Market Share:</span>
                          <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${competitor.marketPosition.marketShare || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{competitor.marketPosition.marketShare || 0}%</span>
                        </div>
                      )}
                      {expandedCompetitors.includes(competitor.name) ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedCompetitors.includes(competitor.name) && (
                    <CardContent className="p-4 pt-0">
                      <div className="grid md:grid-cols-2 gap-6 mt-4">
                        {/* Left Side */}
                        <div className="space-y-6">
                          {/* Company Info */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {[
                              {
                                icon: Globe,
                                label: 'HQ',
                                value: competitor.companyProfile?.headquartersLocation || 'N/A',
                              },
                              {
                                icon: Users,
                                label: 'Size',
                                value: competitor.companyProfile?.employeeCount || 'N/A',
                              },
                              {
                                icon: TrendingUp,
                                label: 'Growth Rate',
                                value: competitor.marketPosition?.growthRate || 'N/A',
                              },
                            ].map((item, i) => (
                              <div key={i} className="bg-muted/30 p-3 rounded-md">
                                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                                  <item.icon className="w-3 h-3" />
                                  <span>{item.label}</span>
                                </div>
                                <div className="font-medium">{item.value}</div>
                              </div>
                            ))}
                          </div>

                          {/* Website */}
                          {competitor.website && (
                            <a
                              href={competitor.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-primary hover:underline p-2 bg-primary/5 rounded-md"
                            >
                              <Globe className="w-4 h-4" />
                              Visit Website
                              <ExternalLink className="w-3 h-3 ml-auto" />
                            </a>
                          )}

                          {/* Recent Developments */}
                          {competitor.recentDevelopments && competitor.recentDevelopments.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-medium flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                Recent Developments
                              </h4>
                              <div className="space-y-2 bg-muted p-3 rounded-md">
                                {competitor.recentDevelopments.map((d: any, idx: number) => (
                                  <div key={idx} className="flex items-start gap-2 text-sm">
                                    <span className="flex-shrink-0 text-primary">•</span>
                                    <span>{d.development}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Side - SWOT */}
                        {competitor.swotAnalysis && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-primary">
                                  <Star className="w-4 h-4" />
                                  <h4 className="font-medium text-sm">Strengths</h4>
                                </div>
                                <div className="bg-muted p-3 rounded-md space-y-2">
                                  {competitor.swotAnalysis.strengths.map((s: any, idx: number) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm">
                                      <span className="flex-shrink-0 text-primary">•</span>
                                      <span>{s.point}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-destructive">
                                  <ShieldAlert className="w-4 h-4" />
                                  <h4 className="font-medium text-sm">Weaknesses</h4>
                                </div>
                                <div className="bg-destructive/5 p-3 rounded-md space-y-2">
                                  {competitor.swotAnalysis.weaknesses.map((w: any, idx: number) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm">
                                      <span className="flex-shrink-0 text-destructive">•</span>
                                      <span>{w.point}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center p-8 bg-muted/30 rounded-md">
                <div className="text-muted-foreground">No competitors found matching your criteria</div>
                <button
                  className="mt-4 text-primary"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilters([]);
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Market Opportunities */}
        <div>
          <div className="sticky top-4 space-y-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Market Opportunities</CardTitle>
                </div>
                <CardDescription>Identified growth spaces</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {comparativeAnalysis.opportunitySpaces.map((opportunity, index) => (
                  <div key={index} className="border rounded-md overflow-hidden">
                    <div className="bg-primary/5 p-3 border-b">
                      <div className="font-medium text-sm">{opportunity.description}</div>
                    </div>
                    <div className="p-3 space-y-3">
                      <div className="text-xs">
                        <div className="text-muted-foreground mb-1">Unserved Needs:</div>
                        <ul className="list-disc list-inside space-y-1">
                          {opportunity.unservedNeeds.map((need: string, idx: number) => (
                            <li key={idx}>{need}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <Badge variant="outline" className="justify-center">
                          {opportunity.entryDifficulty}
                        </Badge>
                        <Badge variant="outline" className="justify-center">
                          {opportunity.timeToMarket}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Feature Comparison - Accordion-based approach without tabs */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Scale className="w-6 h-6 text-primary" />
            <div>
              <CardTitle className="text-xl">Feature Comparison</CardTitle>
              <CardDescription>Compare key features across competitors</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {/* Features as Accordion Sections */}
          <div className="space-y-6">
            {comparativeAnalysis.featureComparison.map((feature, index) => (
              <div key={index} id={`feature-${index}`} className="border rounded-lg overflow-hidden">
                {/* Feature Header */}
                <div className="bg-muted/50 p-4 border-b">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg">{feature.feature}</h3>
                      <p className="text-sm text-muted-foreground">
                        Comparison across {feature.competitors.length} competitors
                      </p>
                    </div>
                    <Badge>{feature.importance}</Badge>
                  </div>
                </div>

                {/* Feature Content */}
                <div className="p-4">
                  {/* Implementation Scale/Legend */}
                  <div className="mb-4 p-3 bg-muted/30 rounded-md">
                    <div className="text-sm font-medium mb-2">Implementation Scale:</div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary/40"></div>
                        <span className="text-xs">Basic (&lt;60%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary/70"></div>
                        <span className="text-xs">Advanced (60-80%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-xs">Best-in-class (&gt;80%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Competitor Cards */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {feature.competitors.map((comp, idx) => {
                      // Determine implementation level and styling
                      const implementationLevel =
                        comp.implementation.includes('Highly') || comp.implementation.includes('Strong')
                          ? 90
                          : comp.implementation.includes('Simple') || comp.implementation.includes('Limited')
                          ? 40
                          : 70;

                      const implementationColor =
                        implementationLevel >= 80
                          ? 'bg-primary'
                          : implementationLevel >= 60
                          ? 'bg-primary/70'
                          : 'bg-primary/40';

                      const labelColor =
                        implementationLevel >= 80
                          ? 'bg-primary/10 text-primary'
                          : implementationLevel >= 60
                          ? 'bg-primary/5 text-primary/80'
                          : 'bg-muted text-muted-foreground';

                      return (
                        <div key={idx} className="border rounded-md overflow-hidden">
                          {/* Company name with implementation level */}
                          <div className="p-3 bg-muted/20 border-b flex justify-between items-center gap-2">
                            <div className="font-medium truncate">{comp.name}</div>
                            <div className={`text-xs rounded-full px-2 py-0.5 ${labelColor}`}>
                              {implementationLevel}%
                            </div>
                          </div>

                          <div className="p-3 space-y-3">
                            {/* Implementation details with progress bar */}
                            <div>
                              <div className="mb-2">
                                <div className="h-1.5 w-full bg-muted-foreground/10 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${implementationColor}`}
                                    style={{ width: `${implementationLevel}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground line-clamp-3">{comp.implementation}</div>
                            </div>

                            {/* Notes (if any) */}
                            {comp.notes && (
                              <div className="text-xs bg-muted/20 p-2 rounded">
                                <span className="font-medium">Notes:</span> {comp.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Recommendations - Card-based layout */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-primary" />
            <div>
              <CardTitle className="text-xl">Key Recommendations</CardTitle>
              <CardDescription>Strategic actions based on competitive analysis</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recommendations.map((rec, index) => {
              // Determine priority styling
              const priorityStyles = {
                high: {
                  badge: 'bg-destructive',
                  border: 'border-destructive/20',
                  header: 'bg-destructive/5',
                },
                medium: {
                  badge: 'bg-amber-500',
                  border: 'border-amber-200',
                  header: 'bg-amber-50',
                },
                low: {
                  badge: 'bg-primary',
                  border: 'border-primary/20',
                  header: 'bg-primary/5',
                },
              }[rec.priority] || { badge: '', border: '', header: '' };

              return (
                <div key={index} className={`border rounded-lg overflow-hidden ${priorityStyles.border}`}>
                  <div className={`p-3 border-b ${priorityStyles.header}`}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm">{rec.recommendation}</h3>
                      <Badge className={priorityStyles.badge}>
                        {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 text-sm space-y-3">
                    <p className="text-muted-foreground">{rec.rationale}</p>

                    <div className="pt-2 border-t text-xs space-y-2">
                      <div>
                        <span className="font-medium">Resources:</span> {rec.resourceRequirements}
                      </div>
                      <div>
                        <div className="font-medium mb-1">Risks:</div>
                        <ul className="list-disc list-inside pl-1 space-y-1">
                          {rec.risks?.map((risk: string, riskIndex: number) => (
                            <li key={riskIndex}>{risk}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitionView;
