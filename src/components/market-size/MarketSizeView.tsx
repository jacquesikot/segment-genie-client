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
  const safeStatus = status || { progress: 0, message: 'Loading...', isComplete: false };

  if (!marketSize) {
    return (
      <SegmentLoader
        progress={safeStatus.progress ? safeStatus.progress.toString() : '0'}
        statusText={safeStatus.message || 'Loading...'}
        isComplete={!!safeStatus.isComplete}
        title="Market size"
        error={safeStatus.progress < 0 ? safeStatus.message : undefined}
        onRetry={onRetry}
      />
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <MarketOverview marketSize={marketSize} />
      <MarketMetricsSection marketSize={marketSize} />
      <DataSourcesSection sources={marketSize.metadata?.sources || []} />
    </div>
  );
};

export default MarketSizeView;
