/**
 * Debounce Utility
 * 
 * Creates a debounced version of a function that delays execution
 * until after a specified wait period has elapsed since the last invocation
 */

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Create a debounced callback with cleanup
 * Returns both the debounced function and a cleanup function
 */
export function createDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  wait: number
): {
  debouncedFn: (...args: Parameters<T>) => void;
  cancel: () => void;
  flush: () => void;
} {
  let timeout: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;
  
  const debouncedFn = (...args: Parameters<T>) => {
    lastArgs = args;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      callback(...args);
      lastArgs = null;
      timeout = null;
    }, wait);
  };
  
  const cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
      lastArgs = null;
    }
  };
  
  const flush = () => {
    if (timeout && lastArgs) {
      clearTimeout(timeout);
      callback(...lastArgs);
      timeout = null;
      lastArgs = null;
    }
  };
  
  return { debouncedFn, cancel, flush };
}

