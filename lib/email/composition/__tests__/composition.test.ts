/**
 * Composition System Tests
 * 
 * Unit tests for design tokens, composition rules, engine, and scoring.
 * 
 * Note: These tests require Jest to be installed and configured.
 * To run: npm test lib/email/composition/__tests__/
 * 
 * Setup instructions:
 * 1. Install Jest types: npm install --save-dev @types/jest
 * 2. Configure Jest in package.json or jest.config.js
 * 3. Run tests: npm test
 */

/// <reference types="jest" />

import { 
  designTokens,
  getSpacingToken,
  getColorToken,
  getTypographyToken,
  snapToGrid,
  pxToNumber,
} from '../../design-tokens';

import {
  spacingGridRule,
  typographyHierarchyRule,
  contrastRule,
  touchTargetRule,
  whiteSpaceRule,
} from '../rules';

import { CompositionEngine } from '../engine';
import { scoreComposition } from '../scoring';

// ============================================================================
// Design Token Tests
// ============================================================================

describe('Design Tokens', () => {
  describe('Token Resolution', () => {
    it('should resolve spacing tokens correctly', () => {
      expect(getSpacingToken('content.balanced')).toBe('16px');
      expect(getSpacingToken('section.hero')).toBe('80px');
    });

    it('should resolve color tokens correctly', () => {
      expect(getColorToken('text.primary')).toBe('#171717');
      expect(getColorToken('action.primary')).toBe('#3B82F6');
    });

    it('should resolve typography tokens correctly', () => {
      const heading = getTypographyToken('heading.primary');
      expect(heading.size).toBe('32px');
      expect(heading.weight).toBe(700);
    });
  });

  describe('Utility Functions', () => {
    it('should snap values to 8px grid', () => {
      expect(snapToGrid(35)).toBe(32);
      expect(snapToGrid(42)).toBe(40);
      expect(snapToGrid(47)).toBe(48);
    });

    it('should convert px strings to numbers', () => {
      expect(pxToNumber('16px')).toBe(16);
      expect(pxToNumber('48px')).toBe(48);
    });
  });
});

// ============================================================================
// Composition Rule Tests
// ============================================================================

describe('Composition Rules', () => {
  describe('Spacing Grid Rule', () => {
    it('should round padding to 8px grid', () => {
      const block = {
        id: 'test-1',
        type: 'layouts' as const,
        position: 0,
        settings: {
          padding: { top: 35, right: 18, bottom: 42, left: 25 }
        },
        content: {},
      };

      const result = spacingGridRule.action(block, {
        tokens: designTokens,
        viewport: 'desktop',
        accessibility: 'WCAG-AA',
      });

      expect(result.settings?.padding).toEqual({
        top: 32,
        right: 16,
        bottom: 40,
        left: 24,
      });
    });

    it('should validate off-grid spacing', () => {
      const block = {
        id: 'test-2',
        type: 'layouts' as const,
        position: 0,
        settings: {
          padding: { top: 35, right: 20, bottom: 40, left: 20 }
        },
        content: {},
      };

      const violation = spacingGridRule.validate(block, {
        tokens: designTokens,
        viewport: 'desktop',
        accessibility: 'WCAG-AA',
      });

      expect(violation).not.toBeNull();
      expect(violation?.autoFixable).toBe(true);
    });
  });

  describe('Typography Hierarchy Rule', () => {
    it('should enforce minimum 1.5:1 heading ratio', () => {
      const block = {
        id: 'test-hierarchy',
        type: 'layouts' as const,
        position: 0,
        settings: {
          titleSize: 18,
          bodySize: 16,
        },
        content: {},
      };

      const result = typographyHierarchyRule.action(block, {
        tokens: designTokens,
        viewport: 'desktop',
        accessibility: 'WCAG-AA',
      });

      // Should increase title size to maintain 1.5:1 ratio
      expect(result.settings?.titleSize).toBeGreaterThanOrEqual(24);
    });
    
    it('should validate weak hierarchy', () => {
      const block = {
        id: 'test-weak',
        type: 'layouts' as const,
        position: 0,
        settings: {
          titleSize: 18,
          bodySize: 16,
        },
        content: {},
      };

      const violation = typographyHierarchyRule.validate(block, {
        tokens: designTokens,
        viewport: 'desktop',
        accessibility: 'WCAG-AA',
      });

      expect(violation).not.toBeNull();
      expect(violation?.message).toContain('hierarchy');
    });
  });

  describe('Contrast Rule', () => {
    it('should validate WCAG AA contrast', () => {
      const goodContrastBlock = {
        id: 'test-good',
        type: 'layouts' as const,
        position: 0,
        settings: {
          textColor: '#171717',
          backgroundColor: '#ffffff',
        },
        content: {},
      };

      const violation = contrastRule.validate(goodContrastBlock, {
        tokens: designTokens,
        viewport: 'desktop',
        accessibility: 'WCAG-AA',
      });

      expect(violation).toBeNull();
    });
    
    it('should fix poor contrast', () => {
      const badContrastBlock = {
        id: 'test-bad',
        type: 'layouts' as const,
        position: 0,
        settings: {
          textColor: '#cccccc',
          backgroundColor: '#ffffff',
        },
        content: {},
      };

      const result = contrastRule.action(badContrastBlock, {
        tokens: designTokens,
        viewport: 'desktop',
        accessibility: 'WCAG-AA',
      });

      // Should darken text color
      expect(result.settings?.textColor).not.toBe('#cccccc');
    });
  });

  describe('Touch Target Rule', () => {
    it('should ensure buttons are 44px minimum', () => {
      const smallButton = {
        id: 'test-small-button',
        type: 'button' as const,
        position: 0,
        settings: {
          padding: { top: 8, right: 20, bottom: 8, left: 20 },
        },
        content: {},
      };

      const result = touchTargetRule.action(smallButton, {
        tokens: designTokens,
        viewport: 'desktop',
        accessibility: 'WCAG-AA',
      });

      // Should increase padding to reach 44px height
      const totalHeight = (result.settings?.padding?.top || 0) + 20 + (result.settings?.padding?.bottom || 0);
      expect(totalHeight).toBeGreaterThanOrEqual(44);
    });
    
    it('should validate touch target size', () => {
      const smallButton = {
        id: 'test-validate',
        type: 'button' as const,
        position: 0,
        settings: {
          padding: { top: 8, right: 20, bottom: 8, left: 20 },
        },
        content: {},
      };

      const violation = touchTargetRule.validate(smallButton, {
        tokens: designTokens,
        viewport: 'desktop',
        accessibility: 'WCAG-AA',
      });

      expect(violation).not.toBeNull();
      expect(violation?.autoFixable).toBe(true);
    });
  });

  describe('White Space Rule', () => {
    it('should ensure adequate padding', () => {
      const cramped = {
        id: 'test-cramped',
        type: 'layouts' as const,
        position: 0,
        settings: {
          padding: { top: 8, right: 8, bottom: 8, left: 8 },
        },
        content: {
          title: 'Title',
          paragraph: 'This is a very long paragraph with lots of text that will make the white space ratio too low.',
        },
      };

      const result = whiteSpaceRule.action(cramped, {
        tokens: designTokens,
        viewport: 'desktop',
        accessibility: 'WCAG-AA',
      });

      // Should increase padding
      expect(result.settings?.padding?.top).toBeGreaterThan(8);
    });
  });
});

