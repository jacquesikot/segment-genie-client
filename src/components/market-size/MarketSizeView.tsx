import { Status } from '@/api/segment';
import SegmentLoader from '../SegmentLoader';
import MarketOverview from './components/MarketOverview';
import MarketMetricsSection from './components/MarketMetricsSection';
import DataSourcesSection from './components/DataSourcesSection';
import { MarketSize } from './types';

interface Props {
  marketSize?: MarketSize;
  status: Status;
}

const MarketSizeView = ({ marketSize, status }: Props) => {
  if (!marketSize) {
    return (
      <SegmentLoader
        progress={status.progress ? status.progress.toString() : '0'}
        statusText={status.message}
        isComplete={status.isComplete}
        title="Market size"
        error={status.progress < 0 ? status.message : undefined}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Market Overview Card */}
      <MarketOverview marketSize={marketSize} />

      {/* Market Size Visualization */}
      <MarketMetricsSection marketSize={marketSize} />

      {/* Data Sources Section */}
      <DataSourcesSection sources={marketSize.metadata.sources} />
    </div>
  );
};

export default MarketSizeView;
