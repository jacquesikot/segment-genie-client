import { MarketTrends } from '@/api/research';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Globe, Zap } from 'lucide-react';

interface StrategyProps {
  data: MarketTrends;
}

const Strategy = ({ data }: StrategyProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            Strategic Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.strategicRecommendations?.map((rec, index) => (
              <Card
                key={index}
                className="overflow-hidden border-l-4 transition-all hover:shadow-md"
                style={{
                  borderLeftColor:
                    rec.priorityLevel === 'critical'
                      ? 'rgb(239, 68, 68)'
                      : rec.priorityLevel === 'high'
                      ? 'rgb(249, 115, 22)'
                      : rec.priorityLevel === 'medium'
                      ? 'rgb(59, 130, 246)'
                      : 'rgb(16, 185, 129)',
                }}
              >
                <CardHeader className="pb-2 sm:pb-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <CardTitle className="text-base sm:text-lg">{rec.recommendation}</CardTitle>
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-0.5 ${
                        rec.priorityLevel === 'critical'
                          ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/10 dark:text-red-300 dark:border-red-800/20'
                          : rec.priorityLevel === 'high'
                          ? 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/10 dark:text-orange-300 dark:border-orange-800/20'
                          : rec.priorityLevel === 'medium'
                          ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/10 dark:text-blue-300 dark:border-blue-800/20'
                          : 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/10 dark:text-green-300 dark:border-green-800/20'
                      }`}
                    >
                      {rec.priorityLevel.charAt(0).toUpperCase() + rec.priorityLevel.slice(1)} Priority
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm mt-2 text-gray-700 dark:text-gray-300">{rec.rationale}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                          Connected Trends
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {rec.trendConnection.map((trend, i) => (
                            <Badge key={i} className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                              {trend}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                          Implementation Difficulty
                        </h4>
                        <div className="flex items-center gap-2">
                          <Progress value={rec.implementationDifficulty * 10} className="h-1.5 flex-1" />
                          <span className="text-xs font-medium">{rec.implementationDifficulty}/10</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                          Timeline
                        </h4>
                        <Badge
                          className={`capitalize ${
                            rec.timeframe === 'short-term'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : rec.timeframe === 'mid-term'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}
                        >
                          {rec.timeframe}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                          Resource Requirements
                        </h4>
                        <p className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-md">
                          {rec.resourceRequirements}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                          Expected Outcome
                        </h4>
                        <p className="text-xs text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 p-2 rounded-md">
                          {rec.expectedOutcome}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                          Potential Risks
                        </h4>
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 p-2 rounded-md">
                          <ul className="list-disc pl-4 text-xs text-red-700 dark:text-red-400 space-y-1">
                            {rec.risks.map((risk, i) => (
                              <li key={i}>{risk}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Influencing Factors */}
      {data.influencingFactors && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              Influencing Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.influencingFactors.map((factor, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Badge
                      className={`capitalize mt-0.5 ${
                        factor.factorType === 'technological'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : factor.factorType === 'economic'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : factor.factorType === 'social'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                          : factor.factorType === 'political'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : factor.factorType === 'environmental'
                          ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}
                    >
                      {factor.factorType}
                    </Badge>
                    <h3 className="font-medium text-sm">{factor.factorName}</h3>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-2">{factor.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        factor.directionality === 'positive'
                          ? 'text-green-700 dark:text-green-400'
                          : factor.directionality === 'negative'
                          ? 'text-red-700 dark:text-red-400'
                          : 'text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {factor.directionality}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {factor.permanence}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Strategy;
