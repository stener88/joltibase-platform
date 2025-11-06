/**
 * Test AI Client
 * Run with: npx tsx scripts/test-ai-client.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { generateCompletion, testConnection, parseAndValidateJSON } from '../lib/ai/client';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

async function runTests() {
  console.log('🧪 Testing AI Client...\n');

  // Test 1: Check API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in .env.local');
    process.exit(1);
  }
  console.log('✓ API key found in environment\n');

  // Test 2: Test connection
  console.log('🔌 Testing OpenAI connection...');
  try {
    const connected = await testConnection();
    if (connected) {
      console.log('✅ OpenAI connection successful!\n');
    } else {
      console.log('❌ OpenAI connection test failed\n');
      process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ Connection error:', error.message);
    process.exit(1);
  }

  // Test 3: Generate simple email subject line
  console.log('✉️  Testing email subject generation...');
  try {
    const result = await generateCompletion(
      [
        {
          role: 'system',
          content: 'You are an email marketing expert. Generate email subject lines in JSON format.',
        },
        {
          role: 'user',
          content: 'Create a welcome email subject line for a SaaS product called "TaskFlow". Respond with JSON: {"subject": "...", "previewText": "..."}',
        },
      ],
      {
        maxTokens: 100,
      }
    );

    const parsed = parseAndValidateJSON<{ subject: string; previewText: string }>(result.content);
    
    console.log('✅ Subject generated successfully!\n');
    console.log('📧 Generated content:');
    console.log(`   Subject: ${parsed.subject}`);
    console.log(`   Preview: ${parsed.previewText}\n`);
    console.log('📊 Token usage:');
    console.log(`   Prompt tokens: ${result.promptTokens}`);
    console.log(`   Completion tokens: ${result.completionTokens}`);
    console.log(`   Total tokens: ${result.tokensUsed}`);
    console.log(`   Cost: $${result.costUsd.toFixed(4)}`);
    console.log(`   Generation time: ${result.generationTimeMs}ms\n`);
  } catch (error: any) {
    console.error('❌ Generation failed:', error.message);
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
    }
    process.exit(1);
  }

  console.log('✨ All tests passed! AI client is ready.\n');
  console.log('💡 Next steps:');
  console.log('   1. Create system prompts for campaign generation');
  console.log('   2. Build the generation engine');
  console.log('   3. Create the API route');
}

runTests();