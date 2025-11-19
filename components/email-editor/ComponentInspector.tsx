'use client';

import { useState } from 'react';
import { Code, Palette, Type, Box, AlertCircle } from 'lucide-react';
import type { EmailComponent } from '@/lib/email-v2/types';
import { getComponentPropDocs, getEditableStyleProps } from '@/lib/email-v2';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ComponentInspectorProps {
  component: EmailComponent | null;
  onUpdate: (updates: Partial<EmailComponent>) => void;
  onAIEdit?: (prompt: string) => void;
}

export function ComponentInspector({
  component,
  onUpdate,
  onAIEdit,
}: ComponentInspectorProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'props' | 'ai'>('content');
  const [aiPrompt, setAiPrompt] = useState('');

  if (!component) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center text-gray-500">
          <Box size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Select a component to inspect</p>
        </div>
      </div>
    );
  }

  const propDocs = getComponentPropDocs(component.component);
  const editableStyles = getEditableStyleProps(component.component);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{getComponentIcon(component.component)}</span>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">{component.component}</h3>
            <p className="text-xs text-gray-500">ID: {component.id}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-3">
          <TabButton
            active={activeTab === 'content'}
            onClick={() => setActiveTab('content')}
            icon={<Type size={14} />}
            label="Content"
          />
          <TabButton
            active={activeTab === 'style'}
            onClick={() => setActiveTab('style')}
            icon={<Palette size={14} />}
            label="Style"
          />
          <TabButton
            active={activeTab === 'props'}
            onClick={() => setActiveTab('props')}
            icon={<Code size={14} />}
            label="Props"
          />
          <TabButton
            active={activeTab === 'ai'}
            onClick={() => setActiveTab('ai')}
            icon={<AlertCircle size={14} />}
            label="AI Edit"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'content' && (
          <ContentTab component={component} onUpdate={onUpdate} />
        )}
        {activeTab === 'style' && (
          <StyleTab component={component} onUpdate={onUpdate} editableStyles={editableStyles} />
        )}
        {activeTab === 'props' && (
          <PropsTab component={component} onUpdate={onUpdate} propDocs={propDocs} />
        )}
        {activeTab === 'ai' && (
          <AIEditTab
            component={component}
            prompt={aiPrompt}
            setPrompt={setAiPrompt}
            onAIEdit={onAIEdit}
          />
        )}
      </div>
    </div>
  );
}

// Tab button component
function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors
        ${active
          ? 'bg-violet-100 text-violet-700'
          : 'text-gray-600 hover:bg-gray-100'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// Content tab
function ContentTab({
  component,
  onUpdate,
}: {
  component: EmailComponent;
  onUpdate: (updates: Partial<EmailComponent>) => void;
}) {
  if (!component.content && component.component !== 'Text' && component.component !== 'Heading' && component.component !== 'Button') {
    return (
      <div className="text-sm text-gray-500">
        This component doesn't have editable content.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          value={component.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          rows={4}
          placeholder="Enter content..."
        />
      </div>

      {component.component === 'Button' && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Link URL
          </label>
          <Input
            value={component.props?.href || ''}
            onChange={(e) => onUpdate({
              props: { ...component.props, href: e.target.value }
            })}
            placeholder="https://..."
            className="text-sm"
          />
        </div>
      )}

      {component.component === 'Link' && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Link URL
          </label>
          <Input
            value={component.props?.href || ''}
            onChange={(e) => onUpdate({
              props: { ...component.props, href: e.target.value }
            })}
            placeholder="https://..."
            className="text-sm"
          />
        </div>
      )}

      {component.component === 'Img' && (
        <>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <Input
              value={component.props?.src || ''}
              onChange={(e) => onUpdate({
                props: { ...component.props, src: e.target.value }
              })}
              placeholder="https://..."
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Alt Text
            </label>
            <Input
              value={component.props?.alt || ''}
              onChange={(e) => onUpdate({
                props: { ...component.props, alt: e.target.value }
              })}
              placeholder="Image description..."
              className="text-sm"
            />
          </div>
        </>
      )}
    </div>
  );
}

