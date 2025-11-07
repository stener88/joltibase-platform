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

  for (let i = 0; i < templates.length; i++) {
    const template = templates[i];
    console.log(`📧 Testing ${i + 1}/${templates.length}: ${template}`);
    
    try {
      const sample = generateSampleEmail(template);
      
      const emailData = {
        from: 'onboarding@resend.dev', // Resend's test domain
        to: testEmail,
        subject: `[TEST] ${template} - ${sample.subject}`,
        html: sample.html,
        text: sample.plainText,
      };
      
      console.log(`   → To: ${emailData.to}`);
      console.log(`   → Subject: ${emailData.subject}`);
      console.log(`   → HTML length: ${emailData.html.length} chars`);
      console.log(`   → Text length: ${emailData.text.length} chars`);
      
      const response = await resend.emails.send(emailData);
      
      console.log(`   ✅ API Response:`, JSON.stringify(response, null, 2));
      
      if (response.data?.id) {
        console.log(`   📬 Email ID: ${response.data.id}`);
      }
      
      if (response.error) {
        console.error(`   ⚠️  API returned an error:`, response.error);
      }
      
      console.log(`   ✅ Sent ${template}\n`);
      
      // Add delay between sends to avoid rate limiting
      if (i < templates.length - 1) {
        console.log(`   ⏳ Waiting 2 seconds before next send...\n`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error: any) {
      console.error(`   ❌ Failed to send ${template}`);
      console.error(`   Error message: ${error.message}`);
      if (error.response) {
        console.error(`   Response data:`, error.response.data);
      }
      if (error.stack) {
        console.error(`   Stack trace:`, error.stack);
      }
      console.log('');
    }
  }

  console.log('✨ All test emails processed!');
  console.log(`📬 Check your inbox: ${testEmail}`);
  console.log(`🔍 Also check Resend dashboard for delivery status`);
}

testTemplates().catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });