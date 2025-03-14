import { cn } from '@/lib/utils';

interface SentimentBadgeProps {
  score: number;
}

const SentimentBadge = ({ score }: SentimentBadgeProps) => {
  const getSentimentColor = (score: number) => {
    if (score >= 0.3) return 'bg-green-500/20 text-green-600';
    if (score <= -0.3) return 'bg-red-500/20 text-red-600';
    return 'bg-yellow-500/20 text-yellow-600';
  };

  return (
    <span
      className={cn('px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1', getSentimentColor(score))}
    >
      {score >= 0.3 ? 'Positive' : score <= -0.3 ? 'Negative' : 'Neutral'}
    </span>
  );
};

export default SentimentBadge;
