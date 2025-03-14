import React from 'react';

interface ConfidenceIndicatorProps {
  confidence: number;
  tooltip: string;
  showLabel?: boolean;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ confidence, tooltip, showLabel = false }) => {
  let color = 'bg-red-500';
  let textColor = 'text-red-700 dark:text-red-400';
  let bgColor = 'bg-red-100 dark:bg-red-900/30';

  if (confidence >= 0.8) {
    color = 'bg-green-500';
    textColor = 'text-green-700 dark:text-green-400';
    bgColor = 'bg-green-100 dark:bg-green-900/30';
  } else if (confidence >= 0.6) {
    color = 'bg-amber-500';
    textColor = 'text-amber-700 dark:text-amber-400';
    bgColor = 'bg-amber-100 dark:bg-amber-900/30';
  } else if (confidence >= 0.4) {
    color = 'bg-orange-500';
    textColor = 'text-orange-700 dark:text-orange-400';
    bgColor = 'bg-orange-100 dark:bg-orange-900/30';
  }

  return (
    <div className={`flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 ${bgColor} rounded-full shadow-sm`}>
      <div className="flex items-center gap-1">
        <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${color}`}></div>
        <span className={`text-xs sm:text-sm font-medium ${textColor}`} title={tooltip}>
          {showLabel ? `${(confidence * 100).toFixed(0)}%` : 'Confidence'}
        </span>
      </div>
    </div>
  );
};

export default ConfidenceIndicator;
