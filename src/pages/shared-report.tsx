import { ResearchReport } from '@/api/research';
import { getSegment, Segment, SegmentStatus } from '@/api/segment';
import SharedReportView from '@/components/customer-report/SharedReportView';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function SharedReport() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [segment, setSegment] = useState<Segment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [segmentData, setSegmentData] = useState<ResearchReport>();
  const [status, setStatus] = useState<SegmentStatus>({
    general: {
      progress: 100,
      message: 'Complete',
      isComplete: true,
      data: null,
    },
    marketSize: {
      progress: 100,
      message: 'Complete',
      isComplete: true,
      data: null,
    },
    painPoints: {
      progress: 100,
      message: 'Complete',
      isComplete: true,
      data: null,
    },
    competitors: {
      progress: 100,
      message: 'Complete',
      isComplete: true,
      data: null,
    },
    marketTrends: {
      progress: 100,
      message: 'Complete',
      isComplete: true,
      data: null,
    },
  });

  useEffect(() => {
    async function fetchSegment() {
      if (!id) return;

      try {
        setIsLoading(true);
        const segmentData = await getSegment(id);
        setSegment(segmentData);

        if (segmentData.data) {
          setSegmentData(segmentData.data);
        }

        setStatus(segmentData.status);
      } catch (err) {
        console.error('Error fetching segment:', err);
        setError('Failed to load the report. It may have been deleted or is no longer available.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSegment();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-gray-600">Loading report...</p>
      </div>
    );
  }

  if (error || !segment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Alert className="max-w-md">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'Report not found'}</AlertDescription>
        </Alert>
        <Button asChild className="mt-6">
          <Link to="/">Go to Home</Link>
        </Button>
      </div>
    );
  }

  if (!segment.isPublic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Alert className="max-w-md">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle>Private Report</AlertTitle>
          <AlertDescription>
            This report is private and cannot be viewed. The owner of this report has not made it public.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-6">
          <Link to="/">Go to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b py-3 px-4 bg-background">
        <div className="max-w-screen-xl flex justify-between items-center">
          <h1 className="text-xl font-semibold">{segment.title || 'Shared Report'}</h1>
        </div>
      </div>

      <main className="flex-1 overflow-hidden">
        <SharedReportView report={segmentData} status={status} />
      </main>
    </div>
  );
}
