import { AnalyticsEvent, identifyUser, trackEvent as trackMixPanelEvent } from '@/utils/mixpanel';
import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';

// Define a type for analytics properties
type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined | object | Array<string | number | boolean | null | undefined | object>
>;

export const useAnalytics = () => {
  const { user } = useUser();

  // Identify user when they log in
  useEffect(() => {
    if (user) {
      identifyUser(user.id, {
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        email: user.primaryEmailAddress?.emailAddress,
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
