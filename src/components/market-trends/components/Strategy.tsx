/* eslint-disable @typescript-eslint/no-explicit-any */
import { MarketTrends } from '@/api/research';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap } from 'lucide-react';

interface StrategyProps {
  data: MarketTrends;
}

const Strategy = ({ data }: StrategyProps) => {
  // Safely access data
  const recommendations = data.strategicRecommendations || [];

  if (recommendations.length === 0) {
    return (
      <div className="space-y-6">
        <div className="shadow-md dark:bg-gray-900 border-0 overflow-hidden">
          <div className="pb-2 border-gray-100 dark:border-gray-800">
            <div className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Strategic Recommendations
            </div>
          </div>
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No strategic recommendations available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="shadow-md dark:bg-gray-900 border-0 overflow-hidden">
        <div className="pb-2 border-gray-100 dark:border-gray-800">
          <div className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Strategic Recommendations
          </div>
        </div>
        <div className="pt-4">
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <Card
                key={index}
                className="overflow-hidden border-l-4 transition-all hover:shadow-lg group"
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
                <CardHeader className="pb-2 sm:pb-4 bg-gray-50/50 dark:bg-gray-800/20 transition-colors group-hover:bg-gray-50 dark:group-hover:bg-gray-800/30">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <CardTitle className="text-base sm:text-lg font-semibold">
                      {rec.recommendation || 'No recommendation title'}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={`text-xs px-2.5 py-0.5 whitespace-nowrap ${
                        rec.priorityLevel === 'critical'
                          ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/10 dark:text-red-300 dark:border-red-800/20'
                          : rec.priorityLevel === 'high'
                          ? 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/10 dark:text-orange-300 dark:border-orange-800/20'
                          : rec.priorityLevel === 'medium'
                          ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/10 dark:text-blue-300 dark:border-blue-800/20'
                          : 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/10 dark:text-green-300 dark:border-green-800/20'
                      }`}
                    >
                      {rec.priorityLevel
                        ? rec.priorityLevel.charAt(0).toUpperCase() + rec.priorityLevel.slice(1)
                        : 'Normal'}{' '}
                      Priority
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                    {rec.rationale || 'No rationale provided'}
                  </p>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {rec.trendConnection && rec.trendConnection.length > 0 && (
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                            Connected Trends
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {rec.trendConnection.map((trend, i) => (
                              <Badge
                                key={i}
                                className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 transition-all hover:bg-blue-200 dark:hover:bg-blue-900/40"
                              >
                                {trend}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                          Implementation Difficulty
                        </h4>
                        <div className="flex items-center gap-3">
                          <Progress
                            value={(rec.implementationDifficulty || 0) * 10}
                            className="h-2 flex-1 rounded-full"
                            style={
                              {
                                background: 'rgba(124, 58, 237, 0.1)',
                                '--progress-background':
                                  'linear-gradient(to right, rgb(124, 58, 237), rgb(139, 92, 246))',
                              } as any
                            }
                          />
                          <span className="text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full">
                            {rec.implementationDifficulty || 0}/10
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                          Timeline
                        </h4>
                        <Badge
                          className={`capitalize px-3 py-1 ${
                            rec.timeframe === 'short-term'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : rec.timeframe === 'mid-term'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}
                        >
                          {rec.timeframe || 'Unknown timeframe'}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                          Resource Requirements
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border border-gray-100 dark:border-gray-800/50 leading-relaxed">
                          {rec.resourceRequirements || 'No resource requirements specified'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          Expected Outcome
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 p-3 rounded-md leading-relaxed">
                          {rec.expectedOutcome || 'No expected outcome specified'}
                        </p>
                      </div>

                      {rec.risks && rec.risks.length > 0 && (
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                            Potential Risks
                          </h4>
                          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 p-3 rounded-md">
                            <ul className="list-disc pl-4 text-xs sm:text-sm text-red-700 dark:text-red-400 space-y-1.5">
                              {rec.risks.map((risk, i) => (
                                <li key={i} className="leading-relaxed">
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Strategy;
