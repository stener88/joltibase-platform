'use client';

import { useState, useCallback, useRef } from 'react';
import type { EmailComponent, GlobalEmailSettings } from '@/lib/email-v2/types';
import { useV2Editor } from '@/hooks/use-v2-editor';
import { ComponentTree } from './ComponentTree';
import { ComponentInspector } from './ComponentInspector';
import { getComponentPath } from '@/lib/email-v2';
import { ChatInterface, type ChatMessage, type ChatInterfaceRef } from '@/components/campaigns/ChatInterface';

interface VisualEmailEditorV2Props {
  initialRootComponent: EmailComponent;
  initialGlobalSettings: GlobalEmailSettings;
  campaignId: string;
  onSave?: (root: EmailComponent, settings: GlobalEmailSettings) => Promise<void>;
  mode?: 'chat' | 'visual';
}

export function VisualEmailEditorV2({
  initialRootComponent,
  initialGlobalSettings,
  campaignId,
  onSave,
  mode = 'visual',
}: VisualEmailEditorV2Props) {
  const editor = useV2Editor(initialRootComponent, initialGlobalSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isAIRefining, setIsAIRefining] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatInterfaceRef = useRef<ChatInterfaceRef>(null);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave(editor.rootComponent, editor.globalSettings);
      editor.markAsSaved();
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  }, [editor, onSave]);

  // Handle AI refinement for selected component
  const handleAIRefine = useCallback(
    async (prompt: string) => {
      if (!editor.selectedComponentId) {
        console.error('No component selected');
        return;
      }

      setIsAIRefining(true);
      
      // Add user message to chat
      const userMessage: ChatMessage = {
        role: 'user',
        content: prompt,
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, userMessage]);

      try {
        // Get component path
        const componentPath = getComponentPath(editor.rootComponent, editor.selectedComponentId);
        
        if (!componentPath) {
          throw new Error('Could not find component path');
        }

        const response = await fetch('/api/ai/refine-component', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campaignId,
            componentPath,
            prompt,
          }),
        });

        const result = await response.json();

        if (result.success && result.rootComponent) {
          editor.setRootComponent(result.rootComponent);
          
          // Add success message to chat
          const assistantMessage: ChatMessage = {
            role: 'assistant',
            content: `✓ Updated component successfully`,
            timestamp: new Date(),
          };
          setChatHistory(prev => [...prev, assistantMessage]);
        } else {
          throw new Error(result.error || 'AI refinement failed');
        }
      } catch (error) {
        console.error('AI refinement error:', error);
        
        // Add error message to chat
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: `✗ Failed to update: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: new Date(),
        };
        setChatHistory(prev => [...prev, errorMessage]);
      } finally {
        setIsAIRefining(false);
      }
    },
    [editor, campaignId]
  );

  // Handle full email AI generation/refinement (chat mode)
  const handleChatSubmit = useCallback(
    async (message: string) => {
      setIsAIRefining(true);
      
      // Add user message
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, userMessage]);

      try {
        const response = await fetch('/api/ai/generate-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campaignId,
            prompt: message,
          }),
        });

        const result = await response.json();

        if (result.success && result.rootComponent) {
          editor.setRootComponent(result.rootComponent);
          
          const assistantMessage: ChatMessage = {
            role: 'assistant',
            content: `✓ Generated new email with ${result.metadata?.componentCount || 'multiple'} components`,
            timestamp: new Date(),
          };
          setChatHistory(prev => [...prev, assistantMessage]);
        } else {
          throw new Error(result.error || 'Generation failed');
        }
      } catch (error) {
        console.error('Chat generation error:', error);
        
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: `✗ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: new Date(),
        };
        setChatHistory(prev => [...prev, errorMessage]);
      } finally {
        setIsAIRefining(false);
      }
    },
    [editor, campaignId]
  );

  // Get selected component
  const selectedComponent = editor.getSelectedComponent();

  if (mode === 'chat') {
    // Chat mode: Similar to existing chat interface
    return (
      <div className="h-full flex">
        {/* Chat interface (left) */}
        <div className="flex-1 flex flex-col">
          <ChatInterface
            ref={chatInterfaceRef}
            campaignId={campaignId}
            onRefine={handleChatSubmit}
            isRefining={isAIRefining}
            chatHistory={chatHistory}
          />
        </div>
      </div>
    );
  }

  // Visual mode: Component tree + preview + inspector
  return (
    <div className="h-full flex bg-gray-50">
      {/* Left sidebar: Component Tree */}
      <div className="w-64 border-r border-gray-200 bg-white overflow-hidden flex flex-col">
        <ComponentTree
          rootComponent={editor.rootComponent}
          selectedId={editor.selectedComponentId || undefined}
          onSelectComponent={editor.selectComponent}
          onMoveUp={(id) => editor.moveComponent(id, 'up')}
          onMoveDown={(id) => editor.moveComponent(id, 'down')}
          onDuplicate={editor.duplicateComponent}
          onDelete={editor.deleteComponent}
        />
      </div>

      {/* Right sidebar: Component Inspector with AI Edit */}
      <div className="w-80 border-l border-gray-200 bg-white overflow-hidden flex flex-col">
        <ComponentInspector
          component={selectedComponent}
          onUpdate={(updates) => {
            if (editor.selectedComponentId) {
              editor.updateComponent(editor.selectedComponentId, updates);
            }
          }}
          onAIEdit={handleAIRefine}
        />
      </div>

      {/* AI refinement loading overlay */}
      {isAIRefining && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
              <div>
                <p className="font-medium text-gray-900">AI is working...</p>
                <p className="text-sm text-gray-600">This may take a few seconds</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

