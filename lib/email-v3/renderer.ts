/**
 * V3 Email Renderer
 * 
 * Renders React Email components to HTML:
 * 1. Dynamic import of TSX component
 * 2. Render to HTML using @react-email/render
 * 
 * Note: Components already include Html/Head/Body/Container structure
 */

import { render } from '@react-email/render';
import path from 'path';
import fs from 'fs';
import { pathToFileURL } from 'url';
import { transformSync } from 'esbuild';
import React from 'react';
import { parseAndInjectIds, type ComponentMap } from './tsx-parser';

const GENERATED_DIR = path.join(process.cwd(), 'emails/generated');

export interface RenderOptions {
  props?: Record<string, any>;
  plainText?: boolean;
}

export interface RenderResult {
  html: string;
  plainText?: string;
  error?: string;
}

export interface RenderWithIdsResult extends RenderResult {
  componentMap: ComponentMap;
  modifiedTsx: string;
}

/**
 * Render a V3 React Email component to HTML
 */
export async function renderEmail(
  filename: string,
  options: RenderOptions = {}
): Promise<RenderResult> {
  console.log(`🎨 [V3-RENDERER] Rendering: ${filename}`);
  
  try {
    const filepath = path.join(GENERATED_DIR, filename);
    
    // Check file exists
    if (!fs.existsSync(filepath)) {
      throw new Error(`Email file not found: ${filename}`);
    }
    
    // Read and transpile TSX to JS
    const tsxCode = fs.readFileSync(filepath, 'utf-8');
    
    console.log(`🔄 [V3-RENDERER] Transpiling TSX to JS...`);
    const transpiled = transformSync(tsxCode, {
      loader: 'tsx',
      format: 'esm',
      target: 'node20',
      jsx: 'automatic',
      jsxImportSource: 'react',
    });
    
    // Write transpiled JS to temp file
    const jsFilepath = filepath.replace('.tsx', `.${Date.now()}.mjs`);
    fs.writeFileSync(jsFilepath, transpiled.code, 'utf-8');
    
    try {
      // Dynamic import the transpiled JS
      const fileUrl = pathToFileURL(jsFilepath).href;
      const module = await import(/* webpackIgnore: true */ fileUrl);
      const Component = module.default;
      
      // Clean up temp file
      fs.unlinkSync(jsFilepath);
      
      if (!Component) {
        throw new Error('No default export found in email component');
      }
      
      // Get props
      const componentProps = options.props || {};
      
      // Render component directly (it already has Html/Body/Container)
      const html = await render(React.createElement(Component, componentProps));
      
      if (!html || html.length < 100) {
        throw new Error('Rendered HTML too short (likely error in component)');
      }
      
      // Replace [APP_URL] placeholder with actual base URL
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const finalHtml = html.replace(/\[APP_URL\]/g, baseUrl);
      
      console.log(`✅ [V3-RENDERER] Rendered successfully (${finalHtml.length} bytes)`);
      
      // Optionally render plain text
      let plainText: string | undefined;
      if (options.plainText) {
        const plainTextRaw = await render(React.createElement(Component, componentProps), { plainText: true });
        plainText = plainTextRaw.replace(/\[APP_URL\]/g, baseUrl);
        console.log(`✅ [V3-RENDERER] Plain text rendered (${plainText.length} bytes)`);
      }
      
      return {
        html: finalHtml,
        plainText,
      };
    } catch (importError) {
      // Clean up temp file on error
      if (fs.existsSync(jsFilepath)) {
        fs.unlinkSync(jsFilepath);
      }
      throw importError;
    }
  } catch (error: any) {
    console.error('❌ [V3-RENDERER] Render error:', error);
    
    // Enhanced error message for users
    const userFriendlyError = error.message.includes('Unexpected closing')
      ? 'Your last change caused a structure error. The component may have mismatched tags. Please try undoing the last change or regenerating the email.'
      : error.message;
    
    return {
      html: generateFallbackEmail(filename, error),
      error: userFriendlyError,
    };
  }
}

