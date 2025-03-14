import { MarketTrends } from '@/api/research';
import { Status } from '@/api/segment';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SegmentLoader from '../SegmentLoader';
import DataSources from './components/DataSources';
import Header from './components/Header';
import Opportunities from './components/Opportunities';
import Overview from './components/Overview';
import Strategy from './components/Strategy';
import Trends from './components/Trends';

interface Props {
  data: MarketTrends;
  status: Status;
}

const MarketTrendsView = ({ data, status }: Props) => {
  if (!data) {
    return (
      <SegmentLoader
        progress={status.progress.toString()}
        statusText={status.message}
        isComplete={status.isComplete}
        error={status.progress < 0 ? status.message : undefined}
        title="Market Trends"
      />
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <Card className="shadow-lg border-0 overflow-hidden mb-6">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 pb-4 sm:pb-6">
          <Header data={data} />
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-10 sm:mb-6 w-full grid grid-cols-2 sm:grid-cols-4 gap-1">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="trends" className="text-xs sm:text-sm">
                Current Trends
              </TabsTrigger>
              <TabsTrigger value="opportunities" className="text-xs sm:text-sm">
                Opportunities
              </TabsTrigger>
              <TabsTrigger value="strategy" className="text-xs sm:text-sm">
                Strategy
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <Overview data={data} />
            </TabsContent>

            {/* Current Trends Tab */}
            <TabsContent value="trends">
              <Trends data={data} />
            </TabsContent>

            {/* Opportunities Tab */}
            <TabsContent value="opportunities">
              <Opportunities data={data} />
            </TabsContent>

            {/* Strategy Tab */}
            <TabsContent value="strategy">
              <Strategy data={data} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <DataSources data={data} />
    </div>
  );
};

export default MarketTrendsView;
