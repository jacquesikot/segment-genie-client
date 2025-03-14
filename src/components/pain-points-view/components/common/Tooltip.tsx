import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Info } from 'lucide-react';
import { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
}

const Tooltip = ({ children, content }: TooltipProps) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <span className="inline-flex items-center gap-1 cursor-help">
        {children}
        <Info className="w-3.5 h-3.5 text-muted-foreground/70" />
      </span>
    </HoverCardTrigger>
    <HoverCardContent className="text-sm p-3 max-w-[280px]">{content}</HoverCardContent>
  </HoverCard>
);

export default Tooltip;
