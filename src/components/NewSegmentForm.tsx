import { Card, CardContent } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { researchInputForm } from '@/pages/dashboard';
import { BarChart3, Info, Lightbulb, Users } from 'lucide-react';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

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

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<z.infer<typeof researchInputForm>, any, undefined>;
  onSubmit?: () => void;
  isLoading?: boolean;
}

export function NewSegmentForm({ form }: Props) {
  const [activeSection, setActiveSection] = useState('customer');

  return (
    <div>
      {/* Quick Overview & Tabs Navigation */}
      <Card className="shadow-sm border-0 bg-transparent">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Segment Details</h2>
          </div>

          <Tabs defaultValue="all" value={activeSection} onValueChange={setActiveSection} className="mb-4">
            <TabsList className="grid grid-cols-3 mb-2">
              <TabsTrigger value="customer" className="text-xs sm:text-sm">
                Customer
              </TabsTrigger>
              <TabsTrigger value="solution" className="text-xs sm:text-sm">
                Solution
              </TabsTrigger>
              <TabsTrigger value="market" className="text-xs sm:text-sm">
                Market
              </TabsTrigger>
            </TabsList>

            {/* Improved Title Input */}
            <div className="relative">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="mb-0">
                    <div className="flex items-center mb-1">
                      <FormLabel className="text-xs text-gray-600 dark:text-gray-400">
                        Title <span className="text-gray-400">(click to edit)</span>
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="Enter segment title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Tabs>
        </CardContent>
      </Card>
      <ScrollArea className="pr-4">
        <div className="space-y-4">
          {/* Customer Profile Section */}
          {activeSection === 'customer' && (
            <Card className="shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <Label className="font-semibold text-sm">Customer Profile</Label>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="segment"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1 mb-1">
                            <FormLabel className="text-xs text-gray-600 dark:text-gray-400">Target Segment</FormLabel>
                            <FormTooltip content="Describe your target customer group">
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </FormTooltip>
                          </div>
                          <FormControl>
                            <Input className="text-sm" placeholder="e.g., Freelancers, solopreneurs" {...field} />
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
                        <div className="flex items-center gap-1 mb-1">
                          <FormLabel className="text-xs text-gray-600 dark:text-gray-400">Pain Points</FormLabel>
                          <FormTooltip content="What challenges does your target audience face?">
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </FormTooltip>
                        </div>
                        <FormControl>
                          <Textarea
                            className="min-h-[80px] text-sm"
                            placeholder="Describe their challenges"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Solution Overview Section */}
          {activeSection === 'solution' && (
            <Card className="shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <Label className="font-semibold text-sm">Solution Overview</Label>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="problem"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1 mb-1">
                            <FormLabel className="text-xs text-gray-600 dark:text-gray-400">Problem to Solve</FormLabel>
                            <FormTooltip content="What specific problem are you solving?">
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </FormTooltip>
                          </div>
                          <FormControl>
                            <Textarea
                              className="min-h-[80px] text-sm"
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
                          <div className="flex items-center gap-1 mb-1">
                            <FormLabel className="text-xs text-gray-600 dark:text-gray-400">Solution Offered</FormLabel>
                            <FormTooltip content="How does your solution address the problem?">
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </FormTooltip>
                          </div>
                          <FormControl>
                            <Textarea
                              className="min-h-[80px] text-sm"
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
                        <div className="flex items-center gap-1 mb-1">
                          <FormLabel className="text-xs text-gray-600 dark:text-gray-400">Unique Features</FormLabel>
                          <FormTooltip content="What makes your solution unique?">
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </FormTooltip>
                        </div>
                        <FormControl>
                          <Textarea
                            className="min-h-[80px] text-sm"
                            placeholder="e.g., Simple interface, automatic reminders"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Market Context Section */}
          {activeSection === 'market' && (
            <Card className="shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <Label className="font-semibold text-sm">Market Context</Label>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1 mb-1">
                            <FormLabel className="text-xs text-gray-600 dark:text-gray-400">Industry</FormLabel>
                            <FormTooltip content="What industry does your solution serve?">
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </FormTooltip>
                          </div>
                          <FormControl>
                            <Input className="text-sm" placeholder="e.g., Accounting & Finance Tools" {...field} />
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
                          <div className="flex items-center gap-1 mb-1">
                            <FormLabel className="text-xs text-gray-600 dark:text-gray-400">Competitors</FormLabel>
                            <FormTooltip content="Who are your main competitors?">
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </FormTooltip>
                          </div>
                          <FormControl>
                            <Textarea
                              className="min-h-[60px] text-sm"
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
                        <div className="flex items-center gap-1 mb-1">
                          <FormLabel className="text-xs text-gray-600 dark:text-gray-400">Marketing Channels</FormLabel>
                          <FormTooltip content="How will you reach your customers?">
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </FormTooltip>
                        </div>
                        <FormControl>
                          <Textarea
                            className="min-h-[80px] text-sm"
                            placeholder="e.g., Freelancing platforms, forums, social media ads"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
