import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { cva } from 'class-variance-authority';
import {
  TrendingUp,
  Clock,
  ShieldAlert,
  Users,
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  Target,
  UserCheck,
} from 'lucide-react';
import { formatCurrency, getMarketTypeStyles } from '../utils';

const marketCardVariants = cva('border shadow-sm hover:shadow-md transition-shadow dark:bg-gray-900 h-full', {
  variants: {
    type: {
      tam: 'border-l-4 border-l-blue-500 dark:border-l-blue-400',
      sam: 'border-l-4 border-l-purple-500 dark:border-l-purple-400',
      som: 'border-l-4 border-l-green-500 dark:border-l-green-400',
    },
  },
  defaultVariants: {
    type: 'tam',
  },
});

interface MarketMetricCardProps {
  title: string;
  value: { currency: string; amount: number; unit: string };
  description: string;
  type: 'tam' | 'sam' | 'som';
  percentage?: number;
  growthRate?: number;
  keyDrivers?: string[];
  risks?: string[];
  targetSegments?: string[];
  exclusionCriteria?: string[];
  competitiveDynamics?: string[];
  timeToAchieve?: number;
  methodology: string;
}

const MarketMetricCard = ({
  title,
  value,
  description,
  type,
  percentage,
  growthRate,
  keyDrivers,
  risks,
  targetSegments,
  exclusionCriteria,
  competitiveDynamics,
  timeToAchieve,
  methodology,
}: MarketMetricCardProps) => {
  const styles = getMarketTypeStyles(type);

  // Render the appropriate icon based on type
  const renderIcon = () => {
    switch (styles.icon) {
      case 'Target':
        return <Target className={`w-6 h-6 ${styles.color}`} />;
      case 'Users':
        return <Users className={`w-6 h-6 ${styles.color}`} />;
      case 'UserCheck':
        return <UserCheck className={`w-6 h-6 ${styles.color}`} />;
      default:
        return <Target className={`w-6 h-6 ${styles.color}`} />;
    }
  };

  return (
    <Card className={marketCardVariants({ type })}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <div className={`p-2 rounded-lg ${styles.bgColor}`}>{renderIcon()}</div>
            <div>
              <CardTitle className="text-lg dark:text-white">{title}</CardTitle>
              <CardDescription className="dark:text-gray-300">{description}</CardDescription>
            </div>
          </div>
          <span className={`${styles.color} font-semibold text-xl`}>
            {formatCurrency(value.amount, value.currency, value.unit)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {percentage !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm dark:text-gray-300">
              <span>Market Coverage</span>
              <span>{(percentage * 100).toFixed(1)}%</span>
            </div>
            <Progress value={percentage * 100} className={`h-2 ${styles.progressBgColor}`} />
          </div>
        )}

        {growthRate !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className={`w-4 h-4 ${styles.color}`} />
            <span className="font-medium dark:text-gray-300">{growthRate}% Annual Growth</span>
          </div>
        )}

        {timeToAchieve !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className={`w-4 h-4 ${styles.color}`} />
            <span className="font-medium dark:text-gray-300">Est. {timeToAchieve} years to achieve</span>
          </div>
        )}

        <Accordion type="single" collapsible className="w-full">
          {keyDrivers && keyDrivers.length > 0 && (
            <AccordionItem value="key-drivers" className="border-b-0">
              <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Key Growth Drivers</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="mt-2">
                <ul className="space-y-1 pl-6 text-sm text-muted-foreground dark:text-gray-400">
                  {keyDrivers.map((driver, idx) => (
                    <li key={idx} className="list-disc">
                      {driver}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {risks && risks.length > 0 && (
            <AccordionItem value="risks" className="border-b-0">
              <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Market Risks</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="mt-2">
                <ul className="space-y-1 pl-6 text-sm text-muted-foreground dark:text-gray-400">
                  {risks.map((risk, idx) => (
                    <li key={idx} className="list-disc">
                      {risk}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {targetSegments && targetSegments.length > 0 && (
            <AccordionItem value="segments" className="border-b-0">
              <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Target Segments</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="mt-2">
                <ul className="space-y-1 pl-6 text-sm text-muted-foreground dark:text-gray-400">
                  {targetSegments.map((segment, idx) => (
                    <li key={idx} className="list-disc">
                      {segment}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {exclusionCriteria && exclusionCriteria.length > 0 && (
            <AccordionItem value="exclusions" className="border-b-0">
              <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Exclusion Criteria</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="mt-2">
                <ul className="space-y-1 pl-6 text-sm text-muted-foreground dark:text-gray-400">
                  {exclusionCriteria.map((criteria, idx) => (
                    <li key={idx} className="list-disc">
                      {criteria}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {competitiveDynamics && competitiveDynamics.length > 0 && (
            <AccordionItem value="dynamics" className="border-b-0">
              <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Competitive Dynamics</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="mt-2">
                <ul className="space-y-1 pl-6 text-sm text-muted-foreground dark:text-gray-400">
                  {competitiveDynamics.map((dynamic, idx) => (
                    <li key={idx} className="list-disc">
                      {dynamic}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem value="methodology" className="border-b-0">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Methodology</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="mt-2">
              <p className="text-sm text-muted-foreground dark:text-gray-400">{methodology}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default MarketMetricCard;