// ============================================================================
// Composition Engine Tests
// ============================================================================

describe('Composition Engine', () => {
  let engine: CompositionEngine;

  beforeEach(() => {
    engine = new CompositionEngine();
  });

  describe('Rule Execution', () => {
    it('should execute rules in priority order', async () => {
      const blocks = [
        {
          id: 'test-1',
          type: 'layouts' as const,
          position: 0,
          settings: {
            padding: { top: 35, right: 18, bottom: 42, left: 25 },
          },
          content: {},
        },
      ];

      const result = await engine.execute(blocks);
      
      expect(result.appliedRules).toContain('spacing-grid-8px');
      expect(result.correctionsMade).toBeGreaterThan(0);
    });

    it('should complete in <50ms for typical blocks', async () => {
      const blocks = [
        {
          id: 'test-perf-1',
          type: 'layouts' as const,
          position: 0,
          settings: { padding: { top: 40, right: 24, bottom: 40, left: 24 } },
          content: {},
        },
        {
          id: 'test-perf-2',
          type: 'button' as const,
          position: 1,
          settings: { padding: { top: 12, right: 32, bottom: 12, left: 32 } },
          content: {},
        },
      ];

      const startTime = Date.now();
      await engine.execute(blocks);
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(50);
    });
  });

  describe('Validation', () => {
    it('should detect violations without modifying blocks', () => {
      const blocks = [
        {
          id: 'test-validate',
          type: 'layouts' as const,
          position: 0,
          settings: {
            padding: { top: 35, right: 18, bottom: 42, left: 25 },
          },
          content: {},
        },
      ];

      const violations = engine.validate(blocks);
      
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]).toHaveProperty('ruleId');
      expect(violations[0]).toHaveProperty('severity');
    });
  });
});

// ============================================================================
// Quality Scoring Tests
// ============================================================================

