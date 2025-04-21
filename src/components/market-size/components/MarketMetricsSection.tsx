import { MarketSize } from '../types';
import MarketMetricCard from './MarketMetricCard';

interface MarketMetricsSectionProps {
  marketSize: MarketSize;
}

const MarketMetricsSection = ({ marketSize }: MarketMetricsSectionProps) => {
  // Add default empty objects to prevent null errors
  const marketAnalysis = marketSize.marketAnalysis || {};
  const tam = marketAnalysis.tam || {
    marketSize: { value: 0, currency: 'USD', unit: 'billion' },
    keyDrivers: [],
    risks: [],
    methodology: 'N/A',
  };

  const sam = marketAnalysis.sam || {
    marketSize: { value: 0, currency: 'USD', unit: 'billion' },
    percentageOfTAM: 0,
    targetSegments: [],
    exclusionCriteria: [],
    methodology: 'N/A',
  };

  const som = marketAnalysis.som || {
    marketSize: { value: 0, currency: 'USD', unit: 'billion' },
    percentageOfSAM: 0,
    timeToAchieve: 0,
    competitiveDynamics: [],
    methodology: 'N/A',
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <MarketMetricCard
        title="TAM"
        value={{
          amount: tam.marketSize?.value || 0,
          currency: tam.marketSize?.currency || 'USD',
          unit: tam.marketSize?.unit || 'billion',
        }}
        description="Total Addressable Market"
        type="tam"
        growthRate={tam.growthRate}
        keyDrivers={tam.keyDrivers || []}
        risks={tam.risks || []}
        methodology={tam.methodology || 'N/A'}
      />

      <MarketMetricCard
        title="SAM"
        value={{
          amount: sam.marketSize?.value || 0,
          currency: sam.marketSize?.currency || 'USD',
          unit: sam.marketSize?.unit || 'billion',
        }}
        description="Serviceable Addressable Market"
        type="sam"
        percentage={(sam.percentageOfTAM || 0) / 100}
        targetSegments={sam.targetSegments || []}
        exclusionCriteria={sam.exclusionCriteria || []}
        methodology={sam.methodology || 'N/A'}
      />

      <MarketMetricCard
        title="SOM"
        value={{
          amount: som.marketSize?.value || 0,
          currency: som.marketSize?.currency || 'USD',
          unit: som.marketSize?.unit || 'billion',
        }}
        description="Serviceable Obtainable Market"
        type="som"
        percentage={(som.percentageOfSAM || 0) / 100}
        timeToAchieve={som.timeToAchieve}
        competitiveDynamics={som.competitiveDynamics || []}
        methodology={som.methodology || 'N/A'}
      />
    </div>
  );
};

export default MarketMetricsSection;
