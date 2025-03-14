import { PainPoints } from '@/api/research';
import { Status } from '@/api/segment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Brain } from 'lucide-react';
import SegmentLoader from '../SegmentLoader';
import ClusterSection from './components/ClusterSection';
import MetricsSection from './components/MetricsSection';
import PainPointCard from './components/PainPointCard';

interface Props {
  data?: PainPoints;
  status: Status;
}

const PainPointsView = ({ data, status }: Props) => {
  if (!data) {
    return (
      <SegmentLoader
        progress={status.progress.toString()}
        statusText={status.message}
        isComplete={status.isComplete}
        error={status.progress < 0 ? status.message : undefined}
        title="Pain points"
      />
    );
  }

  const { metadata, painPoints, painPointClusters } = data;

  return (
    <div className="space-y-6 pb-20">
      {/* Overview Section */}
      <Card className="shadow-lg dark:bg-gray-900 border-0 overflow-hidden">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 dark:bg-purple-950/50 p-3 rounded-lg flex-shrink-0">
              <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-2xl dark:text-white break-words">Pain Points Analysis</CardTitle>
              <CardDescription className="mt-2 dark:text-gray-300 break-words">
                {metadata.totalSourcesAnalyzed} Sources Analyzed · Confidence:{' '}
                {(metadata.validationScore * 100).toFixed(0)}%
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <MetricsSection metadata={metadata} />

          <Separator />

          <ClusterSection clusters={painPointClusters} />
        </CardContent>
      </Card>

      {/* Pain Points List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Identified Pain Points</h2>
        <div className="space-y-4">
          {painPoints.map((point) => (
            <PainPointCard key={point.id} point={point} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PainPointsView;
