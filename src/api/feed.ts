import client from './client';
import { FeedPost } from './segment';

export interface BookmarkPost extends FeedPost {
  postId: string; // Used in the bookmarks API
}

export const addBookmark = async (
  segmentId: string,
  postId: string,
  subreddit: string,
  userId: string
): Promise<BookmarkPost> => {
  const response = await client.post(`/feed/${segmentId}/bookmark`, {
    postId,
    subreddit,
    userId,
  });
  return response.data.data;
};

export const deleteBookmark = async (segmentId: string, postId: string, userId: string): Promise<BookmarkPost> => {
  const response = await client.delete(`/feed/${segmentId}/${userId}/bookmark/${postId}`);
  return response.data.data;
};

export const getBookmarks = async (segmentId: string, userId: string): Promise<BookmarkPost[]> => {
  const response = await client.get(`/feed/${segmentId}/${userId}/bookmarks`);
  return response.data.data;
};
