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
  const [mode, setMode] = useState<EditMode>('chat');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [componentPosition, setComponentPosition] = useState<{ top: number; left: number } | null>(null);
  const [componentMap, setComponentMap] = useState<any>({});
  const [hasVisualEdits, setHasVisualEdits] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [visualModeEntryCode, setVisualModeEntryCode] = useState<string>('');
  const [isEnteringVisualMode, setIsEnteringVisualMode] = useState(false);
  const [isExitingVisualMode, setIsExitingVisualMode] = useState(false);
  const [floatingPrompt, setFloatingPrompt] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [brandSettings, setBrandSettings] = useState<BrandIdentity | null>(null);
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
  
  // Optimistic updates (for instant feedback before commit)
  const [optimisticEdits, setOptimisticEdits] = useState<OptimisticEdit[]>([]);

  // Display TSX = committed tsxCode + optimistic edits
  const displayTsx = useMemo(() => {
    if (optimisticEdits.length === 0) {
      return tsxCode;
    }
    
    console.log('[EDITOR] Applying', optimisticEdits.length, 'optimistic edits');
    
    // Apply optimistic edits on top of committed TSX
    let result = tsxCode;
    for (const edit of optimisticEdits) {
      try {
        const parsed = parseAndInjectIds(result);
        
        if (edit.property === 'text' || edit.property === 'textContent') {
          result = updateComponentText(result, parsed.componentMap, edit.componentId, edit.value);
        } else if (edit.property === 'imageSrc') {
          const { url, alt, width, height } = JSON.parse(edit.value);
          result = updateImageSrc(result, parsed.componentMap, edit.componentId, url, alt, width, height);
        } else if (edit.property === 'imageAlt') {
          result = updateImageSrc(result, parsed.componentMap, edit.componentId, undefined, edit.value);
        } else if (edit.property === 'imageWidth') {
          const numValue = parseInt(edit.value, 10);
          if (!isNaN(numValue)) {
            result = updateImageSrc(result, parsed.componentMap, edit.componentId, undefined, undefined, numValue, undefined);
          }
        } else if (edit.property === 'imageHeight') {
          const numValue = parseInt(edit.value, 10);
          if (!isNaN(numValue)) {
            result = updateImageSrc(result, parsed.componentMap, edit.componentId, undefined, undefined, undefined, numValue);
          }
        } else {
          // Handle spacing and other style properties
          const spacingProps = ['marginTop', 'marginBottom', 'marginLeft', 'marginRight', 
                                'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'];
          const valueWithUnit = spacingProps.includes(edit.property) ? `${edit.value}px` : edit.value;
          result = updateInlineStyle(result, parsed.componentMap, edit.componentId, edit.property, valueWithUnit);
        }
      } catch (error) {
        console.error('[EDITOR] Failed to apply optimistic edit:', error, edit);
      }
    }
    
    return result;
  }, [tsxCode, optimisticEdits]);

  // Debug log for new architecture
  useEffect(() => {
    console.log('[EDITOR] New architecture initialized:', {
      tsxCodeLength: tsxCode.length,
    });
  }, []);

  // ========================================
  // 🔄 COMMIT PIPELINE: Debounced commit (simple TSX update)
  // ========================================
  const commitEditsRef = useRef(
    debounce((newTsx: string, description: string = 'Edit') => {
      console.log('[EDITOR] Committing visual edit:', description, 'TSX length:', newTsx.length);
      
      // Simply update the TSX state
      setTsxCode(newTsx);
      
      // Mark as visual edit (so LivePreview skips API re-render)
      setTsxCodeSource('visual');
      
      // Clear optimistic edits (they're now committed)
      setOptimisticEdits([]);
    }, 500) // 500ms debounce
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending commits
      const cancel = (commitEditsRef.current as any).cancel;
      if (cancel) cancel();
    };
  }, []);

  // ========================================
  // 🔧 REFS: Essential refs for editor functionality
  // ========================================
  // ✅ Floating toolbar input ref - for focus management
  const floatingToolbarInputRef = useRef<HTMLInputElement>(null);

  // ✅ Message metadata ref - tracks changes and intent per message
  const messageMetadataRef = useRef<Map<string, { changes?: CodeChange[]; intent?: 'question' | 'command' }>>(new Map());

  // ✅ Sync function ref - for updating iframe selection without useEffect
  const syncSelectionRef = useRef<((id: string | null) => void) | null>(null);
  
  // Stable callback for iframe ready
  const handleIframeReady = useCallback((syncFn: (id: string | null) => void) => {
    syncSelectionRef.current = syncFn;
  }, []);

  // State for manual streaming (hybrid approach)
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string; createdAt?: Date }>>(initialChatMessages as any);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  // Handle chat submission
  // source: 'chat' for main input, 'toolbar' for floating toolbar (forces command mode)
  const handleChatSubmit = useCallback(async (customPrompt?: string, source: 'chat' | 'toolbar' = 'chat') => {
    const promptToUse = customPrompt || input;
    if (!promptToUse.trim() || isGenerating) return;

    const isToolbar = source === 'toolbar';
    console.log(`[EDITOR] Submitting: "${promptToUse}" (source: ${source})`);

    // For toolbar: show loading state
    if (isToolbar) {
      setToolbarStatus({ type: 'loading' });
    }

    // Add user message (skip for toolbar to keep chat clean)
    if (!isToolbar) {
      const userMsg = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: promptToUse,
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, userMsg]);
    }

    // Clear input
    if (!customPrompt) {
      setInput('');
    }

    // Create placeholder for assistant (skip for toolbar)
    const assistantId = (Date.now() + 1).toString();
    if (!isToolbar) {
      const assistantMsg = {
        id: assistantId,
        role: 'assistant' as const,
        content: '',
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/v3/campaigns/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          currentTsxCode: tsxCode,
          userMessage: promptToUse,
          selectedComponentId,
          selectedComponentType: selectedComponentId && componentMap[selectedComponentId]
            ? componentMap[selectedComponentId].type
            : null,
          brandSettings,
          source, // Pass source to API for intent forcing
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Parse response
      const data = await response.json();
      console.log(`[EDITOR] Intent: ${data.intent}, Success: ${data.success}`);

      // Handle toolbar response
      if (isToolbar) {
        if (data.success) {
          // Apply code changes
          if (data.tsxCode) {
            setTsxCode(data.tsxCode);
            setTsxCodeSource('ai'); // Mark as AI edit
          }
          setToolbarStatus({ type: 'success' });
          // Auto-clear success after 2s
          setTimeout(() => setToolbarStatus({ type: 'idle' }), 2000);
          console.log(`[EDITOR] Toolbar command success - ${data.changes?.length || 0} changes`);
        } else {
          // Show error inline
          setToolbarStatus({ 
            type: 'error', 
            message: data.message || "Couldn't make that change" 
          });
          console.log(`[EDITOR] Toolbar command failed: ${data.message}`);
        }
        return; // Don't update chat for toolbar commands
      }

      // Handle chat response (non-toolbar)
      // Apply code changes if command succeeded
      if (data.intent === 'command' && data.success && data.tsxCode) {
        setTsxCode(data.tsxCode);
        setTsxCodeSource('ai'); // Mark as AI edit

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
      console.error('[EDITOR] Error:', error);
      
      if (isToolbar) {
        setToolbarStatus({ 
          type: 'error', 
          message: 'Something went wrong. Try again.' 
        });
      } else {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: 'Sorry, something went wrong. Please try again.' }
              : m
          )
        );
      }
    } finally {
      setIsGenerating(false);
    }
  }, [input, isGenerating, campaignId, selectedComponentId, componentMap, brandSettings]);

  // Handle mode toggle
  const handleModeToggle = useCallback(() => {
    const newMode = mode === 'chat' ? 'visual' : 'chat';
    console.log('[EDITOR] Toggling mode from', mode, 'to', newMode);
    
    // Check if there are visual edits (compare current tsx with entry code)
    const hasVisualModeChanges = mode === 'visual' && visualModeEntryCode && tsxCode !== visualModeEntryCode;
    
    // If exiting visual mode with changes, show confirmation
    if (mode === 'visual' && (hasVisualModeChanges || hasUnsavedChanges)) {
      console.log('[EDITOR] Unsaved changes detected:', { hasVisualModeChanges, hasUnsavedChanges });
      setShowExitConfirm(true);
      return;
    }
    
    // Entering visual mode - snapshot current code
    if (newMode === 'visual') {
      setVisualModeEntryCode(tsxCode);
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
  }, [mode, tsxCode, visualModeEntryCode, hasUnsavedChanges]);

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

  // ========================================
  // 🎨 VISUAL EDITS: New architecture with optimistic updates
  // ========================================
  const sendDirectUpdate = useCallback((componentId: string, property: string, value: string) => {
    console.log('[EDITOR] Direct update (new architecture):', { componentId, property, value });
    
    // 1. Send instant DOM update via postMessage (keep for immediate visual feedback)
    const livePreviewUpdate = (window as any).__livePreviewSendDirectUpdate;
    if (livePreviewUpdate) {
      livePreviewUpdate({
        type: 'direct-update',
        componentId,
        property,
        value,
      });
    }
    
    // 2. Add optimistic edit (instant local state update)
    setOptimisticEdits(prev => {
      // Remove any existing edit for this component+property
      const filtered = prev.filter(e => !(e.componentId === componentId && e.property === property));
      // Add new edit
      return [...filtered, { componentId, property, value, timestamp: Date.now() }];
    });
    
    // 3. Apply edit to TSX and prepare for commit
    const currentTsx = tsxCode; // Use new state instead of ref
    let updatedTsx: string;
    
    try {
      // Parse fresh componentMap from current TSX
      const parsed = parseAndInjectIds(currentTsx);
      const freshMap = parsed.componentMap;
    
      // Apply edit based on property type
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
        // Handle spacing properties - add 'px' unit
        const spacingProps = ['marginTop', 'marginBottom', 'marginLeft', 'marginRight', 
                              'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'];
        
        const valueWithUnit = spacingProps.includes(property) ? `${value}px` : value;
        updatedTsx = updateInlineStyle(currentTsx, freshMap, componentId, property, valueWithUnit);
    }
    
      // 4. Debounced commit (captures HTML after 500ms)
      commitEditsRef.current(updatedTsx, `Updated ${property}`);
      
    setHasVisualEdits(true);
      
    } catch (error) {
      console.error('[EDITOR] Failed to apply edit:', error);
    }
  }, [tsxCode]);

  // Save visual edits and exit (commit to DB)
  const handleSaveVisualEdits = useCallback(async () => {
    console.log('[EDITOR] Saving visual edits and exiting visual mode');
    setIsExitingVisualMode(true);
    
    // Use current tsxCode (already committed via debounce)
    const updatedCode = tsxCode;
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
      
      // Invalidate Next.js cache to ensure send page loads fresh data
      router.refresh();
      
      console.log('✅ Visual edits saved to database');
    } catch (error: any) {
      console.error('Failed to save visual edits:', error);
      alert(`Failed to save changes: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [campaignId]);

  // Discard visual edits and exit (reset to entry state)
  const handleDiscardVisualEdits = useCallback(() => {
    console.log('[EDITOR] Discarding visual edits - reloading page');
    setIsExitingVisualMode(true);
    
    // TODO: Restore to visualModeEntryCode state without page reload
    // For now, just reload the page
    window.location.reload();
  }, [visualModeEntryCode]);

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
      
      // Invalidate Next.js cache for fresh data on navigation
      router.refresh();
      
      console.log('✅ Campaign saved successfully');
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
  const handleNextClick = useCallback(() => {
    // If in visual mode with unsaved changes, show save prompt
    if (mode === 'visual' && hasVisualEdits) {
      setShowExitConfirm(true);
      return;
    }
    
    // If in visual mode but changes are saved, exit visual mode first
    if (mode === 'visual') {
      setMode('chat');
      setSelectedComponentId(null);
    }
    
    // Navigate to send page
    router.push(`/dashboard/campaigns/${campaignId}/send`);
  }, [mode, hasVisualEdits, campaignId, router]);

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
                            console.log('[EDITOR] Selecting parent:', parentId);
                            setSelectedComponentId(parentId);
                            syncSelectionRef.current?.(parentId); // Direct sync to iframe
                          } else {
                            console.log('[EDITOR] Already at root component - no parent');
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
                    handleChatSubmit(floatingPrompt, 'toolbar'); // ✅ Pass 'toolbar' source
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
                    handleChatSubmit(floatingPrompt, 'toolbar'); // ✅ Pass 'toolbar' source
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

