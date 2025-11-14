'use client';

import type { SectionTemplate } from '@/lib/email/sections';

interface SectionCardProps {
  section: SectionTemplate;
  onClick: (sectionId: string) => void;
}

/**
 * Section Card Component
 * 
 * Displays a section template as a clickable card with preview and metadata
 */
export function SectionCard({ section, onClick }: SectionCardProps) {
  const handleClick = () => {
    onClick(section.id);
  };
  
  return (
    <button
      onClick={handleClick}
      className="w-full text-left group relative border border-gray-200 rounded-lg overflow-hidden hover:border-[#e9a589] hover:shadow-md transition-all duration-200 bg-white"
    >
      {/* Thumbnail/Preview Area */}
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {section.thumbnail ? (
          <img
            src={section.thumbnail}
            alt={section.name}
            className="w-full h-full object-cover"
          />
        ) : (
          // Placeholder with gradient based on category
          <div className={`w-full h-full flex items-center justify-center ${getCategoryGradient(section.category)}`}>
            <div className="text-center px-4">
              <div className="text-3xl mb-2">{getCategoryIcon(section.category)}</div>
              <div className="text-xs font-medium text-white/90">{section.name}</div>
            </div>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[#e9a589]/0 group-hover:bg-[#e9a589]/10 transition-colors duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#e9a589] text-white px-4 py-2 rounded-md text-sm font-medium">
            Insert Section
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-3">
        {/* Section Name */}
        <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1">
          {section.name}
        </h3>
        
        {/* Description */}
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {section.description}
        </p>
        
        {/* Tags/Metadata */}
        <div className="flex flex-wrap gap-1">
          {/* Design Style Badge */}
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 capitalize">
            {section.designStyle}
          </span>
          
          {/* Complexity Badge */}
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            section.complexity === 'simple' 
              ? 'bg-green-100 text-green-700'
              : section.complexity === 'moderate'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-orange-100 text-orange-700'
          }`}>
            {section.complexity}
          </span>
          
          {/* Block Count */}
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
            {section.blocks.length} block{section.blocks.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </button>
  );
}

/**
 * Get gradient class based on section category
 */
function getCategoryGradient(category: string): string {
  switch (category) {
    case 'hero':
      return 'bg-gradient-to-br from-purple-500 to-purple-700';
    case 'promo':
      return 'bg-gradient-to-br from-red-500 to-red-700';
    case 'content':
      return 'bg-gradient-to-br from-blue-500 to-blue-700';
    case 'social-proof':
      return 'bg-gradient-to-br from-green-500 to-green-700';
    case 'cta':
      return 'bg-gradient-to-br from-orange-500 to-orange-700';
    case 'pricing':
      return 'bg-gradient-to-br from-yellow-500 to-yellow-700';
    case 'features':
      return 'bg-gradient-to-br from-teal-500 to-teal-700';
    default:
      return 'bg-gradient-to-br from-gray-500 to-gray-700';
  }
}

/**
 * Get icon based on section category
 */
function getCategoryIcon(category: string): string {
  switch (category) {
    case 'hero':
      return '⭐';
    case 'promo':
      return '🎉';
    case 'content':
      return '📝';
    case 'social-proof':
      return '💬';
    case 'cta':
      return '🎯';
    case 'pricing':
      return '💰';
    case 'features':
      return '✨';
    default:
      return '📦';
  }
}

