/**
 * Section Templates Index
 * 
 * Central registry for all section templates using complex layout blocks.
 */

import type { SectionTemplate } from '../types';
import { registerSections } from '../registry';

// Import complex layout templates
import { TWO_COLUMN_TEMPLATES } from './two-column';
import { GALLERY_TEMPLATES } from './gallery';
import { OVERLAY_CARD_TEMPLATES } from './overlay-card';
import { ADVANCED_TEMPLATES } from './advanced';

// ============================================================================
// Base Templates (Complex Layout Blocks)
// ============================================================================

export const BASE_SECTION_TEMPLATES: SectionTemplate[] = [
  ...TWO_COLUMN_TEMPLATES,
  ...GALLERY_TEMPLATES,
  ...OVERLAY_CARD_TEMPLATES,
  ...ADVANCED_TEMPLATES,
];

// ============================================================================
// Section Templates (No Variants)
// ============================================================================

// Use base templates directly without generating design variants
export const ALL_SECTION_TEMPLATES: SectionTemplate[] = BASE_SECTION_TEMPLATES;

// ============================================================================
// Auto-register all templates
// ============================================================================

// Register all templates on module load
registerSections(ALL_SECTION_TEMPLATES);

if (ALL_SECTION_TEMPLATES.length > 0) {
  console.log(`📚 Section Library initialized with ${ALL_SECTION_TEMPLATES.length} templates`);
}

