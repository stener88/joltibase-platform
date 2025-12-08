/**
 * Generate Email Icons Script
 * 
 * Pre-generates Lucide icons as email-compatible data URIs
 * Run this script to update icon constants
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  Plane,
  Hotel,
  Car,
  Mountain,
  UtensilsCrossed,
  ArrowRight,
} from 'lucide-react';
import fs from 'fs';
import path from 'path';

interface IconConfig {
  width: number;
  height: number;
  color: string;
  bgColor?: string;
  strokeWidth?: number;
}

function iconToDataUri(
  Icon: any,
  config: IconConfig
): string {
  const {
    width,
    height,
    color,
    bgColor,
    strokeWidth = 2,
  } = config;

  // Render icon to SVG string
  const iconSvg = renderToStaticMarkup(
    React.createElement(Icon, {
      width,
      height,
      color,
      strokeWidth,
    })
  );

  // Extract SVG content (remove <svg> wrapper)
  const svgContentMatch = iconSvg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  const svgContent = svgContentMatch ? svgContentMatch[1] : '';

  // Create complete SVG with background if needed
  const completeSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      ${bgColor ? `<rect width="100%" height="100%" fill="${bgColor}" rx="2"/>` : ''}
      ${svgContent}
    </svg>
  `.trim();

  // Convert to base64 data URI
  const base64 = Buffer.from(completeSvg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

function createTextIcon(
  text: string,
  config: IconConfig
): string {
  const {
    width,
    height,
    color,
    bgColor,
  } = config;

  const fontSize = Math.min(width, height) * 0.6;
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      ${bgColor ? `<rect width="100%" height="100%" fill="${bgColor}" rx="2"/>` : ''}
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="${fontSize}px" 
        font-weight="bold" 
        fill="${color}" 
        text-anchor="middle" 
        dominant-baseline="central"
      >${text}</text>
    </svg>
  `.trim();

  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

// Generate all icons
const icons = {
  // Travel icons - Blue background, white icon
  flights: iconToDataUri(Plane, {
    width: 24,
    height: 20,
    color: '#ffffff',
    bgColor: '#0062e3',
    strokeWidth: 2,
  }),
  
  hotel: iconToDataUri(Hotel, {
    width: 24,
    height: 20,
    color: '#ffffff',
    bgColor: '#0062e3',
    strokeWidth: 2,
  }),
  
  car: iconToDataUri(Car, {
    width: 24,
    height: 20,
    color: '#ffffff',
    bgColor: '#0062e3',
    strokeWidth: 2,
  }),
  
  // Activity icons - Blue background, white icon
  mountain: iconToDataUri(Mountain, {
    width: 19,
    height: 19,
    color: '#ffffff',
    bgColor: '#0062e3',
    strokeWidth: 2,
  }),
  
  island: createTextIcon('I', {
    width: 19,
    height: 19,
    color: '#ffffff',
    bgColor: '#0062e3',
  }),
  
  dining: iconToDataUri(UtensilsCrossed, {
    width: 19,
    height: 19,
    color: '#ffffff',
    bgColor: '#0062e3',
    strokeWidth: 2,
  }),
  
  // Arrow - Gray, no background
  arrow: iconToDataUri(ArrowRight, {
    width: 6,
    height: 10,
    color: '#666666',
    strokeWidth: 2,
  }),
  
  // Footer icons - White background, dark icon
  flightsWhite: iconToDataUri(Plane, {
    width: 24,
    height: 16,
    color: '#05203C',
    bgColor: '#ffffff',
    strokeWidth: 1.5,
  }),
  
  hotelWhite: iconToDataUri(Hotel, {
    width: 24,
    height: 16,
    color: '#05203C',
    bgColor: '#ffffff',
    strokeWidth: 1.5,
  }),
  
  carWhite: iconToDataUri(Car, {
    width: 24,
    height: 16,
    color: '#05203C',
    bgColor: '#ffffff',
    strokeWidth: 1.5,
  }),
};

// Generate TypeScript file with icon constants
const output = `/**
 * Email-Compatible Icon System
 * 
 * Auto-generated from Lucide icons
 * DO NOT EDIT MANUALLY - Run: npm run generate:icons
 * 
 * Generated: ${new Date().toISOString()}
 */

/**
 * Email-compatible icon registry
 * Maps icon names to data URIs (base64 encoded SVGs)
 */
export const EMAIL_ICONS = {
${Object.entries(icons)
  .map(([key, value]) => `  ${key}: '${value}',`)
  .join('\n')}
} as const;

/**
 * Get icon URL by name
 * Returns data URI for email compatibility
 */
export function getEmailIcon(name: keyof typeof EMAIL_ICONS): string {
  return EMAIL_ICONS[name] || '';
}

/**
 * Get all available icon names
 */
export function getAvailableIcons(): string[] {
  return Object.keys(EMAIL_ICONS);
}

/**
 * Icon configuration type
 */
export interface IconConfig {
  width: number;
  height: number;
  color: string;
  bgColor?: string;
  strokeWidth?: number;
}
`;

// Write to file
const outputPath = path.join(process.cwd(), 'lib', 'email-v3', 'icons.ts');
fs.writeFileSync(outputPath, output, 'utf-8');

console.log('✅ Generated email icons:', Object.keys(icons).length);
console.log('📁 Saved to:', outputPath);
console.log('\nIcons generated:');
Object.keys(icons).forEach(key => {
  const uri = icons[key as keyof typeof icons];
  const size = Math.round(uri.length / 1024 * 100) / 100;
  console.log(`  - ${key}: ${size}KB`);
});

