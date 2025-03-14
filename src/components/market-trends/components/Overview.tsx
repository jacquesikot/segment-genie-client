import { MarketTrends } from '@/api/research';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, AlertTriangle, ChevronRight, Globe } from 'lucide-react';

interface OverviewProps {
  data: MarketTrends;
}

const Overview = ({ data }: OverviewProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Market Overview Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Market Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{data.marketOverview?.currentState}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="font-medium text-sm mb-3 text-gray-800 dark:text-gray-200">Key Metrics</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">SaaS Market Growth</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Growth
                    </Badge>
                  </div>
                  <p className="font-semibold text-sm">{data.marketOverview?.keyMetrics?.SaaSMarketGrowth}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">MicroSaaS Market Growth</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Growth
                    </Badge>
                  </div>
                  <p className="font-semibold text-sm">{data.marketOverview?.keyMetrics?.MicroSaaSMarketGrowth}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">AI Integration Adoption</span>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Adoption</Badge>
                  </div>
                  <p className="font-semibold text-sm">{data.marketOverview?.keyMetrics?.AIIntegrationAdoption}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm mb-3 text-gray-800 dark:text-gray-200">Market Dynamics</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Disruption Potential</span>
                    <span className="font-semibold text-sm">
                      {((data.marketOverview?.disruptionPotential || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={(data.marketOverview?.disruptionPotential || 0) * 100} className="h-1.5 mt-2" />
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Adoption Cycle</span>
                    <Badge className="capitalize bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {data.marketOverview?.adoptionCycle}
                    </Badge>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-2">Source Diversity</span>
                  <div className="flex items-center gap-2">
                    <Progress value={(data.metadata.sourceDiversity || 0) * 100} className="h-1.5 flex-1" />
                    <span className="text-sm font-medium">
                      {((data.metadata.sourceDiversity || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium text-sm mb-3 text-gray-800 dark:text-gray-200">Dominant Trends</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {data.marketOverview?.dominantTrends?.map((trend, index) => (
                <div
                  key={index}
                  className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg p-2 flex items-center"
                >
                  <ChevronRight className="w-4 h-4 text-blue-500 mr-1 flex-shrink-0" />
                  <span className="text-xs text-blue-700 dark:text-blue-300">{trend}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threats & Challenges Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Threats & Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <div>
              <Accordion type="single" collapsible className="w-full">
                {data.threatsAndChallenges?.map((threat, index) => (
                  <AccordionItem key={index} value={`threat-${index}`} className="border-b">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex items-start">
                        <div
                          className={`p-1 rounded-full mr-2 ${
                            threat.severity >= 8
                              ? 'bg-red-100 dark:bg-red-900/30'
                              : threat.severity >= 6
                              ? 'bg-amber-100 dark:bg-amber-900/30'
                              : 'bg-yellow-100 dark:bg-yellow-900/30'
                          }`}
                        >
                          <AlertCircle
                            className={`w-4 h-4 ${
                              threat.severity >= 8
                                ? 'text-red-500 dark:text-red-400'
                                : threat.severity >= 6
                                ? 'text-amber-500 dark:text-amber-400'
                                : 'text-yellow-500 dark:text-yellow-400'
                            }`}
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium">{threat.threatName}</p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span className="mr-2">Severity: {threat.severity}/10</span>
                            <span>Likelihood: {(threat.likelihood * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-8 text-xs">
                      <p className="mb-2 text-gray-700 dark:text-gray-300">{threat.description}</p>

                      <div className="mt-3">
                        <span className="font-medium block mb-1">Impact Areas:</span>
                        <div className="flex flex-wrap gap-1">
                          {threat.impactAreas.map((area, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30"
                            >
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="font-medium block mb-1">Mitigation Strategies:</span>
                        <ul className="list-disc pl-4 text-gray-700 dark:text-gray-300 space-y-1">
                          {threat.mitigationStrategies.map((strategy, i) => (
                            <li key={i}>{strategy}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-3">
                        <span className="font-medium block mb-1">Timeframe:</span>
                        <Badge
                          className={`
                          ${
                            threat.timeframe === 'immediate'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                              : threat.timeframe === 'short-term'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                          }
                        `}
                        >
                          {threat.timeframe}
                        </Badge>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
