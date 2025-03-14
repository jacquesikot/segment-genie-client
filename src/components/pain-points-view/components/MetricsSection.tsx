import { Separator } from '@/components/ui/separator';
import { Flame, Link2, Users } from 'lucide-react';
import MetricCard from './common/MetricCard';
import PlatformBreakdown from './common/PlatformBreakdown';
import SentimentIndicator from './common/SentimentIndicator';

interface MetadataType {
  dataFreshness: string;
  sourceDiversity: number;
  sentimentScore: number;
  validationScore: number;
  totalSourcesAnalyzed: number;
  dateRange: {
    earliest: string;
    latest: string;
  };
  platformBreakdown: {
    platform: string;
    sourceCount: number;
    averageEngagement: number;
  }[];
}

interface MetricsSectionProps {
  metadata: MetadataType;
}

const MetricsSection = ({ metadata }: MetricsSectionProps) => {
  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SentimentIndicator score={metadata.sentimentScore} />
        <MetricCard
          title="Sources Analyzed"
          value={metadata.totalSourcesAnalyzed}
          icon={<Link2 className="w-5 h-5 text-blue-500" />}
          tooltip="Total number of sources analyzed for this research"
        />
        <MetricCard
          title="Source Diversity"
          value={`${(metadata.sourceDiversity * 100).toFixed(0)}%`}
          icon={<Users className="w-5 h-5 text-green-500" />}
          tooltip="Measure of how diverse the sources are across different platforms"
        />
        <MetricCard
          title="Confidence Score"
          value={`${(metadata.validationScore * 100).toFixed(0)}%`}
          icon={<Flame className="w-5 h-5 text-orange-500" />}
          tooltip="Confidence level in the accuracy and reliability of the data"
        />
      </div>

      <Separator />

      {metadata.platformBreakdown && (
        <div>
          <h3 className="font-medium text-lg mb-3">Platform Distribution</h3>
          <PlatformBreakdown platforms={metadata.platformBreakdown} />
        </div>
      )}
    </>
  );
};

export default MetricsSection;
