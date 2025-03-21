import { getUserSegments, Segment } from '@/api/segment';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalytics } from '@/hooks/use-analytics';
import { keys, storage } from '@/lib/storage';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, BarChart, CheckCircle2, CircleAlert, Clock, Loader2, Plus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const SegmentCardSkeleton = () => {
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex items-center justify-between mt-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
};

// Loading state component
const LoadingState = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <SegmentCardSkeleton key={i} />
      ))}
    </div>
  );
};

const SegmentCard = ({ segment }: { segment: Segment }) => {
  const navigate = useNavigate();
  const analytics = useAnalytics();

  const getStatusIcon = () => {
    if (segment.status.marketSize.isComplete) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    } else if (segment.status.marketSize.progress < 0) {
      return <CircleAlert className="h-5 w-5 text-red-500" />;
    } else {
      return <Clock className="h-5 w-5 text-amber-500 animate-pulse" />;
    }
  };

  const handleCardClick = () => {
    analytics.trackEvent(analytics.Event.NAVIGATION_CLICK, {
      path: `/segment/${segment._id}`,
      from: 'segments',
      action: 'view_segment',
    });
    navigate(`/segment/${segment._id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 group"
    >
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{segment.title}</h3>
          </div>
          {getStatusIcon()}
        </div>
        {segment.timestamp && (
          <p className="text-sm text-muted-foreground">{formatDate(new Date(segment.timestamp).toDateString())}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm">
          <span className="font-medium">Industry:</span> {segment.input.marketContext.industry}
        </div>
        <div className="text-sm">
          <span className="font-medium">Target Segment:</span> {segment.input.customerProfile.segment}
        </div>
        {segment.status.marketSize.isComplete ? (
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Analysis Complete</span>
            </div>
            <Button variant="ghost" size="sm" className="hover:text-primary hover:bg-primary/10">
              View Details →
            </Button>
          </div>
        ) : segment.status.marketSize.progress < 0 ? (
          <div className="flex items-center space-x-2 mt-4 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>{segment.status.marketSize.message}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 mt-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{segment.status.marketSize.message}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No Segments Yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Start by creating your first segment analysis. We'll help you understand your target market better.
      </p>
      <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90">
        <Plus className="mr-2 h-4 w-4" />
        Create Your First Segment
      </Button>
    </div>
  );
};

const SegmentsPage = () => {
  const navigate = useNavigate();
  const analytics = useAnalytics();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = storage.getItem(keys.USER);
  const { data: segments, isLoading } = useQuery({
    queryKey: ['segments'],
    queryFn: () => getUserSegments(user!.id),
  });

  const handleNewSegmentClick = () => {
    analytics.trackEvent(analytics.Event.NAVIGATION_CLICK, {
      path: '/',
      from: 'segments',
      action: 'new_segment',
    });
    navigate('/');
  };

  return (
    <>
      <PageHeader />
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
        {segments && segments.length ? (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold">Your Segments</h1>
              <p className="text-muted-foreground">View and manage your market segment analyses</p>
            </div>
            <Button onClick={handleNewSegmentClick} className="bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  New Segment
                </>
              )}
            </Button>
          </div>
        ) : null}

        {isLoading ? (
          <LoadingState />
        ) : (segments || []).length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(segments || []).map((segment) => (
              <SegmentCard key={segment._id} segment={segment} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SegmentsPage;
