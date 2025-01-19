import { getUserSegments } from '@/api/segment';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { keys, storage } from '@/lib/storage';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SegmentsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = storage.getItem(keys.USER);
  const { data: segments, isLoading } = useQuery({
    queryKey: ['segments'],
    queryFn: () => getUserSegments(user!.id),
  });
  const navigate = useNavigate();

  const handleCardClick = (segmentId: string) => {
    navigate(`/segment/${segmentId}`);
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <h2 className="text-lg font-semibold text-gray-700">No Segments Yet</h2>
      <p className="text-sm text-gray-500">Create your first segment to start analyzing customer insights.</p>
      <Button onClick={() => navigate('/create-segment')} className="bg-indigo-600 text-white">
        Create New Segment
      </Button>
    </div>
  );

  const renderSegmentCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {(segments || []).map((segment) => (
        <Card
          key={segment._id}
          className="cursor-pointer hover:shadow-lg transition-all"
          onClick={() => handleCardClick(segment._id)}
        >
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900">{segment.title}</h3>
            <p className="text-sm text-gray-500">{segment.title}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500">{segment.status.message}</span>
              <span className="text-xs text-gray-400">Progress: {segment.status.progress}%</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Segments</h1>
        <Button onClick={() => navigate('/create-segment')} className="bg-indigo-600 text-white">
          Create New Segment
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center space-x-2">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading Segments...</span>
        </div>
      ) : (segments || []).length === 0 ? (
        renderEmptyState()
      ) : (
        renderSegmentCards()
      )}
    </div>
  );
}
