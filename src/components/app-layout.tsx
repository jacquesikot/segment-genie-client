import { getUserSegments, Segment } from '@/api/segment';
import { keys, storage } from '@/lib/storage';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppNav from './app-nav';
import { SidebarInset, SidebarProvider } from './ui/sidebar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSegments } from '@/redux/slice/segment';

interface UserData {
  email: string | undefined;
  fullName: string | null;
  imageUrl: string;
  id: string;
  token: string;
}

// Custom hook to handle authentication state
const useAuthState = () => {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { user } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [isLoggedInLocally, setIsLoggedInLocally] = useState(() => !!storage.getItem(keys.IS_LOGGED_IN));

  const updateUserData = async () => {
    if (!isSignedIn || !user) return;

    try {
      const token = await getToken();
      const userData: UserData = {
        email: user.primaryEmailAddress?.emailAddress,
        fullName: user.fullName,
        imageUrl: user.imageUrl,
        id: user.id,
        token: token as string,
      };

      storage.setItem(keys.IS_LOGGED_IN, true);
      storage.setItem(keys.USER, userData);
      setIsLoggedInLocally(true);
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to update login state. Please try again.');
    }
  };

  return {
    isLoaded,
    isLoggedInLocally,
    error,
    updateUserData,
  };
};

const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen w-screen">
    <p>SegmentGenie Loading...</p>
  </div>
);

const ErrorScreen = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center h-screen w-screen">
    <p className="text-red-500">{message}</p>
  </div>
);

const AppLayout = () => {
  const dispatch = useAppDispatch();
  const { isLoaded, isLoggedInLocally, error, updateUserData } = useAuthState();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = storage.getItem(keys.USER);
  const appSegments = useAppSelector((s) => s.segment.segments);
  const { data: segments, isLoading } = useQuery({
    queryKey: ['segments'],
    queryFn: () => getUserSegments(user!.id),
  });

  // Update auth state when component mounts
  useEffect(() => {
    updateUserData();
    if (segments) {
      dispatch(setSegments(segments));
    }
  }, [updateUserData, segments, dispatch]);

  if (!isLoaded && !isLoggedInLocally) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen message={error} />;
  }

  return (
    <SidebarProvider>
      <div className="flex w-screen">
        {isLoggedInLocally && <AppNav segments={appSegments as Segment[]} isLoading={isLoading} />}
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
