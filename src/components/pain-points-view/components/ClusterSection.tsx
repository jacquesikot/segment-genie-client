import ClusterChip from './common/ClusterChip';

interface ClusterSectionProps {
  clusters: {
    clusterName: string;
    description: string;
  }[];
}

const ClusterSection = ({ clusters }: ClusterSectionProps) => {
  return (
    <div>
      <h3 className="font-medium text-lg mb-3">Key Clusters</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {clusters.map((cluster) => (
          <ClusterChip key={cluster.clusterName} cluster={cluster} />
        ))}
      </div>
    </div>
  );
};

export default ClusterSection;
