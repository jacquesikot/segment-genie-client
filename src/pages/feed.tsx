import { addBookmark, deleteBookmark, generateSegmentFeedReply, getBookmarks, getSegmentFeed } from '@/api/feed';
import { Segment } from '@/api/segment';
import BookmarksModal from '@/components/bookmarks-modal';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { storage } from '@/lib/storage';
import { useAppSelector } from '@/redux/hooks';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Bookmark, Copy, ExternalLink, MessageSquare, RefreshCw, ThumbsUp, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { siReddit } from 'simple-icons/icons';

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
  const queryClient = useQueryClient();
  const segments = useAppSelector((state) => state.segment.segments) as Segment[];
  const userId = 'user123'; // Mock user ID for now - in a real app, get this from auth state
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [generatingReplies, setGeneratingReplies] = useState<Record<string, boolean>>({});
  const [generatedReplies, setGeneratedReplies] = useState<Record<string, string>>({});
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, boolean>>({});
  const [isBookmarksModalOpen, setIsBookmarksModalOpen] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState<Record<string, boolean>>({});

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

  // Query to get feed posts
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
    gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes
  });

  // Load bookmarks when segment or user changes
  useEffect(() => {
    fetchBookmarks();
  }, [selectedSegmentId, userId]);

  // Function to fetch and set bookmarks
  const fetchBookmarks = async () => {
    if (!selectedSegmentId || !userId) return;

    try {
      const bookmarks = await getBookmarks(selectedSegmentId, userId);

      // Map the bookmarked posts to our state format
      const bookmarksMap: Record<string, boolean> = {};
      bookmarks.forEach((bookmark) => {
        bookmarksMap[bookmark.id] = true;
      });
      setBookmarkedPosts(bookmarksMap);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const handleSegmentChange = (value: string) => {
    setSelectedSegmentId(value);
    // Reset bookmarked posts state when segment changes
    setBookmarkedPosts({});
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

  const handleGenerateReply = async (postId: string, subreddit: string) => {
    if (generatingReplies[postId]) return;

    try {
      // Mark this post as generating a reply
      setGeneratingReplies((prev) => ({ ...prev, [postId]: true }));

      // Call the API to generate a reply
      const reply = await generateSegmentFeedReply(selectedSegmentId, postId, subreddit);

      // Store the generated reply and show it
      setGeneratedReplies((prev) => ({ ...prev, [postId]: reply }));
      setShowReplies((prev) => ({ ...prev, [postId]: true }));

      toast({
        title: 'Reply generated',
        description: 'Your reply is ready to copy',
      });
    } catch (error) {
      toast({
        title: 'Failed to generate reply',
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      // Mark generation as complete
      setGeneratingReplies((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleCopyReply = (postId: string) => {
    if (generatedReplies[postId]) {
      navigator.clipboard.writeText(generatedReplies[postId]);
      toast({
        title: 'Reply copied',
        description: 'Reply has been copied to clipboard',
      });
    }
  };

  const handleToggleReply = (postId: string) => {
    setShowReplies((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Refresh bookmarks whenever modal opens
  useEffect(() => {
    if (isBookmarksModalOpen) {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', selectedSegmentId, userId] });
    }
  }, [isBookmarksModalOpen, queryClient, selectedSegmentId, userId]);

  const handleToggleBookmark = async (postId: string, subreddit: string) => {
    if (isBookmarking[postId]) return;

    // Set the loading state for this post
    setIsBookmarking((prev) => ({ ...prev, [postId]: true }));

    try {
      const isCurrentlyBookmarked = bookmarkedPosts[postId];

      if (isCurrentlyBookmarked) {
        // Remove from bookmarks
        await deleteBookmark(selectedSegmentId, postId, userId);

        setBookmarkedPosts((prev) => {
          const newState = { ...prev };
          delete newState[postId];
          return newState;
        });

        toast({
          title: 'Post removed from bookmarks',
          description: 'The post has been removed from your bookmarks',
        });
      } else {
        // Add to bookmarks
        await addBookmark(selectedSegmentId, postId, subreddit, userId);

        setBookmarkedPosts((prev) => ({
          ...prev,
          [postId]: true,
        }));

        toast({
          title: 'Post added to bookmarks',
          description: 'The post has been added to your bookmarks',
        });
      }

      // Refresh all bookmarks in case the modal is open
      if (isBookmarksModalOpen) {
        // Refresh the bookmarks query
        queryClient.invalidateQueries({ queryKey: ['bookmarks', selectedSegmentId, userId] });
      }
    } catch (error) {
      toast({
        title: 'Bookmark action failed',
        description: error instanceof Error ? error.message : 'Failed to update bookmarks. Please try again.',
        variant: 'destructive',
      });
    } finally {
      // Clear the loading state
      setIsBookmarking((prev) => {
        const newState = { ...prev };
        delete newState[postId];
        return newState;
      });
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

  // Handler function for when a bookmark is removed from the modal
  const handleBookmarkRemoved = (postId: string) => {
    setBookmarkedPosts((prev) => {
      const newState = { ...prev };
      delete newState[postId];
      return newState;
    });
  };

  return (
    <>
      <PageHeader />

      {/* Bookmarks Modal */}
      <BookmarksModal
        isOpen={isBookmarksModalOpen}
        onOpenChange={setIsBookmarksModalOpen}
        selectedSegmentId={selectedSegmentId}
        userId={userId}
        onBookmarkRemoved={handleBookmarkRemoved}
      />

      <div className="container mx-auto py-6 px-4 md:px-6">
        {/* Add the animation styles */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes progressAnimation {
            0% { width: 5%; }
            10% { width: 15%; }
            25% { width: 28%; }
            50% { width: 45%; }
            75% { width: 65%; }
            90% { width: 80%; }
            95% { width: 90%; }
            100% { width: 95%; }
          }
          .progress-bar {
            animation: progressAnimation 2.5s ease-in-out infinite;
            width: 0%;
          }
          /* Make sure markdown content respects container width */
          .prose p, .prose pre, .prose code, .prose a, .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
            overflow-wrap: break-word;
            word-wrap: break-word;
            word-break: break-word;
            max-width: 100%;
          }
          .prose pre {
            white-space: pre-wrap;
            overflow-x: auto;
          }
          .prose code {
            white-space: pre-wrap;
          }
        `,
          }}
        />

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <svg
                role="img"
                viewBox="0 0 24 24"
                width={24}
                height={24}
                xmlns="http://www.w3.org/2000/svg"
                fill={`#${siReddit.hex}`}
              >
                <title>{siReddit.title}</title>
                <path d={siReddit.path} />
              </svg>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Reddit Feed</h1>
                <p className="text-muted-foreground mt-1">Discover relevant Reddit posts based on your segments</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 w-full sm:w-auto">
              <div className="flex flex-col w-full sm:w-auto gap-1.5">
                <label htmlFor="segment-selector" className="text-sm font-medium text-muted-foreground">
                  Active Segment
                </label>
                <Select
                  value={selectedSegmentId}
                  onValueChange={handleSegmentChange}
                  disabled={segments.length === 0 || isLoading}
                >
                  <SelectTrigger id="segment-selector" className="w-full sm:w-[220px]">
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
              </div>

              <div className="flex flex-row gap-2 w-full sm:w-auto self-end">
                <Button onClick={() => setIsBookmarksModalOpen(true)} variant="outline" className="flex-1 sm:flex-none">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Bookmarks
                </Button>

                <Button
                  onClick={handleRefresh}
                  disabled={!selectedSegmentId || isRefreshing || isLoading}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-3xl mx-auto">
              <div className="animate-pulse">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  width={64}
                  height={64}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={`#${siReddit.hex}`}
                  className="mb-6 animate-bounce"
                >
                  <title>{siReddit.title}</title>
                  <path d={siReddit.path} />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mt-4 mb-2">Finding relevant Reddit posts...</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                This may take a few moments as we search, filter, and analyze Reddit posts related to your segment.
              </p>
              <div className="flex justify-center w-full max-w-md mx-auto">
                <div className="h-1.5 bg-orange-100 dark:bg-orange-950 rounded-full w-full overflow-hidden">
                  <div className="h-full bg-orange-500 dark:bg-orange-600 rounded-full progress-bar"></div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                We're collecting posts from various subreddits to find the most relevant content for you.
              </p>
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
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
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
                        <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-medium text-foreground/80">r/{post.subreddit}</span>
                          <span>•</span>
                          <span>Posted by u/{post.author}</span>
                          <span>•</span>
                          <span>{formatDate(post.created_utc)}</span>
                          {post.domain && post.domain !== 'self.' + post.subreddit && (
                            <>
                              <span>•</span>
                              <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{post.domain}</span>
                            </>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-1.5 items-end">
                        {post.relevanceScore !== undefined && (
                          <div className="rounded-full text-xs px-2 py-1 bg-primary/10 text-primary font-medium whitespace-nowrap">
                            {Math.round(post.relevanceScore * 100)}% relevant
                          </div>
                        )}
                        {post.is_original_content && (
                          <div className="rounded-full text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium">
                            OC
                          </div>
                        )}
                      </div>
                    </div>
                    {post.post_categories && post.post_categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.post_categories.map((category, index) => (
                          <span key={index} className="text-xs bg-secondary/50 px-1.5 py-0.5 rounded">
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    {post.selftext ? (
                      <div className="prose dark:prose-invert text-sm text-muted-foreground w-full max-w-full overflow-x-hidden">
                        <ReactMarkdown>{truncateText(post.selftext, 280)}</ReactMarkdown>
                      </div>
                    ) : null}

                    {/* Improved media display logic */}
                    {!post.is_self && (
                      <div className="mt-3">
                        {post.is_video && post.media?.reddit_video ? (
                          <div className="rounded-md overflow-hidden">
                            <video
                              controls
                              className="w-full max-h-80 object-contain"
                              poster={post.thumbnail !== 'default' ? post.thumbnail : undefined}
                            >
                              <source src={post.media.reddit_video.fallback_url} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        ) : post.preview?.images && post.preview.images.length > 0 ? (
                          <div className="rounded-md overflow-hidden">
                            <img
                              src={post.preview.images[0].source.url.replace(/&amp;/g, '&')}
                              alt={post.title}
                              className="w-full max-h-80 object-contain"
                              onError={(e) => {
                                // Fallback to thumbnail on error
                                if (post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default') {
                                  (e.target as HTMLImageElement).src = post.thumbnail;
                                } else {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }
                              }}
                            />
                          </div>
                        ) : post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default' ? (
                          <div className="rounded-md overflow-hidden flex justify-center">
                            <img
                              src={post.thumbnail}
                              alt={post.title}
                              className="max-h-48 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        ) : null}

                        {/* Gallery display */}
                        {post.gallery_data && post.gallery_data.items && post.gallery_data.items.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground mb-1">
                              Gallery with {post.gallery_data.items.length} items
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-4 pb-0 border-t flex flex-col gap-4">
                    <div className="w-full flex flex-wrap justify-between items-center gap-2">
                      <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.score.toLocaleString()}</span>
                          {post.upvote_ratio && (
                            <span className="text-xs">({Math.round(post.upvote_ratio * 100)}%)</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.num_comments.toLocaleString()}</span>
                        </div>
                        {post.subreddit_subscribers && (
                          <div className="text-xs flex items-center gap-1">
                            <span className="font-medium">Subscribers:</span>
                            <span>{post.subreddit_subscribers.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {post.over_18 && (
                          <span className="text-xs px-1.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded font-medium">
                            NSFW
                          </span>
                        )}
                        {post.spoiler && (
                          <span className="text-xs px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 rounded font-medium">
                            Spoiler
                          </span>
                        )}
                        <Button
                          onClick={() => handleToggleBookmark(post.id, post.subreddit)}
                          variant="ghost"
                          size="sm"
                          disabled={isBookmarking[post.id]}
                          className={`text-xs ${bookmarkedPosts[post.id] ? 'text-primary' : ''}`}
                          title={bookmarkedPosts[post.id] ? 'Remove from bookmarks' : 'Add to bookmarks'}
                        >
                          {isBookmarking[post.id] ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Bookmark className="h-4 w-4" fill={bookmarkedPosts[post.id] ? 'currentColor' : 'none'} />
                          )}
                        </Button>
                        <Button
                          onClick={() => handleGenerateReply(post.id, post.subreddit)}
                          disabled={!!generatingReplies[post.id] || Object.values(generatingReplies).some(Boolean)}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          {generatingReplies[post.id] && <RefreshCw className="mr-1.5 h-3 w-3 animate-spin" />}
                          {generatingReplies[post.id] ? 'Generating...' : 'Generate Reply'}
                        </Button>
                        <a
                          href={formatRedditUrl(post.permalink)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center hover:underline text-muted-foreground"
                        >
                          View on Reddit
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    {/* Reply generation section */}
                    <div className="w-full">
                      <div className="flex items-center justify-between gap-2">
                        {/* Action buttons row */}
                        <div className="flex items-center gap-2">
                          {generatedReplies[post.id] && (
                            <Button
                              onClick={() => handleToggleReply(post.id)}
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                            >
                              {showReplies[post.id] ? 'Hide Reply' : 'Show Reply'}
                            </Button>
                          )}
                        </div>

                        {/* Other potential actions can go here */}
                      </div>

                      {/* Generated reply content */}
                      {generatedReplies[post.id] && showReplies[post.id] && (
                        <div className="w-full space-y-3 border rounded-md p-3 mt-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium">Generated Reply</h4>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleGenerateReply(post.id, post.subreddit)}
                                disabled={
                                  !!generatingReplies[post.id] || Object.values(generatingReplies).some(Boolean)
                                }
                                size="sm"
                                variant="ghost"
                                className="h-8 px-2"
                              >
                                <RefreshCw className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                onClick={() => handleCopyReply(post.id)}
                                size="sm"
                                variant="ghost"
                                className="h-8 px-2"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                onClick={() => handleToggleReply(post.id)}
                                size="sm"
                                variant="ghost"
                                className="h-8 px-2"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                          <div className="prose dark:prose-invert max-w-none text-sm p-2 bg-secondary/20 rounded-md">
                            <ReactMarkdown>{generatedReplies[post.id]}</ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
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
