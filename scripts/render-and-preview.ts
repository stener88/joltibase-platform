/**
 * Render and Preview Generated Emails
 * 
 * Uses the existing V3 renderer to convert TSX to HTML and opens in browser
 * Run with: npx tsx scripts/render-and-preview.ts [filename]
 */

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { readdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { renderEmail } from '../lib/email-v3/renderer';
import { statSync } from 'fs';

const execAsync = promisify(exec);

const GENERATED_DIR = join(process.cwd(), 'emails', 'generated');
const PREVIEW_DIR = join(process.cwd(), 'emails', 'previews');

interface EmailFile {
  name: string;
  size: number;
  created: Date;
}

async function listGeneratedEmails(): Promise<EmailFile[]> {
  const files = await readdir(GENERATED_DIR, { withFileTypes: true });
  
  const emails: EmailFile[] = [];
  
  for (const file of files) {
    if (file.isFile() && file.name.endsWith('.tsx')) {
      const path = join(GENERATED_DIR, file.name);
      const stats = statSync(path);
      const created = new Date(stats.mtime);
      
      emails.push({
        name: file.name,
        size: stats.size,
        created,
      });
    }
  }
  
  // Sort by creation date (newest first)
  return emails.sort((a, b) => b.created.getTime() - a.created.getTime());
}

async function renderAndSave(filename: string): Promise<string> {
  console.log(`\n🎨 Rendering ${filename}...`);
  
  try {
    // Use the existing V3 renderer
    const result = await renderEmail(filename);
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    // Wrap in a nice preview page
    const wrappedHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Preview - ${filename}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .preview-container {
      max-width: 800px;
      width: 100%;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .preview-header {
      padding: 24px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .preview-header h1 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
    }
    .preview-header p {
      margin: 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .stats {
      display: flex;
      gap: 24px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid rgba(255,255,255,0.2);
    }
    .stat {
      font-size: 13px;
    }
    .stat-label {
      opacity: 0.8;
      display: block;
      margin-bottom: 4px;
    }
    .stat-value {
      font-weight: 600;
      font-size: 16px;
    }
    .email-viewport {
      padding: 40px;
      background: #f3f4f6;
      display: flex;
      justify-content: center;
    }
    .email-frame {
      max-width: 600px;
      width: 100%;
      background: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    .email-content {
      /* Email content styles will be inline from React Email */
    }
    .preview-footer {
      padding: 20px 32px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 13px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: #10b981;
      color: white;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin-right: 8px;
    }
  </style>
</head>
<body>
  <div class="preview-container">
    <div class="preview-header">
      <h1>📧 Multi-Agent Email</h1>
      <p>${filename}</p>
      <div class="stats">
        <div class="stat">
          <span class="stat-label">Generated</span>
          <span class="stat-value">${new Date().toLocaleString()}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Size</span>
          <span class="stat-value">${(result.html.length / 1024).toFixed(1)} KB</span>
        </div>
        <div class="stat">
          <span class="stat-label">System</span>
          <span class="stat-value">Multi-Agent v2</span>
        </div>
      </div>
    </div>
    <div class="email-viewport">
      <div class="email-frame">
        <div class="email-content">
          ${result.html}
        </div>
      </div>
    </div>
    <div class="preview-footer">
      <span class="badge">✓ RENDERED</span>
      Generated with Joltibase Multi-Agent Email System
    </div>
  </div>
</body>
</html>`;
    
    // Save to preview directory
    const outputPath = join(PREVIEW_DIR, filename.replace('.tsx', '.html'));
    await writeFile(outputPath, wrappedHTML, 'utf-8');
    
    console.log(`✅ Rendered successfully!`);
    console.log(`📂 Saved to: ${outputPath}`);
    
    return outputPath;
    
  } catch (error) {
    console.error(`❌ Render failed:`, error);
    throw error;
  }
}

async function openInBrowser(filePath: string): Promise<void> {
  const platform = process.platform;
  let command: string;
  
  if (platform === 'darwin') {
    command = `open "${filePath}"`;
  } else if (platform === 'win32') {
    command = `start "${filePath}"`;
  } else {
    command = `xdg-open "${filePath}"`;
  }
  
  try {
    await execAsync(command);
    console.log(`🌐 Opened in browser!`);
  } catch (error) {
    console.error(`⚠️  Could not open browser. Open manually:\n   file://${filePath}`);
  }
}

async function main() {
  console.log('🚀 Multi-Agent Email Preview Generator');
  console.log('━'.repeat(80));
  
  // Create preview directory
  try {
    await execAsync(`mkdir -p "${PREVIEW_DIR}"`);
  } catch {
    // Directory might already exist
  }
  
  // List emails
  const emails = await listGeneratedEmails();
  
  if (emails.length === 0) {
    console.log('\n❌ No generated emails found!');
    console.log('📝 Run this first: npx tsx scripts/test-multi-agent.ts\n');
    return;
  }
  
  console.log(`\n📨 Found ${emails.length} generated email(s):\n`);
  
  emails.forEach((email, i) => {
    console.log(`  ${i + 1}. ${email.name}`);
    console.log(`     📅 ${email.created.toLocaleString()}`);
    console.log(`     📦 ${(email.size / 1024).toFixed(1)} KB\n`);
  });
  
  // Get target file
  const targetFile = process.argv[2];
  let emailToRender: string;
  
  if (targetFile) {
    const found = emails.find(e => e.name === targetFile);
    if (!found) {
      console.error(`❌ File not found: ${targetFile}`);
      console.log(`\n💡 Available files:`);
      emails.forEach(e => console.log(`   - ${e.name}`));
      return;
    }
    emailToRender = targetFile;
  } else {
    // Use most recent
    emailToRender = emails[0].name;
    console.log(`📧 Rendering most recent: ${emailToRender}`);
  }
  
  // Render and open
  const outputPath = await renderAndSave(emailToRender);
  await openInBrowser(outputPath);
  
  console.log('\n━'.repeat(80));
  console.log('✅ Done! Email preview opened in browser');
  console.log('━'.repeat(80) + '\n');
}

main().catch(console.error);
