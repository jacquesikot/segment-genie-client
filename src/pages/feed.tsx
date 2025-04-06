import { FeedPost, getSegmentFeed, getUserSegments, Segment } from '@/api/segment';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { keys, storage } from '@/lib/storage';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowUpRight,
  Clock,
  ExternalLink,
  Eye,
  Image,
  Loader2,
  MessageSquare,
  RefreshCw,
  Rss,
  ScanSearch,
  Share2,
  ThumbsUp,
  Video,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

// Format time elapsed
const timeAgo = (timestamp: number) => {
  const seconds = Math.floor((Date.now() - timestamp * 1000) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';

  return Math.floor(seconds) + ' seconds ago';
};

// Get content type icon
const ContentTypeIcon = ({ post }: { post: FeedPost }) => {
  if (post.is_video) return <Video className="h-4 w-4 text-red-500" />;
  if (post.gallery_data) return <Image className="h-4 w-4 text-blue-500" />;
  if (post.post_hint === 'image') return <Image className="h-4 w-4 text-green-500" />;
  if (post.is_self) return <Eye className="h-4 w-4 text-purple-500" />;
  return <ExternalLink className="h-4 w-4 text-primary" />;
};

// Feed post component
const FeedPostItem = ({ post }: { post: FeedPost }) => {
  const handlePostClick = () => {
    window.open(`https://reddit.com${post.permalink}`, '_blank');
  };

  // Extract image from post if available
  const getPostImage = () => {
    if (post.preview?.images && post.preview.images.length > 0) {
      const image = post.preview.images[0];
      if (image.source?.url) {
        return decodeURIComponent(image.source.url.replace(/&amp;/g, '&'));
      }
    }
    if (post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default') {
      return post.thumbnail;
    }
    return null;
  };

  const imageUrl = getPostImage();
  const hasAwards = post.all_awardings && post.all_awardings.length > 0;
  const postDate = post.created_utc ? timeAgo(post.created_utc) : '';
  const awardCount = post.all_awardings ? post.all_awardings.reduce((sum, award) => sum + award.count, 0) : 0;

  return (
    <Card className="mb-4 hover:shadow-md transition-all border overflow-hidden group">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            {/* <Avatar className="h-8 w-8 border bg-primary/10">
              <span className="text-xs font-medium">r/</span>
            </Avatar> */}
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">r/{post.subreddit}</p>
                {post.subreddit_subscribers > 0 && (
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {post.subreddit_subscribers.toLocaleString()} members
                  </span>
                )}
              </div>
              <div className="flex items-center text-xs text-muted-foreground flex-wrap">
                <span>u/{post.author}</span>
                {post.author_flair_text && (
                  <>
                    <span className="mx-1">•</span>
                    <Badge variant="outline" className="px-1 py-0 text-[10px] h-4">
                      {post.author_flair_text}
                    </Badge>
                  </>
                )}
                <span className="mx-1">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {postDate}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 ml-auto">
            <Badge variant="outline" className="bg-primary/5 text-xs">
              {post.relevanceScore !== undefined ? `${Math.round(post.relevanceScore * 100)}% relevant` : 'Relevant'}
            </Badge>
            {hasAwards && (
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0">
                  {post.gilded > 0 && '🥇 '}Awards: {awardCount}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-1 pt-2 space-y-3">
        <div className="flex items-start gap-2">
          <ContentTypeIcon post={post} />
          <h3
            className="font-medium text-lg cursor-pointer hover:text-primary transition-colors group-hover:underline"
            onClick={handlePostClick}
          >
            {post.title}
          </h3>
        </div>

        {/* Post content preview */}
        {post.selftext && post.selftext.length > 0 && (
          <div className="text-sm text-muted-foreground line-clamp-3 mt-2">{post.selftext}</div>
        )}

        {/* Image preview */}
        {imageUrl && (
          <div
            className="mt-2 overflow-hidden rounded-md border cursor-pointer aspect-video relative"
            onClick={handlePostClick}
          >
            <img
              src={imageUrl}
              alt={post.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {post.is_video && (
              <div className="absolute top-2 right-2 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs flex items-center">
                <Video className="h-3 w-3 mr-1" /> Video
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between py-3 flex-wrap gap-2">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <div className="flex items-center gap-1 text-muted-foreground hover:text-primary text-xs cursor-pointer transition-colors">
            <ThumbsUp className="h-4 w-4" />
            <span>
              {post.score.toLocaleString()} {post.upvote_ratio && `(${Math.round(post.upvote_ratio * 100)}%)`}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground hover:text-primary text-xs cursor-pointer transition-colors">
            <MessageSquare className="h-4 w-4" />
            <span>{post.num_comments.toLocaleString()} comments</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground hover:text-primary text-xs cursor-pointer transition-colors">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </div>
        </div>
        <button
          className="flex items-center gap-1 text-muted-foreground hover:text-primary text-xs transition-colors"
          onClick={handlePostClick}
        >
          <ArrowUpRight className="h-4 w-4" />
          <span>View on Reddit</span>
        </button>
      </CardFooter>
    </Card>
  );
};

// Post skeleton loading state
const FeedPostSkeleton = () => {
  return (
    <Card className="mb-4 border overflow-hidden">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <div>
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-1 pt-2 space-y-3">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-40 w-full rounded-md" />
      </CardContent>
      <CardFooter className="flex justify-between py-3">
        <div className="flex items-center gap-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-24" />
      </CardFooter>
    </Card>
  );
};

// Simple content loader
const ContentLoader = () => {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <FeedPostSkeleton key={i} />
        ))}
    </div>
  );
};

// Empty state component
const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[400px] text-center">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <ScanSearch className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No Feed Posts Found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn't find any relevant Reddit posts for this segment. Try selecting a different segment or refreshing.
      </p>
      <Button variant="outline">Try Another Segment</Button>
    </div>
  );
};

// Loading segments state
const LoadingSegmentsState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[400px] text-center">
      <div className="bg-primary/10 p-4 rounded-full mb-4 relative">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Loading Your Segments</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        We're retrieving your segments. This will only take a moment...
      </p>
    </div>
  );
};

