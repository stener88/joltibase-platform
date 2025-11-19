/**
 * Component Label Badge
 * 
 * Displays component type when selected in visual edit mode
 * Positioned at top-left of selected element
 */

'use client';

import type { ComponentType } from '@/lib/email-v2/types';
import { getComponentDescriptor } from '@/lib/email-v2/component-descriptor';

interface ComponentLabelProps {
  componentType: ComponentType;
  position: { x: number; y: number }; // Top-left corner of selected element
}

export function ComponentLabel({ componentType, position }: ComponentLabelProps) {
  const descriptor = getComponentDescriptor(componentType);
  
  return (
    <div
      className="fixed z-[101] pointer-events-none"
      style={{
        top: `${position.y - 32}px`, // Position above element
        left: `${position.x}px`,
      }}
    >
      <div className="bg-violet-600 text-white px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
        <span className="text-base leading-none">{descriptor.icon}</span>
        <span>{descriptor.displayName}</span>
      </div>
    </div>
  );
}