describe('Quality Scoring', () => {
  describe('Score Calculation', () => {
    it('should calculate overall score', () => {
      const blocks: any[] = [
        {
          id: 'score-1',
          type: 'layouts',
          position: 0,
          settings: {
            padding: { top: 40, right: 24, bottom: 40, left: 24 },
            textColor: '#171717',
            backgroundColor: '#ffffff',
          },
          content: {
            title: 'Test Title',
            paragraph: 'Test paragraph',
          },
        },
      ];
      
      const score = scoreComposition(blocks);
      
      expect(score.score).toBeGreaterThanOrEqual(0);
      expect(score.score).toBeLessThanOrEqual(100);
      expect(score).toHaveProperty('grade');
      expect(score).toHaveProperty('breakdown');
      expect(score.breakdown).toHaveProperty('spacing');
      expect(score.breakdown).toHaveProperty('hierarchy');
      expect(score.breakdown).toHaveProperty('contrast');
      expect(score.breakdown).toHaveProperty('balance');
    });

    it('should break down scores by category', () => {
      const blocks: any[] = [
        {
          id: 'breakdown-1',
          type: 'layouts',
          position: 0,
          settings: {
            padding: { top: 40, right: 24, bottom: 40, left: 24 },
          },
          content: {},
        },
      ];
      
      const score = scoreComposition(blocks);
      
      // Each category should be 0-25
      expect(score.breakdown.spacing).toBeGreaterThanOrEqual(0);
      expect(score.breakdown.spacing).toBeLessThanOrEqual(25);
      expect(score.breakdown.hierarchy).toBeGreaterThanOrEqual(0);
      expect(score.breakdown.hierarchy).toBeLessThanOrEqual(25);
      expect(score.breakdown.contrast).toBeGreaterThanOrEqual(0);
      expect(score.breakdown.contrast).toBeLessThanOrEqual(25);
      expect(score.breakdown.balance).toBeGreaterThanOrEqual(0);
      expect(score.breakdown.balance).toBeLessThanOrEqual(25);
    });

    it('should assign correct letter grades', () => {
      const perfectBlocks: any[] = [
        {
          id: 'perfect-1',
          type: 'layouts',
          position: 0,
          settings: {
            padding: { top: 80, right: 40, bottom: 80, left: 40 },
            backgroundColor: '#ffffff',
            textColor: '#171717',
          },
          content: {
            title: 'Perfect Title',
            paragraph: 'Perfect content',
          },
        },
      ];
      
      const score = scoreComposition(perfectBlocks);
      
      expect(score.passing).toBe(true);
      expect(['A+', 'A', 'A-', 'B+', 'B']).toContain(score.grade);
    });
  });

  describe('Score Accuracy', () => {
    it('should detect spacing issues', () => {
      const offGridBlocks: any[] = [
        {
          id: 'off-grid-1',
          type: 'layouts',
          position: 0,
          settings: {
            padding: { top: 35, right: 18, bottom: 42, left: 25 }, // Off grid
          },
          content: {},
        },
      ];
      
      const score = scoreComposition(offGridBlocks);
      
      expect(score.breakdown.spacing).toBeLessThan(25);
      expect(score.issues.some(issue => issue.includes('spacing') || issue.includes('grid'))).toBe(true);
    });
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('Integration Tests', () => {
  it('should apply rules and improve score', async () => {
    const engine = new CompositionEngine();
    
    // Bad quality blocks
    const badBlocks: any[] = [
      {
        id: 'bad-1',
        type: 'layouts',
        position: 0,
        settings: {
          padding: { top: 35, right: 18, bottom: 42, left: 25 }, // Off grid
        },
        content: {},
      },
    ];
    
    const beforeScore = scoreComposition(badBlocks);
    const result = await engine.execute(badBlocks);
    const afterScore = scoreComposition(result.blocks);
    
    expect(afterScore.score).toBeGreaterThanOrEqual(beforeScore.score);
    expect(result.correctionsMade).toBeGreaterThan(0);
  });

  it('should work with realistic blocks', async () => {
    const engine = new CompositionEngine();
    
    const blocks: any[] = [
      {
        id: 'realistic-1',
        type: 'layouts',
        position: 0,
        layoutVariation: 'hero-center',
        settings: {
          padding: { top: 40, right: 24, bottom: 40, left: 24 },
          backgroundColor: '#ffffff',
        },
        content: {
          title: 'Welcome to Our Platform',
          paragraph: 'Get started with our amazing features.',
          button: {
            text: 'Get Started',
            url: 'https://example.com',
          },
        },
      },
    ];
    
    const result = await engine.execute(blocks);
    const score = scoreComposition(result.blocks);
    
    expect(result.blocks).toHaveLength(1);
    expect(score.score).toBeGreaterThanOrEqual(70);
  });
});

/**
 * Next steps for complete test coverage:
 * 
 * 1. Add test blocks fixtures in __fixtures__/
 * 2. Implement each TODO test case
 * 3. Add snapshot tests for HTML rendering
 * 4. Add performance benchmarks
 * 5. Add edge case tests
 * 6. Reach >90% code coverage
 * 7. Add CI/CD integration
 */

