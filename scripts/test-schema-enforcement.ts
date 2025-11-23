// scripts/test-schema-enforcement.ts

import { generateStructuredObject } from '@/lib/ai/client';
import { z } from 'zod';

// Test 1: AI SDK with Zod
const schema = z.object({
  description: z.string().max(90, 'Too long'),
});

console.log('🧪 Testing AI SDK schema conversion...\n');

async function runTest() {
  for (let i = 0; i < 5; i++) {
    try {
      const result = await generateStructuredObject({
        model: 'gemini-2.5-flash', // Use production model
        schema,
        prompt: 'Write a detailed description of AI-powered email marketing platforms and their benefits for modern businesses',
        maxOutputTokens: 2000, // Increased to avoid token limit truncation
      });

      console.log(`Test ${i + 1}:`);
      console.log(`- Length: ${result.object.description.length} chars`);
      console.log(`- Content: "${result.object.description.substring(0, 100)}..."`);
      console.log(`- Status: ${result.object.description.length <= 90 ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`- Tokens: ${result.usage.totalTokens} (prompt: ${result.usage.promptTokens}, completion: ${result.usage.completionTokens})\n`);
    } catch (error: any) {
      console.log(`Test ${i + 1}: ❌ ERROR`);
      if (error instanceof Error) {
        console.log(`  Error: ${error.message}`);
      }
      // Log more details if available
      if (error.text) {
        console.log(`  Raw response: ${error.text.substring(0, 200)}`);
      }
      console.log('');
    }
  }
}

runTest().catch(console.error);

