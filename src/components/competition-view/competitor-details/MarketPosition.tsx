import React from 'react';
import { MarketPositionItem } from '../common/MetricItems';

interface MarketPositionProps {
  marketPosition: any;
}

const MarketPosition: React.FC<MarketPositionProps> = ({ marketPosition }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
      <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        Market Position
      </h4>
      <div className="text-xs sm:text-sm space-y-2 sm:space-y-3">
        <MarketPositionItem label="Target Markets" value={marketPosition.targetMarkets.join(', ')} />
        <MarketPositionItem label="Geographic Presence" value={marketPosition.geographicPresence.join(', ')} />
        <MarketPositionItem label="Market Share" value={marketPosition.marketShare || 'Not available'} />
        <MarketPositionItem label="Growth Rate" value={marketPosition.growthRate || 'Not available'} />
      </div>
    </div>
  );
};

export default MarketPosition;
