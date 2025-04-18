import { Progress } from '@/components/ui/progress';
import { Frown, Meh, SmilePlus } from 'lucide-react';

interface SentimentIndicatorProps {
  score: number;
}

const SentimentIndicator = ({ score }: SentimentIndicatorProps) => {
  const getSentimentInfo = (score: number) => {
    if (score >= 0.3) return { icon: SmilePlus, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-950/50' };
    if (score <= -0.3) return { icon: Frown, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-950/50' };
    return { icon: Meh, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-950/50' };
  };

  const { icon: Icon, color, bgColor } = getSentimentInfo(score);

  return (
    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
      <div className={`p-2 rounded-full ${bgColor}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="space-y-1">
        <div className="text-sm font-medium">Sentiment Score</div>
        <div className="flex items-center gap-2">
          <Progress value={(score + 1) * 50} className="w-24 h-2" />
          <span className="text-xs font-mono text-muted-foreground">{(score ?? 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default SentimentIndicator;