// Style tab
function StyleTab({
  component,
  onUpdate,
  editableStyles,
}: {
  component: EmailComponent;
  onUpdate: (updates: Partial<EmailComponent>) => void;
  editableStyles: string[];
}) {
  const currentStyle = component.props?.style || {};

  const updateStyle = (key: string, value: string) => {
    onUpdate({
      props: {
        ...component.props,
        style: {
          ...currentStyle,
          [key]: value,
        },
      },
    });
  };

  // Common style properties
  const commonStyles = [
    { key: 'color', label: 'Text Color', type: 'color' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'fontSize', label: 'Font Size', type: 'text', placeholder: '16px' },
    { key: 'fontWeight', label: 'Font Weight', type: 'select', options: ['normal', 'bold', '600', '700'] },
    { key: 'textAlign', label: 'Text Align', type: 'select', options: ['left', 'center', 'right'] },
    { key: 'padding', label: 'Padding', type: 'text', placeholder: '20px' },
    { key: 'margin', label: 'Margin', type: 'text', placeholder: '0 auto' },
  ];

  return (
    <div className="space-y-3">
      {commonStyles.map(({ key, label, type, placeholder, options }) => {
        if (!editableStyles.includes(key)) return null;

        return (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {label}
            </label>
            {type === 'color' ? (
              <div className="flex gap-2">
                <input
                  type="color"
                  value={currentStyle[key] || '#000000'}
                  onChange={(e) => updateStyle(key, e.target.value)}
                  className="h-9 w-12 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={currentStyle[key] || ''}
                  onChange={(e) => updateStyle(key, e.target.value)}
                  placeholder="#000000"
                  className="text-sm flex-1"
                />
              </div>
            ) : type === 'select' ? (
              <select
                value={currentStyle[key] || ''}
                onChange={(e) => updateStyle(key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Default</option>
                {options!.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                value={currentStyle[key] || ''}
                onChange={(e) => updateStyle(key, e.target.value)}
                placeholder={placeholder}
                className="text-sm"
              />
            )}
          </div>
        );
      })}

      <div className="pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Raw Style Object (JSON)</p>
        <textarea
          value={JSON.stringify(currentStyle, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              onUpdate({
                props: {
                  ...component.props,
                  style: parsed,
                },
              });
            } catch {
              // Invalid JSON, ignore
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs font-mono focus:outline-none focus:ring-2 focus:ring-violet-500"
          rows={6}
        />
      </div>
    </div>
  );
}

// Props tab
function PropsTab({
  component,
  onUpdate,
  propDocs,
}: {
  component: EmailComponent;
  onUpdate: (updates: Partial<EmailComponent>) => void;
  propDocs: any;
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-gray-500 mb-2">Component Props (JSON)</p>
        <textarea
          value={JSON.stringify(component.props || {}, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              onUpdate({ props: parsed });
            } catch {
              // Invalid JSON, ignore
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs font-mono focus:outline-none focus:ring-2 focus:ring-violet-500"
          rows={10}
        />
      </div>

      {propDocs && (
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-700 mb-2">Available Props</p>
          <div className="text-xs text-gray-600 space-y-1">
            {propDocs.commonProps && (
              <p>Common: {propDocs.commonProps.join(', ')}</p>
            )}
            {propDocs.styleProps && (
              <p>Style: {propDocs.styleProps.join(', ')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// AI Edit tab
function AIEditTab({
  component,
  prompt,
  setPrompt,
  onAIEdit,
}: {
  component: EmailComponent;
  prompt: string;
  setPrompt: (prompt: string) => void;
  onAIEdit?: (prompt: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm text-gray-700 mb-3">
          Describe how you'd like to edit this {component.component.toLowerCase()}:
        </p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          rows={6}
          placeholder="E.g., 'Make the text larger and change the color to blue'"
        />
      </div>

      <Button
        onClick={() => {
          if (onAIEdit && prompt.trim()) {
            onAIEdit(prompt);
            setPrompt('');
          }
        }}
        disabled={!prompt.trim() || !onAIEdit}
        className="w-full"
      >
        Apply AI Edit
      </Button>

      <div className="pt-3 border-t border-gray-200">
        <p className="text-xs font-medium text-gray-700 mb-2">Example Prompts:</p>
        <div className="space-y-2">
          {getExamplePrompts(component.component).map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              className="block w-full text-left px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getComponentIcon(component: string): string {
  const icons: Record<string, string> = {
    Container: '📦',
    Section: '📄',
    Row: '↔️',
    Column: '▓',
    Heading: 'H',
    Text: 'T',
    Button: '🔘',
    Img: '🖼️',
    Link: '🔗',
    Hr: '➖',
  };
  return icons[component] || '•';
}

function getExamplePrompts(component: string): string[] {
  const prompts: Record<string, string[]> = {
    Heading: [
      'Make this heading larger and bold',
      'Change the color to a vibrant purple',
      'Center align this heading',
    ],
    Text: [
      'Make the text slightly larger',
      'Change the text color to dark gray',
      'Add more line height for readability',
    ],
    Button: [
      'Make the button larger with more padding',
      'Change the background color to green',
      'Make the button full width',
    ],
    Section: [
      'Add more padding to this section',
      'Change the background color to light gray',
      'Center all content in this section',
    ],
    Img: [
      'Make the image wider',
      'Center the image',
      'Add rounded corners to the image',
    ],
  };
  return prompts[component] || ['Describe your edit...'];
}

