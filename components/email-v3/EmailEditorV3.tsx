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
import { updateComponentText, updateInlineStyle, updateImageSrc } from '@/lib/email-v3/tsx-manipulator';

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
  const [savedTsxCode, setSavedTsxCode] = useState(initialTsxCode);
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
  
  // Visual editing state
  const [visualEdits, setVisualEdits] = useState<Map<string, Record<string, string>>>(new Map());
  const [iframeKey, setIframeKey] = useState(0);
  const [isEnteringVisualMode, setIsEnteringVisualMode] = useState(false);
  const [isExitingVisualMode, setIsExitingVisualMode] = useState(false);

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
    
    // Entering visual mode - show loading overlay
    if (newMode === 'visual') {
      setIsEnteringVisualMode(true);
      setTimeout(() => {
        setIsEnteringVisualMode(false);
      }, 600);
    }
    
    setMode(newMode);
    if (newMode === 'chat') {
      setSelectedComponentId(null);
      setHasVisualEdits(false);
      setVisualEdits(new Map());
    }
  }, [mode, hasVisualEdits]);

  // Handle component selection
  const handleComponentSelect = useCallback((componentId: string | null, position?: { top: number; left: number }) => {
    console.log('[EDITOR] Component selected:', componentId, position);
    setSelectedComponentId(componentId);
    setComponentPosition(position || null);
  }, []);

  // Send direct update to iframe (instant, no re-render, track in memory)
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
      
      // Track the edit in memory (don't update TSX yet!)
      setVisualEdits(prev => {
        const newEdits = new Map(prev);
        const componentEdits = newEdits.get(componentId) || {};
        componentEdits[property] = value;
        newEdits.set(componentId, componentEdits);
        return newEdits;
      });
      
      // Mark that we have visual edits
      setHasVisualEdits(true);
    }
  }, []);

  // Save visual edits and exit
  const handleSaveVisualEdits = useCallback(() => {
    console.log('[EDITOR] Applying visual edits to TSX');
    setIsExitingVisualMode(true);
    
    let updatedTsx = draftTsxCode;
    
    // Apply all tracked edits to TSX
    visualEdits.forEach((edits, componentId) => {
      Object.entries(edits).forEach(([property, value]) => {
        if (property === 'text' || property === 'textContent') {
          updatedTsx = updateComponentText(updatedTsx, componentMap, componentId, value);
        } else if (property === 'imageSrc') {
          // Parse image data from JSON
          try {
            const imageData = JSON.parse(value);
            updatedTsx = updateImageSrc(
              updatedTsx,
              componentMap,
              componentId,
              imageData.url,
              imageData.alt,
              imageData.width,
              imageData.height
            );
          } catch (error) {
            console.error('[EDITOR] Failed to parse image data:', error);
          }
        } else if (property === 'imageAlt') {
          // Update only alt text
          const componentInfo = componentMap[componentId];
          if (componentInfo && componentInfo.type === 'Img') {
            const componentCode = updatedTsx.substring(componentInfo.startChar, componentInfo.endChar);
            const srcMatch = componentCode.match(/src=["']([^"']+)["']/);
            if (srcMatch) {
              updatedTsx = updateImageSrc(
                updatedTsx,
                componentMap,
                componentId,
                srcMatch[1],
                value
              );
            }
          }
        } else {
          updatedTsx = updateInlineStyle(updatedTsx, componentMap, componentId, property, value);
        }
      });
    });
    
    // Update draft TSX (this will trigger re-render)
    setDraftTsxCode(updatedTsx);
    
    // Clear visual edits and exit visual mode
    setVisualEdits(new Map());
    setShowExitConfirm(false);
    setMode('chat');
    setSelectedComponentId(null);
    setHasVisualEdits(false);
    
    // Clear loading after re-render
    setTimeout(() => {
      setIsExitingVisualMode(false);
    }, 600);
  }, [visualEdits, draftTsxCode, componentMap]);

  // Discard visual edits and exit
  const handleDiscardVisualEdits = useCallback(() => {
    console.log('[EDITOR] Discarding visual edits');
    setIsExitingVisualMode(true);
    
    // Force iframe reload by incrementing key
    setIframeKey(prev => prev + 1);
    
    // Clear visual edits and exit visual mode
    setVisualEdits(new Map());
    setShowExitConfirm(false);
    setMode('chat');
    setSelectedComponentId(null);
    setHasVisualEdits(false);
    
    // Clear loading after re-render
    setTimeout(() => {
      setIsExitingVisualMode(false);
    }, 600);
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

      // Update saved state to reflect successful save
      setSavedTsxCode(draftTsxCode);
      
      console.log('✅ Campaign saved successfully');
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

  // Editor controls for header (empty - save/discard only via visual mode exit)
  const editorControls = {
    editorActions: null,
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
                        disabled={isSaving}
                        compact
                        visualEditsMode={false}
                        onVisualEditsToggle={handleModeToggle}
                        showDiscardSaveButtons={false}
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
                        onDirectUpdate={sendDirectUpdate}
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
                        disabled={isSaving}
                        compact
                        visualEditsMode={true}
                        onVisualEditsToggle={handleModeToggle}
                        showDiscardSaveButtons={false}
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
                  isSaving={isSaving}
                  isEnteringVisualMode={isEnteringVisualMode}
                  isExitingVisualMode={isExitingVisualMode}
                  iframeKey={iframeKey}
                />
                
                {/* Floating AI Toolbar (Visual Mode Only) - positioned below selected component */}
                {mode === 'visual' && selectedComponentId && componentPosition && (
                  <div 
                    className="absolute z-50 bg-[#2d2d2d] shadow-2xl rounded-xl p-2"
                    style={{
                      top: `${componentPosition.top}px`,
                      left: `${componentPosition.left}px`,
                      minWidth: '400px',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {/* AI Input */}
                      <input
                        type="text"
                        placeholder="Ask Jolti..."
                        className="flex-1 px-3 py-1.5 text-sm bg-transparent text-white placeholder-gray-400 border-none outline-none focus:outline-none"
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
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {/* Up Arrow / Submit */}
                        <button
                          className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                          onClick={() => {
                            const input = document.querySelector<HTMLInputElement>(
                              'input[placeholder="Ask Jolti..."]'
                            );
                            if (input?.value.trim()) {
                              setPrompt(input.value);
                              handleChatSubmit();
                              input.value = '';
                            }
                          }}
                        >
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        </button>
                        
                        {/* Separator */}
                        <div className="h-5 w-px bg-gray-600"></div>
                        
                        {/* Delete / Close */}
                        <button
                          className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-red-600 flex items-center justify-center transition-colors"
                          onClick={() => {
                            setSelectedComponentId(null);
                            setComponentPosition(null);
                          }}
                        >
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
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

