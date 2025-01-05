/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Link, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ResearchReport } from '@/api/research';

interface Section {
  id: string;
  title: string;
  data?: string;
  urls: { url: string; title: string }[];
  icon: string;
}

interface CustomerReportProps {
  reportData: ResearchReport;
}

const MarkdownComponents: Record<string, React.FC<any>> = {
  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mb-3 mt-5" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-lg font-medium mb-2 mt-4" {...props} />,
  p: ({ node, ...props }) => <p className="text-sm text-gray-600 mb-3 leading-relaxed" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 text-sm text-gray-600 space-y-2" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 text-sm text-gray-600 space-y-2" {...props} />,
  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
  em: ({ node, ...props }) => <em className="italic text-gray-800" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-4 border-blue-200 pl-4 my-4 italic bg-blue-50 py-2 rounded-r" {...props} />
  ),
  code: ({ node, inline, ...props }) =>
    inline ? (
      <code className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm" {...props} />
    ) : (
      <code className="block bg-gray-100 rounded p-4 my-4 overflow-auto font-mono text-sm" {...props} />
    ),
  table: ({ node, ...props }) => (
    <div className="overflow-auto my-4">
      <table className="min-w-full divide-y divide-gray-200" {...props} />
    </div>
  ),
  th: ({ node, ...props }) => (
    <th
      className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
      {...props}
    />
  ),
  td: ({ node, ...props }) => <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" {...props} />,
};

const CustomerReport: React.FC<CustomerReportProps> = ({ reportData }) => {
  const [activeSection, setActiveSection] = useState<string>('market-demand-overview');

  const sections: Section[] = [
    {
      id: 'market-demand-overview',
      title: 'Market Demand Overview',
      data: reportData.marketDemandOverview?.data,
      urls: reportData.marketDemandOverview?.urls || [],
      icon: '📊',
    },
    {
      id: 'pain-points',
      title: 'Pain Points',
      data: reportData.painPoints?.data,
      urls: reportData.painPoints?.urls || [],
      icon: '🎯',
    },
    {
      id: 'competitive-analysis',
      title: 'Competitive Analysis',
      data: reportData.competitiveAnalysis?.data,
      urls: reportData.competitiveAnalysis?.urls || [],
      icon: '⚔️',
    },
    {
      id: 'desired-features',
      title: 'Desired Features',
      data: reportData.desiredFeatures?.data,
      urls: reportData.desiredFeatures?.urls || [],
      icon: '✨',
    },
    {
      id: 'sentiment-analysis',
      title: 'Sentiment Analysis',
      data: reportData.sentimentAnalysis?.data,
      urls: reportData.sentimentAnalysis?.urls || [],
      icon: '🎭',
    },
    {
      id: 'market-trend-analysis',
      title: 'Market Trend Analysis',
      data: reportData.marketTrendAnalysis?.data,
      urls: reportData.marketTrendAnalysis?.urls || [],
      icon: '📈',
    },
    {
      id: 'demographic-insights',
      title: 'Demographic Insights',
      data: reportData.geodemographicInsights?.data,
      urls: reportData.geodemographicInsights?.urls || [],
      icon: '🌎',
    },
  ];

  const activeContent = sections.find((section) => section.id === activeSection);

  return (
    <div className="flex h-screen">
      {/* Side Navigation */}
      <div className="w-64 bg-white">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900">Report Sections</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-60px)]">
          <nav className="space-y-1 p-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-gray-100 text-black font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{section.icon}</span>
                <span className="text-sm font-medium">{section.title}</span>
              </button>
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <Card className="m-6 bg-white shadow-sm h-[calc(100vh-48px)]">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>{activeContent?.icon}</span>
                {activeContent?.title}
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">Detailed analysis and insights</CardDescription>
            </div>
            {activeContent?.urls && activeContent.urls.length > 0 && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    View Sources
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col h-full">
                    <SheetHeader className="flex-shrink-0">
                      <SheetTitle>Data Sources</SheetTitle>
                      <SheetDescription>References and sources used in this section</SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="flex-1 mt-6 -mr-6 pr-6">
                      <ul className="space-y-4">
                        {activeContent.urls.map((source, index) => (
                          <li
                            key={index}
                            className={`pb-4 ${index !== activeContent.urls.length - 1 ? 'border-b' : ''}`}
                          >
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="h-4 w-4 flex-shrink-0" />
                              <span className="text-sm break-all">{source.title}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </CardHeader>

          <ScrollArea className="h-[calc(100vh-200px)] w-full overflow-x-auto px-6">
            <div className="prose prose-sm max-w-none pb-6">
              <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {activeContent?.data || ''}
              </ReactMarkdown>
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default CustomerReport;
