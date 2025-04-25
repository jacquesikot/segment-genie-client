import { getUserSegments, Segment } from '@/api/segment';
import { keys, storage } from '@/lib/storage';
import { useAuth } from '@/lib/auth-context';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSegments } from '@/redux/slice/segment';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AppNav from './app-nav';
import { SidebarInset, SidebarProvider } from './ui/sidebar';

interface UserData {
  email: string | undefined;
  fullName: string | null;
  imageUrl: string;
  id: string;
  token: string;
}

const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen w-screen">
    <p>SegmentGenie Loading...</p>
  </div>
);

const AppLayout = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAuth();
  const appSegments = useAppSelector((s) => s.segment.segments);

  // Get user data from local storage with proper type
  const userData = storage.getItem(keys.USER) as UserData | null;

  const { data: segments, isLoading } = useQuery({
    queryKey: ['segments'],
    queryFn: () => (userData?.id ? getUserSegments(userData.id) : Promise.resolve([])),
    enabled: !!userData?.id,
  });

  // Update segments in Redux store
  useEffect(() => {
    if (segments) {
      dispatch(setSegments(segments));
    }
  }, [segments, dispatch]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SidebarProvider>
      <div className="flex w-screen">
        {user && <AppNav segments={appSegments as Segment[]} isLoading={isLoading} />}
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
