import React from 'react';

export const MetricItem = ({ label, value, icon }: { label: string; value: number; icon?: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
      <div className="flex items-center gap-3">
        {icon && <div className="text-indigo-600 dark:text-indigo-400">{icon}</div>}
        <span className="text-sm font-medium text-muted-foreground dark:text-gray-300">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold dark:text-gray-200">{(value * 100).toFixed(0)}%</span>
        <div className="relative w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="absolute h-full bg-indigo-600 dark:bg-indigo-500" style={{ width: `${value * 100}%` }} />
        </div>
      </div>
    </div>
  );
};
