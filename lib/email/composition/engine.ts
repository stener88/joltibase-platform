/**
 * Composition Engine
 * 
 * Middleware-based engine that applies composition rules to email blocks.
 * Enforces aesthetic quality and accessibility standards automatically.
 */

import type { EmailBlock } from '../blocks/types';
import type { CompositionRule, RuleContext, RuleViolation } from './rules';
import { allCompositionRules } from './rules';
import { designTokens } from '../design-tokens';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface CompositionOptions {
  enabled?: boolean;
  rules?: string[]; // Rule IDs to apply (default: all)
  accessibility?: 'WCAG-AA' | 'WCAG-AAA';
  viewport?: 'mobile' | 'tablet' | 'desktop';
}

export interface CompositionResult {
  blocks: EmailBlock[];
  appliedRules: string[];
  violations: RuleViolation[];
  correctionsMade: number;
}

export interface CompositionMetadata {
  appliedRules: string[];
  violations: RuleViolation[];
  correctionsMade: number;
  timestamp: Date;
}

// Middleware type
export type CompositionMiddleware = (
  blocks: EmailBlock[],
  context: RuleContext,
  next: () => Promise<EmailBlock[]>
) => Promise<EmailBlock[]>;

// ============================================================================
// Composition Engine
// ============================================================================

/**
 * Main composition engine that applies rules to blocks
 * Uses middleware pattern for extensibility
 */
export class CompositionEngine {
  private rules: CompositionRule[] = [];
  private middlewares: CompositionMiddleware[] = [];
  private ruleCache: Map<string, boolean> = new Map();
  
  constructor(rules: CompositionRule[] = allCompositionRules) {
    this.rules = rules.sort((a, b) => b.weight - a.weight);
  }
  
  /**
   * Add a middleware to the pipeline
   */
  use(middleware: CompositionMiddleware): this {
    this.middlewares.push(middleware);
    return this;
  }
  
  /**
   * Add a composition rule
   */
  addRule(rule: CompositionRule): this {
    this.rules.push(rule);
    this.rules.sort((a, b) => b.weight - a.weight);
    return this;
  }
  
  /**
   * Remove a rule by ID
   */
  removeRule(ruleId: string): this {
    this.rules = this.rules.filter(r => r.id !== ruleId);
    return this;
  }
  
  /**
   * Execute composition rules on blocks
   */
  async execute(
    blocks: EmailBlock[],
    options: CompositionOptions = {}
  ): Promise<CompositionResult> {
    const context: RuleContext = {
      tokens: designTokens,
      viewport: options.viewport || 'desktop',
      accessibility: options.accessibility || 'WCAG-AA',
    };
    
    // Filter rules if specific rules requested
    let rulesToApply = this.rules;
    if (options.rules && options.rules.length > 0) {
      rulesToApply = this.rules.filter(r => options.rules!.includes(r.id));
    }
    
    // Apply middlewares
    let processedBlocks = await this.applyMiddlewares(blocks, context);
    
    // Apply composition rules
    const result = await this.applyRules(processedBlocks, rulesToApply, context);
    
    return result;
  }
  
  /**
   * Validate blocks without modifying them
   * Returns list of violations
   */
  validate(
    blocks: EmailBlock[],
    options: CompositionOptions = {}
  ): RuleViolation[] {
    const context: RuleContext = {
      tokens: designTokens,
      viewport: options.viewport || 'desktop',
      accessibility: options.accessibility || 'WCAG-AA',
    };
    
    const violations: RuleViolation[] = [];
    
    // Filter rules if specific rules requested
    let rulesToApply = this.rules;
    if (options.rules && options.rules.length > 0) {
      rulesToApply = this.rules.filter(r => options.rules!.includes(r.id));
    }
    
    for (const block of blocks) {
      for (const rule of rulesToApply) {
        if (rule.condition(block)) {
          const violation = rule.validate(block, context);
          if (violation) {
            violations.push(violation);
          }
        }
      }
    }
    
    return violations;
  }
  
  /**
   * Get violations for specific blocks
   * Useful for UI feedback
   */
  getViolations(
    blocks: EmailBlock[],
    context: RuleContext = {
      tokens: designTokens,
      viewport: 'desktop',
      accessibility: 'WCAG-AA',
    }
  ): RuleViolation[] {
    return this.validate(blocks, {
      accessibility: context.accessibility,
      viewport: context.viewport,
    });
  }
  
