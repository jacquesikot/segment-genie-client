import client from './client';
import type { NewResearch, ResearchReport } from './research';

export interface Segment {
  _id: string;
  userId: string;
  title: string;
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

export const getUserSegments = async (): Promise<Segment[] | []> => {
  try {
    return (await client.get(`/segment/user`)).data.data;
  } catch (error) {
    console.log('🚀 ~ getUserSegments ~ error:', error);
    return [];
  }
};
