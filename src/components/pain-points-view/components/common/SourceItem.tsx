import { Badge } from '@/components/ui/badge';
import { ExternalLink, Link2, TrendingUp } from 'lucide-react';
import SentimentBadge from './SentimentBadge';

interface SourceItemProps {
  source: {
    url: string;
    platform: string;
    date: string;
    authorType: string;
    excerpt: string;
    engagement: {
      upvotes: number;
    };
    sentiment: number;
  };
}

const SourceItem = ({ source }: SourceItemProps) => (
  <div className="group bg-card rounded-lg border p-3 hover:border-primary/50 transition-colors">
    <div className="flex items-start justify-between gap-2 mb-2">
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
      >
        <span className="inline-flex items-center gap-1.5">
          <Link2 className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{source.platform}</span>
        </span>
        {/* <span className="text-muted-foreground/70 text-xs">{new Date(source.date).toLocaleDateString()}</span> */}
        <ExternalLink className="w-3 h-3 ml-1 text-muted-foreground/70" />
      </a>
      <Badge variant="outline" className="text-xs capitalize">
        {source.authorType.toLowerCase()}
      </Badge>
    </div>
    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">"{source.excerpt}"</p>
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      {source.engagement.upvotes > 0 && (
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> {source.engagement.upvotes}
        </span>
      )}
      <SentimentBadge score={source.sentiment} />
    </div>
  </div>
);

export default SourceItem;