// No segments state
const NoSegmentsState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[400px] text-center">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <Rss className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No Segments Available</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        You need to create at least one segment before you can view a feed. Head to the segments page to create your
        first segment.
      </p>
      <Button className="bg-primary hover:bg-primary/90">Create a Segment</Button>
    </div>
  );
};

const Feed = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = storage.getItem(keys.USER);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('');

  // Fetch user segments
  const { data: segments, isLoading: segmentsLoading } = useQuery({
    queryKey: ['segments'],
    queryFn: () => getUserSegments(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Set the first segment as selected when segments load
  useEffect(() => {
    if (segments && segments.length > 0 && !selectedSegmentId) {
      setSelectedSegmentId(segments[0]._id);
    }
  }, [segments, selectedSegmentId]);

  // Fetch feed posts for selected segment
  const {
    data: feedPosts,
    isLoading: feedLoading,
    refetch: refetchFeed,
    isFetching: isRefetching,
  } = useQuery({
    queryKey: ['feed', selectedSegmentId],
    queryFn: () => getSegmentFeed(selectedSegmentId),
    enabled: !!selectedSegmentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when the window regains focus
    refetchOnMount: false, // Don't refetch when the component remounts
  });

  // Handle segment change
  const handleSegmentChange = (segmentId: string) => {
    setSelectedSegmentId(segmentId);
  };

  // Handle refresh
  const handleRefresh = () => {
    if (selectedSegmentId) {
      refetchFeed();
    }
  };

  // Always render the control bar to prevent layout shift
  const renderControls = () => (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center sticky top-0 z-10 bg-background pb-4 pt-1 border-b mb-4">
      <div className="w-full sm:w-72">
        <Select
          value={selectedSegmentId}
          onValueChange={handleSegmentChange}
          disabled={segmentsLoading || !(segments && segments.length > 0)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={segmentsLoading ? 'Loading segments...' : 'Select a segment'} />
          </SelectTrigger>
          <SelectContent>
            {segments &&
              segments.length > 0 &&
              segments.map((segment: Segment) => (
                <SelectItem key={segment._id} value={segment._id}>
                  {segment.title}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={feedLoading || isRefetching || !selectedSegmentId}
        className="w-full sm:w-auto"
      >
        {isRefetching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
        Refresh Feed
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageHeader />
      <div className="max-w-[800px] w-full mx-auto p-4 md:p-6 space-y-6 flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">Feed</h1>
            <p className="text-muted-foreground">View relevant Reddit posts for your segments</p>
          </div>
        </div>

        {/* Loading Segments State */}
        {segmentsLoading && <LoadingSegmentsState />}

        {/* No Segments State */}
        {!segmentsLoading && segments && segments.length === 0 && <NoSegmentsState />}

        {/* Feed content */}
        {!segmentsLoading && segments && segments.length > 0 && (
          <>
            {/* Always render controls to prevent layout shift */}
            {renderControls()}

            <ScrollArea className="h-[calc(100vh-240px)]">
              {/* Select a segment prompt */}
              {!selectedSegmentId && (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Rss className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Select a Segment</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Choose a segment to view relevant Reddit posts tailored to that market segment.
                  </p>
                </div>
              )}

              {/* Loading feed posts */}
              {selectedSegmentId && (feedLoading || isRefetching) && <ContentLoader />}

              {/* Empty feed state */}
              {selectedSegmentId && !feedLoading && !isRefetching && feedPosts && feedPosts.length === 0 && (
                <EmptyState />
              )}

              {/* Feed posts */}
              {selectedSegmentId && !feedLoading && !isRefetching && feedPosts && feedPosts.length > 0 && (
                <div className="pb-4">
                  {feedPosts.map((post) => (
                    <FeedPostItem key={post.id || post.url} post={post} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  );
};

export default Feed;
