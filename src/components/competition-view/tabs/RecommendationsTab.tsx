import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RecommendationsTabProps {
  recommendations: any[];
}

const RecommendationsTab: React.FC<RecommendationsTabProps> = ({ recommendations }) => {
  return (
    <div className="grid gap-4 sm:gap-6">
      {recommendations.map((rec: any, idx: number) => (
        <Card
          key={idx}
          className="overflow-hidden border-l-4 transition-all hover:shadow-md"
          style={{
            borderLeftColor:
              rec.priority === 'high'
                ? 'rgb(248, 113, 113)'
                : rec.priority === 'medium'
                ? 'rgb(251, 191, 36)'
                : 'rgb(96, 165, 250)',
          }}
        >
          <CardHeader className="pb-2 sm:pb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-base sm:text-lg">{rec.recommendation}</CardTitle>
              <Badge
                variant="outline"
                className={`text-xs px-2 py-0.5 ${
                  rec.priority === 'high'
                    ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/10 dark:text-red-300 dark:border-red-800/20'
                    : rec.priority === 'medium'
                    ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/10 dark:text-amber-300 dark:border-amber-800/20'
                    : 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/10 dark:text-blue-300 dark:border-blue-800/20'
                }`}
              >
                {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
              </Badge>
            </div>
            <CardDescription className="text-xs sm:text-sm mt-2">{rec.rationale}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Resources Required
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-900/30 p-2 sm:p-3 rounded-lg text-xs sm:text-sm">
                    {rec.resourceRequirements}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Implementation Timeline
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-900/30 p-2 sm:p-3 rounded-lg text-xs sm:text-sm">
                    {rec.timeline || 'Not specified'}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Potential Risks
                </h4>
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/20 p-2 sm:p-3 rounded-lg">
                  <ul className="list-disc pl-4 text-xs sm:text-sm space-y-1 text-red-600 dark:text-red-300">
                    {rec.risks.map((risk: string, i: number) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>

                {rec.benefits && rec.benefits.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expected Benefits
                    </h4>
                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/20 p-2 sm:p-3 rounded-lg">
                      <ul className="list-disc pl-4 text-xs sm:text-sm space-y-1 text-green-600 dark:text-green-300">
                        {rec.benefits.map((benefit: string, i: number) => (
                          <li key={i}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {rec.competitiveAdvantage && (
              <div className="mt-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20 p-2 sm:p-3 rounded-lg">
                <h4 className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-300 mb-1">
                  Competitive Advantage
                </h4>
                <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-300">{rec.competitiveAdvantage}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecommendationsTab;
