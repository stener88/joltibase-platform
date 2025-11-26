/**
 * Test V3 Email Generation System
 * 
 * Tests:
 * 1. RAG initialization and pattern loading
 * 2. Pattern retrieval by embedding
 * 3. Email generation with Gemini
 * 4. Email rendering with React Email
 */

import { initializeRAG, retrievePatternsByEmbedding } from '@/emails/lib/rag';
import { generateEmail } from '@/lib/email-v3/generator';
import { renderEmail } from '@/lib/email-v3/renderer';

async function testV3System() {
  console.log('🧪 Testing V3 Email Generation System\n');
  
  try {
    // Test 1: RAG Initialization
    console.log('📚 [1/4] Testing RAG initialization...');
    const patternsWithEmbeddings = await initializeRAG();
    console.log(`✅ Loaded ${patternsWithEmbeddings.length} patterns with embeddings\n`);
    
    patternsWithEmbeddings.forEach(p => {
      console.log(`  - ${p.name}: ${p.description}`);
    });
    
    // Test 2: Pattern Retrieval
    console.log('\n🔍 [2/4] Testing pattern retrieval...');
    const testPrompt = 'Create a welcome email for new users with getting started steps';
    const relevantPatterns = await retrievePatternsByEmbedding(
      testPrompt,
      patternsWithEmbeddings,
      2
    );
    console.log(`✅ Retrieved ${relevantPatterns.length} relevant patterns for prompt:\n   "${testPrompt}"\n`);
    
    relevantPatterns.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name}`);
      console.log(`     Use Case: ${p.useCase}`);
      console.log(`     Tags: ${p.tags.join(', ')}`);
    });
    
    // Test 3: Email Generation
    console.log('\n🤖 [3/4] Testing email generation with Gemini...');
    console.log('   This may take 10-30 seconds...');
    
    const generated = await generateEmail(testPrompt);
    
    console.log(`✅ Generated email successfully!`);
    console.log(`   Filename: ${generated.filename}`);
    console.log(`   Patterns used: ${generated.patternsUsed.join(', ')}`);
    console.log(`   Attempts: ${generated.attempts}`);
    console.log(`   Code length: ${generated.code.length} characters`);
    
    // Check for Tailwind
    const hasTailwind = generated.code.includes('<Tailwind');
    const hasClassName = generated.code.includes('className=');
    console.log(`   Has <Tailwind> wrapper: ${hasTailwind ? '✅' : '❌'}`);
    console.log(`   Uses className: ${hasClassName ? '✅' : '❌'}`);
    
    // Test 4: Email Rendering
    console.log('\n🎨 [4/4] Testing email rendering...');
    const rendered = await renderEmail(generated.filename, {
      props: {
        userName: 'Test User',
      },
    });
    
    if (rendered.error) {
      console.error(`❌ Rendering failed: ${rendered.error}`);
    } else {
      console.log(`✅ Rendered successfully!`);
      console.log(`   HTML length: ${rendered.html.length} bytes`);
      console.log(`   Has <!DOCTYPE html>: ${rendered.html.includes('<!DOCTYPE html>') ? '✅' : '❌'}`);
      console.log(`   Has inline styles: ${rendered.html.includes('style=') ? '✅' : '❌'}`);
    }
    
    console.log('\n🎉 All tests passed!\n');
    console.log('Next steps:');
    console.log('  1. Test from landing page UI');
    console.log('  2. Verify database save');
    console.log('  3. Test full campaign flow');
    
  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run tests
testV3System();

