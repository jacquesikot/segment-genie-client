import { ReactNode } from 'react';
import Tooltip from './Tooltip';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  tooltip?: string;
}

const MetricCard = ({ title, value, icon, tooltip }: MetricCardProps) => (
  <div className="bg-card rounded-lg border p-4 flex items-center gap-3">
    <div className="p-2 rounded-full bg-muted">{icon}</div>
    <div>
      <div className="text-sm text-muted-foreground flex items-center gap-1">
        {title}
        {tooltip && (
          <Tooltip content={tooltip}>
            <span></span>
          </Tooltip>
        )}
      </div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  </div>
);

export default MetricCard;
