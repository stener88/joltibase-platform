'use client';

import type { EmailBlock, LayoutVariation } from '@/lib/email/blocks/types';
import { LAYOUT_VARIATION_DEFINITIONS } from '@/lib/email/blocks';
import { getDefaultBlockContent, getDefaultBlockSettings } from '@/lib/email/blocks/registry/defaults';

interface LayoutVariationSelectorProps {
  block: EmailBlock & { layoutVariation?: string };
  onUpdate: (blockId: string, updates: Partial<EmailBlock>) => void;
}

export function LayoutVariationSelector({ block, onUpdate }: LayoutVariationSelectorProps) {
  const currentVariation = block.layoutVariation || 'hero-center';
  
  // Only show actually implemented variations
  const implementedVariations: LayoutVariation[] = [
    'hero-center',
    'two-column-50-50',
    'two-column-60-40',
    'two-column-40-60',
    'two-column-70-30',
    'two-column-30-70',
    'stats-2-col',
    'stats-3-col',
    'stats-4-col',
    'image-overlay',
    'card-centered',
    'compact-image-text',
    'two-column-text',
    'magazine-feature',
  ];
  
  const allVariations = implementedVariations
    .map(v => LAYOUT_VARIATION_DEFINITIONS[v])
    .filter(Boolean);

  const handleSelectVariation = (variation: LayoutVariation) => {
    // Get fresh default content and settings for the new variation
    const newContent = getDefaultBlockContent('layouts', { layoutVariation: variation });
    const newSettings = getDefaultBlockSettings('layouts', { layoutVariation: variation });
    
    // Update the block with new variation, content, and settings
    onUpdate(block.id, { 
      layoutVariation: variation,
      content: newContent,
      settings: newSettings,
    });
  };

  return (
    <div className="p-2 space-y-1 overflow-y-auto max-w-xs mx-auto">
      {allVariations.map((def) => {
        if (!def) return null;
        
        // Determine aspect ratio based on layout type to match actual rendering
        let aspectRatio = 'aspect-[3/2]'; // Default landscape
        
        if (def.variation === 'hero-center') {
          aspectRatio = 'aspect-[3/2]'; // Landscape - centered content
        } else if (def.variation === 'card-centered') {
          aspectRatio = 'aspect-[4/5]'; // Portrait card
        } else if (def.variation === 'image-overlay') {
          aspectRatio = 'aspect-[3/2]'; // Landscape - full image background
        } else if (def.variation === 'compact-image-text') {
          aspectRatio = 'aspect-[5/2]'; // Wide landscape - side by side
        } else if (def.variation === 'two-column-text') {
          aspectRatio = 'aspect-[5/2]'; // Wide landscape - two text columns
        } else if (def.variation === 'magazine-feature') {
          aspectRatio = 'aspect-[3/4]'; // Portrait - vertical magazine layout
        } else if (def.variation.includes('two-column')) {
          aspectRatio = 'aspect-[3/2]'; // Landscape - side by side columns
        } else if (def.variation.includes('stats')) {
          aspectRatio = 'aspect-[5/1]'; // Very wide landscape - horizontal stats
        }
        
        return (
          <button
            key={def.variation}
            onClick={() => handleSelectVariation(def.variation)}
            className={`w-full border rounded transition-all overflow-hidden ${
              currentVariation === def.variation
                ? 'border-[#e9a589] ring-1 ring-[#e9a589]'
                : 'border-gray-200 hover:border-[#e9a589]'
            }`}
          >
            {/* Visual Preview */}
            <div className={`${aspectRatio} w-full bg-gray-50`}>
              <LayoutPreview variation={def.variation} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Realistic preview component - matching actual email rendering
function LayoutPreview({ variation }: { variation: LayoutVariation }) {
  // Hero Center - centered content with badge, title, paragraph, button
  // Based on renderHeroCenterLayout from renderer.ts
  if (variation === 'hero-center') {
    return (
      <div className="w-full h-full bg-white flex flex-col items-center justify-center px-4 py-3 gap-1.5">
        <div className="text-[7px] uppercase tracking-wider text-gray-400 font-semibold">INTRODUCING</div>
        <div className="text-[11px] font-bold text-gray-900 text-center leading-tight">Your Headline Here</div>
        <div className="text-[6px] text-gray-600 text-center max-w-[85%] leading-snug">Add your description text here to explain the feature.</div>
        <div className="mt-1 px-2.5 py-0.5 bg-gray-900 text-white text-[6px] rounded">Get Started</div>
      </div>
    );
  }
  
  // Two Column layouts - image on one side, content on other
  // Based on renderTwoColumnLayout from renderer.ts
  if (variation.includes('two-column') && variation !== 'two-column-text') {
    // Determine which column gets the image and what width
    // 60-40 = image is 60% on LEFT
    // 40-60 = image is 40% on LEFT (or 60% of text on RIGHT)
    // 70-30 = image is 70% on LEFT
    // 30-70 = image is 30% on LEFT
    const isImageOnLeft = !variation.includes('40-60') && !variation.includes('30-70');
    const imageWidth = variation.includes('50-50') ? 'w-1/2' : 
                       variation.includes('60-40') ? 'w-[60%]' :
                       variation.includes('40-60') ? 'w-[40%]' :
                       variation.includes('70-30') ? 'w-[70%]' : 'w-[30%]';
    
    const imageElement = <div className={`${imageWidth} bg-gray-300 rounded flex-shrink-0`}></div>;
    const textElement = (
      <div className="flex-1 flex flex-col justify-center gap-0.5">
        <div className="text-[9px] font-bold text-gray-900 leading-tight">Feature Title</div>
        <div className="text-[6px] text-gray-600 leading-relaxed">Feature description goes here.</div>
        <div className="mt-1 px-2 py-0.5 bg-gray-900 text-white text-[5px] rounded self-start">Learn More</div>
      </div>
    );
    
    return (
      <div className="w-full h-full bg-white flex gap-2 p-2">
        {isImageOnLeft ? imageElement : textElement}
        {isImageOnLeft ? textElement : imageElement}
      </div>
    );
  }
  
  // Stats layouts - horizontal grid with value, title, description
  // Based on renderStatsLayout from renderer.ts
  if (variation.includes('stats')) {
    const cols = variation.includes('2-col') ? 2 : 
                 variation.includes('3-col') ? 3 : 4;
    const stats = [
      { value: '10K+', label: 'Users' },
      { value: '99%', label: 'Uptime' },
      { value: '24/7', label: 'Support' },
      { value: '<1s', label: 'Response' },
    ].slice(0, cols);
    
    // Fix: Use explicit grid classes instead of template string (Tailwind needs static classes)
    const gridClass = cols === 2 ? 'grid grid-cols-2' :
                      cols === 3 ? 'grid grid-cols-3' :
                      'grid grid-cols-4';
    
    return (
      <div className={`w-full h-full bg-white ${gridClass} gap-1 p-2`}>
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center justify-center">
            <div className="text-[14px] font-bold text-gray-900 leading-none">{stat.value}</div>
            <div className="text-[6px] text-gray-600 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    );
  }
  
  // Image Overlay - full background image with text overlay (badge + title + paragraph)
  // Based on renderImageOverlayLayout from renderer.ts
  if (variation === 'image-overlay') {
    return (
      <div className="w-full h-full bg-gray-300 relative flex items-start p-2">
        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-gray-900 text-white text-[7px] font-bold">003</div>
        <div className="mt-6 max-w-[60%]">
          <div className="text-[8px] font-bold text-gray-900 leading-tight uppercase tracking-wide">A LITTLE GIFT OF THANKS</div>
          <div className="text-[6px] text-gray-800 leading-tight mt-0.5">Your exclusive content awaits</div>
        </div>
      </div>
    );
  }
  
  // Card Centered - white card with large number, subtitle, divider, paragraph, button
  // Based on renderCardCenteredLayout from renderer.ts
  if (variation === 'card-centered') {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center p-1.5">
        <div className="bg-white border border-gray-200 rounded py-3 px-2 flex flex-col items-center gap-1 w-[85%]">
          <div className="text-[24px] font-bold text-gray-900 leading-none">6</div>
          <div className="text-[8px] font-medium text-gray-900 text-center leading-tight">Tips to Photograph Food</div>
          <div className="w-6 h-[1px] bg-gray-300 my-0.5"></div>
          <div className="text-[5px] text-gray-600 text-center leading-relaxed px-1">I remember my first try at food photography...</div>
          <div className="mt-1 px-2 py-0.5 bg-gray-400 text-white text-[5px] rounded tracking-wide">READ IT</div>
        </div>
      </div>
    );
  }
  
  // Compact Image Text - small image left, title + subtitle right
  // Based on renderCompactImageTextLayout from renderer.ts  
  if (variation === 'compact-image-text') {
    return (
      <div className="w-full h-full bg-white flex gap-2 items-center p-2">
        <div className="w-10 h-10 bg-gray-300 rounded border border-gray-200 flex-shrink-0"></div>
        <div className="flex-1 flex flex-col gap-0.5">
          <div className="text-[6px] italic text-gray-400 leading-tight">One</div>
          <div className="text-[8px] text-gray-900 leading-tight font-medium">Click here for my creamy butternut squash soup</div>
        </div>
      </div>
    );
  }
  
  // Two Column Text - two columns of text side-by-side
  // Based on renderTwoColumnTextLayout from renderer.ts
  if (variation === 'two-column-text') {
    return (
      <div className="w-full h-full bg-white flex gap-2 p-2">
        <div className="flex-1 flex flex-col gap-0.5">
          <div className="text-[5px] text-gray-700 leading-tight">Neil Armstrong made it all the way to the moon, but he couldn't have dreamed of...</div>
        </div>
        <div className="flex-1 flex flex-col gap-0.5">
          <div className="text-[5px] text-gray-700 leading-tight">Your unwavering support creates space for us to share what we love and build...</div>
        </div>
      </div>
    );
  }
  
  // Magazine Feature - title, square image with badge overlay, paragraph
  // Based on renderMagazineFeatureLayout from renderer.ts
  if (variation === 'magazine-feature') {
    return (
      <div className="w-full h-full bg-[#9CADB7] flex flex-col items-center p-2 gap-1.5">
        <div className="text-[10px] text-gray-900 font-serif leading-tight">Rose my way</div>
        <div className="relative w-3/4 aspect-square bg-gray-300 rounded-sm">
          <div className="absolute bottom-[-8px] right-[10%] text-[18px] font-bold text-black font-serif">01</div>
        </div>
        <div className="text-[5px] text-gray-900 leading-relaxed px-2 mt-2">Since we recently discovered homemade gnocchi, dinners at home...</div>
      </div>
    );
  }
  
  // Default fallback
  return (
    <div className="w-full h-full bg-gray-50 flex flex-col gap-1 p-1">
      <div className="bg-gray-300 rounded flex-1"></div>
      <div className="bg-gray-300 rounded flex-1"></div>
    </div>
  );
}

