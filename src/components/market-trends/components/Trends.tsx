import { MarketTrends } from '@/api/research';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, Target, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';

interface TrendsProps {
  data: MarketTrends;
}

const Trends = ({ data }: TrendsProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedCards, setExpandedCards] = useState<number[]>([]);

  // Safely handle data
  const currentTrends = data.currentTrends || [];

  // Filter trends based on selected category
  const filteredTrends =
    selectedCategory === 'All'
      ? currentTrends
      : currentTrends.filter((trend) => trend?.category?.toLowerCase() === selectedCategory.toLowerCase());

  const toggleCardExpansion = (index: number) => {
    setExpandedCards((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          Current Trends
        </h2>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px] text-xs">
            <SelectValue placeholder="Filter Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Market">Market Trends</SelectItem>
            <SelectItem value="Investment">Investment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredTrends.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No trends data available for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredTrends.map((trend, index) => {
            if (!trend) return null;

            const isExpanded = expandedCards.includes(index);
            const relevance = trend.relevance || 0;
            const relevanceColor = relevance >= 0.9 ? 'indigo' : relevance >= 0.8 ? 'green' : 'gray';

            return (
              <Card
                key={index}
                className={`transition-all duration-300 hover:shadow-lg dark:hover:shadow-indigo-900/10 overflow-hidden
                  border-0 shadow-md dark:bg-gray-900/80 backdrop-blur-sm rounded-xl`}
              >
                <div className={`absolute top-0 left-0 w-1 h-full bg-${relevanceColor}-500`} />

                <CardHeader className="pb-2 pt-5 px-5">
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <CardTitle className="text-base sm:text-lg flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {trend.trendName || 'Unnamed Trend'}
                      </span>
                      <Badge className="capitalize bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 font-normal">
                        {trend.maturityStage || 'Unknown Stage'}
                      </Badge>
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30">
                        <Zap className="w-3 h-3 mr-1" />
                        {((trend.prevalence || 0) * 100).toFixed(0)}%
                      </Badge>
                      <Badge className="bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30">
                        <Target className="w-3 h-3 mr-1" />
                        {(relevance * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-5 pb-5">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {trend.description || 'No description available.'}
                  </p>

                  <button
                    onClick={() => toggleCardExpansion(index)}
                    className="flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors mb-4"
                  >
                    {isExpanded ? 'Hide details' : 'Show details'}
                    <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2 animate-fadeIn">
                      {trend.impactAreas && trend.impactAreas.length > 0 && (
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-4">
                          <h4 className="text-xs font-medium mb-3 text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                            Impact Areas
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {trend.impactAreas.map((area, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30"
                              >
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {trend.supportingEvidence && trend.supportingEvidence.length > 0 && (
                        <div className="bg-purple-50/50 dark:bg-purple-900/10 rounded-lg p-4">
                          <h4 className="text-xs font-medium mb-3 text-purple-800 dark:text-purple-300 uppercase tracking-wider">
                            Supporting Evidence
                          </h4>
                          <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-2 list-disc pl-4">
                            {trend.supportingEvidence.map((evidence, i) => (
                              <li key={i} className="leading-relaxed">
                                {evidence}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Trends;
