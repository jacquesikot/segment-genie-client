import client from './client';
import type { ResearchInput, ResearchReport } from './research';

export interface Status {
  progress: number;
  message: string;
  isComplete: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export interface RedditComment {
  id: string;
  body: string;
  author: string;
  score: number;
  created_utc: number;
  permalink: string;
  replies?: RedditComment[];
  is_submitter: boolean;
  distinguished?: string;
  gilded: number;
  depth: number;
  author_flair_text?: string;
}

export interface FeedPost {
  id: string;
  title: string;
  selftext: string;
  url: string;
  isBookmarked?: boolean;
  created_utc: number;
  subreddit: string;
  author: string;
  permalink: string;
  score: number;
  relevanceScore?: number;
  thumbnail: string;
  preview?: {
    images: Array<{
      source: {
        url: string;
        width: number;
        height: number;
      };
      resolutions: Array<{
        url: string;
        width: number;
        height: number;
      }>;
    }>;
    enabled: boolean;
  };
  num_comments: number;
  upvote_ratio: number;
  post_hint?: string;
  is_video: boolean;
  is_original_content: boolean;
  is_self: boolean;
  domain: string;
  over_18: boolean;
  spoiler: boolean;
  locked: boolean;
  stickied: boolean;
  subreddit_subscribers: number;
  subreddit_type: string;
  subreddit_id: string;
  author_flair_text?: string;
  gilded: number;
  distinguished?: string;
  post_categories?: string[];
  all_awardings?: Array<{
    name: string;
    description: string;
    icon_url: string;
    count: number;
  }>;
  media?: {
    type?: string;
    oembed?: {
      provider_url: string;
      title: string;
      html: string;
      thumbnail_url?: string;
    };
    reddit_video?: {
      fallback_url: string;
      height: number;
      width: number;
      duration: number;
    };
  };
  gallery_data?: {
    items: Array<{
      media_id: string;
      id: number;
    }>;
  };
  crosspost_parent_list?: FeedPost[];
  comments?: RedditComment[];
}

export interface SegmentStatus {
  general: Status;
  marketSize: Status;
  painPoints: Status;
  competitors: Status;
  marketTrends: Status;
}

export interface Segment {
  _id: string;
  userId: string;
  query?: string;
  title: string;
  status: SegmentStatus;
  input: ResearchInput;
  data?: ResearchReport;
  timestamp: Date;
}

export const createSegment = async (segment: Partial<Segment>): Promise<Segment> => {
  return (await client.post('/segment', segment)).data.data;
};

export const getSegment = async (segmentId: string): Promise<Segment> => {
  return (await client.get(`/segment/${segmentId}`)).data.data;
};

export const getUserSegments = async (userId: string): Promise<Segment[] | []> => {
  const data = await client.get(`/segment/user/${userId}`);
  return data.data.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteSegment = async (segmentId: string): Promise<any> => {
  const res = await client.delete(`/segment/${segmentId}`);
  return res.data.data;
};

export const getSegmentFeed = async (segmentId: string): Promise<FeedPost[]> => {
  const data = await client.post(`/feed/${segmentId}/relevant-posts`);
  return data.data.data;
};

export const generateSegmentFeedReply = async (
  segmentId: string,
  postId: string,
  subreddit: string
): Promise<string> => {
  const data = await client.post(`/feed/reply`, {
    segmentId,
    postId,
    subreddit,
  });
  return data.data.data;
};
