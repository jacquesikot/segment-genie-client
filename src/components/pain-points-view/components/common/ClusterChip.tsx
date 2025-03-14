import { Flame } from 'lucide-react';

interface ClusterChipProps {
  cluster: {
    clusterName: string;
    description: string;
  };
}

const ClusterChip = ({ cluster }: ClusterChipProps) => (
  <div className="p-3 bg-card rounded-lg border">
    <div className="flex items-center gap-2 mb-2">
      <div className="bg-orange-100 dark:bg-orange-950/50 p-1.5 rounded-md">
        <Flame className="w-4 h-4 text-orange-500" />
      </div>
      <h4 className="font-medium text-sm">{cluster.clusterName}</h4>
    </div>
    <p className="text-sm text-muted-foreground mb-3">{cluster.description}</p>
    <div className="flex flex-wrap gap-2"></div>
  </div>
);

export default ClusterChip;
