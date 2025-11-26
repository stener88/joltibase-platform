/**
 * RAG System with Gemini Embeddings
 * 
 * Uses Gemini text-embedding-004 for semantic pattern retrieval
 * Caches embeddings to emails/rag/embeddings.json
 */

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { embed, embedMany } from 'ai';
import fs from 'fs';
import path from 'path';
import { Pattern, loadPatterns } from './patterns';

const EMBEDDINGS_CACHE_FILE = path.join(process.cwd(), 'emails/rag/embeddings.json');
const EMBEDDING_MODEL = 'text-embedding-004'; // Gemini's latest embedding model (768 dimensions)

// Initialize Google provider with API key
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export interface PatternWithEmbedding extends Pattern {
  embedding: number[];
}

interface EmbeddingsCache {
  version: string;
  model: string;
  patterns: {
    [filename: string]: {
      embedding: number[];
      updatedAt: string;
    };
  };
}

/**
 * Load or generate embeddings for all patterns
 */
export async function initializeRAG(): Promise<PatternWithEmbedding[]> {
  console.log('🚀 [RAG] Initializing RAG system...');
  
  // Load patterns
  const patterns = await loadPatterns();
  
  if (patterns.length === 0) {
    console.warn('⚠️ [RAG] No patterns found');
    return [];
  }
  
  // Load cache
  const cache = loadCache();
  
  // Check which patterns need embeddings
  const patternsWithEmbeddings: PatternWithEmbedding[] = [];
  const patternsToEmbed: Pattern[] = [];
  
  for (const pattern of patterns) {
    const cached = cache.patterns[pattern.filename];
    
    // Use cache if available and model matches
    if (cached && cache.model === EMBEDDING_MODEL) {
      patternsWithEmbeddings.push({
        ...pattern,
        embedding: cached.embedding,
      });
      console.log(`✅ [RAG] Loaded cached embedding for ${pattern.name}`);
    } else {
      patternsToEmbed.push(pattern);
    }
  }
  
  // Generate embeddings for patterns without cache
  if (patternsToEmbed.length > 0) {
    console.log(`🔄 [RAG] Generating embeddings for ${patternsToEmbed.length} patterns...`);
    
    for (const pattern of patternsToEmbed) {
      const embedding = await generatePatternEmbedding(pattern);
      
      patternsWithEmbeddings.push({
        ...pattern,
        embedding,
      });
      
      // Update cache
      cache.patterns[pattern.filename] = {
        embedding,
        updatedAt: new Date().toISOString(),
      };
      
      console.log(`✅ [RAG] Generated embedding for ${pattern.name}`);
    }
    
    // Save updated cache
    cache.model = EMBEDDING_MODEL;
    saveCache(cache);
    console.log('💾 [RAG] Cache updated');
  }
  
  console.log(`✅ [RAG] Initialized with ${patternsWithEmbeddings.length} patterns`);
  return patternsWithEmbeddings;
}

/**
 * Generate embedding for a single pattern
 */
async function generatePatternEmbedding(pattern: Pattern): Promise<number[]> {
  // Combine relevant text for embedding
  const text = [
    `Pattern: ${pattern.description}`,
    `Use Case: ${pattern.useCase}`,
    `Tags: ${pattern.tags.join(', ')}`,
    `Name: ${pattern.name}`,
  ].join('\n');
  
  const { embedding } = await embed({
    model: google.textEmbeddingModel(EMBEDDING_MODEL),
    value: text,
  });
  
  return embedding;
}

/**
 * Retrieve most relevant patterns using semantic similarity
 */
export async function retrievePatternsByEmbedding(
  prompt: string,
  patternsWithEmbeddings: PatternWithEmbedding[],
  topK: number = 2
): Promise<Pattern[]> {
  console.log(`🔍 [RAG] Retrieving patterns for: "${prompt}"`);
  
  if (patternsWithEmbeddings.length === 0) {
    console.warn('⚠️ [RAG] No patterns available');
    return [];
  }
  
  // Generate embedding for prompt
  const { embedding: promptEmbedding } = await embed({
    model: google.textEmbeddingModel(EMBEDDING_MODEL),
    value: prompt,
  });
  
  // Calculate cosine similarity with each pattern
  const similarities = patternsWithEmbeddings.map(pattern => ({
    pattern,
    similarity: cosineSimilarity(promptEmbedding, pattern.embedding),
  }));
  
  // Sort by similarity (descending) and take top K
  const topPatterns = similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
  
  // Log results
  topPatterns.forEach(({ pattern, similarity }) => {
    console.log(`  📄 ${pattern.name} (similarity: ${similarity.toFixed(3)})`);
  });
  
  return topPatterns.map(({ pattern }) => pattern);
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same length');
  }
  
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }
  
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);
  
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Load embeddings cache
 */
function loadCache(): EmbeddingsCache {
  try {
    if (fs.existsSync(EMBEDDINGS_CACHE_FILE)) {
      const data = fs.readFileSync(EMBEDDINGS_CACHE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('⚠️ [RAG] Could not load cache:', error);
  }
  
  // Return empty cache
  return {
    version: '1.0',
    model: EMBEDDING_MODEL,
    patterns: {},
  };
}

/**
 * Save embeddings cache
 */
function saveCache(cache: EmbeddingsCache): void {
  try {
    const dir = path.dirname(EMBEDDINGS_CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(
      EMBEDDINGS_CACHE_FILE,
      JSON.stringify(cache, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('❌ [RAG] Could not save cache:', error);
  }
}

/**
 * Clear embeddings cache (useful when patterns change)
 */
export function clearEmbeddingsCache(): void {
  try {
    if (fs.existsSync(EMBEDDINGS_CACHE_FILE)) {
      fs.unlinkSync(EMBEDDINGS_CACHE_FILE);
      console.log('✅ [RAG] Cache cleared');
    }
  } catch (error) {
    console.error('❌ [RAG] Could not clear cache:', error);
  }
}

