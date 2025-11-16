/**
 * API Response Utilities
 * 
 * Standardized response helpers to ensure consistent API response formats.
 */

import { NextResponse } from 'next/server';

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

/**
 * Create a standardized success response
 */
export function successResponse<T>(
  data: T,
  status: number = 200
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json<SuccessResponse<T>>(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Create a standardized error response
 */
export function errorResponse(
  error: string,
  status: number = 500,
  code?: string,
  details?: any
): NextResponse<ErrorResponse> {
  const response: ErrorResponse = {
    success: false,
    error,
  };

  if (code) {
    response.code = code;
  }

  if (details) {
    response.details = details;
  }

  return NextResponse.json<ErrorResponse>(response, { status });
}

/**
 * Common error responses
 */
export const CommonErrors = {
  unauthorized: () => errorResponse('Authentication required', 401, 'UNAUTHORIZED'),
  forbidden: () => errorResponse('Access forbidden', 403, 'FORBIDDEN'),
  notFound: (resource: string = 'Resource') => 
    errorResponse(`${resource} not found`, 404, 'NOT_FOUND'),
  badRequest: (message: string = 'Invalid request data') => 
    errorResponse(message, 400, 'BAD_REQUEST'),
  validationError: (message: string = 'Validation failed', details?: any) =>
    errorResponse(message, 400, 'VALIDATION_ERROR', details),
  serverError: (message: string = 'Internal server error') =>
    errorResponse(message, 500, 'INTERNAL_ERROR'),
};

