import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from '../main';

export default function AuthCallback() {
  const navigate = useNavigate();

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
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/sign-in', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return <LoadingSpinner />;
}
