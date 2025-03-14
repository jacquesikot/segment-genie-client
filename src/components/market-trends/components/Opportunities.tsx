import { MarketTrends } from '@/api/research';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Lightbulb } from 'lucide-react';
import { CartesianGrid, Legend, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';

interface OpportunitiesProps {
  data: MarketTrends;
}

const Opportunities = ({ data }: OpportunitiesProps) => {
  // Prepare opportunity data
  const opportunityData = data.emergingOpportunities?.map((opp) => ({
    name: opp.opportunityName.length > 25 ? opp.opportunityName.substring(0, 25) + '...' : opp.opportunityName,
    impact: opp.potentialImpact * 10,
    barrier: opp.barrierToEntry * 10,
    advantage: opp.firstMoverAdvantage * 100,
  }));

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Emerging Opportunities Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="barrier"
                  name="Barrier to Entry"
                  domain={[0, 10]}
                  label={{ value: 'Barrier to Entry', position: 'bottom', offset: 0 }}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  type="number"
                  dataKey="impact"
                  name="Potential Impact"
                  domain={[0, 10]}
                  label={{ value: 'Potential Impact', angle: -90, position: 'left' }}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'advantage') return [`${value}%`, 'First Mover Advantage'];
                    return [value, name];
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
                          <p className="font-medium text-xs mb-1">{data.name}</p>
                          <p className="text-xs">
                            Impact: <span className="font-medium">{data.impact / 10}/10</span>
                          </p>
                          <p className="text-xs">
                            Barrier: <span className="font-medium">{data.barrier / 10}/10</span>
                          </p>
                          <p className="text-xs">
                            First Mover Advantage: <span className="font-medium">{data.advantage}%</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Scatter
                  name="Opportunities"
                  data={opportunityData}
                  fill="#6366F1"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  shape={(props: any) => {
                    const { cx, cy, payload } = props;
                    const size = (payload.advantage / 100) * 30 + 10; // Scale bubble size based on advantage

                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={size}
                        fill="#6366F1"
                        fillOpacity={0.6}
                        stroke="#4F46E5"
                        strokeWidth={1}
                      />
                    );
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            <div className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 rounded-full bg-blue-500 opacity-60"></div>
              <span>Bubble size = First Mover Advantage</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span>Top-Left:</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                High Impact, Low Barrier
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span>Bottom-Right:</span>
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                Low Impact, High Barrier
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {data.emergingOpportunities?.map((opportunity, index) => (
              <Card
                key={index}
                className={`border-l-4 ${
                  opportunity.potentialImpact >= 8
                    ? 'border-l-green-500'
                    : opportunity.potentialImpact >= 7
                    ? 'border-l-blue-500'
                    : 'border-l-amber-500'
                }`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{opportunity.opportunityName}</CardTitle>
                  <div className="flex gap-2 mt-1">
                    <Badge
                      className={`
                      ${
                        opportunity.timeframe.emergenceExpected === 'short-term'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                      }
                    `}
                    >
                      {opportunity.timeframe.emergenceExpected} ({opportunity.timeframe.estimatedMonths} months)
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      Impact: {opportunity.potentialImpact}/10
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{opportunity.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <h4 className="font-medium mb-1">Target Segments</h4>
                      <ul className="list-disc pl-4 text-gray-700 dark:text-gray-300 space-y-1">
                        {opportunity.targetSegments.map((segment, i) => (
                          <li key={i}>{segment}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="font-medium block mb-1">
                          Barrier to Entry: {opportunity.barrierToEntry}/10
                        </span>
                        <Progress value={opportunity.barrierToEntry * 10} className="h-1.5" />
                      </div>

                      <div>
                        <span className="font-medium block mb-1">
                          First Mover Advantage: {(opportunity.firstMoverAdvantage * 100).toFixed(0)}%
                        </span>
                        <Progress
                          value={opportunity.firstMoverAdvantage * 100}
                          className="h-1.5 bg-blue-100 dark:bg-blue-900/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs">
                    <h4 className="font-medium mb-1">Supporting Evidence</h4>
                    <ul className="list-disc pl-4 text-gray-700 dark:text-gray-300 space-y-1">
                      {opportunity.supportingEvidence.map((evidence, i) => (
                        <li key={i}>{evidence}</li>
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

export default Opportunities;
