import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { keys, storage } from './storage';

// Define the interface for user data to be stored
interface UserData {
  email: string | undefined;
  fullName: string | null;
  imageUrl: string;
  id: string;
  token: string;
}

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    error: Error | null;
    user: User | null;
  }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{
    error: Error | null;
    user: User | null;
  }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: Error | null;
  }>;
  updatePassword: (password: string) => Promise<{
    error: Error | null;
  }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to update user data in storage
  const updateUserInStorage = (currentUser: User | null, currentSession: Session | null) => {
    if (currentUser && currentSession) {
      try {
        const userData: UserData = {
          email: currentUser.email,
          fullName: currentUser.user_metadata?.full_name || null,
          imageUrl: currentUser.user_metadata?.avatar_url || '',
          id: currentUser.id,
          token: currentSession.access_token,
        };

        storage.setItem(keys.IS_LOGGED_IN, true);
        storage.setItem(keys.USER, userData);
      } catch (err) {
        console.error('Failed to store user data:', err);
      }
    } else {
      // Clear user data if user is null
      storage.removeItem(keys.IS_LOGGED_IN);
      storage.removeItem(keys.USER);
    }
  };

  useEffect(() => {
    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      updateUserInStorage(session?.user ?? null, session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      updateUserInStorage(session?.user ?? null, session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error, user: data.user };
    } catch (error) {
      return { error: error as Error, user: null };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      return { error, user: data.user };
    } catch (error) {
      return { error: error as Error, user: null };
    }
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    // Note: We're not explicitly tracking the event here because
    // the component that calls signOut (NavUser) is responsible for tracking
    // This avoids duplicate events when logout is triggered from the UI
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
