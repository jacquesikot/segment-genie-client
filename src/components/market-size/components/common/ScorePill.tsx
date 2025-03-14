export const ScorePill = ({ value, label }: { value: number; label: string }) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-950/30';
    if (score >= 0.6) return 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/30';
    if (score >= 0.4) return 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/30';
    return 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/30';
  };

  const colorClass = getScoreColor(value);

  return (
    <div className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {label}: <span>{(value * 100).toFixed(0)}%</span>
    </div>
  );
};
