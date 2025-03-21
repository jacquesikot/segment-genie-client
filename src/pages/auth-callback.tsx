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
          console.log('🚀 ~ handleAuthCallback ~ data:', data.session.user);
          // Determine if this is a new user or existing user by checking metadata
          const isNewUser = data.session.user.created_at === data.session.user.last_sign_in_at;

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
