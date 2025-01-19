import { getResearchInput, startNewResearch } from '@/api/research';
import { NewSegmentForm } from '@/components/NewSegmentForm';
import PageHeader from '@/components/page-header';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch } from '@/redux/hooks';
import { addNewSegment } from '@/redux/slice/segment';
import { useUser } from '@clerk/clerk-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, History, Loader2, Plus, Sparkles, Sun } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

export const researchInputForm = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  segment: z.string().min(2, { message: 'Segment must be at least 2 characters.' }),
  painPoints: z.string().min(5, { message: 'Pain Points must be at least 5 characters.' }),
  problem: z.string().min(5, { message: 'Problem must be at least 5 characters.' }),
  solution: z.string().min(5, { message: 'Solution must be at least 5 characters.' }),
  features: z.string().min(5, { message: 'Features must be at least 5 characters.' }),
  industry: z.string().min(2, { message: 'Industry must be at least 2 characters.' }),
  competitors: z.string().min(5, { message: 'Competitors must be at least 5 characters.' }),
  channels: z.string().min(5, { message: 'Channels must be at least 5 characters.' }),
});

const recentExamples = [
  'A subscription box service for exotic cooking ingredients with recipe cards',
  'An AI-powered personal stylist app that suggests daily outfits',
  'A marketplace for local artists to sell and rent their artwork',
];

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { user } = useUser();
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
      problem: '',
      solution: '',
      features: '',
      industry: '',
      competitors: '',
      channels: '',
    },
  });

  const handleInitialAnalysis = async () => {
    if (!initialIdea.trim()) return;
    setIsInitialLoading(true);
    try {
      // Simulate API call
      const response = await getResearchInput(initialIdea);
      form.reset(response);
      setShowDetailedForm(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinalSubmit = async (values: any) => {
    setIsFinalLoading(true);
    try {
      const research = await startNewResearch({
        title: values.title,
        userId: user!.id,
        input: {
          customerProfile: {
            segment: values.segment,
            painPoints: values.painPoints,
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
      });

      form.reset();
      dispatch(addNewSegment(research.data.segment));
      await navigate(`/segment/${research.data.segment._id}`);
    } finally {
      setIsFinalLoading(false);
    }
  };

  return (
    <>
      <PageHeader />
      <div className="flex w-[800px] flex-col align-middle flex-1  p-4 md:p-6 space-y-6 self-center">
        {/* Premium Banner */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-indigo-700 dark:text-indigo-300">
            <Sparkles size={16} className="text-indigo-500" />
            <span>Unlock advanced features with Segment Genie Pro</span>
          </div>
          <Button
            variant="default"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm w-full sm:w-auto"
          >
            Upgrade to Pro
          </Button>
        </div>

        {/* Greeting Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <Sun className="text-amber-500 dark:text-amber-400" size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                Welcome to Segment Genie
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Your AI-powered market research assistant
              </p>
            </div>
          </div>
        </div>

        {!showDetailedForm ? (
          // Initial Idea Input Card
          <Card className="shadow-lg border border-gray-200 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                  What idea do you want to validate today?
                </h2>

                <div className="flex flex-wrap gap-2 mb-4">
                  {recentExamples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setInitialIdea(example)}
                      className="text-sm px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Plus size={12} className="inline mr-1" />
                      Try Example {index + 1}
                    </button>
                  ))}
                </div>

                <Textarea
                  value={initialIdea}
                  onChange={(e) => setInitialIdea(e.target.value)}
                  placeholder="Describe your business idea or target audience in detail... For example: I want to create a mobile app that helps pet owners find and book pet sitters in their local area."
                  className="min-h-[200px] w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-300 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none resize-none text-base"
                />

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <History size={14} />
                    <span>Your insights are saved automatically</span>
                  </div>
                  <Button
                    onClick={handleInitialAnalysis}
                    disabled={!initialIdea.trim() || isInitialLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-8 py-2 text-base"
                  >
                    {isInitialLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
          <Card className="shadow-lg border border-gray-200 dark:border-gray-800 transition-all relative">
            {isFinalLoading && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-lg font-medium text-primary">Generating Customer Report...</p>
                  <p className="text-sm text-muted-foreground">This may take a few moments</p>
                </div>
              </div>
            )}

            <CardContent className="p-8">
              <div className="mb-6">
                <Alert className="bg-primary/5 border-primary/20">
                  <AlertDescription>
                    We've analyzed your idea! Review and adjust the details below to generate your customer report.
                  </AlertDescription>
                </Alert>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onFinalSubmit)} className="space-y-8">
                  <NewSegmentForm form={form} />

                  <div className="flex items-center justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDetailedForm(false)}
                      className="text-base"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Editor
                    </Button>

                    <Button
                      type="submit"
                      disabled={isFinalLoading}
                      className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-8 py-2 text-base"
                    >
                      {isFinalLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
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
    </>
  );
}
