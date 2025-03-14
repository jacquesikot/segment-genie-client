export interface Industry {
  primaryIndustry: string;
  subIndustries: string[];
  relatedIndustries: string[];
  industryMaturity: 'emerging' | 'growing' | 'mature' | 'declining';
  keyTrends: string[];
  regulatoryFactors: string[];
}

export interface MarketSize {
  metadata: {
    analysisDate: string;
    marketMaturity: 'emerging' | 'growing' | 'mature' | 'declining';
    dataQuality: {
      score: number;
      limitations: string[];
    };
    sources: Array<{
      url?: string;
      title?: string;
      credibilityScore?: number;
      datePublished?: string | null;
      publisher?: string;
      relevanceScore?: number;
    }>;
  };
  marketAnalysis: {
    industry: Industry;
    tam: {
      marketSize: {
        value: number;
        currency: string;
        unit: 'trillion' | 'billion' | 'million' | 'thousand';
      };
      growthRate?: number;
      keyDrivers: string[];
      risks: string[];
      methodology: string;
    };
    sam: {
      marketSize: {
        value: number;
        currency: string;
        unit: 'trillion' | 'billion' | 'million' | 'thousand';
      };
      percentageOfTAM: number;
      targetSegments: string[];
      exclusionCriteria: string[];
      methodology: string;
    };
    som: {
      marketSize: {
        value: number;
        currency: string;
        unit: 'trillion' | 'billion' | 'million' | 'thousand';
      };
      percentageOfSAM: number;
      timeToAchieve: number;
      competitiveDynamics: string[];
      methodology: string;
    };
  };
}

export interface Source {
  url?: string;
  title?: string;
  credibilityScore?: number;
  datePublished?: string | null;
  publisher?: string;
  relevanceScore?: number;
}
