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
  const [componentMap, setComponentMap] = useState<any>({});
  const [hasVisualEdits, setHasVisualEdits] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

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
    const newMode = mode === 'chat' ? 'visual' : 'chat';
    console.log('[EDITOR] Toggling mode from', mode, 'to', newMode);
    
    // If exiting visual mode with unsaved edits, show confirmation
    if (mode === 'visual' && hasVisualEdits) {
      setShowExitConfirm(true);
      return;
    }
    
    setMode(newMode);
    if (newMode === 'chat') {
      setSelectedComponentId(null);
      setHasVisualEdits(false);
    }
  }, [mode, hasVisualEdits]);

  // Handle component selection
  const handleComponentSelect = useCallback((componentId: string | null, position?: { top: number; left: number }) => {
    console.log('[EDITOR] Component selected:', componentId, position);
    setSelectedComponentId(componentId);
    setComponentPosition(position || null);
  }, []);

  // Handle direct TSX update (from PropertiesPanel)
  const handleTsxUpdate = useCallback((newTsxCode: string) => {
    setDraftTsxCode(newTsxCode);
  }, []);

  // Send direct update to iframe (instant, no re-render)
  const sendDirectUpdate = useCallback((componentId: string, property: string, value: string) => {
    // Access the sendDirectUpdate function exposed by LivePreview
    const livePreviewUpdate = (window as any).__livePreviewSendDirectUpdate;
    if (livePreviewUpdate) {
      livePreviewUpdate({
        type: 'direct-update',
        componentId,
        property,
        value,
      });
      
      // Mark that we have visual edits
      setHasVisualEdits(true);
    }
  }, []);

  // Save visual edits and exit
  const handleSaveVisualEdits = useCallback(() => {
    console.log('[EDITOR] Saving visual edits');
    // TODO: Update draftTsxCode with the visual edits using tsx-manipulator
    setShowExitConfirm(false);
    setMode('chat');
    setSelectedComponentId(null);
    setHasVisualEdits(false);
  }, []);

  // Discard visual edits and exit
  const handleDiscardVisualEdits = useCallback(() => {
    console.log('[EDITOR] Discarding visual edits');
    // TODO: Reload iframe to reset visual changes
    setShowExitConfirm(false);
    setMode('chat');
    setSelectedComponentId(null);
    setHasVisualEdits(false);
    // Trigger re-render to reset iframe
    setDraftTsxCode(draftTsxCode);
  }, [draftTsxCode]);

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
      {/* Exit Visual Mode Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">Save visual edits?</h3>
            <p className="text-sm text-gray-600 mb-6">
              You have unsaved visual edits. Do you want to save them before switching modes?
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleDiscardVisualEdits}
              >
                Discard Changes
              </Button>
              <Button
                onClick={handleSaveVisualEdits}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

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
                        componentMap={componentMap}
                        onTsxUpdate={handleTsxUpdate}
                        onDirectUpdate={sendDirectUpdate}
                        onBackToChat={() => setMode('chat')}
                      />
                    </div>

                    {/* Prompt Input (also in visual mode) */}
                    <div className="border-t p-4">
                      {hasVisualEdits && (
                        <div className="mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800 flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            You have unsaved visual edits. Switch to chat mode to save or discard.
                          </p>
                        </div>
                      )}
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
                  onComponentMapUpdate={setComponentMap}
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

