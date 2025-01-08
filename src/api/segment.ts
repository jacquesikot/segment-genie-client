import client from './client';
import type { NewResearch, ResearchReport } from './research';

export interface Segment {
  _id: string;
  userId: string;
  title: string;
  status: {
    message: string;
    progress: string;
    isComplete: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any[];
  };
  input: NewResearch;
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
  try {
    const data = await client.get(`/segment/user/${userId}`);
    return data.data.data;
  } catch (error) {
    console.log('🚀 ~ getUserSegments ~ error:', error);
    return [];
  }
};
