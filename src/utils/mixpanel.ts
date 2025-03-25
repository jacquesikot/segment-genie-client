import mixpanel from 'mixpanel-browser';

export enum AnalyticsEvent {
  // Auth events
  USER_SIGNED_UP = 'user_signed_up',
  USER_SIGNED_IN = 'user_signed_in',
  USER_SIGNED_OUT = 'user_signed_out',

  // Navigation events
  PAGE_VIEW = 'page_view',
  NAVIGATION_CLICK = 'navigation_click',

  // Dashboard events
  DASHBOARD_LOADED = 'dashboard_loaded',
  RESEARCH_EXAMPLE_CLICKED = 'research_example_clicked',
  INITIAL_SEGMENT_ANALYSIS_STARTED = 'initial_segment_analysis_started',
  INITIAL_SEGMENT_ANALYSIS_COMPLETED = 'initial_segment_analysis_completed',
  SEGMENT_INITIAL_ANALYSIS_TAB_CHANGED = 'segment_initial_analysis_tab_changed',
  SEGMENT_INITIAL_ANALYSIS_DATA_CHANGED = 'segment_initial_analysis_data_changed',

  // Segment events
  SEGMENT_CREATED = 'segment_created',
  SEGMENT_UPDATED = 'segment_updated',
  SEGMENT_DELETED = 'segment_deleted',
  SEGMENT_VIEWED = 'segment_viewed',
  SEGMENT_LIST_VIEWED = 'segment_list_viewed',
  SEGMENT_ANALYSIS_STARTED = 'segment_analysis_started',
  SEGMENT_ANALYSIS_PENDING = 'segment_analysis_pending',
  SEGMENT_ANALYSIS_COMPLETED = 'segment_analysis_completed',
  SEGMENT_ANALYSIS_ERROR = 'segment_analysis_error',
  SEGMENT_REPORT_TAB_CHANGED = 'segment_report_tab_changed',
  SEGMENT_REPORT_RERUN = 'segment_report_rerun',

  // Interaction events
  BUTTON_CLICKED = 'button_clicked',
  LINK_CLICKED = 'link_clicked',
  FEATURE_USED = 'feature_used',

  // Error events
  API_ERROR = 'api_error',
  FORM_VALIDATION_ERROR = 'form_validation_error',
  APPLICATION_ERROR = 'application_error',
}

// Near entry of your product, init Mixpanel
mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
  debug: true, // Keep debug mode on to see logs
  track_pageview: true,
  persistence: 'localStorage',
  ignore_dnt: true, // Ignore "Do Not Track" settings
  opt_out_tracking_by_default: false,
  api_host: 'https://api-js.mixpanel.com', // Explicitly set the API host
  cross_subdomain_cookie: false, // D
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const identifyUser = (userId: string, properties: Record<string, any> = {}): void => {
  try {
    // Identify the user with their unique ID
    mixpanel.identify(userId);

    // Set user properties in Mixpanel People
    mixpanel.people.set({
      // Default properties
      $name: properties.name,
      $email: properties.email,
      plan: properties.plan,
      ...properties,
    });
  } catch (error) {
    console.error('Error identifying user:', error);
  }
};

export const trackEvent = (
  event: AnalyticsEvent,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: Record<string, any> = {},
  timeEvent: boolean = false
): void => {
  const enhancedProperties = {
    ...properties,
    environment: import.meta.env.VITE_ENVIRONMENT,
  };
  mixpanel.track(event, enhancedProperties);

  if (timeEvent) {
    mixpanel.time_event(event);
  }
};
