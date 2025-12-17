// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://71c6507cbcd8ed653a39cc64141c683f@o4510550474031104.ingest.de.sentry.io/4510550481698896",

  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production',

  // Debug mode for troubleshooting (disable in production)
  debug: false,

  // Sample 10% of transactions for performance monitoring (reduced from 100%)
  tracesSampleRate: 0.1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
