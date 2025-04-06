import { Segment, getSegmentFeed } from '@/api/segment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector } from '@/redux/hooks';
import { storage } from '@/lib/storage';
import { AlertCircle, ExternalLink, MessageSquare, RefreshCw, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/page-header';

// Format relative time (e.g., "2 hours ago")
const formatDistanceToNow = (date: Date, options?: { addSuffix?: boolean }): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return options?.addSuffix ? 'just now' : 'less than a minute';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}${options?.addSuffix ? ' ago' : ''}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''}${options?.addSuffix ? ' ago' : ''}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''}${options?.addSuffix ? ' ago' : ''}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''}${options?.addSuffix ? ' ago' : ''}`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''}${options?.addSuffix ? ' ago' : ''}`;
};

const STORAGE_KEY_SELECTED_SEGMENT = 'SELECTED_SEGMENT';

export default function Feed() {
  const { toast } = useToast();
  const segments = useAppSelector((state) => state.segment.segments) as Segment[];
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load selected segment from local storage on initial render
  useEffect(() => {
    const savedSegmentId = storage.getItem<string>(STORAGE_KEY_SELECTED_SEGMENT);

    if (savedSegmentId && segments.some((segment) => segment._id === savedSegmentId)) {
      setSelectedSegmentId(savedSegmentId);
    } else if (segments.length > 0) {
      // Default to first segment if saved segment doesn't exist or is invalid
      setSelectedSegmentId(segments[0]._id);
      storage.setItem(STORAGE_KEY_SELECTED_SEGMENT, segments[0]._id);
    }
  }, [segments]);

  // Save selected segment to local storage when it changes
  useEffect(() => {
    if (selectedSegmentId) {
      storage.setItem(STORAGE_KEY_SELECTED_SEGMENT, selectedSegmentId);
    }
  }, [selectedSegmentId]);

  const {
    data: feedPosts,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['feed', selectedSegmentId],
    queryFn: () => getSegmentFeed(selectedSegmentId),
    enabled: !!selectedSegmentId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  const handleSegmentChange = (value: string) => {
    setSelectedSegmentId(value);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: 'Feed refreshed',
        description: 'Latest posts have been loaded',
      });
    } catch {
      toast({
        title: 'Failed to refresh feed',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Helper to format Reddit URLs
  const formatRedditUrl = (permalink: string) => {
    return `https://reddit.com${permalink}`;
  };

  // Helper to format date
  const formatDate = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
  };

  // Helper to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <>
      <PageHeader />
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reddit Feed</h1>
              <p className="text-muted-foreground mt-1">Discover relevant Reddit posts based on your segments</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <Select
                value={selectedSegmentId}
                onValueChange={handleSegmentChange}
                disabled={segments.length === 0 || isLoading}
              >
                <SelectTrigger className="w-full sm:w-[220px]">
                  <SelectValue placeholder="Select a segment" />
                </SelectTrigger>
                <SelectContent>
                  {segments.map((segment) => (
                    <SelectItem key={segment._id} value={segment._id}>
                      {segment.title}
                    </SelectItem>
                  ))}
                  {segments.length === 0 && (
                    <SelectItem value="none" disabled>
                      No segments available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>

              <Button
                onClick={handleRefresh}
                disabled={!selectedSegmentId || isRefreshing}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="flex flex-col w-full">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-4 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Error state */}
          {isError && (
            <Card className="border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800 max-w-3xl mx-auto">
              <CardHeader>
                <div className="flex items-center">
                  <AlertCircle className="text-red-500 mr-2 h-5 w-5" />
                  <CardTitle className="text-red-600 dark:text-red-400">Error loading feed</CardTitle>
                </div>
                <CardDescription className="text-red-500 dark:text-red-400">
                  {error instanceof Error ? error.message : 'Failed to load feed data. Please try again.'}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => refetch()} variant="outline" className="mt-2">
                  Try again
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Empty state */}
          {!isLoading && !isError && feedPosts && feedPosts.length === 0 && (
            <Card className="text-center p-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="rounded-full bg-muted p-4">
                  <MessageSquare className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No posts found</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  There are no relevant Reddit posts for this segment at the moment. Try selecting a different segment
                  or refreshing later.
                </p>
                <Button onClick={handleRefresh} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </Card>
          )}

          {/* Feed posts column */}
          {!isLoading && !isError && feedPosts && feedPosts.length > 0 && (
            <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
              {feedPosts.map((post) => (
                <Card key={post.id} className="w-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5">
                        <CardTitle className="text-lg leading-tight">
                          <a
                            href={formatRedditUrl(post.permalink)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-primary"
                          >
                            {truncateText(post.title, 100)}
                          </a>
                        </CardTitle>
                        <CardDescription>
                          <span className="font-medium text-foreground/80">r/{post.subreddit}</span> • Posted by u/
                          {post.author} • {formatDate(post.created_utc)}
                        </CardDescription>
                      </div>
                      {post.relevanceScore !== undefined && (
                        <div className="rounded-full text-xs px-2 py-1 bg-primary/10 text-primary font-medium">
                          {Math.round(post.relevanceScore * 100)}% relevant
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {post.selftext ? (
                      <p className="text-sm text-muted-foreground">{truncateText(post.selftext, 280)}</p>
                    ) : post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default' ? (
                      <div className="mt-2 flex justify-center">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="rounded-md max-h-48 object-cover"
                          onError={(e) => {
                            // Hide image on error
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ) : null}
                  </CardContent>
                  <CardFooter className="pt-4 pb-4 border-t flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.score.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.num_comments.toLocaleString()}</span>
                      </div>
                    </div>
                    <a
                      href={formatRedditUrl(post.permalink)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs flex items-center hover:underline text-muted-foreground"
                    >
                      View on Reddit
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
