import { z } from 'zod';

export const researchInputForm = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  segment: z.string().min(2, { message: 'Segment must be at least 2 characters.' }),
  painPoints: z.string().min(5, { message: 'Pain Points must be at least 5 characters.' }),
  demographics: z.string().min(5, { message: 'Demographics must be at least 5 characters.' }),
  problem: z.string().min(5, { message: 'Problem must be at least 5 characters.' }),
  solution: z.string().min(5, { message: 'Solution must be at least 5 characters.' }),
  features: z.string().min(5, { message: 'Features must be at least 5 characters.' }),
  industry: z.string().min(2, { message: 'Industry must be at least 2 characters.' }),
  competitors: z.string().min(5, { message: 'Competitors must be at least 5 characters.' }),
  channels: z.string().min(5, { message: 'Channels must be at least 5 characters.' }),
});
