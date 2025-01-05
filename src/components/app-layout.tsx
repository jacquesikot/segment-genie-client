import { getUserSegments, Segment } from '@/api/segment';
import { keys, storage } from '@/lib/storage';
import { useAuth, useUser } from '@clerk/clerk-react';
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

// Custom hook to handle segments
const useSegments = () => {
  const { data: segments } = useQuery({
    queryKey: ['segments'],
    queryFn: getUserSegments,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [appSegments, setAppSegments] = useState<Segment[]>(storage.getItem(keys.RECENT_SEGMENTS) || []);

  // Update segments in storage when they change
  if (segments) {
    storage.setItem(keys.RECENT_SEGMENTS, segments);
  }

  return { appSegments };
};

// Loading component
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen w-screen">
    <p>SegmentGenie Loading...</p>
  </div>
);

// Error component
const ErrorScreen = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center h-screen w-screen">
    <p className="text-red-500">{message}</p>
  </div>
);

const AppLayout = () => {
  const { isLoaded, isLoggedInLocally, error, updateUserData } = useAuthState();
  const { appSegments } = useSegments();

  // Update auth state when component mounts
  useEffect(() => {
    updateUserData();
  }, [updateUserData]);

  if (!isLoaded && !isLoggedInLocally) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen message={error} />;
  }

  return (
    <SidebarProvider>
      <div className="flex w-screen">
        {isLoggedInLocally && <AppNav segments={appSegments} />}
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
