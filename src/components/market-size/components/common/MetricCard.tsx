import React from 'react';

export const MetricCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
    <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
      {icon}
    </div>
    <div>
      <div className="text-sm text-muted-foreground dark:text-gray-400">{label}</div>
      <div className="font-medium dark:text-white">{value}</div>
    </div>
  </div>
);
