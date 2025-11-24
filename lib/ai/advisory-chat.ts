/**
 * Conversational Advisory Chat
 * 
 * Generates helpful, conversational advice about email optimization
 * without modifying the actual email blocks
 */

import { generateCompletion, type AIProvider } from './client';
import type { SemanticBlock } from '@/lib/email-v2/ai/blocks';
import type { GlobalEmailSettings } from '@/lib/email-v2/types';

export async function generateEmailAdvice(
  userQuestion: string,
  currentBlocks: SemanticBlock[],
  subject: string,
  previewText: string,
  globalSettings: GlobalEmailSettings
): Promise<string> {
  const provider: AIProvider = (process.env.AI_PROVIDER as AIProvider) || 'gemini';
  const model = provider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-4o';
  
  const blockSummary = currentBlocks.map(b => `- ${b.blockType}`).join('\n');
  
  const prompt = `You are an email marketing expert. Analyze this email and provide advice.

EMAIL DETAILS:
- Subject: ${subject}
- Preview: ${previewText}
- Blocks: ${blockSummary}
- Brand Colors: ${globalSettings.primaryColor}
- Font: ${globalSettings.fontFamily}

USER ASKS: "${userQuestion}"

Provide 2-3 specific suggestions in a friendly tone (under 150 words). End with an invitation to make changes.`;

  const result = await generateCompletion(
    [
      {
        role: 'system',
        content: 'You are a helpful email marketing advisor. Be conversational, specific, and actionable. Use "you/your" language and ask follow-up questions. Offer concrete suggestions that invite the user to take action.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    {
      provider,
      model,
      temperature: 0.8,
      maxTokens: 600,
    }
  );
  
  return result.content;
}

