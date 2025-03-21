import { getUserSegments, Segment } from '@/api/segment';
import { keys, storage } from '@/lib/storage';
import { useAuth } from '@/lib/auth-context';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSegments } from '@/redux/slice/segment';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
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
  const { user, loading, session } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const appSegments = useAppSelector((s) => s.segment.segments);

  // Store user data in local storage
  useEffect(() => {
    if (user && session) {
      try {
        const userData: UserData = {
          email: user.email,
          fullName: user.user_metadata?.full_name || null,
          imageUrl: user.user_metadata?.avatar_url || '',
          id: user.id,
          token: session.access_token,
        };

        storage.setItem(keys.IS_LOGGED_IN, true);
        storage.setItem(keys.USER, userData);
      } catch (err) {
        console.error('Failed to store user data:', err);
        setError('Failed to store user data. Please try again.');
      }
    }
  }, [user, session]);

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

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
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
