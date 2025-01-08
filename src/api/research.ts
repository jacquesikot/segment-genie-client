import client from './client';
import type { Segment } from './segment';

export interface NewResearch {
  title: string;
  userId: string;
  input: {
    customerProfile: {
      segment: string;
      demographics?: string;
      painPoints?: string;
    };
    solutionOverview: {
      problemToSolve: string;
      solutionOffered: string;
      uniqueFeatures?: string;
    };
    marketContext: {
      industry?: string;
      competitors?: string;
      channels?: string;
    };
  };
}

interface NewResearchResponse {
  data: {
    jobId: string;
    segment: Segment;
  };
}

interface ReportResponse {
  data: string;
  urls: { url: string; title: string }[];
}

export interface WSEvent {
  jobId: string;
  segmentId: string;
  progress: number;
  status: string;
  data?: ResearchReport | null;
}

export interface ResearchReport {
  marketDemandOverview: ReportResponse;
  painPoints: ReportResponse;
  competitiveAnalysis: ReportResponse;
  desiredFeatures: ReportResponse;
  sentimentAnalysis: ReportResponse;
  marketTrendAnalysis: ReportResponse;
  geodemographicInsights: ReportResponse;
}

export const startNewResearch = async (data: NewResearch): Promise<NewResearchResponse> => {
  const res = await client.post('/research', data);
  return res.data;
};
