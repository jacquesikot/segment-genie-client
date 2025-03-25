import { BarChart3, Brain, Building2, Check, Target } from 'lucide-react';

export const SECTIONS = [
  {
    id: 'painPoints',
    label: 'Pain Points',
    icon: Brain,
    description: 'Customer challenges and needs',
  },
  {
    id: 'competitors',
    label: 'Competitors',
    icon: Target,
    description: 'Competitive landscape analysis',
  },
  {
    id: 'marketTrends',
    label: 'Market Trends',
    icon: BarChart3,
    description: 'Industry trends and forecasts',
  },
  {
    id: 'marketSize',
    label: 'Market Size',
    icon: Building2,
    description: 'Market segmentation and size analysis',
  },
  {
    id: 'validation',
    label: 'Validation',
    icon: Check,
    description: 'Is your product ready for market?',
  },
];
