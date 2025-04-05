import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { ExternalLink } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import ConfidenceIndicator from '../common/ConfidenceIndicator';
import CompanyProfile from '../competitor-details/CompanyProfile';
import MarketPosition from '../competitor-details/MarketPosition';
import ProductDetails from '../competitor-details/ProductDetails';
import SwotAnalysis from '../competitor-details/SwotAnalysis';
import { PricingItem } from '../common/MetricItems';
import CustomerThemeSection from '../common/CustomerThemeSection';

interface CompanyProfile {
  foundedYear: number;
  headquartersLocation: string;
  employeeCount: number;
  fundingStatus: string;
  lastFundingAmount: number;
  keyExecutives: string[];
}

interface MarketPosition {
  targetMarkets: string[];
  geographicPresence: string[];
  marketShare: number;
  growthRate: number;
}

interface ProductDetails {
  mainProducts: string[];
  keyFeatures: string[];
  uniqueSellingPoints: string[];
  technologiesUsed: string[];
}

interface SwotItem {
  point: string;
  impact: string;
  evidence: string;
}

interface SwotAnalysis {
  strengths: SwotItem[];
  weaknesses: SwotItem[];
  opportunities: SwotItem[];
  threats: SwotItem[];
}

export interface Competitor {
  name: string;
  category: string;
  website: string;
  analysisConfidence: number;
  companyProfile: CompanyProfile;
  marketPosition: MarketPosition;
  productDetails: ProductDetails;
  swotAnalysis: SwotAnalysis;
  forums: {
    name: string;
    url: string;
  }[];
  socialMedia: {
    platform: string;
    username: string;
    url: string;
  }[];
  pricingStrategy: {
    model: string;
    pricePoints: string[];
    comparativeValue: string;
  };
  customerInsights: {
    satisfaction: {
      overallScore: number;
      positiveThemes: string[];
      negativeThemes: string[];
    };
    painPoints: string[];
    switchingCosts: string;
  };
  recentDevelopments: {
    date: string;
    development: string;
    significance: string;
  }[];
  sources: {
    url: string;
    relevance: number;
  }[];
}

interface CompetitorsTabProps {
  competitors: Competitor[];
  filterCategory: string;
  setFilterCategory: (value: string) => void;
}

