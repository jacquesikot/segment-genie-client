import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import React from 'react';

interface FeatureComparisonItem {
  feature: string;
  importance: string;
  competitors: { name: string; implementation: string; notes: string }[];
}

interface OpportunitySpaceItem {
  description: string;
  potentialSize: string;
  entryDifficulty: string;
  timeToMarket: string;
  unservedNeeds: string[];
}

interface ComparativeTabProps {
  comparativeAnalysis: {
    featureComparison: FeatureComparisonItem[];
    opportunitySpaces: OpportunitySpaceItem[];
  };
}

const getImportanceColor = (importance: string) => {
  const lowerImportance = importance.toLowerCase();
  if (lowerImportance.includes('high') || lowerImportance.includes('critical')) {
    return 'text-red-800 dark:text-red-300';
  } else if (lowerImportance.includes('medium')) {
    return 'text-amber-800 dark:text-amber-300';
  } else {
    return 'text-blue-800 dark:text-blue-300';
  }
};

const ComparativeTab: React.FC<ComparativeTabProps> = ({ comparativeAnalysis }) => {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pb-3">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <span className="inline-block w-1.5 h-6 bg-indigo-500 rounded-full mr-1"></span>
            Feature Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {/* Mobile view (card-based layout) */}
            <div className="md:hidden space-y-4 p-4">
              {comparativeAnalysis.featureComparison.map((feature: FeatureComparisonItem, idx: number) => (
                <div key={idx} className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 border-b">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <h4 className="font-semibold text-sm">{feature.feature}</h4>
                      <h4 className={`text-xs py-0.5 ${getImportanceColor(feature.importance)}`}>
                        {feature.importance}
                      </h4>
                    </div>
                  </div>
                  <div className="p-3 space-y-3">
                    {feature.competitors.map((comp, i: number) => (
                      <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-md">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comp.name}</span>
                          <span className="text-xs py-0.5">{comp.implementation}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{comp.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view (table layout) */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50">
                    <th className="p-4 text-left font-medium text-slate-700 dark:text-slate-300 w-1/4">Feature</th>
                    <th className="p-4 text-left font-medium text-slate-700 dark:text-slate-300 w-1/6">Importance</th>
                    <th className="p-4 text-left font-medium text-slate-700 dark:text-slate-300">
                      Competitor Implementation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparativeAnalysis.featureComparison.map((feature: FeatureComparisonItem, idx: number) => (
                    <tr
                      key={idx}
                      className="border-b hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
                    >
                      <td className="p-4 align-top font-medium">{feature.feature}</td>
                      <td className="p-4 align-top">
                        <h4 className={`text-xs py-0.5 ${getImportanceColor(feature.importance)}`}>
                          {feature.importance}
                        </h4>
                      </td>
                      <td className="p-4">
                        <div className="space-y-3">
                          {feature.competitors.map((comp, i: number) => (
                            <div key={i} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{comp.name}</span>
                                <span className="text-xs px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-full">
                                  {comp.implementation}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{comp.notes}</p>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pb-3">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <span className="inline-block w-1.5 h-6 bg-green-500 rounded-full mr-1"></span>
            Opportunity Spaces
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {comparativeAnalysis.opportunitySpaces.map((space: OpportunitySpaceItem, idx: number) => (
              <Card key={idx} className="border shadow-sm overflow-hidden">
                <CardHeader className="p-4 pb-2 bg-slate-50 dark:bg-slate-900/50">
                  <CardTitle className="text-base font-medium">{space.description}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                    <div className="p-2 bg-slate-50 dark:bg-slate-900/30 rounded-md">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Potential Size</div>
                      <div className="font-medium text-sm mt-1">{space.potentialSize}</div>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-900/30 rounded-md">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Entry Difficulty</div>
                      <div className="font-medium text-sm mt-1">{space.entryDifficulty}</div>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-900/30 rounded-md">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Time to Market</div>
                      <div className="font-medium text-sm mt-1">{space.timeToMarket}</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-sm font-medium mb-2">Unserved Needs:</h4>
                    <ul className="space-y-1.5">
                      {space.unservedNeeds.map((need: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{need}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparativeTab;