  /**
   * Apply middlewares in sequence
   */
  private async applyMiddlewares(
    blocks: EmailBlock[],
    context: RuleContext
  ): Promise<EmailBlock[]> {
    if (this.middlewares.length === 0) {
      return blocks;
    }
    
    let result = blocks;
    
    const executeMiddleware = async (index: number): Promise<EmailBlock[]> => {
      if (index >= this.middlewares.length) {
        return result;
      }
      
      const middleware = this.middlewares[index];
      result = await middleware(result, context, () => executeMiddleware(index + 1));
      
      return result;
    };
    
    return executeMiddleware(0);
  }
  
  /**
   * Apply composition rules to blocks
   */
  private async applyRules(
    blocks: EmailBlock[],
    rules: CompositionRule[],
    context: RuleContext
  ): Promise<CompositionResult> {
    let correctedBlocks = [...blocks];
    const appliedRules: string[] = [];
    const violations: RuleViolation[] = [];
    let correctionsMade = 0;
    
    // Apply each rule in priority order
    for (const rule of rules) {
      let ruleApplied = false;
      
      // Apply rule to each block
      correctedBlocks = correctedBlocks.map(block => {
        // Check if rule applies to this block (with caching)
        const cacheKey = `${rule.id}-${block.id}-${this.hashBlockState(block)}`;
        
        if (rule.condition(block)) {
          // Validate before correction
          const violation = rule.validate(block, context);
          if (violation) {
            violations.push(violation);
          }
          
          // Apply correction
          const corrected = rule.action(block, context);
          
          // Check if block was modified
          if (JSON.stringify(corrected) !== JSON.stringify(block)) {
            ruleApplied = true;
            correctionsMade++;
          }
          
          return corrected;
        }
        
        return block;
      });
      
      if (ruleApplied) {
        appliedRules.push(rule.id);
      }
    }
    
    return {
      blocks: correctedBlocks,
      appliedRules,
      violations,
      correctionsMade,
    };
  }
  
  /**
   * Hash block state for caching
   */
  private hashBlockState(block: EmailBlock): string {
    // Simple hash of relevant properties
    const relevantProps = {
      type: block.type,
      settings: block.settings,
    };
    return JSON.stringify(relevantProps).split('').reduce(
      (hash, char) => {
        const charCode = char.charCodeAt(0);
        return ((hash << 5) - hash + charCode) | 0;
      },
      0
    ).toString(36);
  }
  
  /**
   * Clear rule cache
   */
  clearCache(): void {
    this.ruleCache.clear();
  }
}

// ============================================================================
// Built-in Middlewares
// ============================================================================

/**
 * Logging middleware - logs rule applications
 */
export const loggingMiddleware: CompositionMiddleware = async (blocks, context, next) => {
  console.log(`[Composition] Processing ${blocks.length} blocks`);
  const start = Date.now();
  
  const result = await next();
  
  const duration = Date.now() - start;
  console.log(`[Composition] Completed in ${duration}ms`);
  
  return result;
};

/**
 * Performance tracking middleware
 */
export const performanceMiddleware: CompositionMiddleware = async (blocks, context, next) => {
  const start = performance.now();
  
  const result = await next();
  
  const duration = performance.now() - start;
  
  if (duration > 50) {
    console.warn(`[Composition] Slow execution: ${duration.toFixed(2)}ms (target: <50ms)`);
  }
  
  return result;
};

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create a composition engine with default rules and options
 */
export function createCompositionEngine(options: {
  rules?: CompositionRule[];
  middleware?: CompositionMiddleware[];
  enableLogging?: boolean;
  enablePerformanceTracking?: boolean;
} = {}): CompositionEngine {
  const engine = new CompositionEngine(options.rules);
  
  // Add middleware
  if (options.middleware) {
    options.middleware.forEach(m => engine.use(m));
  }
  
  if (options.enableLogging) {
    engine.use(loggingMiddleware);
  }
  
  if (options.enablePerformanceTracking) {
    engine.use(performanceMiddleware);
  }
  
  return engine;
}

// ============================================================================
// Export Default Engine
// ============================================================================

/**
 * Default composition engine instance
 */
export const defaultCompositionEngine = createCompositionEngine({
  enablePerformanceTracking: process.env.NODE_ENV === 'development',
});

