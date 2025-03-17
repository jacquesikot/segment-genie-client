import { Status } from '@/api/segment';
import SegmentLoader from '../SegmentLoader';
import MarketOverview from './components/MarketOverview';
import MarketMetricsSection from './components/MarketMetricsSection';
import DataSourcesSection from './components/DataSourcesSection';
import { MarketSize } from './types';

interface Props {
  marketSize?: MarketSize;
  status: Status;
  onRetry?: () => void;
}

const MarketSizeView = ({ marketSize, status, onRetry }: Props) => {
  if (!marketSize) {
    return (
      <SegmentLoader
        progress={status.progress ? status.progress.toString() : '0'}
        statusText={status.message}
        isComplete={status.isComplete}
        title="Market size"
        error={status.progress < 0 ? status.message : undefined}
        onRetry={onRetry}
      />
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <MarketOverview marketSize={marketSize} />
      <MarketMetricsSection marketSize={marketSize} />
      <DataSourcesSection sources={marketSize.metadata.sources} />
    </div>
  );
};

export default MarketSizeView;
