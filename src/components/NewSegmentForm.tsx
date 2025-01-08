import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useUser } from '@clerk/clerk-react';
import { BarChart3, Info, Lightbulb, Sparkles, Users, Loader2 } from 'lucide-react';
import { startNewResearch } from '@/api/research';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface FormValues {
  title: string;
  segment: string;
  painPoints: string;
  problem: string;
  solution: string;
  features: string;
  industry: string;
  competitors: string;
  channels: string;
}

const formSchema = z.object({
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

const FormTooltip = ({ content, children }: { content: string; children: React.ReactNode }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export function NewSegmentForm() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: 'Segment Genie',
      segment: 'Saas and Micro Saas founders',
      painPoints:
        'Difficulty in validating saas ideas. When a founder has an idea, they typically have to do a lot of manual work scouring through forums like reddit, websites, blogs and other online sources, trying to build a picture of their target customers needs, wants, behaviours, etc, this process is typically tedious and time consuming. This is the problem we are trying to solve',
      problem: 'Ease at which founders find social proof to validate or invalidate their ideas.',
      solution:
        'A cloud-based we app that allows founders define their business idea and and ideal customer, our app then scours the internet and trusted sources like reddit, stackoverflow, dev.to, etc to find relevant data on your idea, and then generate a customer report. We also allow the founders chat with the discovered data.',
      features: 'How quickly founders can generate and validate an idea using ai',
      industry: 'Startup/Tech',
      competitors:
        "Insight7, Meltwater's Consumer Insights Platform, Synerise, Tableau, Zappi, Crayon, Remesh, Native AI",
      channels: 'Content marketing, Google Ads, influencer partnerships, social media campaigns',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
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
      await navigate(`/segment/${research.data.segment._id}`);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[800px] shadow-lg">
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium text-primary">Generating Customer Report...</p>
            <p className="text-sm text-muted-foreground">This may take a few moments</p>
          </div>
        </div>
      )}
      <CardHeader className="space-y-2 border-b bg-muted/30">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>Create Customer Segment</CardTitle>
        </div>
        <Alert className="bg-primary/5 border-primary/20">
          <AlertDescription>
            Define your target customer segment to generate detailed insights and market analysis
          </AlertDescription>
        </Alert>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Customer Profile Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <Label className="text-lg font-semibold">Customer Profile</Label>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormTooltip content="Give your segment a memorable name">
                        <div className="flex items-center gap-2">
                          <FormLabel>Title</FormLabel>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormTooltip>
                      <FormControl>
                        <Input
                          className="transition-all focus:scale-[1.01]"
                          placeholder="e.g., Invoice Tool"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="segment"
                  render={({ field }) => (
                    <FormItem>
                      <FormTooltip content="Describe your target customer group">
                        <div className="flex items-center gap-2">
                          <FormLabel>Segment</FormLabel>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormTooltip>
                      <FormControl>
                        <Input
                          className="transition-all focus:scale-[1.01]"
                          placeholder="e.g., Freelancers, solopreneurs"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="painPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormTooltip content="What challenges does your target audience face?">
                      <div className="flex items-center gap-2">
                        <FormLabel>Pain Points</FormLabel>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormTooltip>
                    <FormControl>
                      <Textarea
                        className="min-h-[100px] transition-all focus:scale-[1.01]"
                        placeholder="Describe their challenges"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-8" />

            {/* Solution Overview Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-primary" />
                <Label className="text-lg font-semibold">Solution Overview</Label>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="problem"
                  render={({ field }) => (
                    <FormItem>
                      <FormTooltip content="What specific problem are you solving?">
                        <div className="flex items-center gap-2">
                          <FormLabel>Problem to Solve</FormLabel>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormTooltip>
                      <FormControl>
                        <Textarea
                          className="min-h-[100px] transition-all focus:scale-[1.01]"
                          placeholder="e.g., Simplifying invoicing..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="solution"
                  render={({ field }) => (
                    <FormItem>
                      <FormTooltip content="How does your solution address the problem?">
                        <div className="flex items-center gap-2">
                          <FormLabel>Solution Offered</FormLabel>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormTooltip>
                      <FormControl>
                        <Textarea
                          className="min-h-[100px] transition-all focus:scale-[1.01]"
                          placeholder="e.g., A lightweight invoicing tool..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormTooltip content="What makes your solution unique?">
                      <div className="flex items-center gap-2">
                        <FormLabel>Unique Features</FormLabel>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormTooltip>
                    <FormControl>
                      <Textarea
                        className="min-h-[100px] transition-all focus:scale-[1.01]"
                        placeholder="e.g., Simple interface, automatic reminders"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-8" />

            {/* Market Context Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-primary" />
                <Label className="text-lg font-semibold">Market Context</Label>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormTooltip content="What industry does your solution serve?">
                        <div className="flex items-center gap-2">
                          <FormLabel>Industry</FormLabel>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormTooltip>
                      <FormControl>
                        <Input
                          className="transition-all focus:scale-[1.01]"
                          placeholder="e.g., Accounting & Finance Tools"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="competitors"
                  render={({ field }) => (
                    <FormItem>
                      <FormTooltip content="Who are your main competitors?">
                        <div className="flex items-center gap-2">
                          <FormLabel>Competitors</FormLabel>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormTooltip>
                      <FormControl>
                        <Textarea
                          className="transition-all focus:scale-[1.01]"
                          placeholder="e.g., FreshBooks, Zoho Invoice"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="channels"
                render={({ field }) => (
                  <FormItem>
                    <FormTooltip content="How will you reach your customers?">
                      <div className="flex items-center gap-2">
                        <FormLabel>Marketing Channels</FormLabel>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormTooltip>
                    <FormControl>
                      <Textarea
                        className="min-h-[100px] transition-all focus:scale-[1.01]"
                        placeholder="e.g., Freelancing platforms, forums, social media ads"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                disabled={isLoading}
                type="submit"
                className="px-8 py-6 text-lg font-medium transition-all hover:scale-[1.02]"
              >
                {isLoading ? (
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
  );
}
