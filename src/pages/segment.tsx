import { ResearchReport, WSEvent } from '@/api/research';
import { getSegment, SegmentStatus } from '@/api/segment';
import CustomerReportView from '@/components/CustomerReportView';
import PageHeader from '@/components/page-header';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
  const [status, setStatus] = useState<SegmentStatus>({
    general: {
      progress: 0,
      message: 'Fetching Segment...',
      isComplete: false,
      data: null,
    },
    marketSize: {
      progress: 0,
      message: 'Fetching Segment...',
      isComplete: false,
      data: null,
    },
    painPoints: {
      progress: 0,
      message: 'Fetching Segment...',
      isComplete: false,
      data: null,
    },
  });

  const { data: segment } = useQuery({
    queryKey: ['segment', id],
    queryFn: () => getSegment(id as string),
    enabled: !!id,
  });
  const [segmentData, setSegmentData] = useState<ResearchReport>();

  useEffect(() => {
    if (!segment) return;

    setStatus(segment.status);
    if (segment.data) {
      setSegmentData(segment.data);
    } else {
      setStatus(segment.status);
    }
  }, [segment]);

  useEventSource(`${import.meta.env.VITE_API_URL}/events`, (data) => {
    if (data.segmentId === id) {
      setStatus(data.status);
    }
  });

  useEffect(() => {
    if (segment === null) throw new Error('Segment not found');
  }, [segment]);

  return (
    <>
      <PageHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-5 overflow-hidden">
        <CustomerReportView report={segmentData ? segmentData : undefined} status={status} />
      </div>
    </>
  );
}
