import { ResearchReport, WSEvent } from '@/api/research';
import { getSegment } from '@/api/segment';
import CustomerReportView from '@/components/CustomerReportView';
import SegmentLoader from '@/components/SegmentLoader';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface SegmentStatus {
  progress: string;
  message: string;
  isComplete: boolean;
  data?: ResearchReport | null;
}

const useEventSource = (url: string, onMessage: (data: WSEvent) => void) => {
  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      const data: WSEvent = JSON.parse(event.data);
      onMessage(data);
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [url, onMessage]);
};

export default function Segment() {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<SegmentStatus>({
    progress: '0',
    message: 'Fetching Segment...',
    isComplete: false,
    data: null,
  });

  const { data: segment } = useQuery({
    queryKey: ['segment', id],
    queryFn: () => getSegment(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (!segment) return;

    if (segment.data) {
      setState((prev) => ({
        ...prev,
        progress: segment.status.progress,
        message: segment.status.message,
        isComplete: segment.status.isComplete,
        data: segment.data,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        progress: segment.status.progress,
        message: segment.status.message,
      }));
    }
  }, [segment]);

  useEventSource(`${import.meta.env.VITE_API_URL}/events`, (data) => {
    if (data.segmentId === id) {
      setState((prev) => ({
        ...prev,
        progress: data.progress.toString(),
        message: data.status,
        data: data.data,
      }));
    }
  });

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">{segment?.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-hidden">
        {state.data ? (
          <div className="overflow-x-auto">
            <CustomerReportView reportData={state.data} />
          </div>
        ) : (
          <SegmentLoader progress={state.progress} statusText={state.message} />
        )}
      </div>
    </>
  );
}
