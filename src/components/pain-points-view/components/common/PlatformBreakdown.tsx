import { Progress } from '@/components/ui/progress';

interface Platform {
  platform: string;
  sourceCount: number;
}

interface PlatformBreakdownProps {
  platforms: Platform[];
}

const PlatformBreakdown = ({ platforms }: PlatformBreakdownProps) => (
  <div className="space-y-3">
    {platforms.map((platform) => (
      <div key={platform.platform} className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm w-32">
          <span className="text-muted-foreground">{platform.platform}</span>
          <span className="text-muted-foreground/70">({platform.sourceCount})</span>
        </div>
        <div className="flex-1">
          <Progress
            value={(platform.sourceCount / Math.max(...platforms.map((p) => p.sourceCount))) * 100}
            className="h-2"
          />
        </div>
      </div>
    ))}
  </div>
);

export default PlatformBreakdown;
