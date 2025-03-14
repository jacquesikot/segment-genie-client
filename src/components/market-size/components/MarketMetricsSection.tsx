import React from 'react';
import { MarketSize } from '../types';
import MarketMetricCard from './MarketMetricCard';

interface MarketMetricsSectionProps {
  marketSize: MarketSize;
}

const MarketMetricsSection = ({ marketSize }: MarketMetricsSectionProps) => {
  const tam = marketSize.marketAnalysis.tam;
  const sam = marketSize.marketAnalysis.sam;
  const som = marketSize.marketAnalysis.som;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <MarketMetricCard
        title="TAM"
        value={{
          amount: tam.marketSize.value,
          currency: tam.marketSize.currency,
          unit: tam.marketSize.unit,
        }}
        description="Total Addressable Market"
        type="tam"
        growthRate={tam.growthRate}
        keyDrivers={tam.keyDrivers}
        risks={tam.risks}
        methodology={tam.methodology}
      />

      <MarketMetricCard
        title="SAM"
        value={{
          amount: sam.marketSize.value,
          currency: sam.marketSize.currency,
          unit: sam.marketSize.unit,
        }}
        description="Serviceable Addressable Market"
        type="sam"
        percentage={sam.percentageOfTAM / 100}
        targetSegments={sam.targetSegments}
        exclusionCriteria={sam.exclusionCriteria}
        methodology={sam.methodology}
      />

      <MarketMetricCard
        title="SOM"
        value={{
          amount: som.marketSize.value,
          currency: som.marketSize.currency,
          unit: som.marketSize.unit,
        }}
        description="Serviceable Obtainable Market"
        type="som"
        percentage={som.percentageOfSAM / 100}
        timeToAchieve={som.timeToAchieve}
        competitiveDynamics={som.competitiveDynamics}
        methodology={som.methodology}
      />
    </div>
  );
};

export default MarketMetricsSection;
