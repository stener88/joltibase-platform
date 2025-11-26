'use client';

import { useState, useCallback } from 'react';
import { SplitScreenLayout } from '@/components/campaigns/SplitScreenLayout';
import { PromptInput } from '@/components/campaigns/PromptInput';
import { Button } from '@/components/ui/button';
import { LivePreview } from './LivePreview';
import { PropertiesPanel } from './PropertiesPanel';
import { ChatHistory } from './ChatHistory';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EmailEditorV3Props {
  campaignId: string;
  initialTsxCode: string;
  initialHtmlContent: string;
  campaignName: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type EditMode = 'chat' | 'visual';

export function EmailEditorV3({
  campaignId,
  initialTsxCode,
  initialHtmlContent,
  campaignName,
}: EmailEditorV3Props) {
  const router = useRouter();

  // State management
  const [savedTsxCode] = useState(initialTsxCode);
  const [draftTsxCode, setDraftTsxCode] = useState(initialTsxCode);
  const [mode, setMode] = useState<EditMode>('chat');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [componentPosition, setComponentPosition] = useState<{ top: number; left: number } | null>(null);

  // Derived state
  const hasUnsavedChanges = draftTsxCode !== savedTsxCode;

  // Handle chat submission (AI-based edits)
  const handleChatSubmit = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');
    setIsGenerating(true);

    try {
      // Call AI to modify TSX
      const response = await fetch('/api/v3/campaigns/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          currentTsxCode: draftTsxCode,
          userMessage: prompt,
        }),
      });

      const { tsxCode: newTsxCode, message } = await response.json();

      // Update draft (not database)
      setDraftTsxCode(newTsxCode);

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: message || 'Updated the email as requested.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to generate:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, isGenerating, draftTsxCode, campaignId]);

  // Handle mode toggle
  const handleModeToggle = useCallback(() => {
    setMode((prev) => (prev === 'chat' ? 'visual' : 'chat'));
    if (mode === 'visual') {
      setSelectedComponentId(null);
    }
  }, [mode]);

  // Handle component selection
  const handleComponentSelect = useCallback((componentId: string | null, position?: { top: number; left: number }) => {
    setSelectedComponentId(componentId);
    setComponentPosition(position || null);
  }, []);

  // Handle direct TSX update (from PropertiesPanel)
  const handleTsxUpdate = useCallback((newTsxCode: string) => {
    setDraftTsxCode(newTsxCode);
  }, []);

  // Handle save
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    
    try {
      // Render TSX to HTML
      const renderResponse = await fetch('/api/v3/campaigns/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tsxCode: draftTsxCode }),
      });

      if (!renderResponse.ok) {
        const errorText = await renderResponse.text();
        throw new Error(`Render failed: ${errorText}`);
      }
      
      const renderData = await renderResponse.json();

      // Update campaign in database
      const updateResponse = await fetch(`/api/v3/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          component_code: draftTsxCode,
          html_content: renderData.html,
        }),
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Update failed: ${errorText}`);
      }

      // Redirect back to campaigns list
      router.push('/dashboard/campaigns');
    } catch (error: any) {
      console.error('Failed to save:', error);
      alert(`Failed to save changes: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [draftTsxCode, campaignId, router]);

  // Handle discard
  const handleDiscard = useCallback(() => {
    if (confirm('Are you sure you want to discard all changes?')) {
      setDraftTsxCode(savedTsxCode);
      setMessages([]);
      setSelectedComponentId(null);
    }
  }, [savedTsxCode]);

  // Editor controls for header
  const editorControls = {
    editorActions: (
      <div className="flex items-center gap-2">
        {hasUnsavedChanges && (
          <>
            <span className="text-sm text-gray-600">Unsaved changes</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDiscard}
              disabled={isSaving}
            >
              <X className="w-4 h-4 mr-1" />
              Discard
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-1" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        )}
      </div>
    ),
  };

  return (
    <DashboardLayout campaignEditor={editorControls}>
      <div className="relative h-full w-full">
        {/* Main Editor */}
        <div className="h-[calc(100vh-3rem)]">
          <SplitScreenLayout
            leftPanel={
              <div className="flex flex-col h-full">
                {/* Left Panel Content */}
                {mode === 'chat' ? (
                  <>
                    {/* Chat History */}
                    <div className="flex-1 overflow-y-auto">
                      <ChatHistory messages={messages} isGenerating={isGenerating} />
                    </div>

                    {/* Chat Input */}
                    <div className="border-t p-4">
                      <PromptInput
                        value={prompt}
                        onChange={setPrompt}
                        onSubmit={handleChatSubmit}
                        isLoading={isGenerating}
                        disabled={hasUnsavedChanges && isSaving}
                        compact
                        visualEditsMode={false}
                        onVisualEditsToggle={handleModeToggle}
                        showDiscardSaveButtons={hasUnsavedChanges}
                      />
                    </div>
                  </>
                ) : mode === 'visual' ? (
                  <>
                    {/* Visual Mode - Properties Panel */}
                    <div className="flex-1 overflow-y-auto">
                      <PropertiesPanel
                        tsxCode={draftTsxCode}
                        selectedComponentId={selectedComponentId}
                        onTsxUpdate={handleTsxUpdate}
                        onBackToChat={() => setMode('chat')}
                      />
                    </div>

                    {/* Prompt Input (also in visual mode) */}
                    <div className="border-t p-4">
                      <PromptInput
                        value={prompt}
                        onChange={setPrompt}
                        onSubmit={handleChatSubmit}
                        isLoading={isGenerating}
                        disabled={hasUnsavedChanges && isSaving}
                        compact
                        visualEditsMode={true}
                        onVisualEditsToggle={handleModeToggle}
                        showDiscardSaveButtons={hasUnsavedChanges}
                      />
                    </div>
                  </>
                ) : null}
              </div>
            }
            rightPanel={
              <div className="relative h-full">
                <LivePreview
                  tsxCode={draftTsxCode}
                  mode={mode}
                  selectedComponentId={selectedComponentId}
                  hoveredComponentId={hoveredComponentId}
                  onComponentSelect={handleComponentSelect}
                  onComponentHover={setHoveredComponentId}
                  isGenerating={isGenerating}
                />
                
                {/* Floating AI Toolbar (Visual Mode Only) - positioned below selected component */}
                {mode === 'visual' && selectedComponentId && componentPosition && (
                  <div 
                    className="absolute z-50 bg-white shadow-lg rounded border border-gray-300 p-2"
                    style={{
                      top: `${componentPosition.top}px`,
                      left: `${componentPosition.left}px`,
                      maxWidth: '300px',
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="AI edit..."
                        className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.currentTarget.value;
                            if (input.trim()) {
                              setPrompt(input);
                              handleChatSubmit();
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => {
                          const input = document.querySelector<HTMLInputElement>(
                            'input[placeholder="AI edit..."]'
                          );
                          if (input?.value.trim()) {
                            setPrompt(input.value);
                            handleChatSubmit();
                            input.value = '';
                          }
                        }}
                      >
                        →
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            }
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

