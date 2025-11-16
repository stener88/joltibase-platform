'use client';

import { getAllSections } from '@/lib/email/sections';
import { renderBlocksToEmail } from '@/lib/email/blocks';

interface SectionLibraryPanelProps {
  onInsertSection: (sectionId: string) => void;
}

/**
 * Section Library Panel Component
 * 
 * Single scrollable list of all section templates
 */
export function SectionLibraryPanel({ onInsertSection }: SectionLibraryPanelProps) {
  const allSections = getAllSections();
  
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">
          Layout Templates
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {allSections.length} template{allSections.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {allSections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
            <div className="text-gray-400 mb-3">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              No templates available
            </h4>
            <p className="text-xs text-gray-500 max-w-xs">
              Section templates will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {allSections.map((section) => (
              <button
                key={section.id}
                onClick={() => onInsertSection(section.id)}
                className="w-full border-2 border-gray-200 rounded-lg overflow-hidden hover:border-[#e9a589] transition-all group"
              >
                {/* Visual Preview */}
                <div className="relative bg-gray-50 p-4 aspect-[4/3] overflow-hidden">
                  <div 
                    className="scale-[0.35] origin-top-left w-[285%] h-[285%] pointer-events-none"
                    dangerouslySetInnerHTML={{
                      __html: renderBlocksToEmail(section.blocks, {
                        backgroundColor: '#ffffff',
                        contentBackgroundColor: '#ffffff',
                        maxWidth: 600,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        mobileBreakpoint: 480,
                      })
                    }}
                  />
                </div>
                
                {/* Section Info */}
                <div className="p-3 bg-white border-t border-gray-200 group-hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-sm text-gray-900 text-left">
                    {section.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-left">
                    {section.blocks.length} block{section.blocks.length !== 1 ? 's' : ''} • {section.designStyle}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

