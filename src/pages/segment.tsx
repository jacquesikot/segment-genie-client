'use client';

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

export default function Segment() {
  const [progress, setProgress] = useState(0);
  const params = useParams();
  const [statusText, setStatusText] = useState('Fetching Segment...');
  const { data: segment } = useQuery({
    queryKey: ['segment'],
    queryFn: () => getSegment(params.id as string),
    enabled: !!params.id,
  });
  const [report, setReport] = useState<ResearchReport | null>();
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    if (segment && segment.data) {
      setProgress(100);
      setReport(segment.data);
      setTitle(segment.title);
    } else if (segment) {
      setProgress(parseInt(segment?.status.progress));
      setStatusText(segment?.status.message);
    }
  }, [segment]);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5002/events');

    eventSource.onmessage = (event) => {
      const data: WSEvent = JSON.parse(event.data);
      setProgress(data.progress);
      setStatusText(data.status);
      if (data.data) {
        setReport(data.data);
      }
    };

    eventSource.onerror = (error) => {
      console.log('🚀 ~ useEffect ~ error:', error);
      setStatusText('An error occurred. Please try again later.');
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-hidden">
        {report ? (
          <div className="overflow-x-auto">
            <CustomerReportView reportData={report} />
          </div>
        ) : (
          <SegmentLoader progress={progress} statusText={statusText} />
        )}
      </div>
    </>
  );
}
