'use client';

import { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { SplitScreenLayout } from '@/components/campaigns/SplitScreenLayout';
import { PromptInput } from '@/components/campaigns/PromptInput';
import { Button } from '@/components/ui/button';
import { LivePreview } from './LivePreview';
import { PropertiesPanel } from './PropertiesPanel';
import { ChatHistory } from './ChatHistory';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Save, X, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateComponentText, updateInlineStyle, updateImageSrc } from '@/lib/email-v3/tsx-manipulator';
import { parseAndInjectIds } from '@/lib/email-v3/tsx-parser';
import { Z_INDEX } from '@/lib/ui-constants';
import type { CodeChange } from '@/lib/email-v3/diff-generator';
import type { BrandIdentity } from '@/lib/types/brand';

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
  const [draftTsxCode, setDraftTsxCode] = useState(initialTsxCode);
  const [renderVersion, setRenderVersion] = useState(0);
  const [mode, setMode] = useState<EditMode>('chat');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [componentPosition, setComponentPosition] = useState<{ top: number; left: number } | null>(null);
  const [componentMap, setComponentMap] = useState<any>({});
  const [hasVisualEdits, setHasVisualEdits] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [visualModeEntryCode, setVisualModeEntryCode] = useState<string>('');
  const [iframeKey, setIframeKey] = useState(0);
  const [isEnteringVisualMode, setIsEnteringVisualMode] = useState(false);
  const [isExitingVisualMode, setIsExitingVisualMode] = useState(false);
  const [floatingPrompt, setFloatingPrompt] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [brandSettings, setBrandSettings] = useState<BrandIdentity | null>(null);
  const [hasShownBrandPrompt, setHasShownBrandPrompt] = useState(false);

  // ✅ Working TSX ref - holds current code with visual edits (no re-renders!)
  const workingTsxRef = useRef(initialTsxCode);
  
  // ✅ Floating toolbar input ref - for focus management
  const floatingToolbarInputRef = useRef<HTMLInputElement>(null);

  // ✅ Message metadata ref - tracks changes and intent per message
  const messageMetadataRef = useRef<Map<string, { changes?: CodeChange[]; intent?: 'question' | 'command' }>>(new Map());

  // State for manual streaming (hybrid approach)
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string; createdAt?: Date }>>(initialChatMessages as any);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync working ref when draftTsxCode changes externally (AI, load, etc.)
  useEffect(() => {
    workingTsxRef.current = draftTsxCode;
  }, [draftTsxCode]);

  // Set mounted state for Portal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch brand settings on mount
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await fetch('/api/brand');
        if (response.ok) {
          const data = await response.json();
          setBrandSettings(data.brand);
        }
      } catch (error) {
        console.error('[EmailEditor] Failed to fetch brand:', error);
      }
    };
    fetchBrand();
  }, []);

  // Save brand settings handler
  const handleBrandSettingsSave = useCallback(async (brand: BrandIdentity) => {
    try {
      const response = await fetch('/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brand),
      });
      if (response.ok) {
        const data = await response.json();
        setBrandSettings(data.brand);
      }
    } catch (error) {
      console.error('[EmailEditor] Failed to save brand:', error);
    }
  }, []);

  // Show brand prompt after first successful generation
  useEffect(() => {
    if (messages.length > 2 && !brandSettings && !hasShownBrandPrompt) {
      setHasShownBrandPrompt(true);
    }
  }, [messages.length, brandSettings, hasShownBrandPrompt]);

  // Derived state
  const hasUnsavedChanges = draftTsxCode !== savedTsxCode;

  // ✅ Focus floating toolbar input when component is selected (synchronous, no flicker)
  useLayoutEffect(() => {
    if (selectedComponentId && floatingToolbarInputRef.current) {
      floatingToolbarInputRef.current.focus();
    }
  }, [selectedComponentId]);

  // ✅ Clear floating prompt when switching components
  useEffect(() => {
    if (selectedComponentId) {
      setFloatingPrompt('');
    }
  }, [selectedComponentId]);

  // Handle chat submission with streaming
  // Can accept optional customPrompt to bypass main input state (for floating toolbar)
  const handleChatSubmit = useCallback(async (customPrompt?: string) => {
    const promptToUse = customPrompt || input;
    if (!promptToUse.trim() || isGenerating) return;

    console.log(`[EDITOR] Submitting: "${promptToUse}"`);

    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: promptToUse,
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    // Clear input
    if (!customPrompt) {
      setInput('');
    }

    // Create placeholder for assistant
    const assistantId = (Date.now() + 1).toString();
    const assistantMsg = {
      id: assistantId,
      role: 'assistant' as const,
      content: '',
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, assistantMsg]);

    setIsGenerating(true);

    try {
      const response = await fetch('/api/v3/campaigns/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          currentTsxCode: workingTsxRef.current,
          userMessage: promptToUse,
          selectedComponentId,
          selectedComponentType: selectedComponentId && componentMap[selectedComponentId]
            ? componentMap[selectedComponentId].type
            : null,
          brandSettings, // Include brand identity
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Simple JSON response
      const data = await response.json();
      console.log(`[EDITOR] Intent: ${data.intent}`);

      // Apply code changes if command
      if (data.intent === 'command' && data.tsxCode) {
        setDraftTsxCode(data.tsxCode);
        workingTsxRef.current = data.tsxCode;
        setRenderVersion(v => v + 1);

        // Store metadata for changelog
        messageMetadataRef.current.set(assistantId, {
          changes: data.changes || [],
          intent: data.intent,
        });
        
        console.log(`[EDITOR] Applied ${data.changes?.length || 0} changes`);
      }

      // Update assistant message
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: data.message }
            : m
        )
      );
    } catch (error) {
      console.error('[EDITOR] Stream error:', error);
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: 'Sorry, something went wrong. Please try again.' }
            : m
        )
      );
    } finally {
      setIsGenerating(false);
    }
  }, [input, isGenerating, campaignId, selectedComponentId, componentMap, workingTsxRef]);

  // Handle mode toggle
  const handleModeToggle = useCallback(() => {
    const newMode = mode === 'chat' ? 'visual' : 'chat';
    console.log('[EDITOR] Toggling mode from', mode, 'to', newMode);
    
    // Check if there are visual edits (compare working ref with entry code)
    const hasVisualModeChanges = mode === 'visual' && visualModeEntryCode && workingTsxRef.current !== visualModeEntryCode;
    
    // If exiting visual mode with changes, show confirmation
    if (mode === 'visual' && (hasVisualModeChanges || hasUnsavedChanges)) {
      console.log('[EDITOR] Unsaved changes detected:', { hasVisualModeChanges, hasUnsavedChanges });
      setShowExitConfirm(true);
      return;
    }
    
    // Entering visual mode - snapshot current code
    if (newMode === 'visual') {
      setVisualModeEntryCode(draftTsxCode);
      workingTsxRef.current = draftTsxCode; // Initialize working ref
      setIsEnteringVisualMode(true);
      setTimeout(() => {
        setIsEnteringVisualMode(false);
      }, 600);
    }
    
    setMode(newMode);
    if (newMode === 'chat') {
      setSelectedComponentId(null);
      setHasVisualEdits(false);
      setVisualModeEntryCode('');
    }
  }, [mode, draftTsxCode, visualModeEntryCode, hasUnsavedChanges]);

  // Handle component selection
  const handleComponentSelect = useCallback((componentId: string | null, position?: { top: number; left: number }) => {
    if (componentId !== selectedComponentId) {
      // Selecting a different component
      console.log('[EDITOR] Selecting new component:', componentId);
      setSelectedComponentId(componentId);
      setComponentPosition(position || null);
    } else if (componentId) {
      // Same component clicked - manually refocus the input
      console.log('[EDITOR] Same component clicked, refocusing input');
      setTimeout(() => {
        floatingToolbarInputRef.current?.focus();
      }, 0);
    }
  }, [selectedComponentId]);

  // Send direct update to iframe (instant DOM update + silent ref update)
  const sendDirectUpdate = useCallback((componentId: string, property: string, value: string) => {
    // 1. Send instant DOM update via postMessage
    const livePreviewUpdate = (window as any).__livePreviewSendDirectUpdate;
    if (livePreviewUpdate) {
      livePreviewUpdate({
        type: 'direct-update',
        componentId,
        property,
        value,
      });
    }
    
    // 2. Update working ref SILENTLY (no state change, no re-render!)
    const currentTsx = workingTsxRef.current;
    
    // Parse fresh componentMap from current working code
    let freshMap;
    try {
      const parsed = parseAndInjectIds(currentTsx);
      freshMap = parsed.componentMap;
    } catch (error) {
      console.error('[EDITOR] Failed to parse componentMap:', error);
      return; // Abort edit on parse error
    }
    
    // Apply edit to working ref based on property type
    let updatedTsx: string;
    
    if (property === 'text' || property === 'textContent') {
      updatedTsx = updateComponentText(currentTsx, freshMap, componentId, value);
      
    } else if (property === 'imageSrc') {
      // Parse JSON for atomic image update (url, alt, width, height)
      try {
        const { url, alt, width, height } = JSON.parse(value);
        updatedTsx = updateImageSrc(currentTsx, freshMap, componentId, url, alt, width, height);
      } catch (error) {
        console.error('[EDITOR] Failed to parse image data:', error);
        return;
      }
      
    } else if (property === 'imageAlt') {
      updatedTsx = updateImageSrc(currentTsx, freshMap, componentId, undefined, value);
      
    } else if (property === 'imageWidth') {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue)) return;
      updatedTsx = updateImageSrc(currentTsx, freshMap, componentId, undefined, undefined, numValue, undefined);
      
    } else if (property === 'imageHeight') {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue)) return;
      updatedTsx = updateImageSrc(currentTsx, freshMap, componentId, undefined, undefined, undefined, numValue);
      
    } else {
      updatedTsx = updateInlineStyle(currentTsx, freshMap, componentId, property, value);
    }
    
    // Update working ref (silent, no re-render)
    workingTsxRef.current = updatedTsx;
    
    // Mark that we have visual edits
    setHasVisualEdits(true);
  }, []); // ✅ No dependencies - always uses fresh data from closure

  // Save visual edits and exit (commit ref to state + persist to DB)
  const handleSaveVisualEdits = useCallback(async () => {
    console.log('[EDITOR] Saving visual edits and exiting visual mode');
    setIsExitingVisualMode(true);
    
    // Commit working ref to draft state
    const updatedCode = workingTsxRef.current;
    
    // 🔍 DEBUG: Log what's being saved
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[SAVE] TSX code being saved (first 500 chars):');
    console.log(updatedCode.substring(0, 500));
    console.log('[SAVE] TSX code being saved (last 500 chars):');
    console.log(updatedCode.substring(Math.max(0, updatedCode.length - 500)));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    setDraftTsxCode(updatedCode);
    
    // Force re-render to show final result
    setRenderVersion(v => v + 1);
    console.log('[EDITOR] Committed visual edits and incremented render version');
    
    // Exit visual mode and clear state
    setShowExitConfirm(false);
    setMode('chat');
    setSelectedComponentId(null);
    setHasVisualEdits(false);
    setVisualModeEntryCode('');
    
    // Clear loading overlay
    setTimeout(() => {
      setIsExitingVisualMode(false);
    }, 600);
    
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

      // Update saved state to reflect successful save
      setSavedTsxCode(updatedCode);
      
      console.log('✅ Visual edits saved to database');
    } catch (error: any) {
      console.error('Failed to save visual edits:', error);
      alert(`Failed to save changes: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [campaignId]);

  // Discard visual edits and exit (reset ref to snapshot + trigger re-render)
  const handleDiscardVisualEdits = useCallback(() => {
    console.log('[EDITOR] Discarding visual edits');
    setIsExitingVisualMode(true);
    
    // Reset working ref to snapshot
    if (visualModeEntryCode) {
      workingTsxRef.current = visualModeEntryCode;
      console.log('[EDITOR] Reset working ref to visual mode entry state');
    }
    
    // Force re-render with original code
    setRenderVersion(v => v + 1);
    
    // Exit visual mode and clear state
    setShowExitConfirm(false);
    setMode('chat');
    setSelectedComponentId(null);
    setHasVisualEdits(false);
    setVisualModeEntryCode('');
    
    // Clear loading after re-render
    setTimeout(() => {
      setIsExitingVisualMode(false);
    }, 600);
  }, [visualModeEntryCode]);

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
      workingTsxRef.current = savedTsxCode; // ✅ Sync ref when discarding
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
                        messageMetadata={messageMetadataRef.current}
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
                        onBrandSettingsSave={handleBrandSettingsSave}
                      />
                    </div>
                  </>
                ) : mode === 'visual' ? (
                  <>
                    {/* Visual Mode - Properties Panel */}
                    <div className="flex-1 overflow-y-auto">
                      <PropertiesPanel
                        workingTsxRef={workingTsxRef}
                        selectedComponentId={selectedComponentId}
                        componentMap={componentMap}
                        onDirectUpdate={sendDirectUpdate}
                        onSelectParent={() => {
                          // TODO: Implement parent selection logic
                          // Would need to track parent-child relationships in componentMap
                          console.log('[EDITOR] Select parent - needs hierarchy tracking in tsx-parser');
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
                        onBrandSettingsSave={handleBrandSettingsSave}
                      />
                    </div>
                  </>
                ) : null}
              </div>
            }
            rightPanel={
              <div className="relative h-full rounded-r-xl overflow-hidden">
                <LivePreview
                  workingTsxRef={workingTsxRef}
                  renderVersion={renderVersion}
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
              width: '280px',
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
                onChange={(e) => setFloatingPrompt(e.target.value)}
                placeholder="Ask Jolti..."
                autoFocus
                className="flex-1 px-2.5 py-1.5 text-sm bg-background text-foreground placeholder-muted-foreground border border-border rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && floatingPrompt.trim()) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleChatSubmit(floatingPrompt); // ✅ Pass directly, don't touch main prompt!
                    setFloatingPrompt('');
                    // Re-focus after submit
                    setTimeout(() => floatingToolbarInputRef.current?.focus(), 0);
                  }
                  if (e.key === 'Escape') {
                    setSelectedComponentId(null);
                    setComponentPosition(null);
                    setFloatingPrompt('');
                  }
                }}
              />
              
              {/* Submit Button */}
              <button
                className="w-8 h-8 rounded-lg bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!floatingPrompt.trim() || isGenerating}
                onClick={() => {
                  if (floatingPrompt.trim()) {
                    handleChatSubmit(floatingPrompt); // ✅ Pass directly, don't touch main prompt!
                    setFloatingPrompt('');
                    // Re-focus after submit
                    setTimeout(() => floatingToolbarInputRef.current?.focus(), 0);
                  }
                }}
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
              
              {/* Close Button */}
              <button
                className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                onClick={() => {
                  setSelectedComponentId(null);
                  setComponentPosition(null);
                  setFloatingPrompt('');
                }}
              >
                <svg className="w-4 h-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>,
          document.body
        )}
      </div>
    </DashboardLayout>
  );
}

