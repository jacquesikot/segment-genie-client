import { AnalyticsEvent, identifyUser, trackEvent as trackMixPanelEvent } from '@/utils/mixpanel';
import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';

// Define a type for analytics properties
type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined | object | Array<string | number | boolean | null | undefined | object>
>;

export const useAnalytics = () => {
  const { user } = useAuth();

  // Identify user when they log in
  useEffect(() => {
    if (user) {
      identifyUser(user.id, {
        firstName: user.user_metadata.first_name || undefined,
        lastName: user.user_metadata.last_name || undefined,
        email: user.email || undefined,
        plan: 'free',
      });
    }
  }, [user]);

  return {
    trackEvent: (event: AnalyticsEvent, properties: AnalyticsProperties = {}, timeEvent: boolean = false) => {
      return trackMixPanelEvent(event, properties, timeEvent);
    },

    Event: AnalyticsEvent,
  };
};
