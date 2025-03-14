import { MarketTrends } from '@/api/research';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface TrendsProps {
  data: MarketTrends;
}

const Trends = ({ data }: TrendsProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter trends based on selected category
  const filteredTrends =
    selectedCategory === 'All'
      ? data.currentTrends
      : data.currentTrends?.filter((trend) => trend.trendName.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Current Trends</h2>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px] text-xs">
            <SelectValue placeholder="Filter Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Trends</SelectItem>
            <SelectItem value="AI">AI & ML</SelectItem>
            <SelectItem value="Data">Data</SelectItem>
            <SelectItem value="Privacy">Privacy & Security</SelectItem>
            <SelectItem value="Micro">MicroSaaS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTrends?.map((trend, index) => (
          <Card
            key={index}
            className={`border-l-4 overflow-hidden ${
              trend.relevance >= 0.9
                ? 'border-l-blue-500'
                : trend.relevance >= 0.8
                ? 'border-l-green-500'
                : 'border-l-gray-300'
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-base sm:text-lg flex items-center">
                  {trend.trendName}
                  <Badge className="ml-2 capitalize bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {trend.maturityStage}
                  </Badge>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30">
                    Prevalence: {(trend.prevalence * 100).toFixed(0)}%
                  </Badge>
                  <Badge className="bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30">
                    Relevance: {(trend.relevance * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{trend.description}</p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                <div>
                  <h4 className="text-xs font-medium mb-2">Impact Areas</h4>
                  <div className="flex flex-wrap gap-1">
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

                <div>
                  <h4 className="text-xs font-medium mb-2">Supporting Evidence</h4>
                  <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1 list-disc pl-4">
                    {trend.supportingEvidence.map((evidence, i) => (
                      <li key={i}>{evidence}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-medium mb-2">Competitor Adoption</h4>
                  <div className="space-y-2">
                    {trend.competitorAdoption.map((comp, i) => (
                      <div key={i} className="text-xs flex items-start">
                        <Badge
                          className={`mr-2 flex-shrink-0 ${
                            comp.adoptionLevel === 'full'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : comp.adoptionLevel === 'partial'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                        >
                          {comp.adoptionLevel}
                        </Badge>
                        <div>
                          <span className="font-medium">{comp.competitor}:</span> {comp.details}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend Intersections */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-purple-500" />
            Trend Intersections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.trendIntersections?.map((intersection, index) => (
              <div
                key={index}
                className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 rounded-lg p-4"
              >
                <div className="flex flex-wrap gap-2 mb-2">
                  {intersection.trends.map((trend, i) => (
                    <Badge key={i} className="bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                      {trend}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{intersection.description}</p>
                <div className="flex justify-between items-center text-xs mt-2">
                  <span className="text-gray-500 dark:text-gray-400">{intersection.significance}</span>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    Opportunity Score: {intersection.opportunityScore}/10
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Trends;
