import { researchInputForm } from '@/pages/dashboard';
import client from './client';
import type { Segment, SegmentStatus } from './segment';
import { z } from 'zod';

const revenueSchema = z.object({
  value: z.number().nullable().describe('Revenue value in its number unit'),
  currency: z.string().nullable().describe('Currency code (e.g., USD, EUR)'),
  rawString: z.string().nullable().describe('Raw revenue string from source'),
  unit: z.enum(['billion', 'million', 'thousand']),
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

const competitorDetailSchema = z.object({
  name: z.string().describe('Official company name of the competitor'),
  website: z.string().nullable().describe('Primary website URL of the competitor'),
  category: z
    .enum(['direct', 'indirect', 'potential'])
    .describe(
      'Classification of competitor based on market overlap: direct (same solution), indirect (different solution, same problem), potential (could enter market)'
    )
    .optional(),

  companyProfile: z
    .object({
      foundedYear: z.number().nullable().optional().describe('Year the company was founded'),
      headquartersLocation: z.string().nullable().optional().describe('Main headquarters location (city, country)'),
      employeeCount: z.string().nullable().optional().describe('Approximate number of employees (ranges acceptable)'),
      fundingStatus: z
        .string()
        .nullable()
        .optional()
        .describe('Current funding stage or status (e.g., Seed, Series A, Public)'),
      lastFundingAmount: z.string().nullable().optional().describe('Most recent funding amount raised'),
      keyExecutives: z.array(z.string()).optional().describe('Names and roles of key leadership team members'),
    })
    .describe('Basic company information and key metrics')
    .optional(),

  productDetails: z
    .object({
      mainProducts: z.array(z.string()).describe('Primary products or services offered'),
      keyFeatures: z.array(z.string()).describe('Main features or capabilities of their products'),
      uniqueSellingPoints: z.array(z.string()).describe('Distinctive value propositions or differentiators'),
      technologiesUsed: z.array(z.string()).optional().describe('Key technologies or platforms used in their solution'),
      integrationsOffered: z.array(z.string()).optional().describe('Major third-party integrations or partnerships'),
    })
    .describe('Product and feature information')
    .optional(),

  marketPosition: z
    .object({
      targetMarkets: z.array(z.string()).describe('Primary industries or markets served'),
      geographicPresence: z.array(z.string()).optional().describe('Regions or countries where they operate'),
      marketShare: z.number().nullable().optional().describe('Estimated market share percentage if available'),
      growthRate: z.string().nullable().optional().describe('Recent growth rate or trajectory'),
      customerSegments: z.array(z.string()).optional().describe('Main customer segments or personas targeted'),
    })
    .describe('Market presence and positioning information')
    .optional(),

  swotAnalysis: z
    .object({
      strengths: z
        .array(
          z.object({
            point: z.string().describe('Specific strength of the competitor'),
            impact: z
              .enum(['Low', 'Medium', 'High'])
              .describe('Impact level of this strength on their market position'),
            evidence: z.string().describe('Concrete example or proof of this strength'),
          })
        )
        .min(1)
        .describe('Key competitive strengths'),

      weaknesses: z
        .array(
          z.object({
            point: z.string().describe('Specific weakness or limitation'),
            impact: z
              .enum(['Low', 'Medium', 'High'])
              .describe('Impact level of this weakness on their market position'),
            evidence: z.string().describe('Concrete example or proof of this weakness'),
          })
        )
        .min(1)
        .describe('Notable weaknesses or limitations'),

      opportunities: z
        .array(
          z.object({
            point: z.string().describe('Potential market or growth opportunity'),
            relevance: z.enum(['Low', 'Medium', 'High']).describe('Relevance to their current market position'),
            timeframe: z
              .enum(['Short-term', 'Medium-term', 'Long-term'])
              .describe('Expected timeline for opportunity realization'),
          })
        )
        .optional()
        .describe('Growth opportunities available'),

      threats: z
        .array(
          z.object({
            point: z.string().describe('Potential threat or risk factor'),
            severity: z.enum(['Low', 'Medium', 'High']).describe('Impact severity if threat materializes'),
            likelihood: z.enum(['Low', 'Medium', 'High']).describe('Probability of threat occurring'),
          })
        )
        .optional()
        .describe('Market threats and risks'),
    })
    .describe('Comprehensive SWOT analysis')
    .optional(),

  pricingStrategy: z
    .object({
      model: z.string().describe('Primary pricing model (e.g., subscription, usage-based)'),
      pricePoints: z.array(z.string()).optional().describe('Key pricing tiers or packages'),
      comparativeValue: z.string().optional().describe('Price positioning relative to competitors'),
    })
    .describe('Pricing structure and strategy')
    .optional(),

  customerInsights: z
    .object({
      satisfaction: z
        .object({
          overallScore: z
            .number()
            .min(0)
            .max(5)
            .nullable()
            .optional()
            .describe('Average customer satisfaction score (0-5)'),
          positiveThemes: z.array(z.string()).optional().describe('Common positive feedback themes'),
          negativeThemes: z.array(z.string()).optional().describe('Common negative feedback themes'),
          reviewSources: z.array(z.string()).optional().describe('Sources of customer reviews analyzed'),
        })
        .optional()
        .describe('Customer satisfaction metrics'),
      painPoints: z.array(z.string()).optional().describe('Common customer complaints or issues'),
      switchingCosts: z.string().optional().describe('Barriers or costs for customers to switch from this competitor'),
    })
    .describe('Customer feedback and satisfaction analysis')
    .optional(),

  recentDevelopments: z
    .array(
      z.object({
        date: z.string().describe('Date of the development'),
        development: z.string().describe('Description of the event or update'),
        significance: z.string().describe('Impact or importance of this development'),
      })
    )
    .optional()
    .describe('Recent significant company developments or changes'),

  sources: z
    .array(
      z.object({
        url: z.string().describe('Source URL'),
        type: z.enum(['company_website', 'news', 'review', 'social', 'financial', 'other']).describe('Type of source'),
        date: z.string().describe('Date of the source content'),
        relevance: z.number().min(0).max(1).describe('Relevance score of source (0-1)'),
      })
    )
    .min(1)
    .describe('All data source URLs used for analysis')
    .optional(),
});

// Step 3: Comparative Analysis Schema
const comparativeAnalysisSchema = z
  .object({
    marketOverview: z
      .object({
        totalAddressableMarket: z
          .string()
          .describe(
            'Estimated market size in dollar value (e.g., "$5B annually"). Include year of estimate if available.'
          ),
        growthRate: z
          .string()
          .describe('Annual market growth rate as a percentage with timeframe (e.g., "15% YoY for 2023-2024")'),
        maturityStage: z
          .string()
          .describe(
            'Current market lifecycle stage (e.g., "Emerging", "Growth", "Mature", "Declining") with key characteristics'
          ),
        keyTrends: z
          .array(z.string())
          .describe(
            'Major market trends affecting the industry. Each trend should include: trend name, impact, and timeline'
          )
          .min(3),
        entryBarriers: z
          .array(z.string())
          .describe(
            'Significant barriers to market entry, each with description of difficulty and mitigation strategies'
          )
          .min(2),
      })
      .describe('Overall market analysis and key metrics'),

    competitiveLandscape: z
      .object({
        competitorDensity: z
          .string()
          .describe(
            'Assessment of number and distribution of competitors (e.g., "Highly fragmented with 100+ solutions" or "Consolidated with 3 major players")'
          ),
        marketConcentration: z
          .string()
          .describe(
            'Degree of market share concentration among top players (e.g., "Top 3 players control 75% of market")'
          ),
        keyPlayerGroups: z
          .array(
            z.object({
              group: z
                .string()
                .describe(
                  'Category name for this group of competitors (e.g., "Enterprise Incumbents", "Emerging Startups")'
                ),
              description: z.string().describe('Characteristics and competitive approach of this group'),
              representatives: z
                .array(z.string())
                .describe('Names of key companies in this group, minimum 2 companies')
                .min(2),
            })
          )
          .describe('Classification of competitor types and their characteristics')
          .min(2),
      })
      .describe('Analysis of competitive dynamics and player categorization'),

    featureComparison: z
      .array(
        z.object({
          feature: z.string().describe('Specific feature or capability name'),
          importance: z
            .enum(['Critical', 'Important', 'Nice-to-have'])
            .describe(
              'Business impact of this feature: Critical (must-have), Important (differentiator), Nice-to-have (auxiliary)'
            ),
          competitors: z
            .array(
              z.object({
                name: z.string().describe('Competitor company name'),
                implementation: z
                  .enum(['None', 'Basic', 'Advanced', 'Best-in-class'])
                  .describe(
                    'Quality of feature implementation: None (not available), Basic (minimal), Advanced (solid), Best-in-class (exceptional)'
                  ),
                notes: z.string().describe('Specific details about implementation, limitations, or unique aspects'),
              })
            )
            .min(3)
            .describe('How competitors implement this feature'),
        })
      )
      .min(5)
      .describe('Detailed feature-by-feature comparison across competitors'),

    opportunitySpaces: z
      .array(
        z.object({
          description: z.string().describe('Clear description of the market opportunity or gap'),
          unservedNeeds: z.array(z.string()).describe('Specific customer needs or problems not being addressed').min(2),
          potentialSize: z
            .string()
            .describe('Estimated size of opportunity (e.g., "~$1M ARR in first year" or "20% of current market")'),
          entryDifficulty: z
            .enum(['Low', 'Medium', 'High'])
            .describe(
              'Difficulty of capturing this opportunity: Low (few barriers), Medium (some challenges), High (significant barriers)'
            ),
          timeToMarket: z.string().describe('Estimated time needed to address this opportunity (e.g., "6-8 months")'),
        })
      )
      .min(2)
      .describe('Analysis of market gaps and opportunities'),

    recommendations: z
      .array(
        z.object({
          recommendation: z.string().describe('Specific, actionable recommendation for product or market strategy'),
          rationale: z.string().describe('Clear explanation of why this recommendation matters and expected benefits'),
          priority: z.enum(['Low', 'Medium', 'High']).describe('Implementation priority based on impact and urgency'),
          resourceRequirements: z
            .string()
            .describe('Required resources, including estimated time, team size, and other requirements'),
          risks: z
            .array(z.string())
            .describe('Potential risks or challenges in implementing this recommendation')
            .min(1),
        })
      )
      .min(3)
      .describe('Strategic recommendations based on competitive analysis'),
  })
  .describe('Comprehensive comparative analysis of market and competition');

export const recommendationSchema = z.object({
  recommendation: z.string(),
  rationale: z.string(),
  priority: z.string(),
  resourceRequirements: z.string().optional(),
  risks: z.array(z.string()).optional(),
});

export const competitionSchema = z.object({
  metadata: z.object({
    analysisDate: z.string(),
    totalCompetitors: z.number(),
    confidenceScore: z.number(),
    dataFreshness: z.object({
      mostRecent: z.string(),
      oldest: z.string(),
      averageAge: z.string(),
    }),
  }),
  competitors: z.array(competitorDetailSchema),
  comparativeAnalysis: comparativeAnalysisSchema,
  recommendations: z.array(recommendationSchema),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const marketTrendsSchema = z.object({
  metadata: z.object({
    analysisDate: z.string(),
    confidenceScore: z.number(),
    dataFreshness: z
      .object({
        mostRecent: z.string(),
        oldest: z.string(),
        averageAge: z.number().or(z.string()),
      })
      .optional(),
    sourceDiversity: z.number().optional(),
    totalSourcesAnalyzed: z.number().optional(),
    sources: z
      .array(
        z.object({
          url: z.string(),
          title: z.string().nullable(),
          type: z.string(),
          publicationDate: z.string(),
          credibilityScore: z.number(),
          relevanceScore: z.number(),
        })
      )
      .optional(),
  }),
  marketOverview: z
    .object({
      currentState: z.string(),
      dominantTrends: z.array(z.string()),
      disruptionPotential: z.number(),
      adoptionCycle: z.string(),
      keyMetrics: z.record(z.string()).optional(),
    })
    .optional(),
  currentTrends: z
    .array(
      z.object({
        trendName: z.string(),
        description: z.string(),
        maturityStage: z.string(),
        prevalence: z.number(),
        relevance: z.number(),
        impactAreas: z.array(z.string()),
        supportingEvidence: z.array(z.string()),
      })
    )
    .optional(),
  emergingOpportunities: z
    .array(
      z.object({
        opportunityName: z.string(),
        description: z.string(),
        timeframe: z.object({
          emergenceExpected: z.string(),
          estimatedMonths: z.number(),
        }),
        potentialImpact: z.number(),
        targetSegments: z.array(z.string()),
        barrierToEntry: z.number(),
        firstMoverAdvantage: z.number(),
        supportingEvidence: z.array(z.string()),
      })
    )
    .optional(),
  threatsAndChallenges: z
    .array(
      z.object({
        threatName: z.string(),
        description: z.string(),
        severity: z.number(),
        likelihood: z.number(),
        timeframe: z.string(),
        impactAreas: z.array(z.string()),
        mitigationStrategies: z.array(z.string()),
        affectedCompetitors: z.array(z.string()),
      })
    )
    .optional(),
  influencingFactors: z
    .array(
      z.object({
        factorName: z.string(),
        factorType: z.string(),
        description: z.string(),
        impact: z.string(),
        directionality: z.string(),
        permanence: z.string(),
        supportingEvidence: z.array(z.string()),
      })
    )
    .optional(),
  trendIntersections: z
    .array(
      z.object({
        trends: z.array(z.string()),
        description: z.string(),
        significance: z.string(),
        opportunityScore: z.number(),
      })
    )
    .optional(),
  strategicRecommendations: z
    .array(
      z.object({
        recommendation: z.string(),
        rationale: z.string(),
        trendConnection: z.array(z.string()),
        implementationDifficulty: z.number(),
        priorityLevel: z.string(),
        timeframe: z.string(),
        resourceRequirements: z.string(),
        expectedOutcome: z.string(),
        risks: z.array(z.string()),
      })
    )
    .optional(),
});

export type MarketSize = z.infer<typeof marketSizeSchema>;
export type ValidIndustry = z.infer<typeof industryValidationSchema>;
export type PainPoints = z.infer<typeof painPointsSchema>;
export type Competitors = z.infer<typeof competitionSchema>;
export type MarketTrends = z.infer<typeof marketTrendsSchema>;
export interface ResearchReport {
  marketSize: MarketSize;
  painPoints: PainPoints;
  competitors: Competitors;
  marketTrends: MarketTrends;
}

export const startNewResearch = async (data: NewResearch): Promise<NewResearchResponse> => {
  const res = await client.post('/research', data);
  return res.data;
};

export const getResearchInput = async (query: string): Promise<z.infer<typeof researchInputForm>> => {
  const res = await client.post('/research/input', { query });
  return res.data.data;
};
