import { ResearchReport, WSEvent } from '@/api/research';
import { getSegment, SegmentStatus } from '@/api/segment';
import CustomerReportView from '@/components/customer-report/CustomerReportView';
import PageHeader from '@/components/page-header';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

const useSocketIO = (url: string, onStatusUpdate: (data: WSEvent) => void) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Create Socket.io connection
    const socket = io(url);
    socketRef.current = socket;

    // Connection opened
    socket.on('connect', () => {
      console.log('Connected to Socket.io server');
    });

    // Listen for status updates
    socket.on('statusUpdate', (data: WSEvent) => {
      console.log('Status update received:', data);
      onStatusUpdate(data);
    });

    // Handle errors
    socket.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error);
    });

    // Connection closed
    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
    });

    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, [url, onStatusUpdate]);

  return socketRef;
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
    competitors: {
      progress: 0,
      message: 'Fetching Segment...',
      isComplete: false,
      data: null,
    },
    marketTrends: {
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

  // Update segment data when any section's data is updated
  const updateSegmentData = useCallback((newStatus: SegmentStatus) => {
    setSegmentData((prevData) => {
      // Create a new object to hold the updated data
      const updatedData: ResearchReport = { ...(prevData || {}) } as ResearchReport;

      // Check each section for new data
      if (newStatus.marketSize?.data) {
        updatedData.marketSize = newStatus.marketSize.data;
      }
      if (newStatus.painPoints?.data) {
        updatedData.painPoints = newStatus.painPoints.data;
      }
      if (newStatus.competitors?.data) {
        updatedData.competitors = newStatus.competitors.data;
      }
      if (newStatus.marketTrends?.data) {
        updatedData.marketTrends = newStatus.marketTrends.data;
      }

      return updatedData;
    });
  }, []);

  useEffect(() => {
    if (!segment) return;

    setStatus(segment.status);
    if (segment.data) {
      setSegmentData(segment.data);
    } else {
      updateSegmentData(segment.status);
    }
  }, [segment, updateSegmentData]);

  const handleSocketUpdate = useCallback(
    (data: WSEvent) => {
      if (data.segmentId === id) {
        setStatus(data.status);
        updateSegmentData(data.status);
      }
    },
    [id, updateSegmentData]
  );

  // Use Socket.io instead of native WebSockets
  useSocketIO(import.meta.env.VITE_API_URL, handleSocketUpdate);

  useEffect(() => {
    if (segment === null) throw new Error('Segment not found');
  }, [segment]);

  return (
    <>
      <PageHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-5 overflow-hidden">
        <CustomerReportView report={segmentData} status={status} segmentId={id as string} />
      </div>
    </>
  );
}
