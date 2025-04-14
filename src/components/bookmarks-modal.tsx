import { deleteBookmark, getBookmarks } from '@/api/feed';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Loader2,
  MessageSquare,
  RefreshCw,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { FC, useEffect, useState } from 'react';

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

// Helper to format date
const formatDate = (timestamp: number) => {
  return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
};

// Helper to format Reddit URLs
const formatRedditUrl = (permalink: string) => {
  return `https://reddit.com${permalink}`;
};

// Helper to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

interface BookmarksModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSegmentId: string;
  userId: string;
  onBookmarkRemoved?: (postId: string) => void;
}

const BookmarksModal: FC<BookmarksModalProps> = ({
  isOpen,
  onOpenChange,
  selectedSegmentId,
  userId,
  onBookmarkRemoved,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [removingBookmarks, setRemovingBookmarks] = useState<Record<string, boolean>>({});

  // Query to fetch bookmarks
  const {
    data: bookmarks,
    isLoading: isLoadingBookmarks,
    isError: isErrorBookmarks,
    refetch: refetchBookmarks,
  } = useQuery({
    queryKey: ['bookmarks', selectedSegmentId, userId],
    queryFn: () => getBookmarks(selectedSegmentId, userId),
    enabled: !!selectedSegmentId && !!userId && isOpen,
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep data in cache for 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // Refetch bookmarks when modal opens or segment/user changes
  useEffect(() => {
    if (isOpen && selectedSegmentId && userId) {
      refetchBookmarks();
    }
  }, [isOpen, selectedSegmentId, userId, refetchBookmarks]);

  // Function to remove a bookmark
  const handleRemoveBookmark = async (postId: string) => {
    if (removingBookmarks[postId]) return;

    // Set the loading state for this post
    setRemovingBookmarks((prev) => ({ ...prev, [postId]: true }));

    try {
      // Call the API to remove the bookmark
      await deleteBookmark(selectedSegmentId, postId, userId);

      // Refresh the bookmarks query
      queryClient.invalidateQueries({ queryKey: ['bookmarks', selectedSegmentId, userId] });

      // Update parent component if callback is provided
      if (onBookmarkRemoved) {
        onBookmarkRemoved(postId);
      }

      toast({
        title: 'Post removed from bookmarks',
        description: 'The post has been removed from your bookmarks',
      });
    } catch (error) {
      toast({
        title: 'Failed to remove bookmark',
        description: error instanceof Error ? error.message : 'Failed to remove bookmark. Please try again.',
        variant: 'destructive',
      });
    } finally {
      // Clear the loading state
      setRemovingBookmarks((prev) => {
        const newState = { ...prev };
        delete newState[postId];
        return newState;
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[90%] sm:w-[450px] md:w-[550px] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 pb-2 border-b">
            <div className="flex items-center space-x-2">
              <BookmarkCheck className="h-5 w-5 text-primary" />
              <SheetTitle>Bookmarked Posts</SheetTitle>
            </div>
            <SheetDescription>Saved posts from your selected segment</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-auto p-6">
            {isLoadingBookmarks ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-muted-foreground">Loading your bookmarks...</p>
              </div>
            ) : isErrorBookmarks ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-600 dark:text-red-400">Failed to load bookmarks</h3>
                  <p className="text-muted-foreground text-sm mt-1">Please try again later</p>
                </div>
                <Button onClick={() => refetchBookmarks()} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try again
                </Button>
              </div>
            ) : bookmarks && bookmarks.length > 0 ? (
              <div className="space-y-4">
                {bookmarks.map((bookmark) => (
                  <Card key={bookmark.id} className="w-full hover:shadow-sm transition-shadow">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-base leading-tight">
                          <a
                            href={formatRedditUrl(bookmark.permalink)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-primary"
                          >
                            {truncateText(bookmark.title, 80)}
                          </a>
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveBookmark(bookmark.id || bookmark.postId)}
                          disabled={removingBookmarks[bookmark.id || bookmark.postId]}
                        >
                          {removingBookmarks[bookmark.id || bookmark.postId] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span className="sr-only">Remove bookmark</span>
                        </Button>
                      </div>
                      <CardDescription className="text-xs flex flex-wrap items-center gap-x-1.5 gap-y-1 mt-1">
                        <span className="font-medium text-foreground/80">r/{bookmark.subreddit}</span>
                        <span>•</span>
                        <span>{formatDate(bookmark.created_utc)}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-4 pt-2 flex justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>{bookmark.score.toLocaleString()}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>{bookmark.num_comments.toLocaleString()}</span>
                        </div>
                      </div>
                      <a
                        href={formatRedditUrl(bookmark.permalink)}
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
            ) : (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                <div className="rounded-full bg-muted p-6">
                  <Bookmark className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No bookmarks yet</h3>
                <p className="text-muted-foreground max-w-sm">
                  Bookmark posts from your feed to save them for later. They will appear here.
                </p>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <SheetClose asChild>
              <Button className="w-full" variant="outline">
                Close
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookmarksModal;
