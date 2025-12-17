/**
 * Centralized logging utility
 * 
 * Provides structured logging throughout the application with Sentry integration.
 * 
 * Usage:
 * - logger.debug() → Development only
 * - logger.info() → Important milestones (console only)
 * - logger.warn() → Warnings (console + Sentry in production)
 * - logger.error() → Errors (console + Sentry in production)
 */

import * as Sentry from '@sentry/nextjs';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

/**
 * Logger utility with Sentry integration
 */
export const logger = {
  /**
   * Debug logs - Only shown in development
   * Use for verbose debugging information
   */
  debug: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, context || '');
    }
  },

  /**
   * Info logs - Shown in console only (NOT sent to Sentry)
   * Use for important milestones, performance logs, cost logs
   */
  info: (message: string, context?: LogContext) => {
    console.log(`[INFO] ${message}`, context || '');
  },

  /**
   * Warning logs - Shown in console AND sent to Sentry in production
   * Use for recoverable issues, validation failures, retries
   */
  warn: (message: string, context?: LogContext) => {
    console.warn(`[WARN] ${message}`, context || '');
    
    // Send to Sentry in production
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureMessage(message, {
        level: 'warning',
        extra: context,
      });
    }
  },

  /**
   * Error logs - Shown in console AND sent to Sentry in production
   * Use for all errors and exceptions
   */
  error: (message: string, error?: Error | unknown, context?: LogContext) => {
    console.error(`[ERROR] ${message}`, error, context || '');
    
    // Send to Sentry in production
    if (process.env.NODE_ENV === 'production') {
      if (error instanceof Error) {
        Sentry.captureException(error, {
          extra: { ...context, message },
        });
      } else {
        Sentry.captureMessage(message, {
          level: 'error',
          extra: { ...context, error },
        });
      }
    }
  },
};

/**
 * Cost and performance logs - Console only, NOT sent to Sentry
 * These are operational logs that don't need error tracking
 */
export const logCost = (message: string, cost?: number, tokens?: { input: number; output: number }) => {
  console.log(`💰 ${message}`, { cost, tokens });
};

export const logPerformance = (message: string, duration: number) => {
  console.log(`⏱️ ${message}`, { duration: `${duration.toFixed(1)}s` });
};

