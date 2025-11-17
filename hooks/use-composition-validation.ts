/**
 * Composition Validation Hook
 * 
 * Provides real-time composition validation with debouncing and caching.
 * Exposes violations, score, and auto-fix functions.
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { EmailBlock } from '@/lib/email/blocks/types';
import { 
  defaultCompositionEngine, 
  scoreComposition,
  type RuleViolation,
  type QualityScore,
  type CompositionResult,
} from '@/lib/email/composition';

// ============================================================================
// Types
// ============================================================================

export interface CompositionValidationState {
  violations: RuleViolation[];
  score: QualityScore;
  isValidating: boolean;
  lastValidated: Date | null;
  error: Error | null;
}

export interface UseCompositionValidationOptions {
  /** Debounce delay in milliseconds (default: 500ms) */
  debounceMs?: number;
  /** Enable automatic validation on blocks change (default: true) */
  autoValidate?: boolean;
  /** Enable caching of validation results (default: true) */
  enableCache?: boolean;
}

export interface UseCompositionValidationReturn extends CompositionValidationState {
  /** Manually trigger validation */
  validate: () => Promise<void>;
  /** Apply all auto-fixable corrections */
  autoFixAll: () => Promise<EmailBlock[]>;
  /** Apply correction for specific block and rule */
  autoFix: (blockId: string, ruleId: string) => Promise<EmailBlock[]>;
  /** Clear validation cache */
  clearCache: () => void;
}

// ============================================================================
// Cache Implementation
// ============================================================================

class ValidationCache {
  private cache = new Map<string, { violations: RuleViolation[]; score: QualityScore; timestamp: number }>();
  private maxAge = 5000; // 5 seconds
  
  get(key: string) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return { violations: cached.violations, score: cached.score };
  }
  
  set(key: string, violations: RuleViolation[], score: QualityScore) {
    this.cache.set(key, { violations, score, timestamp: Date.now() });
  }
  
  clear() {
    this.cache.clear();
  }
  
  // Generate cache key from blocks
  static generateKey(blocks: EmailBlock[]): string {
    // Create hash from block structure (simplified)
    const blockData = blocks.map(b => ({
      id: b.id,
      type: b.type,
      settings: JSON.stringify(b.settings),
    }));
    return JSON.stringify(blockData);
  }
}

const globalCache = new ValidationCache();

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook for real-time composition validation
 * 
 * @example
 * ```tsx
 * const { violations, score, autoFixAll } = useCompositionValidation(blocks);
 * 
 * if (score.score < 70) {
 *   console.warn('Low quality:', score.issues);
 * }
 * ```
 */
export function useCompositionValidation(
  blocks: EmailBlock[],
  options: UseCompositionValidationOptions = {}
): UseCompositionValidationReturn {
  const {
    debounceMs = 500,
    autoValidate = true,
    enableCache = true,
  } = options;
  
  const [state, setState] = useState<CompositionValidationState>({
    violations: [],
    score: {
      score: 0,
      breakdown: { spacing: 0, hierarchy: 0, contrast: 0, balance: 0 },
      issues: [],
      grade: 'F',
      passing: false,
    },
    isValidating: false,
    lastValidated: null,
    error: null,
  });
  
  // Generate cache key
  const cacheKey = useMemo(() => {
    return enableCache ? ValidationCache.generateKey(blocks) : '';
  }, [blocks, enableCache]);
  
  // Validation function
  const validate = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isValidating: true, error: null }));
      
      // Check cache first
      if (enableCache && cacheKey) {
        const cached = globalCache.get(cacheKey);
        if (cached) {
          setState(prev => ({
            ...prev,
            violations: cached.violations,
            score: cached.score,
            isValidating: false,
            lastValidated: new Date(),
          }));
          return;
        }
      }
      
      // Validate blocks
      const violations = defaultCompositionEngine.validate(blocks);
      const score = scoreComposition(blocks);
      
      // Cache results
      if (enableCache && cacheKey) {
        globalCache.set(cacheKey, violations, score);
      }
      
      setState({
        violations,
        score,
        isValidating: false,
        lastValidated: new Date(),
        error: null,
      });
    } catch (error) {
      console.error('Composition validation error:', error);
      setState(prev => ({
        ...prev,
        isValidating: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      }));
    }
  }, [blocks, enableCache, cacheKey]);
  
  // Auto-validate with debouncing
  useEffect(() => {
    if (!autoValidate) return;
    
    const timer = setTimeout(() => {
      validate();
    }, debounceMs);
    
    return () => clearTimeout(timer);
  }, [blocks, autoValidate, debounceMs, validate]);
  
  // Auto-fix all violations
  const autoFixAll = useCallback(async (): Promise<EmailBlock[]> => {
    try {
      const result: CompositionResult = await defaultCompositionEngine.execute(blocks);
      
      // Re-validate after fix
      await validate();
      
      return result.blocks;
    } catch (error) {
      console.error('Auto-fix all error:', error);
      throw error;
    }
  }, [blocks, validate]);
  
  // Auto-fix specific violation
  const autoFix = useCallback(async (blockId: string, ruleId: string): Promise<EmailBlock[]> => {
    try {
      // Execute only the specific rule on the specific block
      const result = await defaultCompositionEngine.execute(blocks, {
        rules: [ruleId],
      });
      
      // Re-validate after fix
      await validate();
      
      return result.blocks;
    } catch (error) {
      console.error('Auto-fix error:', error);
      throw error;
    }
  }, [blocks, validate]);
  
  // Clear cache
  const clearCache = useCallback(() => {
    globalCache.clear();
  }, []);
  
  return {
    ...state,
    validate,
    autoFixAll,
    autoFix,
    clearCache,
  };
}

/**
 * Hook for simple composition score (no violations)
 * Lighter weight than full validation
 */
export function useCompositionScore(blocks: EmailBlock[]): QualityScore {
  return useMemo(() => {
    try {
      return scoreComposition(blocks);
    } catch (error) {
      console.error('Composition scoring error:', error);
      return {
        score: 0,
        breakdown: { spacing: 0, hierarchy: 0, contrast: 0, balance: 0 },
        issues: ['Error calculating score'],
        grade: 'F',
        passing: false,
      };
    }
  }, [blocks]);
}

