import { researchInputForm } from '@/pages/dashboard';
import client from './client';
import type { Segment, SegmentStatus } from './segment';
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
            title: z.string(),
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

export interface ResearchInput {
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
}

export interface NewResearch {
  title: string;
  userId: string;
  input: ResearchInput;
}

interface NewResearchResponse {
  data: {
    jobId: string;
    segment: Segment;
  };
}

export interface WSEvent {
  segmentId: string;
  status: SegmentStatus;
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const painPointsSchema = z.object({
  metadata: z.object({
    dataFreshness: z.string(),
    sourceDiversity: z.number().min(0).max(1),
    sentimentScore: z.number().min(-1).max(1),
    validationScore: z.number().min(0).max(1),
    totalSourcesAnalyzed: z.number(),
    dateRange: z.object({
      earliest: z.string(),
      latest: z.string(),
    }),
    platformBreakdown: z.array(
      z.object({
        platform: z.string(),
        sourceCount: z.number(),
        averageEngagement: z.number(),
      })
    ),
  }),
  painPointClusters: z.array(
    z.object({
      clusterName: z.string(),
      description: z.string(),
      relatedPainPoints: z.array(z.string()),
    })
  ),
  painPoints: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
      frequency: z.enum(['Rare', 'Occasional', 'Common', 'Ubiquitous']),
      intensity: z.number().min(1).max(5),
      cluster: z.string(),
      sources: z.array(
        z.object({
          url: z.string(),
          excerpt: z.string(),
          date: z.string(),
          platform: z.string(),
          authorType: z.enum(['User', 'Expert', 'Business', 'Unknown']),
          engagement: z.object({
            upvotes: z.number().optional(),
            replies: z.number().optional(),
            shares: z.number().optional(),
          }),
          sentiment: z.number().min(-1).max(1),
        })
      ),
      emotions: z.array(z.string()),
      keywords: z.array(z.string()),
      impact: z.object({
        businessSize: z.array(z.string()),
        monetaryMentions: z.array(z.string()),
        timeWasted: z.array(z.string()),
      }),
      existingSolutions: z.array(
        z.object({
          name: z.string(),
          description: z.string(),
          effectiveness: z.number().min(0).max(1),
          limitations: z.array(z.string()),
          sources: z.array(z.string()),
        })
      ),
      workarounds: z.array(z.string()),
      trends: z.object({
        seasonal: z.boolean(),
        increasing: z.boolean(),
        geography: z.array(z.string()),
      }),
      confidence: z.number().min(0).max(1),
    })
  ),
});

export type MarketSize = z.infer<typeof marketSizeSchema>;
export type ValidIndustry = z.infer<typeof industryValidationSchema>;
export type PainPoints = z.infer<typeof painPointsSchema>;
export interface ResearchReport {
  validIndustry: ValidIndustry;
  marketSize: MarketSize;
  painPoints: PainPoints;
}

export const startNewResearch = async (data: NewResearch): Promise<NewResearchResponse> => {
  const res = await client.post('/research', data);
  return res.data;
};

export const getResearchInput = async (query: string): Promise<z.infer<typeof researchInputForm>> => {
  const res = await client.post('/research/input', { query });
  return res.data.data;
};
