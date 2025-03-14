import { MarketTrends } from '@/api/research';
import { Status } from '@/api/segment';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SegmentLoader from '../SegmentLoader';
import DataSources from './components/DataSources';
import Header from './components/Header';
import Opportunities from './components/Opportunities';
import Overview from './components/Overview';
import Strategy from './components/Strategy';
import Trends from './components/Trends';
import { useState, useEffect } from 'react';

interface Props {
  data: MarketTrends;
  status: Status;
}

const MarketTrendsView = ({ data, status }: Props) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [, setIsMobile] = useState(false);

  // Check if we're on mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640); // 640px is the sm breakpoint
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-8 pb-20">
      <Card className="shadow-lg dark:bg-gray-900 border-0 overflow-hidden">
        <CardHeader className="pb-4 sm:pb-6">
          <Header data={data} />
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            {/* Mobile Dropdown */}
            <div className="sm:hidden mb-6">
              <Select value={activeTab} onValueChange={handleTabChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="trends">Current Trends</SelectItem>
                  <SelectItem value="opportunities">Opportunities</SelectItem>
                  <SelectItem value="strategy">Strategy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Desktop Tabs */}
            <TabsList className="hidden sm:grid mb-10 w-full grid-cols-4 gap-1">
              <TabsTrigger value="overview" className="text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="trends" className="text-sm">
                Current Trends
              </TabsTrigger>
              <TabsTrigger value="opportunities" className="text-sm">
                Opportunities
              </TabsTrigger>
              <TabsTrigger value="strategy" className="text-sm">
                Strategy
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="overview">
              <Overview data={data} />
            </TabsContent>

            <TabsContent value="trends">
              <Trends data={data} />
            </TabsContent>

            <TabsContent value="opportunities">
              <Opportunities data={data} />
            </TabsContent>

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