/**
 * Render TSX code directly with component ID injection
 * Used by the editor for live preview with click-to-edit
 */
export async function renderTsxWithIds(
  tsxCode: string,
  options: RenderOptions = {}
): Promise<RenderWithIdsResult> {
  console.log(`🎨 [V3-RENDERER] Rendering TSX with IDs...`);
  
  try {
    // Step 1: Parse and inject component IDs
    const { modifiedTsx, componentMap } = parseAndInjectIds(tsxCode);
    console.log(`✅ [V3-RENDERER] Injected ${Object.keys(componentMap).length} component IDs`);
    
    // Step 2: Transpile TSX to JS
    console.log(`🔄 [V3-RENDERER] Transpiling TSX to JS...`);
    const transpiled = transformSync(modifiedTsx, {
      loader: 'tsx',
      format: 'esm',
      target: 'node20',
      jsx: 'automatic',
      jsxImportSource: 'react',
    });
    
    // Step 3: Create temp file for import
    const tempFilepath = path.join(
      GENERATED_DIR,
      `temp_${Date.now()}_${Math.random().toString(36).slice(2)}.mjs`
    );
    
    // Ensure generated directory exists
    if (!fs.existsSync(GENERATED_DIR)) {
      fs.mkdirSync(GENERATED_DIR, { recursive: true });
    }
    
    fs.writeFileSync(tempFilepath, transpiled.code, 'utf-8');
    
    try {
      // Step 4: Dynamic import
      const fileUrl = pathToFileURL(tempFilepath).href;
      const module = await import(/* webpackIgnore: true */ fileUrl);
      const Component = module.default;
      
      // Clean up temp file
      fs.unlinkSync(tempFilepath);
      
      if (!Component) {
        throw new Error('No default export found in email component');
      }
      
      // Step 5: Render to HTML
      const componentProps = options.props || {};
      const html = await render(React.createElement(Component, componentProps));
      
      if (!html || html.length < 100) {
        throw new Error('Rendered HTML too short (likely error in component)');
      }
      
      // Replace [APP_URL] placeholder with actual base URL
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const finalHtml = html.replace(/\[APP_URL\]/g, baseUrl);
      
      console.log(`✅ [V3-RENDERER] Rendered successfully (${finalHtml.length} bytes)`);
      
      return {
        html: finalHtml,
        componentMap,
        modifiedTsx,
      };
    } catch (importError) {
      // Clean up temp file on error
      if (fs.existsSync(tempFilepath)) {
        fs.unlinkSync(tempFilepath);
      }
      throw importError;
    }
  } catch (error: any) {
    console.error('❌ [V3-RENDERER] Render error:', error);
    
    // Enhanced error message for users
    const userFriendlyError = error.message.includes('Unexpected closing')
      ? 'Your last change caused a structure error. The component may have mismatched tags. Please try undoing the last change or regenerating the email.'
      : error.message;
    
    return {
      html: generateFallbackEmail('TSX Code', error),
      componentMap: {},
      modifiedTsx: tsxCode,
      error: userFriendlyError,
    };
  }
}

/**
 * Generate fallback HTML for errors
 */
function generateFallbackEmail(filename: string, error: Error): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Rendering Error</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f9fc;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 20px; font-size: 24px; font-weight: 700; color: #dc2626;">
                ⚠️ Email Rendering Error
              </h1>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5; color: #374151;">
                We encountered an error while rendering this email template.
              </p>
              <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 24px 0;">
                <p style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #991b1b;">
                  Error Details:
                </p>
                <p style="margin: 0; font-size: 13px; font-family: 'Courier New', monospace; color: #7f1d1d; word-break: break-word;">
                  ${error.message}
                </p>
              </div>
              <table role="presentation" style="width: 100%; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                <tr>
                  <td style="font-size: 12px; color: #9ca3af;">
                    <strong>File:</strong> ${filename}
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #9ca3af;">
                    <strong>Time:</strong> ${new Date().toISOString()}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

