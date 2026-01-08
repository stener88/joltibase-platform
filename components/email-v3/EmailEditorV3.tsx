'use client';

import { useState, useCallback, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { SplitScreenLayout } from '@/components/campaigns/SplitScreenLayout';
import { PromptInput } from '@/components/campaigns/PromptInput';
import { Button } from '@/components/ui/button';
import { LivePreview } from './LivePreview';
import { PropertiesPanel } from './PropertiesPanel';
import { ChatHistory } from './ChatHistory';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Save, X, Sparkles, Monitor, Smartphone, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateComponentText, updateInlineStyle, updateImageSrc } from '@/lib/email-v3/tsx-manipulator';
import { parseAndInjectIds, findParentComponent, type ComponentMap } from '@/lib/email-v3/tsx-parser';
import { Z_INDEX } from '@/lib/ui-constants';
import type { CodeChange } from '@/lib/email-v3/diff-generator';
import type { BrandIdentity } from '@/lib/types/brand';
import { useBrandSettings } from './hooks/useBrandSettings';
import { useChatRefinement } from './hooks/useChatRefinement';
import { useVisualEdits } from './hooks/useVisualEdits';
import { useModeToggle } from './hooks/useModeToggle';

interface EmailEditorV3Props {
  campaignId: string;
  initialTsxCode: string;
  initialHtmlContent: string;
  campaignName: string;
  generationPrompt?: string | null;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  changes?: CodeChange[]; // For showing what the AI modified
  intent?: 'question' | 'command'; // Track if it was a question or command
}

export type EditMode = 'chat' | 'visual';

// ========================================
// 🔧 UTILITIES: Debounce function
// ========================================
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// ========================================
// 📝 TYPES: Optimistic edit tracking
// ========================================
interface OptimisticEdit {
  componentId: string;
  property: string;
  value: string;
  timestamp: number;
}


