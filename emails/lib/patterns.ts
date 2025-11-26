/**
 * Pattern Loading & Retrieval System
 * 
 * Loads example React Email patterns from emails/components/
 * Provides simple keyword-based matching for RAG
 * (Future: can add OpenAI embeddings for semantic search)
 */

import fs from 'fs';
import path from 'path';

export interface Pattern {
  name: string;              // e.g., "Hero"
  filename: string;          // e.g., "HeroExample.tsx"
  description: string;       // From PATTERN field
  useCase: string;           // From USE CASE field
  tags: string[];            // From TAGS field
  code: string;              // Full TSX source code
}

const PATTERNS_DIR = path.join(process.cwd(), 'emails/components');

/**
 * Load all example patterns from emails/components/
 */
export async function loadPatterns(): Promise<Pattern[]> {
  try {
    if (!fs.existsSync(PATTERNS_DIR)) {
      console.warn(`⚠️ Patterns directory not found: ${PATTERNS_DIR}`);
      return [];
    }

    const files = fs.readdirSync(PATTERNS_DIR);
    const patterns: Pattern[] = [];
    
    for (const file of files) {
      if (!file.endsWith('Example.tsx')) continue;
      
      const filepath = path.join(PATTERNS_DIR, file);
      const code = fs.readFileSync(filepath, 'utf-8');
      
      // Extract JSDoc metadata
      const metadata = extractMetadata(code);
      
      patterns.push({
        name: file.replace('Example.tsx', ''),
        filename: file,
        description: metadata.description || '',
        useCase: metadata.useCase || '',
        tags: metadata.tags || [],
        code,
      });
    }
    
    console.log(`📚 Loaded ${patterns.length} patterns`);
    return patterns;
    
  } catch (error) {
    console.error('❌ Error loading patterns:', error);
    return [];
  }
}

/**
 * Retrieve most relevant patterns for a given prompt
 * Uses simple keyword matching (no embeddings for now)
 */
export function retrieveRelevantPatterns(
  prompt: string,
  patterns: Pattern[],
  maxPatterns: number = 2
): Pattern[] {
  if (patterns.length === 0) return [];
  
  const promptLower = prompt.toLowerCase();
  const keywords = extractKeywords(promptLower);
  
  console.log(`🔍 Keywords extracted: ${keywords.join(', ')}`);
  
  // Score each pattern based on keyword matches
  const scored = patterns.map(pattern => {
    let score = 0;
    
    // High weight for tag matches
    pattern.tags.forEach(tag => {
      if (keywords.includes(tag.toLowerCase())) {
        score += 10;
      }
    });
    
    // Medium weight for description matches
    keywords.forEach(keyword => {
      if (pattern.description.toLowerCase().includes(keyword)) {
        score += 5;
      }
      if (pattern.useCase.toLowerCase().includes(keyword)) {
        score += 5;
      }
      if (pattern.name.toLowerCase().includes(keyword)) {
        score += 3;
      }
    });
    
    return { pattern, score };
  });
  
  // Sort by score (descending) and return top N
  const topPatterns = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPatterns)
    .map(s => s.pattern);
  
  // If no matches, return first pattern as fallback
  if (topPatterns.length === 0 && patterns.length > 0) {
    console.log('⚠️ No keyword matches, using default pattern');
    return [patterns[0]]; // Hero pattern as default
  }
  
  console.log(`✅ Selected patterns: ${topPatterns.map(p => p.name).join(', ')}`);
  return topPatterns;
}

/**
 * Extract metadata from JSDoc comment
 */
function extractMetadata(code: string): {
  description?: string;
  useCase?: string;
  tags?: string[];
} {
  // Find the JSDoc comment block
  const match = code.match(/\/\*\*([\s\S]*?)\*\//);
  if (!match) return {};
  
  const comment = match[1];
  
  return {
    description: extractField(comment, 'PATTERN'),
    useCase: extractField(comment, 'USE CASE'),
    tags: extractField(comment, 'TAGS')?.split(',').map(t => t.trim()) || [],
  };
}

/**
 * Extract a specific field from JSDoc comment
 */
function extractField(comment: string, field: string): string | undefined {
  const regex = new RegExp(`\\*\\s+${field}:\\s*(.+)`, 'i');
  const match = comment.match(regex);
  return match?.[1].trim();
}

/**
 * Extract meaningful keywords from text
 * Removes stop words and short words
 */
function extractKeywords(text: string): string[] {
  const stopWords = [
    'the', 'a', 'an', 'for', 'with', 'about', 'as', 'by', 'to', 'from',
    'in', 'on', 'at', 'of', 'and', 'or', 'is', 'are', 'was', 'were',
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'that',
    'this', 'these', 'those', 'i', 'you', 'we', 'they', 'it',
  ];
  
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter(word => 
      word.length > 2 && 
      !stopWords.includes(word) &&
      !/^\d+$/.test(word) // Remove pure numbers
    );
}

/**
 * Get a specific pattern by name
 */
export async function getPatternByName(
  name: string
): Promise<Pattern | null> {
  const patterns = await loadPatterns();
  return patterns.find(p => 
    p.name.toLowerCase() === name.toLowerCase()
  ) || null;
}






