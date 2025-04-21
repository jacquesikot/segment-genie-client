import { MarketTrends } from '@/api/research';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Blocks, Clock, Lightbulb, Target, TrendingUp } from 'lucide-react';

interface OpportunitiesProps {
  data: MarketTrends;
}

const Opportunities = ({ data }: OpportunitiesProps) => {
  // Safely access data
  const emergingOpportunities = data.emergingOpportunities || [];

  // Sort opportunities by potential impact (highest first)
  const sortedOpportunities = [...emergingOpportunities].sort(
    (a, b) => (b.potentialImpact || 0) - (a.potentialImpact || 0)
  );

  if (sortedOpportunities.length === 0) {
    return (
      <div className="space-y-6">
        <div className="shadow-md dark:bg-gray-900 border-0 overflow-hidden">
          <div className="pb-5">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Emerging Opportunities Summary
            </CardTitle>
          </div>
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No emerging opportunities data available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="shadow-md dark:bg-gray-900 border-0 overflow-hidden">
        <div className="pb-5">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Emerging Opportunities Summary
          </CardTitle>
        </div>
        <div>
          {/* Opportunity Summary Grid */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedOpportunities.slice(0, 3).map((opportunity, index) => (
                <Card key={index} className="border border-gray-200 dark:border-gray-700 shadow-sm">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm mb-2 line-clamp-2">
                      {opportunity.opportunityName || 'Unnamed Opportunity'}
                    </h3>

                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Impact</span>
                          <span className="font-medium">{opportunity.potentialImpact || 0}/10</span>
                        </div>
                        <Progress
                          value={(opportunity.potentialImpact || 0) * 10}
                          className="h-1.5 bg-blue-100 dark:bg-blue-900/20"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Blocks className="w-4 h-4 text-red-500" />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Barrier</span>
                          <span className="font-medium">{opportunity.barrierToEntry || 0}/10</span>
                        </div>
                        <Progress
                          value={(opportunity.barrierToEntry || 0) * 10}
                          className="h-1.5 bg-red-100 dark:bg-red-900/20"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-green-500" />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span>First Mover Advantage</span>
                          <span className="font-medium">
                            {((opportunity.firstMoverAdvantage || 0) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Progress
                          value={(opportunity.firstMoverAdvantage || 0) * 100}
                          className="h-1.5 bg-green-100 dark:bg-green-900/20"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs">
                      <Target className="w-3 h-3 text-purple-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {opportunity.timeframe?.emergenceExpected || 'Unknown timeframe'}
                        {opportunity.timeframe?.estimatedMonths
                          ? ` (${opportunity.timeframe.estimatedMonths} months)`
                          : ''}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                Higher Impact = Better Opportunity
              </Badge>
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                Higher Barrier = More Difficult
              </Badge>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Higher First Mover = More Urgency
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {emergingOpportunities.map((opportunity, index) => (
              <Card
                key={index}
                className={`border-l-4 ${
                  (opportunity.potentialImpact || 0) >= 8
                    ? 'border-l-green-500'
                    : (opportunity.potentialImpact || 0) >= 7
                    ? 'border-l-blue-500'
                    : 'border-l-amber-500'
                }`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{opportunity.opportunityName || 'Unnamed Opportunity'}</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2 mt-1">
                    <Badge
                      className={`
                      ${
                        opportunity.timeframe?.emergenceExpected === 'short-term'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                      }
                    `}
                    >
                      {opportunity.timeframe?.emergenceExpected || 'Unknown timeframe'}
                      {opportunity.timeframe?.estimatedMonths
                        ? ` (${opportunity.timeframe.estimatedMonths} months)`
                        : ''}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      Impact: {opportunity.potentialImpact || 0}/10
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {opportunity.description || 'No description available.'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {opportunity.targetSegments && opportunity.targetSegments.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-1">Target Segments</h4>
                        <ul className="list-disc pl-4 text-gray-700 dark:text-gray-300 space-y-1">
                          {opportunity.targetSegments.map((segment, i) => (
                            <li key={i}>{segment}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div>
                        <span className="font-medium block mb-1">
                          Barrier to Entry: {opportunity.barrierToEntry || 0}/10
                        </span>
                        <Progress value={(opportunity.barrierToEntry || 0) * 10} className="h-1.5" />
                      </div>

                      <div>
                        <span className="font-medium block mb-1">
                          First Mover Advantage: {((opportunity.firstMoverAdvantage || 0) * 100).toFixed(0)}%
                        </span>
                        <Progress
                          value={(opportunity.firstMoverAdvantage || 0) * 100}
                          className="h-1.5 bg-blue-100 dark:bg-blue-900/20"
                        />
                      </div>
                    </div>
                  </div>

                  {opportunity.supportingEvidence && opportunity.supportingEvidence.length > 0 && (
                    <div className="mt-3 text-xs">
                      <h4 className="font-medium mb-1">Supporting Evidence</h4>
                      <ul className="list-disc pl-4 text-gray-700 dark:text-gray-300 space-y-1">
                        {opportunity.supportingEvidence.map((evidence, i) => (
                          <li key={i}>{evidence}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Opportunities;
