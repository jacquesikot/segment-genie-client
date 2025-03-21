# Analytics Implementation Guide

This document outlines how to implement and use the analytics tracking system in this application.

## Overview

The analytics system tracks user behavior across the application to understand usage patterns and optimize the user experience. We use Mixpanel for event tracking.

## Key Components

1. **Analytics Utility Functions** - Located in `src/utils/mixpanel.ts`
2. **Analytics Hook** - Located in `src/hooks/use-analytics.ts`

## Tracking User Journeys

The system is designed around tracking complete user journeys through various stages:

- **Acquisition**: How users discover the app
- **Activation**: First key user experiences
- **Engagement**: Ongoing interactions with the app
- **Retention**: Factors that bring users back
- **Referral**: How users share the app
- **Revenue**: Conversion to paid features

## Event Categories

Events are organized into these categories:

- `AUTH`: User authentication events
- `NAVIGATION`: Page navigation events
- `DASHBOARD`: Dashboard interactions
- `SEGMENT`: Segment creation and analysis events
- `INTERACTION`: General UI interactions
- `ERROR`: Application and API errors

## Standard Event Types

Standard events are defined in the `AnalyticsEvent` enum. Use these whenever possible instead of custom event names to maintain consistency:

```ts
// Auth events
AnalyticsEvent.USER_SIGNED_UP;
AnalyticsEvent.USER_SIGNED_IN;
AnalyticsEvent.USER_SIGNED_OUT;

// Navigation events
AnalyticsEvent.PAGE_VIEW;
AnalyticsEvent.NAVIGATION_CLICK;

// Dashboard events
AnalyticsEvent.DASHBOARD_LOADED;
AnalyticsEvent.RESEARCH_EXAMPLE_CLICKED;
AnalyticsEvent.INITIAL_SEGMENT_ANALYSIS_STARTED;
AnalyticsEvent.INITIAL_SEGMENT_ANALYSIS_COMPLETED;
AnalyticsEvent.SEGMENT_INITIAL_ANALYSIS_TAB_CHANGED;
AnalyticsEvent.SEGMENT_INITIAL_ANALYSIS_DATA_CHANGED;

// Segment events
AnalyticsEvent.SEGMENT_CREATED;
AnalyticsEvent.SEGMENT_UPDATED;
AnalyticsEvent.SEGMENT_DELETED;
AnalyticsEvent.SEGMENT_VIEWED;
AnalyticsEvent.SEGMENT_LIST_VIEWED;
AnalyticsEvent.SEGMENT_ANALYSIS_STARTED;
AnalyticsEvent.SEGMENT_ANALYSIS_PENDING;
AnalyticsEvent.SEGMENT_ANALYSIS_COMPLETED;
AnalyticsEvent.SEGMENT_ANALYSIS_ERROR;
AnalyticsEvent.SEGMENT_REPORT_TAB_CHANGED;

// Interaction events
AnalyticsEvent.BUTTON_CLICKED;
AnalyticsEvent.LINK_CLICKED;
AnalyticsEvent.FEATURE_USED;

// Error events
AnalyticsEvent.API_ERROR;
AnalyticsEvent.FORM_VALIDATION_ERROR;
AnalyticsEvent.APPLICATION_ERROR;
```

## Implementation Guide

### 1. Using the Analytics Hook

The `useAnalytics` hook automatically handles:

- User identification via Clerk
- Environmental context
- Providing convenient tracking methods

Import it in your component:

```tsx
import { useAnalytics } from '@/hooks/use-analytics';

function MyComponent() {
  const analytics = useAnalytics();

  // Now you can use analytics methods
}
```

### 2. Tracking Page Views

Track page views using the `PAGE_VIEW` event:

```tsx
analytics.trackEvent(analytics.Event.PAGE_VIEW, {
  pageName: 'dashboard',
  // other properties
});
```

### 3. Tracking User Interactions

```tsx
// Track a button click
analytics.trackEvent(analytics.Event.BUTTON_CLICKED, {
  buttonName: 'create_segment_button',
  location: 'dashboard_header',
});

// Track navigation
analytics.trackEvent(analytics.Event.NAVIGATION_CLICK, {
  destination: '/segments',
  source: 'dashboard',
});
```

### 4. Tracking Segment Interactions

```tsx
// Track segment creation
analytics.trackEvent(analytics.Event.SEGMENT_CREATED, {
  segmentId: 'segment-123',
  segmentName: 'Small Business Owners',
  segmentType: 'business',
});

// Track segment view
analytics.trackEvent(analytics.Event.SEGMENT_VIEWED, {
  segmentId: 'segment-123',
});

// Track tabs or sections viewed in reports
analytics.trackEvent(analytics.Event.SEGMENT_REPORT_TAB_CHANGED, {
  activeReportTab: 'marketSize',
  previousReportTab: 'demographics',
});
```

### 5. Tracking Errors

```tsx
// Track API error
analytics.trackEvent(analytics.Event.API_ERROR, {
  message: 'Failed to load segments',
  statusCode: 500,
  endpoint: '/api/segments',
});

// Track form validation error
analytics.trackEvent(analytics.Event.FORM_VALIDATION_ERROR, {
  message: 'Invalid business idea',
  fieldName: 'initialIdea',
});
```

### 6. Tracking Analysis Steps

```tsx
// Track analysis started
analytics.trackEvent(analytics.Event.SEGMENT_ANALYSIS_STARTED, {
  segmentDetail: segmentData,
});

// Track analysis pending
analytics.trackEvent(analytics.Event.SEGMENT_ANALYSIS_PENDING, {
  segmentId: 'segment-123',
});

// Track analysis completed
analytics.trackEvent(analytics.Event.SEGMENT_ANALYSIS_COMPLETED, {
  segmentId: 'segment-123',
  analysisTime: 45,
});
```

## Best Practices

1. **Use Standard Event Names**: Use the predefined event names in `AnalyticsEvent` enum whenever possible
2. **Add Meaningful Properties**: Include relevant contextual data with each event
3. **Track User Journey Stages**: Set properties that help analyze the complete user journey
4. **Be Consistent**: Use the same property names across similar events for easier analysis
5. **Respect User Privacy**: Never track personally identifiable information unless explicitly consented
6. **Track Errors**: Always track errors to understand user pain points
7. **Time Events When Relevant**: Use the third parameter of `trackEvent` to time events between start and completion

## Common Key Metrics to Track

- **Segment Creation Rate**: How many users create segments after visiting the dashboard
- **Analysis Completion Rate**: How many segment analyses complete successfully
- **Time to First Segment**: How long it takes a new user to create their first segment
- **Session Duration**: How long users spend in the app per session
- **Feature Usage**: Which features of the segment analysis are most viewed/used
- **Error Rate**: Frequency and types of errors users encounter

## Debugging

To debug analytics events in development, open your browser console and look for Mixpanel logs. In development mode, debug is set to true, so all events are logged to the console.

## Adding New Event Types

If you need to add a new event type:

1. Add it to the `AnalyticsEvent` enum in `src/utils/mixpanel.ts`
2. Document it in this guide
3. Use it consistently across the application

## Analyzing the Data

You can view the collected analytics data in the Mixpanel dashboard at:
https://mixpanel.com/

## Questions?

If you have questions about implementing analytics or need a new event type added, please contact the development team.
