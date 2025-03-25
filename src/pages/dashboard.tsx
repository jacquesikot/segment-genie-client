/* eslint-disable @typescript-eslint/no-explicit-any */
import { getResearchInput, NewResearch, startNewResearch } from '@/api/research';
import { NewSegmentForm } from '@/components/NewSegmentForm';
import PageHeader from '@/components/page-header';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useAnalytics } from '@/hooks/use-analytics';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/redux/hooks';
import { addNewSegment } from '@/redux/slice/segment';
import { useAuth } from '@/lib/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, History, InfoIcon, Loader2, Plus, Sparkles, Sun } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { researchInputForm } from './schemas';

const recentExamples = [
  'A subscription box service for exotic cooking ingredients with recipe cards',
  'An AI-powered personal stylist app that suggests daily outfits',
  'A marketplace for local artists to sell and rent their artwork',
  'A smart home gardening system for urban apartments',
];

export default function Dashboard() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const analytics = useAnalytics();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [initialIdea, setInitialIdea] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const [isFinalLoading, setIsFinalLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(researchInputForm),
    defaultValues: {
      title: '',
      segment: '',
      painPoints: '',
      demographics: '',
      problem: '',
      solution: '',
      features: '',
      industry: '',
      competitors: '',
      channels: '',
    },
  });

  const handleInitialAnalysis = async () => {
    if (!initialIdea.trim()) {
      toast({
        variant: 'default',
        title: 'Idea required',
        description: 'Please describe your business idea to continue.',
      });
      analytics.trackEvent(analytics.Event.FORM_VALIDATION_ERROR, {
        message: 'Invalid business idea',
      });
      return;
    }

    setIsInitialLoading(true);
    try {
      analytics.trackEvent(analytics.Event.INITIAL_SEGMENT_ANALYSIS_STARTED, {
        initialIdea,
      });
      const response = await getResearchInput(initialIdea);
      form.reset(response);

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setShowDetailedForm(true);
      analytics.trackEvent(analytics.Event.INITIAL_SEGMENT_ANALYSIS_COMPLETED, {
        segmentDetail: response,
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis failed',
        description: 'Unable to analyze your idea. Please try again later.',
      });
      analytics.trackEvent(analytics.Event.API_ERROR, {
        message: 'Error fetching research input',
        error,
      });
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setInitialIdea(example);
    const textarea = document.querySelector('textarea');
    if (textarea) textarea.focus();
    analytics.trackEvent(analytics.Event.RESEARCH_EXAMPLE_CLICKED, { example });
  };

  const onFinalSubmit = async (values: any) => {
    setIsFinalLoading(true);
    try {
      analytics.trackEvent(analytics.Event.SEGMENT_ANALYSIS_STARTED, {
        segmentDetail: values,
      });
      const researchData: NewResearch = {
        title: values.title,
        userId: user?.id || '',
        query: initialIdea,
        input: {
          customerProfile: {
            segment: values.segment,
            painPoints: values.painPoints,
            demographics: values.demographics,
          },
          solutionOverview: {
            problemToSolve: values.problem,
            solutionOffered: values.solution,
            uniqueFeatures: values.features,
          },
          marketContext: {
            industry: values.industry,
            competitors: values.competitors,
            channels: values.channels,
          },
        },
      };
      const research = await startNewResearch(researchData);

      form.reset();
      dispatch(addNewSegment(research.data.segment));

      toast({
        variant: 'default',
        title: 'Success!',
        description: 'Your customer report has been generated.',
      });
      analytics.trackEvent(analytics.Event.SEGMENT_ANALYSIS_PENDING, {
        segmentAnalysis: research.data.segment,
      });
      await navigate('/segments');
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating your report. Please try again.',
      });
      analytics.trackEvent(analytics.Event.API_ERROR, {
        message: 'Error generating segment report',
        error,
      });
    } finally {
      setIsFinalLoading(false);
    }
  };

  return (
    <>
      <PageHeader />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col space-y-6 py-6">
          {/* Premium Banner */}
          {/* <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-indigo-700 dark:text-indigo-300">
              <Sparkles size={16} className="text-indigo-500 flex-shrink-0" />
              <span>Unlock advanced features with Segment Genie Pro</span>
            </div>
            <Button
              variant="default"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs sm:text-sm w-full sm:w-auto"
            >
              Upgrade to Pro
            </Button>
          </div> */}

          {/* Greeting Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <Sun className="text-amber-500 dark:text-amber-400" size={24} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                  Welcome to Segment Genie
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm md:text-base">
                  Your AI-powered product and market research assistant
                </p>
              </div>
            </div>
          </div>

          {!showDetailedForm ? (
            // Initial Idea Input Card
            <Card className="shadow-lg border border-gray-200 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all">
              <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                <div className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white">
                    What idea do you want to validate today?
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {recentExamples.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => handleExampleClick(example)}
                        className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Plus size={12} className="inline mr-1" />
                        <span className="hidden sm:inline">Try Example</span> {index + 1}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Textarea
                      value={initialIdea}
                      onChange={(e) => setInitialIdea(e.target.value)}
                      placeholder="Describe your business idea or target audience in detail..."
                      className="min-h-[150px] sm:min-h-[200px] w-full p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-300 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none resize-none text-sm sm:text-base"
                    />
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-gray-400">
                      <InfoIcon size={12} />
                      <span className="hidden sm:inline">More detail = better results</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <History size={14} />
                      <span>Your insights are saved automatically</span>
                    </div>
                    <Button
                      onClick={handleInitialAnalysis}
                      disabled={!initialIdea.trim() || isInitialLoading}
                      className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 sm:px-8 py-2 text-sm sm:text-base w-full sm:w-auto"
                    >
                      {isInitialLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Analyze
                          <ArrowRight size={16} className="ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Review and Confirm Card
            <Card className="shadow-lg border border-gray-200 dark:border-gray-800 transition-all relative overflow-hidden">
              {isFinalLoading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6">
                  <div className="flex flex-col items-center space-y-6 max-w-md text-center">
                    <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary" />
                    <div>
                      <p className="text-base sm:text-lg font-medium text-primary mb-1">
                        Generating Customer Report...
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">This may take a few moments</p>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 italic mt-2">
                      Analyzing market data and generating insights...
                    </div>
                  </div>
                </div>
              )}

              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="mb-4 sm:mb-6">
                  <Alert className="bg-primary/5 border-primary/20">
                    <AlertDescription className="text-xs sm:text-sm">
                      We've analyzed your idea! Review and adjust the details below to generate your customer report.
                    </AlertDescription>
                  </Alert>
                </div>

                <Form {...form}>
                  <form
                    onBlur={async (e) => {
                      const target = e.target as unknown as HTMLInputElement;
                      analytics.trackEvent(analytics.Event.SEGMENT_INITIAL_ANALYSIS_DATA_CHANGED, {
                        field: target.name,
                        value: target.value,
                      });
                    }}
                    onSubmit={form.handleSubmit(onFinalSubmit)}
                    className="space-y-6 sm:space-y-8"
                  >
                    <NewSegmentForm form={form} />

                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:justify-between pt-4 sm:pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowDetailedForm(false)}
                        className="text-xs sm:text-sm w-full sm:w-auto"
                      >
                        <ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        Back to Editor
                      </Button>

                      <Button
                        type="submit"
                        disabled={isFinalLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 sm:px-8 py-2 text-xs sm:text-sm w-full sm:w-auto"
                      >
                        {isFinalLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Customer Report
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
