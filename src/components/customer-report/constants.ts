import { BarChart3, Brain, Building2, Check, Target } from 'lucide-react';

export const SECTIONS = [
  {
    id: 'industry-market',
    label: 'Industry & Market Size',
    icon: Building2,
    description: 'Market segmentation and size analysis',
  },
  {
    id: 'competition',
    label: 'Competition',
    icon: Target,
    description: 'Competitive landscape analysis',
  },
  {
    id: 'pain-points',
    label: 'Pain Points',
    icon: Brain,
    description: 'Customer challenges and needs',
  },
  {
    id: 'trends',
    label: 'Market Trends',
    icon: BarChart3,
    description: 'Industry trends and forecasts',
  },
  {
    id: 'validation',
    label: 'Validation',
    icon: Check,
    description: 'Is your product ready for market?',
  },
];