export function EmailEditorV3({
  campaignId,
  initialTsxCode,
  initialHtmlContent,
  campaignName,
  generationPrompt,
}: EmailEditorV3Props) {
  const router = useRouter();

  // Initialize chat history with original prompt if available
  const initialChatMessages = generationPrompt ? [
    {
      id: 'initial-prompt',
      role: 'user' as const,
      content: generationPrompt,
    },
    {
      id: 'initial-response',
      role: 'assistant' as const,
      content: "I've created your email based on your request. How would you like to refine it?",
    },
  ] : [];

  // State management
  const [savedTsxCode, setSavedTsxCode] = useState(initialTsxCode);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [componentPosition, setComponentPosition] = useState<{ top: number; left: number } | null>(null);
  const [componentMap, setComponentMap] = useState<any>({});
  const [hasVisualEdits, setHasVisualEdits] = useState(false);
  
  // Mode management hook
  const {
    mode,
    setMode,
    showExitConfirm,
    isEnteringVisualMode,
    isExitingVisualMode,
    toggleMode,
    confirmExit,
    cancelExit,
  } = useModeToggle({
    onModeChange: (newMode) => {
      if (newMode === 'chat') {
        setSelectedComponentId(null);
        setHasVisualEdits(false);
      }
    },
  });
  const [floatingPrompt, setFloatingPrompt] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [hasShownBrandPrompt, setHasShownBrandPrompt] = useState(false);
  const [toolbarStatus, setToolbarStatus] = useState<{
    type: 'idle' | 'loading' | 'error' | 'success';
    message?: string;
  }>({ type: 'idle' });
  
  // Preview mode state: 'desktop' or 'mobile'
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // ========================================
  // ✅ ARCHITECTURE: Single tsxCode state (no undo/redo)
  // ========================================
  const [tsxCode, setTsxCode] = useState(initialTsxCode);
  const [tsxCodeSource, setTsxCodeSource] = useState<'initial' | 'visual' | 'ai'>('initial');
  
  // Visual editing hook
  const { displayTsx, sendDirectUpdate: sendVisualUpdate, flushPendingEdits } = useVisualEdits({
    tsxCode,
    onCommit: (newCode: string) => {
      setTsxCode(newCode);
      setTsxCodeSource('visual');
    },
  });
      
  // Commit logic now handled by useVisualEdits hook

  // ========================================
  // 🔧 REFS: Essential refs for editor functionality
  // ========================================
  // ✅ Floating toolbar input ref - for focus management
  const floatingToolbarInputRef = useRef<HTMLInputElement>(null);

  // ✅ Sync function ref - for updating iframe selection without useEffect
  const syncSelectionRef = useRef<((id: string | null) => void) | null>(null);
  
  // Stable callback for iframe ready
  const handleIframeReady = useCallback((syncFn: (id: string | null) => void) => {
    syncSelectionRef.current = syncFn;
  }, []);

  // Brand settings hook
  const { brandSettings, onBrandSettingsSave } = useBrandSettings();

  // Chat refinement hook
  const {
    messages,
    input,
    setInput,
    isGenerating,
    messageMetadata,
    handleChatSubmit,
  } = useChatRefinement({
    campaignId,
    initialMessages: initialChatMessages,
    onCodeUpdate: (newCode: string) => {
      setTsxCode(newCode);
      setTsxCodeSource('ai');
    },
    getCurrentCode: () => tsxCode,
    selectedComponentId,
    componentMap,
    brandSettings,
  });

  // Set mounted state for Portal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show brand prompt after first successful generation
  useEffect(() => {
    if (messages.length > 2 && !brandSettings && !hasShownBrandPrompt) {
      setHasShownBrandPrompt(true);
    }
  }, [messages.length, brandSettings, hasShownBrandPrompt]);

  // Derived state
  const hasUnsavedChanges = tsxCode !== savedTsxCode;

  // ✅ Focus floating toolbar input when component is selected (synchronous, no flicker)
  useLayoutEffect(() => {
    if (selectedComponentId && floatingToolbarInputRef.current) {
      floatingToolbarInputRef.current.focus();
    }
  }, [selectedComponentId]);

  // ✅ Clear floating prompt and toolbar status when switching components
  useEffect(() => {
    if (selectedComponentId) {
      setFloatingPrompt('');
      setToolbarStatus({ type: 'idle' });
    }
  }, [selectedComponentId]);

  // Wrapper for toolbar-specific chat submissions
  const handleToolbarSubmit = useCallback(async (customPrompt: string) => {
      setToolbarStatus({ type: 'loading' });
    
    try {
      const result = await handleChatSubmit(customPrompt, 'toolbar');

      if (result.success) {
          setToolbarStatus({ type: 'success' });
          setTimeout(() => setToolbarStatus({ type: 'idle' }), 2000);
        } else {
          setToolbarStatus({ 
            type: 'error',
          message: result.message || "Couldn't make that change" 
          });
      }
    } catch (error: any) {
        setToolbarStatus({ 
          type: 'error', 
          message: 'Something went wrong. Try again.' 
        });
    }
  }, [handleChatSubmit]);

  // Handle mode toggle
  // Mode toggle wrapper
  const handleModeToggle = useCallback(() => {
    toggleMode(tsxCode, hasUnsavedChanges);
  }, [toggleMode, tsxCode, hasUnsavedChanges]);

  // Handle component selection
  const handleComponentSelect = useCallback((componentId: string | null, position?: { top: number; left: number }) => {
    if (componentId !== selectedComponentId) {
      // Selecting a different component
      setSelectedComponentId(componentId);
      setComponentPosition(position || null);
    } else if (componentId) {
      // Same component clicked - manually refocus the input
      setTimeout(() => {
        floatingToolbarInputRef.current?.focus();
      }, 0);
    }
  }, [selectedComponentId]);

  // Visual editing now handled by useVisualEdits hook
  // Wrap to track hasVisualEdits state
  const sendDirectUpdate = useCallback((componentId: string, property: string, value: string) => {
    sendVisualUpdate(componentId, property, value);
    setHasVisualEdits(true);
  }, [sendVisualUpdate]);

  // Save visual edits and exit (commit to DB)
  const handleSaveVisualEdits = useCallback(async () => {
    // ✅ CRITICAL: Flush any pending debounced edits
    flushPendingEdits();
    
    // ✅ CRITICAL: Use displayTsx which includes ALL edits (even uncommitted optimistic ones)
    const updatedCode = displayTsx;
    
    // Exit visual mode via hook
    confirmExit();
    setSelectedComponentId(null);
    setHasVisualEdits(false);
    
    // Persist to database
    setIsSaving(true);
    try {
      // Render TSX to HTML
      const renderResponse = await fetch('/api/v3/campaigns/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tsxCode: updatedCode }),
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
          component_code: updatedCode,
          html_content: renderData.html,
        }),
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Update failed: ${errorText}`);
      }

      // ✅ Update React state to match what we saved
      setTsxCode(updatedCode);
      setSavedTsxCode(updatedCode);
      
      // ✅ No page reload - user can continue editing!
      // router.refresh() will be called before navigation instead
    } catch (error: any) {
      console.error('Failed to save visual edits:', error);
      alert(`Failed to save changes: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [campaignId, displayTsx, flushPendingEdits, router, confirmExit]);

  // Discard visual edits and exit (reset to entry state)
  const handleDiscardVisualEdits = useCallback(() => {
    // TODO: Restore to snapshot state without page reload
    window.location.reload();
  }, []);

  // Handle save
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    
    try {
      // Render TSX to HTML
      const renderResponse = await fetch('/api/v3/campaigns/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tsxCode }),
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
          component_code: tsxCode,
          html_content: renderData.html,
        }),
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Update failed: ${errorText}`);
      }

      // Update saved state to reflect successful save
      setSavedTsxCode(tsxCode);
      
      // ✅ No page reload - user can continue editing!
      // router.refresh() will be called before navigation instead
    } catch (error: any) {
      console.error('Failed to save:', error);
      alert(`Failed to save changes: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [tsxCode, campaignId, router]);

  // Handle discard
  const handleDiscard = useCallback(() => {
    if (confirm('Are you sure you want to discard all changes?')) {
      // TODO: Restore to initial state without page reload
      // For now, reload page
      window.location.reload();
    }
  }, [savedTsxCode]);

  // Handle Next button click
  const handleNextClick = useCallback(async () => {
    // If in visual mode with unsaved changes, trigger mode toggle (will show save prompt)
    if (mode === 'visual' && hasVisualEdits) {
      toggleMode(tsxCode, hasUnsavedChanges);
      return;
    }
    
    // If in visual mode but changes are saved, exit visual mode first
    if (mode === 'visual') {
      setMode('chat');
      setSelectedComponentId(null);
    }
    
    // ✅ Auto-save if there are unsaved changes
    if (hasUnsavedChanges) {
      setIsSaving(true);
      
      try {
        await handleSave();
      } catch (error) {
        console.error('❌ Auto-save failed:', error);
        alert('Failed to save changes. Please try again.');
        setIsSaving(false);
        return; // Don't navigate if save failed
      }
      
      setIsSaving(false);
    }
    
    // ✅ CRITICAL: Refresh to load fresh data on send page
    router.refresh();
    
    // Navigate to send page
    router.push(`/dashboard/campaigns/${campaignId}/send`);
  }, [mode, hasVisualEdits, hasUnsavedChanges, campaignId, router, tsxCode, toggleMode, handleSave]);

  // Editor controls for header
  const editorControls = {
    editorActions: (
      <div className="flex items-center gap-3">
        {/* Preview Mode Toggle */}
        <div className="flex items-center bg-muted rounded-md p-0.5 gap-0.5">
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
              previewMode === 'desktop'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Desktop Preview"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
              previewMode === 'mobile'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Mobile Preview"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Next Button - disabled in visual edit mode */}
        <Button
          onClick={handleNextClick}
          disabled={mode === 'visual'}
          className="flex items-center gap-1.5 h-8 px-3 text-xs font-semibold"
          title={mode === 'visual' ? 'Exit visual mode before continuing' : undefined}
        >
          Next
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    ),
  };

  return (
    <DashboardLayout campaignEditor={editorControls}>
      {/* Exit Visual Mode Confirmation Modal */}
      {showExitConfirm && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/50"
          style={{ zIndex: Z_INDEX.MODAL_BACKDROP }}
        >
          <div 
            className="bg-card rounded-lg shadow-xl p-6 max-w-md mx-4"
            style={{ zIndex: Z_INDEX.MODAL_CONTENT }}
          >
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
              <div className="flex flex-col h-full rounded-l-xl overflow-hidden">
                {/* Left Panel Content */}
                {mode === 'chat' ? (
                  <>
                    {/* Brand Prompt Banner */}
                    {hasShownBrandPrompt && !brandSettings && (
                      <div className="mx-4 mt-3 mb-3 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-start gap-3">
                        <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground mb-1">
                            Add your brand identity
                          </p>
                          <p className="text-[10px] text-muted-foreground mb-2">
                            Set your company colors and logo to personalize all emails
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => {
                                // Open brand settings modal
                                const settingsButton = document.querySelector('[data-brand-settings-button]') as HTMLButtonElement;
                                settingsButton?.click();
                              }}
                              className="h-7 text-xs"
                            >
                              Add Brand →
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setHasShownBrandPrompt(false)}
                              className="h-7 text-xs"
                            >
                              Dismiss
                            </Button>
                          </div>
                        </div>
                        <button 
                          onClick={() => setHasShownBrandPrompt(false)}
                          className="text-muted-foreground hover:text-foreground flex-shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Chat History */}
                    <div className="flex-1 overflow-y-auto chat-history-scroll">
                      <ChatHistory 
                        messages={messages} 
                        messageMetadata={messageMetadata}
                        isGenerating={isGenerating} 
                      />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4">
                      <PromptInput
                        value={input}
                        onChange={setInput}
                        onSubmit={handleChatSubmit}
                        isLoading={isGenerating}
                        disabled={isSaving}
                        compact
                        disableAnimation
                        visualEditsMode={false}
                        onVisualEditsToggle={handleModeToggle}
                        showDiscardSaveButtons={false}
                        brandSettings={brandSettings}
                        onBrandSettingsSave={onBrandSettingsSave}
                      />
                    </div>
                  </>
                ) : mode === 'visual' ? (
                  <>
                    {/* Visual Mode - Properties Panel */}
                    <div className="flex-1 overflow-y-auto">
                      <PropertiesPanel
                        tsxCode={displayTsx}
                        selectedComponentId={selectedComponentId}
                        componentMap={componentMap}
                        onDirectUpdate={sendDirectUpdate}
                        onSelectParent={() => {
                          if (!selectedComponentId) return;
                          
                          // Re-parse to get fresh component positions (handles stale map after edits)
                          const { componentMap: freshMap } = parseAndInjectIds(tsxCode);
                          
                          // Find immediate parent using character containment
                          const parentId = findParentComponent(selectedComponentId, freshMap);
                          
                          if (parentId) {
                            setSelectedComponentId(parentId);
                            syncSelectionRef.current?.(parentId); // Direct sync to iframe
                          }
                        }}
                      />
                    </div>

                    {/* Prompt Input (also in visual mode) */}
                    <div className="p-4">
                      <PromptInput
                        value={input}
                        onChange={setInput}
                        onSubmit={handleChatSubmit}
                        isLoading={isGenerating}
                        disabled={isSaving || !!selectedComponentId}
                        compact
                        disableAnimation
                        visualEditsMode={true}
                        onVisualEditsToggle={handleModeToggle}
                        showDiscardSaveButtons={false}
                        brandSettings={brandSettings}
                        onBrandSettingsSave={onBrandSettingsSave}
                      />
                    </div>
                  </>
                ) : null}
              </div>
            }
            rightPanel={
              <div className="relative h-full rounded-r-xl overflow-hidden">
                <LivePreview
                  tsxCode={tsxCode}
                  tsxCodeSource={tsxCodeSource}
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
                  onIframeReady={handleIframeReady}
                  isToolbarLoading={toolbarStatus.type === 'loading'}
                  previewMode={previewMode}
                />
              </div>
            }
          />
        </div>
        
        {/* Floating AI Toolbar - Rendered via Portal with smart positioning */}
        {isMounted && mode === 'visual' && selectedComponentId && componentPosition && createPortal(
          <div 
            className="fixed bg-card shadow-2xl rounded-lg border border-border p-2 transition-all duration-200 ease-out"
            style={{
              top: `${componentPosition.top}px`,
              left: `${componentPosition.left}px`,
              width: '300px',
              zIndex: Z_INDEX.VISUAL_EDITOR_TOOLBAR,
            }}
            onMouseDown={(e) => e.preventDefault()} // ✅ Prevent blur on toolbar clicks
          >
            <div className="flex items-center gap-2">
              {/* AI Input - Controlled with stable ref */}
              <input
                ref={floatingToolbarInputRef}
                type="text"
                value={floatingPrompt}
                onChange={(e) => {
                  setFloatingPrompt(e.target.value);
                  // Clear error when user starts typing
                  if (toolbarStatus.type === 'error') {
                    setToolbarStatus({ type: 'idle' });
                  }
                }}
                placeholder={toolbarStatus.type === 'loading' ? 'Working...' : 'Tell Jolti what to change...'}
                autoFocus
                disabled={toolbarStatus.type === 'loading'}
                className={`flex-1 px-2.5 py-1.5 text-sm bg-background text-foreground placeholder-muted-foreground border rounded-lg outline-none transition-colors ${
                  toolbarStatus.type === 'error' 
                    ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : toolbarStatus.type === 'success'
                    ? 'border-primary'
                    : 'border-border focus:border-primary focus:ring-1 focus:ring-primary'
                }`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && floatingPrompt.trim() && toolbarStatus.type !== 'loading') {
                    e.preventDefault();
                    e.stopPropagation();
                    handleToolbarSubmit(floatingPrompt);
                    setFloatingPrompt('');
                    // Re-focus after submit
                    setTimeout(() => floatingToolbarInputRef.current?.focus(), 0);
                  }
                  if (e.key === 'Escape') {
                    setSelectedComponentId(null);
                    setComponentPosition(null);
                    setFloatingPrompt('');
                    setToolbarStatus({ type: 'idle' });
                  }
                }}
              />
              
              {/* Submit Button - Shows loading/success states */}
              <button
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  toolbarStatus.type === 'success' 
                    ? 'bg-primary' 
                    : toolbarStatus.type === 'loading'
                    ? 'bg-primary/70'
                    : 'bg-primary hover:bg-primary/90'
                }`}
                disabled={!floatingPrompt.trim() || toolbarStatus.type === 'loading'}
                onClick={() => {
                  if (floatingPrompt.trim()) {
                    handleToolbarSubmit(floatingPrompt);
                    setFloatingPrompt('');
                    // Re-focus after submit
                    setTimeout(() => floatingToolbarInputRef.current?.focus(), 0);
                  }
                }}
              >
                {toolbarStatus.type === 'loading' ? (
                  <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : toolbarStatus.type === 'success' ? (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                )}
              </button>
              
              {/* Close Button */}
              <button
                className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                onClick={() => {
                  setSelectedComponentId(null);
                  setComponentPosition(null);
                  setFloatingPrompt('');
                  setToolbarStatus({ type: 'idle' });
                }}
              >
                <svg className="w-4 h-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Inline Error Feedback */}
            {toolbarStatus.type === 'error' && toolbarStatus.message && (
              <div className="mt-1.5 px-1 text-xs text-red-500 leading-tight">
                {toolbarStatus.message}
              </div>
            )}
          </div>,
          document.body
        )}
      </div>
    </DashboardLayout>
  );
}

