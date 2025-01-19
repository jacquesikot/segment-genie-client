import client from './client';
import type { Segment } from './segment';
import { z } from 'zod';

const revenueSchema = z.object({
  value: z.number().nullable().describe('Revenue value in its full number unit'),
  currency: z.string().nullable().describe('Currency code (e.g., USD, EUR)'),
  rawString: z.string().nullable().describe('Raw revenue string from source'),
  formattedValue: z.number().nullable().describe('Actual value with proper scale'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('Confidence score for the data (0-1) indicating reliability of the revenue estimate')
    .optional(),
  year: z.number().describe('Calendar year for which the revenue data is reported').optional(),
  methodology: z
    .string()
    .nullable()
    .describe('Detailed explanation of how the revenue was calculated or estimated')
    .optional(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const marketSizeSchema = z.object({
  metadata: z
    .object({
      industryConfidence: z
        .number()
        .min(0)
        .max(1)
        .describe('Overall confidence score (0-1) in the industry analysis and data quality'),
      dataAvailability: z
        .number()
        .min(0)
        .max(1)
        .describe('Score (0-1) indicating the completeness and accessibility of market data'),
      lastUpdated: z.string().describe('ISO timestamp of when the market size data was last updated'),
      sources: z
        .array(
          z.object({
            url: z.string().describe('Full URL of the source document or webpage'),
            credibilityScore: z.number().min(0).max(1).describe('Assessment of source reliability and authority (0-1)'),
            relevanceScore: z
              .number()
              .min(0)
              .max(1)
              .describe('How closely the source matches the target market and time period (0-1)'),
            datePublished: z.string().nullable().describe('ISO date when the source was published').optional(),
          })
        )
        .describe('Array of reference sources used in the market analysis'),
    })
    .describe('Global metadata about the market size analysis'),

  tam: z
    .object({
      revenue: revenueSchema,
      explanation: z
        .string()
        .describe('Detailed description of the Total Addressable Market calculation and assumptions'),
      sources: z.array(z.string()).describe('List of references supporting TAM calculations'),
      growthRate: z
        .string()
        .nullable()
        .describe('Annual growth rate of the total market, expressed as a percentage')
        .optional(),
    })
    .describe('Total Addressable Market (TAM) metrics and analysis'),

  sam: z
    .object({
      revenue: revenueSchema,
      explanation: z
        .string()
        .describe('Detailed description of the Serviceable Addressable Market calculation and assumptions'),
      sources: z.array(z.string()).describe('List of references supporting SAM calculations'),
      segmentationCriteria: z
        .string()
        .nullable()
        .describe('Criteria used to define the serviceable market segment')
        .optional(),
    })
    .describe('Serviceable Addressable Market (SAM) metrics and analysis'),

  som: z
    .object({
      revenue: revenueSchema,
      explanation: z
        .string()
        .describe('Detailed description of the Serviceable Obtainable Market calculation and assumptions'),
      marketSharePercentage: z
        .number()
        .nullable()
        .describe('Expected market share percentage that can be captured')
        .optional(),
      sources: z.array(z.string()).describe('List of references supporting SOM calculations'),
      competitiveAnalysis: z
        .string()
        .nullable()
        .describe('Analysis of competitive landscape and market positioning strategy')
        .optional(),
    })
    .describe('Serviceable Obtainable Market (SOM) metrics and analysis'),
});

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

export interface WSEvent {
  jobId: string;
  segmentId: string;
  progress: number;
  status: string;
  data?: ResearchReport | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const industryValidationSchema = z.object({
  suggestedIndustry: z.string(),
  alternativeClassifications: z.array(z.string()),
  industryConfidence: z.number().min(0).max(1),
  naicsCode: z
    .string()
    .regex(/^\d{2,6}$/)
    .optional(),
  explanation: z.string().min(1),
});

export type MarketSize = z.infer<typeof marketSizeSchema>;
export type ValidIndustry = z.infer<typeof industryValidationSchema>;
export interface ResearchReport {
  validIndustry: ValidIndustry;
  marketSize: MarketSize;
}

export const startNewResearch = async (data: NewResearch): Promise<NewResearchResponse> => {
  const res = await client.post('/research', data);
  return res.data;
};
