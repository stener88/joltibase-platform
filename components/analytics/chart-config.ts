/**
 * Shared Chart Configuration
 * 
 * Common styling and utilities for Recharts components to eliminate duplication.
 */

// ============================================================================
// Chart Styling Constants
// ============================================================================

/**
 * Shared tooltip styling for all charts
 */
export const CHART_TOOLTIP_STYLE = {
  backgroundColor: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '12px',
};

/**
 * Shared CartesianGrid configuration
 */
export const CHART_GRID_PROPS = {
  strokeDasharray: '3 3' as const,
  stroke: '#f0f0f0',
};

/**
 * Shared axis styling
 */
export const CHART_AXIS_STYLE = {
  tick: { fontSize: 12 },
  stroke: '#999',
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format a date string for chart display
 * 
 * @param dateStr - ISO date string or Date object
 * @returns Formatted date like "Jan 15"
 */
export function formatChartDate(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Sample data array to reduce chart complexity
 * Useful for large datasets to improve performance
 * 
 * @param data - Array of data points
 * @param interval - Show every Nth item (default: 3)
 * @returns Sampled array
 */
export function sampleChartData<T>(data: T[], interval: number = 3): T[] {
  return data.filter((_, index) => index % interval === 0);
}

