'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { EmailComponent, GlobalEmailSettings } from '@/lib/email-v2/types';
import { VisualEmailEditorV2 } from '@/components/email-editor/VisualEmailEditorV2';

export default function VisualEditorTestPage() {
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Sample email component tree
  const initialRoot: EmailComponent = {
    id: 'root',
    component: 'Container',
    props: {
      style: {
        backgroundColor: '#ffffff',
        maxWidth: '600px',
      },
    },
    children: [
      {
        id: 'header-section',
        component: 'Section',
        props: {
          style: {
            backgroundColor: '#7c3aed',
            padding: '40px 20px',
            textAlign: 'center',
          },
        },
        children: [
          {
            id: 'header-heading',
            component: 'Heading',
            props: {
              as: 'h1',
              style: {
                color: '#ffffff',
                fontSize: '32px',
                fontWeight: 'bold',
                margin: '0 0 10px 0',
              },
            },
            content: 'Welcome to Visual Email Editor',
          },
          {
            id: 'header-text',
            component: 'Text',
            props: {
              style: {
                color: '#ffffff',
                fontSize: '16px',
                margin: '0',
              },
            },
            content: 'Build beautiful emails with React Email',
          },
        ],
      },
      {
        id: 'content-section',
        component: 'Section',
        props: {
          style: {
            padding: '40px 20px',
          },
        },
        children: [
          {
            id: 'content-heading',
            component: 'Heading',
            props: {
              as: 'h2',
              style: {
                color: '#111827',
                fontSize: '24px',
                fontWeight: '600',
                margin: '0 0 20px 0',
              },
            },
            content: 'Key Features',
          },
          {
            id: 'feature-1',
            component: 'Text',
            props: {
              style: {
                color: '#374151',
                fontSize: '16px',
                lineHeight: '1.6',
                margin: '0 0 15px 0',
              },
            },
            content: '✓ Component tree navigation with expand/collapse',
          },
          {
            id: 'feature-2',
            component: 'Text',
            props: {
              style: {
                color: '#374151',
                fontSize: '16px',
                lineHeight: '1.6',
                margin: '0 0 15px 0',
              },
            },
            content: '✓ Click-to-select in live preview',
          },
          {
            id: 'feature-3',
            component: 'Text',
            props: {
              style: {
                color: '#374151',
                fontSize: '16px',
                lineHeight: '1.6',
                margin: '0 0 15px 0',
              },
            },
            content: '✓ Component inspector with style editor',
          },
          {
            id: 'feature-4',
            component: 'Text',
            props: {
              style: {
                color: '#374151',
                fontSize: '16px',
                lineHeight: '1.6',
                margin: '0 0 30px 0',
              },
            },
            content: '✓ AI-powered component refinement',
          },
          {
            id: 'cta-button',
            component: 'Button',
            props: {
              href: 'https://example.com',
              style: {
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                padding: '14px 28px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-block',
              },
            },
            content: 'Get Started',
          },
        ],
      },
      {
        id: 'footer-section',
        component: 'Section',
        props: {
          style: {
            backgroundColor: '#f9fafb',
            padding: '30px 20px',
            textAlign: 'center',
          },
        },
        children: [
          {
            id: 'footer-text',
            component: 'Text',
            props: {
              style: {
                color: '#6b7280',
                fontSize: '14px',
                margin: '0',
              },
            },
            content: '© 2025 Your Company. All rights reserved.',
          },
          {
            id: 'footer-hr',
            component: 'Hr',
            props: {
              style: {
                border: 'none',
                borderTop: '1px solid #e5e7eb',
                margin: '20px 0',
              },
            },
          },
          {
            id: 'footer-link',
            component: 'Link',
            props: {
              href: 'https://example.com/unsubscribe',
              style: {
                color: '#7c3aed',
                fontSize: '12px',
                textDecoration: 'underline',
              },
            },
            content: 'Unsubscribe',
          },
        ],
      },
    ],
  };

  const initialSettings: GlobalEmailSettings = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    primaryColor: '#7c3aed',
    maxWidth: '600px',
    backgroundColor: '#ffffff',
  };

  // Save handler
  const handleSave = async (root: EmailComponent, settings: GlobalEmailSettings) => {
    setSaveStatus('saving');
    
    try {
      // In a real app, this would call an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log('Saved email:', { root, settings });
      setSaveStatus('saved');
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Visual Email Editor Test</h1>
            <p className="text-sm text-gray-600 mt-1">
              Week 3 Demo: React Email V2 Visual Editor Integration
            </p>
          </div>
          {saveStatus !== 'idle' && (
            <div
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                saveStatus === 'saving'
                  ? 'bg-blue-100 text-blue-700'
                  : saveStatus === 'saved'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {saveStatus === 'saving' && 'Saving...'}
              {saveStatus === 'saved' && '✓ Saved'}
              {saveStatus === 'error' && '✗ Error'}
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <VisualEmailEditorV2
          initialRootComponent={initialRoot}
          initialGlobalSettings={initialSettings}
          campaignId="test-campaign"
          onSave={handleSave}
          mode="visual"
        />
      </div>
    </div>
  );
}

