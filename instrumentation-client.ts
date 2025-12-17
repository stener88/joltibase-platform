// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://71c6507cbcd8ed653a39cc64141c683f@o4510550474031104.ingest.de.sentry.io/4510550481698896",

  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production',

  // Debug mode for troubleshooting (disable in production)
  debug: false,

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Sample 10% of transactions for performance monitoring (reduced from 100%)
  tracesSampleRate: 0.1,
  
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Sample 1% of normal sessions for replay (reduced from 10%)
  replaysSessionSampleRate: 0.01,

  // Capture 100% of sessions with errors for replay
  replaysOnErrorSampleRate: 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
