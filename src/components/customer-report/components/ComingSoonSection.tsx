import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface ComingSoonSectionProps {
  title: string;
}

const ComingSoonSection: React.FC<ComingSoonSectionProps> = ({ title }) => (
  <Card className="border-2 border-dashed">
    <CardContent className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Clock className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title} - Coming Soon</h3>
      <p className="text-muted-foreground text-center max-w-md">
        We're working on bringing you detailed insights about {title.toLowerCase()}. Stay tuned for comprehensive
        analysis and data.
      </p>
    </CardContent>
  </Card>
);

export default ComingSoonSection;
