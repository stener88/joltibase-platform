/**
 * Preview Generated Emails
 * 
 * Renders generated TSX files to HTML and opens them in browser
 * Run with: npx tsx scripts/preview-emails.ts [filename]
 */

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const GENERATED_DIR = join(process.cwd(), 'emails', 'generated');
const PREVIEW_DIR = join(process.cwd(), 'emails', 'previews');

interface EmailFile {
  name: string;
  path: string;
  size: number;
  created: Date;
}

async function listGeneratedEmails(): Promise<EmailFile[]> {
  const files = await readdir(GENERATED_DIR, { withFileTypes: true });
  
  const emails: EmailFile[] = [];
  
  for (const file of files) {
    if (file.isFile() && file.name.endsWith('.tsx')) {
      const path = join(GENERATED_DIR, file.name);
      const stats = await readFile(path, 'utf-8');
      const created = new Date(file.name.split('_')[1] ? parseInt(file.name.split('_')[1]) : Date.now());
      
      emails.push({
        name: file.name,
        path,
        size: stats.length,
        created,
      });
    }
  }
  
  // Sort by creation date (newest first)
  return emails.sort((a, b) => b.created.getTime() - a.created.getTime());
}

async function renderTSXToHTML(tsxPath: string, outputPath: string): Promise<void> {
  console.log(`🎨 Rendering ${tsxPath}...`);
  
  try {
    // Read the TSX file
    const tsxCode = await readFile(tsxPath, 'utf-8');
    
    // Extract just the component code (remove imports)
    const componentMatch = tsxCode.match(/const\s+\w+\s*=.*?<Tailwind>[\s\S]*?<\/Tailwind>/);
    
    if (!componentMatch) {
      throw new Error('Could not find component in TSX file');
    }
    
    // For now, create a simple HTML preview with the TSX embedded
    // TODO: Use React Email's render() once we set up proper dynamic imports
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Preview</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f3f4f6;
    }
    .preview-container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .preview-header {
      padding: 20px;
      background: #111827;
      color: white;
      border-bottom: 3px solid #4F46E5;
    }
    .preview-header h1 {
      margin: 0 0 8px 0;
      font-size: 20px;
    }
    .preview-header p {
      margin: 0;
      font-size: 14px;
      color: #9CA3AF;
    }
    .preview-content {
      padding: 40px;
      background: #f9fafb;
    }
    .email-frame {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      border-radius: 4px;
      overflow: hidden;
    }
    .code-preview {
      margin-top: 40px;
      padding: 20px;
      background: #1F2937;
      color: #E5E7EB;
      border-radius: 4px;
      overflow-x: auto;
    }
    .code-preview pre {
      margin: 0;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 12px;
      line-height: 1.5;
    }
    .stats {
      display: flex;
      gap: 20px;
      margin-top: 12px;
    }
    .stat {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
    }
    .stat-label {
      color: #9CA3AF;
    }
    .stat-value {
      color: white;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="preview-container">
    <div class="preview-header">
      <h1>📧 Email Preview</h1>
      <p>Generated with Multi-Agent System</p>
      <div class="stats">
        <div class="stat">
          <span class="stat-label">File:</span>
          <span class="stat-value">${tsxPath.split('/').pop()}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Size:</span>
          <span class="stat-value">${(tsxCode.length / 1024).toFixed(2)} KB</span>
        </div>
        <div class="stat">
          <span class="stat-label">Generated:</span>
          <span class="stat-value">${new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
    <div class="preview-content">
      <div class="email-frame">
        <!-- Email content will be rendered here by React Email -->
        <div style="padding: 40px; text-align: center; color: #6B7280;">
          <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">⚠️ React Email Rendering</p>
          <p style="margin: 0; font-size: 14px;">This preview shows the TSX code. For full HTML rendering,</p>
          <p style="margin: 4px 0 0 0; font-size: 14px;">run: <code style="background: #F3F4F6; padding: 2px 6px; border-radius: 3px;">npx react-email dev</code></p>
        </div>
      </div>
      <div class="code-preview">
        <pre>${escapeHtml(tsxCode.substring(0, 3000))}${tsxCode.length > 3000 ? '\n\n... (truncated)' : ''}</pre>
      </div>
    </div>
  </div>
</body>
</html>`;
    
    // Write HTML file
    await writeFile(outputPath, html, 'utf-8');
    console.log(`✅ Saved preview to ${outputPath}`);
    
  } catch (error) {
    console.error(`❌ Failed to render ${tsxPath}:`, error);
    throw error;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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
    console.log(`🌐 Opened in browser`);
  } catch (error) {
    console.error(`⚠️ Could not open browser automatically. Open manually: ${filePath}`);
  }
}

async function main() {
  console.log('🎨 Email Preview Generator');
  console.log('━'.repeat(80));
  
  // Create preview directory if it doesn't exist
  try {
    await readdir(PREVIEW_DIR);
  } catch {
    await execAsync(`mkdir -p "${PREVIEW_DIR}"`);
  }
  
  // List all generated emails
  const emails = await listGeneratedEmails();
  
  if (emails.length === 0) {
    console.log('❌ No generated emails found in emails/generated/');
    console.log('Run: npx tsx scripts/test-multi-agent.ts first');
    return;
  }
  
  console.log(`\nFound ${emails.length} generated email(s):\n`);
  
  emails.forEach((email, i) => {
    console.log(`${i + 1}. ${email.name}`);
    console.log(`   Created: ${email.created.toLocaleString()}`);
    console.log(`   Size: ${(email.size / 1024).toFixed(2)} KB\n`);
  });
  
  // Get filename from command line args or use most recent
  const targetFile = process.argv[2];
  let emailToRender: EmailFile;
  
  if (targetFile) {
    const found = emails.find(e => e.name === targetFile);
    if (!found) {
      console.error(`❌ File not found: ${targetFile}`);
      return;
    }
    emailToRender = found;
  } else {
    // Use most recent
    emailToRender = emails[0];
    console.log(`📧 Previewing most recent: ${emailToRender.name}\n`);
  }
  
  // Render to HTML
  const outputPath = join(PREVIEW_DIR, emailToRender.name.replace('.tsx', '.html'));
  await renderTSXToHTML(emailToRender.path, outputPath);
  
  // Open in browser
  await openInBrowser(outputPath);
  
  console.log('\n━'.repeat(80));
  console.log('✅ Preview generated successfully!');
  console.log(`📂 Preview location: ${outputPath}`);
  console.log('\n💡 TIP: For full React Email rendering, run:');
  console.log('   npx react-email dev');
  console.log('━'.repeat(80));
}

main().catch(console.error);
