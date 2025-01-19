import { ResearchReport } from '@/api/research';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Building2, CheckCircle2, CircleDollarSign, ExternalLink, Info, TrendingUp, Users } from 'lucide-react';
import React from 'react';
import { Separator } from '@/components/ui/separator';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

const ProgressWithLabel: React.FC<{ value: number; total: number; label: string }> = ({ value, total, label }) => {
  const percentage = (value / total) * 100;
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{label}</span>
            <span>{percentage.toFixed(1)}% of total</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-semibold">Market Share Details</h4>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(value)} out of {formatCurrency(total)}
          </p>
          <p className="text-sm">This represents the portion of the market that {label.toLowerCase()} encompasses.</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const CustomerReportView: React.FC<ResearchReport> = ({ marketSize, validIndustry }) => {
  const lastUpdated = new Date(marketSize.metadata.lastUpdated).toDateString();

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6 bg-background/50 min-h-screen">
        {/* Industry Section */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-blue-500" />
                <div>
                  <CardTitle>Industry Classification</CardTitle>
                  <CardDescription>Market Segmentation and Analysis</CardDescription>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant={validIndustry.industryConfidence > 0.7 ? 'default' : 'secondary'}
                    className="flex items-center gap-1 cursor-help"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Confidence: {(validIndustry.industryConfidence * 100).toFixed(0)}%
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-64">
                    Confidence level in the industry classification based on market research and data analysis
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Primary Classification</div>
                  <div className="text-lg font-semibold">{validIndustry.suggestedIndustry}</div>
                  {validIndustry.naicsCode && (
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">NAICS: {validIndustry.naicsCode}</Badge>
                    </div>
                  )}
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Alternative Classifications</div>
                  <div className="flex flex-wrap gap-2">
                    {validIndustry.alternativeClassifications.map((classification, index) => (
                      <Badge key={index} variant="secondary">
                        {classification}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Industry Analysis</div>
                <p className="text-sm text-muted-foreground/90 leading-relaxed">{validIndustry.explanation}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Market Size Analysis</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="flex items-center gap-1 cursor-help">
                  <Info className="w-4 h-4" />
                  Industry Confidence: {(marketSize.metadata.industryConfidence * 100).toFixed(0)}%
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-64">
                  This score reflects the reliability of industry data and market research used in this analysis.
                </p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="flex items-center gap-1 cursor-help">
                  <Info className="w-4 h-4" />
                  Data Availability: {(marketSize.metadata.dataAvailability * 100).toFixed(0)}%
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-64">Indicates the completeness of available market data.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CircleDollarSign className="w-5 h-5 text-blue-500" />
                TAM
              </CardTitle>
              <CardDescription>Total Addressable Market</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(marketSize.tam.revenue.value!)}
                </div>
                {marketSize.tam.growthRate && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400" />
                    <span className="text-sm text-green-600 dark:text-green-400">
                      Growth Rate: {marketSize.tam.growthRate}
                    </span>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">{marketSize.tam.explanation}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                SAM
              </CardTitle>
              <CardDescription>Serviceable Addressable Market</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(marketSize.sam.revenue.value!)}
                </div>
                <ProgressWithLabel
                  value={marketSize.sam.revenue.value!}
                  total={marketSize.tam.revenue.value!}
                  label="Serviceable Market"
                />
                <p className="text-sm text-muted-foreground">{marketSize.sam.explanation}</p>
                {marketSize.sam.segmentationCriteria && (
                  <Alert>
                    <AlertDescription>{marketSize.sam.segmentationCriteria}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                SOM
              </CardTitle>
              <CardDescription>Serviceable Obtainable Market</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(marketSize.som.revenue.value!)}
                </div>
                <ProgressWithLabel
                  value={marketSize.som.revenue.value!}
                  total={marketSize.sam.revenue.value!}
                  label="Obtainable Market"
                />
                <p className="text-sm text-muted-foreground">{marketSize.som.explanation}</p>
                {marketSize.som.marketSharePercentage && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-green-600 dark:text-green-400">
                      Target Market Share: {marketSize.som.marketSharePercentage}%
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
            <CardDescription>Reference Materials and Confidence Scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketSize.metadata.sources.map((source, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-blue-500" />
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {source.url}
                      </a>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Published: {new Date(source.datePublished!).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="cursor-help">
                          Credibility: {(source.credibilityScore * 100).toFixed(0)}%
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reliability score based on source reputation and data quality</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="cursor-help">
                          Relevance: {(source.relevanceScore * 100).toFixed(0)}%
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>How closely the source data matches our market analysis needs</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default CustomerReportView;
