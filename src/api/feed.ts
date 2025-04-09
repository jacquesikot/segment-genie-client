import client from './client';

export const addBookmark = async (segmentId: string, postId: string, subreddit: string) => {
  const response = await client.post(`/feed/${segmentId}/bookmark`, {
    postId,
    subreddit,
  });
  return response.data.data;
};

export const deleteBookmark = async (segmentId: string, postId: string) => {
  const response = await client.delete(`/feed/${segmentId}/bookmark/${postId}`);
  return response.data.data;
};

export const getBookmarks = async (segmentId: string) => {
  const response = await client.get(`/feed/${segmentId}/bookmarks`);
  return response.data.data;
};
