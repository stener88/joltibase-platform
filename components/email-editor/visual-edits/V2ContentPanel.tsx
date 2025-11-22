/**
 * V2 Content Panel
 * 
 * Manual controls for editing V2 component content properties
 * Works with component-descriptor properties
 */

'use client';

import { useState, useEffect } from 'react';
import type { ComponentType, EmailComponent } from '@/lib/email-v2/types';
import { getPropertiesByCategory, type EditableProperty } from '@/lib/email-v2/component-descriptor';

interface V2ContentPanelProps {
  component: EmailComponent;
  position: { x: number; y: number };
  onUpdate: (updates: { props?: Record<string, any>; content?: string }) => void;
  onLivePreview?: (updates: any) => void; // NEW: For live preview without React re-renders
}

export function V2ContentPanel({ component, position, onUpdate, onLivePreview }: V2ContentPanelProps) {
  const contentProperties = getPropertiesByCategory(component.component, 'content');
  const [values, setValues] = useState<Record<string, any>>({
    content: component.content || '',
    ...component.props,
  });

  console.log('=== V2ContentPanel Render ===');
  console.log('component prop:', JSON.parse(JSON.stringify(component)));
  console.log('values state:', values);

  useEffect(() => {
    console.log('=== V2ContentPanel useEffect triggered ===');
    console.log('Resetting values to component:', {
      content: component.content,
      props: component.props,
    });
    setValues({
      content: component.content || '',
      ...component.props,
    });
  }, [component.id, component.content, component.props]);

  const handleChange = (key: string, value: any) => {
    console.log(`[V2ContentPanel] handleChange: ${key} = ${value}`);
    setValues({ ...values, [key]: value });
    
    // Send live preview instead of onUpdate (prevents iframe reload)
    if (onLivePreview) {
      const updates: any = {};
      if (key === 'content') {
        updates.content = value;
      } else {
        updates.props = { [key]: value };
      }
      console.log('[V2ContentPanel] Sending live preview:', updates);
      onLivePreview(updates);
    }
    
    // Don't call onUpdate here - only on Save button
  };

  if (contentProperties.length === 0) {
    return null;
  }

  return (
    <div
      data-manual-panel
      className="fixed bg-[#2d2d2d] rounded-xl shadow-2xl border border-gray-700 z-[99] p-3 min-w-[350px] max-w-[450px]"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >      
      <div className="space-y-2.5">
        {contentProperties.map((prop) => {
          const key = prop.key.replace('props.', '');
          const currentValue = key === 'content' ? values.content : (values[key] || prop.defaultValue || '');
          
          return (
            <div key={prop.key} className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                {prop.label}
              </label>
              
              {prop.type === 'text' && (
                <input
                  type="text"
                  value={currentValue}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#3d3d3d] border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
                />
              )}
              
              {prop.type === 'textarea' && (
                <textarea
                  value={currentValue}
                  onChange={(e) => handleChange(key, e.target.value)}
                  rows={3}
                  className="w-full px-2.5 py-1.5 bg-[#3d3d3d] border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 resize-none"
                />
              )}
              
              {prop.type === 'url' && (
                <input
                  type="url"
                  value={currentValue}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-2.5 py-1.5 bg-[#3d3d3d] border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
                />
              )}
              
              {prop.type === 'select' && prop.options && (
                <select
                  value={currentValue}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#3d3d3d] border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 cursor-pointer"
                >
                  {prop.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
              
              {prop.type === 'number' && (
                <input
                  type="number"
                  value={currentValue}
                  onChange={(e) => handleChange(key, parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-[#3d3d3d] border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

