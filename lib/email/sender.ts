import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set');
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail({
  from,
  to,
  subject,
  html,
  text,
  replyTo,
}: SendEmailParams) {
  try {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      replyTo,
    });

    if (result.error) {
      console.error('❌ [RESEND] Send error:', result.error);
      throw new Error(result.error.message);
    }

    console.log('✅ [RESEND] Email sent:', result.data?.id);
    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error: any) {
    console.error('❌ [RESEND] Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Replace merge tags in email content with actual contact data
 */
export function replaceMergeTags(
  content: string,
  contact: {
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    metadata?: Record<string, any>;
  }
): string {
  let result = content;

  // Replace standard merge tags
  result = result.replace(/\{\{first_name\}\}/g, contact.first_name || '');
  result = result.replace(/\{\{last_name\}\}/g, contact.last_name || '');
  result = result.replace(/\{\{email\}\}/g, contact.email);
  
  // Replace custom metadata tags
  if (contact.metadata) {
    Object.keys(contact.metadata).forEach((key) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, String(contact.metadata![key] || ''));
    });
  }

  return result;
}

/**
 * Convert HTML to plain text (basic implementation)
 */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