const CompetitorsTab: React.FC<CompetitorsTabProps> = ({ competitors, filterCategory, setFilterCategory }) => {
  return (
    <>
      <div className="flex justify-end mb-4 sm:mb-6">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="max-w-[180px] w-full border border-gray-200 shadow-sm">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Competitors</SelectItem>
            <SelectItem value="Direct">Direct Competitors</SelectItem>
            <SelectItem value="Indirect">Indirect Competitors</SelectItem>
            <SelectItem value="Potential">Potential Competitors</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Accordion type="multiple" className="w-full space-y-3 sm:space-y-4">
        {competitors.map((competitor, idx: number) => (
          <AccordionItem
            key={idx}
            value={`competitor-${idx}`}
            className="border rounded-lg shadow-sm overflow-hidden bg-white dark:bg-gray-950"
          >
            <AccordionTrigger className="hover:no-underline px-3 py-2 sm:px-4 sm:py-3">
              <div className="flex flex-col sm:flex-row sm:justify-between w-full items-start sm:items-center gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Badge
                    variant={competitor.category.toLowerCase() === 'direct' ? 'default' : 'secondary'}
                    className={`text-xs sm:text-sm ${
                      competitor.category.toLowerCase() === 'direct'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                        : competitor.category.toLowerCase() === 'indirect'
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400'
                    }`}
                  >
                    {competitor.category.charAt(0).toUpperCase() + competitor.category.slice(1).toLowerCase()}
                  </Badge>
                  <span className="font-semibold text-sm sm:text-base">{competitor.name}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <ConfidenceIndicator
                    confidence={competitor.analysisConfidence}
                    tooltip={`Analysis confidence for ${competitor.name}`}
                    showLabel
                  />
                  <a
                    href={competitor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors px-2 py-1 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/30 flex items-center gap-1.5 text-xs border border-indigo-200 dark:border-indigo-800/50 shadow-sm"
                  >
                    <span>View product</span>
                    <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </a>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 sm:px-4 pb-4 sm:pb-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                <div className="space-y-4 sm:space-y-8">
                  <CompanyProfile companyProfile={competitor.companyProfile} />
                  <MarketPosition marketPosition={competitor.marketPosition} />
                  <ProductDetails productDetails={competitor.productDetails} />
                </div>

                <div className="space-y-4 sm:space-y-8">
                  <SwotAnalysis swotAnalysis={competitor.swotAnalysis} />
                </div>
              </div>

              <div className="mt-4 sm:mt-8 space-y-4 sm:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      Pricing Strategy
                    </h4>
                    <div className="text-xs sm:text-sm space-y-2 sm:space-y-3">
                      <PricingItem label="Model" value={competitor.pricingStrategy.model || 'Not specified'} />
                      {competitor.pricingStrategy.pricePoints.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Price Points:</span>
                          <ul className="list-disc pl-4 mt-1 sm:mt-2 space-y-1">
                            {competitor.pricingStrategy.pricePoints.map((price: string, i: number) => (
                              <li key={i} className="text-gray-600 dark:text-gray-400">
                                {price}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <PricingItem label="Value" value={competitor.pricingStrategy.comparativeValue} />
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      Customer Insights
                    </h4>
                    <div className="text-xs sm:text-sm space-y-3 sm:space-y-4">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Satisfaction Score:</span>
                          <span className="font-bold text-base sm:text-lg">
                            {competitor.customerInsights.satisfaction.overallScore || 'N/A'}
                            <span className="text-[10px] sm:text-xs text-gray-500">/10</span>
                          </span>
                        </div>
                        <Progress
                          value={competitor.customerInsights.satisfaction.overallScore * 10}
                          className="h-1.5 sm:h-2 mt-1 sm:mt-2"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                        <CustomerThemeSection
                          title="Positive Themes"
                          items={competitor.customerInsights.satisfaction.positiveThemes}
                          type="positive"
                        />
                        <CustomerThemeSection
                          title="Negative Themes"
                          items={competitor.customerInsights.satisfaction.negativeThemes}
                          type="negative"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* New sections for Forums and Social Media */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                  {/* Forums Section */}
                  {competitor.forums && Array.isArray(competitor.forums) && competitor.forums.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        Active Forums
                      </h4>
                      <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                        {competitor.forums.map((forum, i) => (
                          <a
                            key={i}
                            href={forum?.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/10 transition-colors group"
                          >
                            <span className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 truncate max-w-[80%]">
                              {forum?.name || 'Unknown Forum'}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Media Section */}
                  {competitor.socialMedia &&
                    Array.isArray(competitor.socialMedia) &&
                    competitor.socialMedia.length > 0 && (
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Social Media Presence
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {competitor.socialMedia.map((social, i) => (
                            <a
                              key={i}
                              href={social?.url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/10 transition-colors group"
                            >
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  social?.platform?.toLowerCase() === 'instagram'
                                    ? 'bg-gradient-to-tr from-purple-500 to-pink-500'
                                    : social?.platform?.toLowerCase() === 'facebook'
                                    ? 'bg-blue-600'
                                    : social?.platform?.toLowerCase() === 'twitter'
                                    ? 'bg-sky-500'
                                    : social?.platform?.toLowerCase() === 'linkedin'
                                    ? 'bg-blue-700'
                                    : social?.platform?.toLowerCase() === 'youtube'
                                    ? 'bg-red-600'
                                    : 'bg-gray-500'
                                }`}
                              >
                                <span className="text-white text-xs font-bold">
                                  {social?.platform ? social.platform.charAt(0).toUpperCase() : '?'}
                                </span>
                              </div>
                              <div className="flex flex-col overflow-hidden">
                                <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                  {social?.platform || 'Unknown Platform'}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {social?.username ? `@${social.username}` : 'Unknown Username'}
                                </span>
                              </div>
                              <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ml-auto" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Pain Points & Switching Costs
                  </h4>
                  <div className="text-xs sm:text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Customer Pain Points:</span>
                        <ul className="list-disc pl-4 mt-1 sm:mt-2 space-y-1">
                          {competitor.customerInsights.painPoints.map((pain: string, i: number) => (
                            <li key={i} className="text-gray-600 dark:text-gray-400">
                              {pain}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-2 sm:p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
                        <span className="font-medium text-amber-800 dark:text-amber-300">Switching Costs:</span>
                        <p className="mt-1 sm:mt-2 text-amber-700 dark:text-amber-400">
                          {competitor.customerInsights.switchingCosts || 'Not assessed'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {competitor.recentDevelopments.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                      Recent Developments
                    </h4>
                    <div className="text-xs sm:text-sm space-y-3 sm:space-y-4">
                      <div className="relative pl-4 sm:pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-4 sm:space-y-6">
                        {competitor.recentDevelopments.map((dev, i: number) => (
                          <div key={i} className="relative">
                            <div className="absolute -left-[19px] sm:-left-[25px] w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-indigo-500"></div>
                            <p className="font-medium text-gray-800 dark:text-gray-200 text-xs sm:text-sm">
                              {new Date(dev.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                              : {dev.development}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs">{dev.significance}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    Sources
                  </h4>
                  <div className="grid gap-2">
                    {competitor.sources.map((source, i: number) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-2 sm:p-3 rounded-lg border hover:bg-indigo-50 dark:hover:bg-indigo-950/10 transition-colors"
                      >
                        <span className="text-indigo-600 dark:text-indigo-400 break-all sm:truncate sm:max-w-[70%] text-xs sm:text-sm">
                          {source.url}
                        </span>
                        <Badge
                          className={`mt-1 sm:mt-0 text-xs ${
                            source.relevance >= 0.8
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : source.relevance >= 0.5
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                        >
                          {(source.relevance * 100).toFixed(0)}% Relevance
                        </Badge>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className='flex justify-center mt-6'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AccordionTrigger className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:no-underline transition-colors [&>svg]:rotate-180 [&[data-state=open]>svg]:rotate-0">
                    Close
                  </AccordionTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Collapse section
                </TooltipContent>
              </Tooltip>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default CompetitorsTab;
