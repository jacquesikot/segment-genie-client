import client from './client';
import type { ResearchInput, ResearchReport } from './research';

export interface Status {
  progress: number;
  message: string;
  isComplete: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export interface SegmentStatus {
  general: Status;
  marketSize: Status;
  painPoints: Status;
}

export interface Segment {
  _id: string;
  userId: string;
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
  try {
    const data = await client.get(`/segment/user/${userId}`);
    return data.data.data;
  } catch (error) {
    console.log('🚀 ~ getUserSegments ~ error:', error);
    return [];
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteSegment = async (segmentId: string): Promise<any> => {
  const res = await client.delete(`/segment/${segmentId}`);
  return res.data.data;
};
