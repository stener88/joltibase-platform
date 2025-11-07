/**
 * Test AI Campaign Generator
 * Run with: npx tsx scripts/test-campaign-generator.ts
 * 
 * Tests the AI generation flow (simplified for script context)
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables first
config({ path: resolve(process.cwd(), '.env.local') });

import { generateCompletion } from '../lib/ai/client';
import { CAMPAIGN_GENERATOR_SYSTEM_PROMPT, buildCampaignPrompt } from '../lib/ai/prompts';
import { parseAndValidateCampaign } from '../lib/ai/validator';
import { renderEmail } from '../lib/email/templates/renderer';
import { supabaseAdmin } from '../lib/supabase/admin';
import type { TemplateRenderInput, EmailContent, ContentSection } from '../lib/email/templates/types';

async function testCampaignGenerator() {
  console.log('🤖 Testing AI Campaign Generator...\n');

  // Check required environment variables
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in .env.local');
    process.exit(1);
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Supabase credentials not found in .env.local');
    console.error('   Need: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Get test user ID from environment or use a test UUID
  const testUserId = process.env.TEST_USER_ID || '00000000-0000-0000-0000-000000000000';
  
  console.log(`📋 Test User ID: ${testUserId}`);
  console.log('💡 Note: Testing simplified flow (skipping rate limits for script context)');
  console.log('');

  try {
    // 1. Get or create brand kit
    console.log('🎨 Getting brand kit...');
    const existingBrandKit = await supabaseAdmin
      .from('brand_kits')
      .select('*')
      .eq('user_id', testUserId)
      .eq('is_active', true)
      .single();
    
    let brandKitData;
    
    if (!existingBrandKit.data || existingBrandKit.error) {
      console.log('   Creating default brand kit...');
      const { data: newBrandKit, error: insertError } = await supabaseAdmin
        .from('brand_kits')
        .insert({
          user_id: testUserId,
          company_name: 'TaskFlow',
          primary_color: '#2563eb',
          secondary_color: '#3b82f6',
          accent_color: '#f59e0b',
          font_style: 'modern',
          is_active: true,
        })
        .select()
        .single();
      
      if (insertError || !newBrandKit) {
        throw new Error(`Failed to create brand kit: ${insertError?.message || 'Unknown error'}`);
      }
      
      brandKitData = newBrandKit;
    } else {
      brandKitData = existingBrandKit.data;
    }
    
    console.log('✅ Brand kit ready');
    console.log('');

    // 2. Generate campaign
    console.log('🎨 Generating campaign with AI...');
    console.log('   Prompt: "Create a welcome email for new SaaS trial users"');
    console.log('');
    
    const startTime = Date.now();
    
    // Build prompts
    const systemPrompt = CAMPAIGN_GENERATOR_SYSTEM_PROMPT;
    const userPrompt = buildCampaignPrompt({
      prompt: 'Create a welcome email for new SaaS trial users. Make it friendly and encouraging.',
      companyName: 'TaskFlow',
      productDescription: 'A modern project management tool for small teams',
      targetAudience: 'Small business owners and startup teams',
      tone: 'friendly',
      campaignType: 'one-time',
      brandKit: {
        primaryColor: brandKitData.primary_color,
        secondaryColor: brandKitData.secondary_color,
        accentColor: brandKitData.accent_color,
        fontStyle: brandKitData.font_style,
      },
    });
    
    // Call OpenAI
    const aiResult = await generateCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      {
        model: 'gpt-4-turbo-preview',
        temperature: 0.7,
        maxTokens: 2000,
        jsonMode: true,
        retries: 3,
      }
    );
    
    // Validate response
    const generatedCampaign = parseAndValidateCampaign(aiResult.content);
    
    // Render emails
    const renderedEmails = generatedCampaign.emails.map(email => {
      const content: EmailContent = {
        headline: email.subject,
        preheader: email.previewText,
        sections: parseEmailBody(email.htmlBody || email.plainTextBody),
        cta: {
          text: email.ctaText,
          url: email.ctaUrl,
        },
        footer: {
          companyName: 'TaskFlow',
        },
      };
      
      const templateInput: TemplateRenderInput = {
        template: generatedCampaign.design.template,
        design: {
          template: generatedCampaign.design.template,
          headerGradient: generatedCampaign.design.headerGradient,
          ctaColor: generatedCampaign.design.ctaColor,
          accentColor: generatedCampaign.design.accentColor,
        },
        content,
        brandColors: {
          primaryColor: brandKitData.primary_color,
          secondaryColor: brandKitData.secondary_color,
          accentColor: brandKitData.accent_color || '#f59e0b',
          fontStyle: brandKitData.font_style || 'modern',
        },
      };
      
      const rendered = renderEmail(templateInput);
      
      return {
        subject: rendered.subject,
        previewText: rendered.previewText,
        html: rendered.html,
        plainText: rendered.plainText,
        ctaText: email.ctaText,
        ctaUrl: email.ctaUrl,
      };
    });
    
    const totalTime = Date.now() - startTime;
    
    // Save to database
    const { data: savedGeneration, error: saveError } = await supabaseAdmin
      .from('ai_generations')
      .insert({
        user_id: testUserId,
        prompt: 'Create a welcome email for new SaaS trial users',
        company_name: 'TaskFlow',
        product_description: 'A modern project management tool for small teams',
        target_audience: 'Small business owners and startup teams',
        tone: 'friendly',
        campaign_type: 'one-time',
        generated_content: generatedCampaign,
        model: aiResult.model,
        model_version: aiResult.model,
        tokens_used: aiResult.tokensUsed,
        prompt_tokens: aiResult.promptTokens,
        completion_tokens: aiResult.completionTokens,
        cost_usd: aiResult.costUsd,
        generation_time_ms: totalTime,
      })
      .select('id')
      .single();
    
    if (saveError) {
      console.warn('⚠️  Failed to save to database:', saveError.message);
    }
    
    const result = {
      id: savedGeneration?.id || 'not-saved',
      campaign: generatedCampaign,
      renderedEmails,
      metadata: {
        model: aiResult.model,
        tokensUsed: aiResult.tokensUsed,
        promptTokens: aiResult.promptTokens,
        completionTokens: aiResult.completionTokens,
        costUsd: aiResult.costUsd,
        generationTimeMs: totalTime,
        generatedAt: new Date(),
      },
    };
    
    // 3. Display results
    console.log('✅ Campaign generated successfully!\n');
    
    console.log('📧 Campaign Details:');
    console.log(`   Name: ${result.campaign.campaignName}`);
    console.log(`   Type: ${result.campaign.campaignType}`);
    console.log(`   Template: ${result.campaign.design.template}`);
    console.log(`   Emails: ${result.renderedEmails.length}`);
    console.log('');
    
    console.log('💰 Cost & Performance:');
    console.log(`   Model: ${result.metadata.model}`);
    console.log(`   Tokens: ${result.metadata.tokensUsed} (${result.metadata.promptTokens} prompt + ${result.metadata.completionTokens} completion)`);
    console.log(`   Cost: $${result.metadata.costUsd.toFixed(4)}`);
    console.log(`   AI Time: ${result.metadata.generationTimeMs}ms`);
    console.log(`   Total Time: ${totalTime}ms`);
    console.log('');
    
    console.log('📨 Generated Emails:');
    result.renderedEmails.forEach((email, index) => {
      console.log(`   ${index + 1}. ${email.subject}`);
      console.log(`      Preview: ${email.previewText.substring(0, 60)}...`);
      console.log(`      CTA: "${email.ctaText}" → ${email.ctaUrl}`);
      console.log(`      HTML length: ${email.html.length} chars`);
      console.log(`      Plain text length: ${email.plainText.length} chars`);
    });
    console.log('');
    
    console.log('🎨 Design Configuration:');
    console.log(`   Template: ${result.campaign.design.template}`);
    console.log(`   CTA Color: ${result.campaign.design.ctaColor}`);
    if (result.campaign.design.headerGradient) {
      console.log(`   Gradient: ${result.campaign.design.headerGradient.from} → ${result.campaign.design.headerGradient.to}`);
    }
    if (result.campaign.design.accentColor) {
      console.log(`   Accent: ${result.campaign.design.accentColor}`);
    }
    console.log('');
    
    console.log('💾 Database:');
    console.log(`   Generation ID: ${result.id}`);
    console.log(`   Saved at: ${result.metadata.generatedAt.toISOString()}`);
    console.log('');
    
    console.log('📊 AI Recommendations:');
    console.log(`   Segment: ${result.campaign.recommendedSegment}`);
    console.log(`   Send Time: ${result.campaign.sendTimeSuggestion}`);
    console.log(`   Success Metrics: ${result.campaign.successMetrics}`);
    console.log('');
    
    console.log('✨ Test completed successfully!\n');
    
    console.log('💡 Next steps:');
    console.log('   1. Check Supabase to see the saved generation');
    console.log('   2. View the HTML emails in a browser');
    console.log('   3. Test the API endpoint with curl or Postman');
    console.log('   4. Build the UI to call this API');
    
  } catch (error: any) {
    console.error('\n❌ Test failed!');
    console.error('Error:', error.message);
    
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    
    process.exit(1);
  }
}

// Helper function to parse email body
function parseEmailBody(body: string): ContentSection[] {
  const sections: ContentSection[] = [];
  const paragraphs = body.split(/\n\n+/).filter(p => p.trim());
  
  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    
    if (trimmed.match(/^[-•*]\s/m)) {
      const items = trimmed
        .split(/\n/)
        .filter(line => line.match(/^[-•*]\s/))
        .map(line => line.replace(/^[-•*]\s/, '').trim());
      
      sections.push({ type: 'list', items });
    } else if (trimmed.length < 60 && (trimmed.endsWith(':') || trimmed.match(/^#+\s/))) {
      sections.push({
        type: 'heading',
        content: trimmed.replace(/^#+\s/, '').replace(/:$/, ''),
      });
    } else {
      sections.push({ type: 'text', content: trimmed });
    }
  }
  
  return sections;
}

// Run the test
testCampaignGenerator();

