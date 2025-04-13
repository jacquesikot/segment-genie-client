import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from '../main';
import { useAnalytics } from '../hooks/use-analytics';

export default function AuthCallback() {
  const navigate = useNavigate();
  const analytics = useAnalytics();

  useEffect(() => {
    // Exchange the code for a session
    const handleAuthCallback = async () => {
      try {
        // Get session information from URL
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        // If session exists, redirect to home page
        if (data.session) {
          // Determine if this is a new user or existing user by checking metadata
          const createdAt = new Date(data.session.user.created_at || '');
          const lastSignInAt = new Date(data.session.user.last_sign_in_at || '');

          // If last_sign_in_at is very close to created_at (within a few seconds), it's a new user
          // Otherwise, it's a returning user with last_sign_in_at > created_at
          const isNewUser = Math.abs(lastSignInAt.getTime() - createdAt.getTime()) < 5000;

          // Track the appropriate event
          if (isNewUser) {
            analytics.trackEvent(analytics.Event.USER_SIGNED_UP, {
              method: 'google',
              userId: data.session.user.id,
            });
          } else {
            analytics.trackEvent(analytics.Event.USER_SIGNED_IN, {
              method: 'google',
              userId: data.session.user.id,
            });
          }

          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/sign-in', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate, analytics]);

  return <LoadingSpinner />;
}
