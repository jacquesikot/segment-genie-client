'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface Props {
  progress: number;
  statusText: string;
}

export default function SegmentLoader({ progress, statusText }: Props) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Generating Your Customer Report</CardTitle>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <p className="text-sm">Please wait while we process your data</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Progress value={progress} className="h-2 transition-all duration-300" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-center font-medium">{statusText}</p>
        </div>
      </CardContent>
    </Card>
  );
}
