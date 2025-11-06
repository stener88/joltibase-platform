/**
 * Test Email Templates
 * Run with: npx tsx scripts/test-email-template.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { generateSampleEmail } from '../lib/email/templates/renderer';
import { resend } from '../lib/email/client';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

async function testTemplates() {
  console.log('🎨 Testing Email Templates...\n');

  // Check if Resend is configured
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in .env.local');
    console.log('   Get your API key from: https://resend.com/api-keys');
    process.exit(1);
  }

  // Your test email
  const testEmail = process.env.TEST_EMAIL || 'your-email@example.com';
  
  if (testEmail === 'your-email@example.com') {
    console.error('❌ Please set TEST_EMAIL in .env.local or update this script');
    process.exit(1);
  }

  // Test all templates
  const templates = ['gradient-hero', 'color-blocks', 'bold-modern', 'minimal-accent', 'text-first'];

  for (const template of templates) {
    console.log(`📧 Testing: ${template}`);
    
    try {
      const sample = generateSampleEmail(template);
      
      await resend.emails.send({
        from: 'onboarding@resend.dev', // Resend's test domain
        to: testEmail,
        subject: `[TEST] ${template} - ${sample.subject}`,
        html: sample.html,
        text: sample.plainText,
      });
      
      console.log(`   ✅ Sent ${template}\n`);
    } catch (error: any) {
      console.error(`   ❌ Failed to send ${template}:`, error.message);
    }
  }

  console.log('✨ All test emails sent!');
  console.log(`📬 Check your inbox: ${testEmail}`);
}

testTemplates().catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });