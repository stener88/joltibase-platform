'use client';

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import type { EmailComponent, GlobalEmailSettings } from '@/lib/email-v2/types';
import type { SemanticBlock } from '@/lib/email-v2/ai/blocks';
import { getComponentPath, findComponentById, deleteComponentById, updateComponentById } from '@/lib/email-v2';
import { ChatInterface, type ChatMessage, type ChatInterfaceRef } from '@/components/campaigns/ChatInterface';
import { EmailV2Frame } from './EmailV2Frame';
import { FloatingToolbar } from '@/components/campaigns/visual-edits/FloatingToolbar';
import { ComponentLabel } from './visual-edits/ComponentLabel';
import { V2ContentPanel } from './visual-edits/V2ContentPanel';
import { V2StylesPanel } from './visual-edits/V2StylesPanel';
import { V2SpacingPanel } from './visual-edits/V2SpacingPanel';
import { DiscardSaveButtons } from './visual-edits/DiscardSaveButtons';
import type { ElementDescriptor } from '@/lib/email-v2/visual-edits/element-descriptor';
import { SplitScreenLayout } from '@/components/campaigns/SplitScreenLayout';
import { getToolbarConfig } from '@/lib/email-v2/toolbar-config';
import { getComponentDescriptor } from '@/lib/email-v2/component-descriptor';
import { renderEmailComponent } from '@/lib/email-v2/renderer';
import { useCampaignMutation } from '@/hooks/use-campaign-query';


interface V2ChatEditorProps {
  initialRootComponent?: EmailComponent;
  htmlContent?: string;
  semanticBlocks?: SemanticBlock[];
  previewText?: string;
  initialGlobalSettings: GlobalEmailSettings;
  campaignId: string;
  deviceMode?: 'desktop' | 'mobile';
  renderMode?: 'chat-only' | 'preview-only' | 'both';
}

interface SelectedComponent {
  id: string;
  component: EmailComponent;
  path: string;
  bounds: DOMRect;
}

export function V2ChatEditor({
  initialRootComponent,
  htmlContent,
  semanticBlocks,
  previewText,
  initialGlobalSettings,
  campaignId,
  deviceMode = 'desktop',
  renderMode = 'both',
}: V2ChatEditorProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const saveMutation = useCampaignMutation(campaignId);
  
  // Visual edit mode state
  const [visualEditMode, setVisualEditMode] = useState(false);
  const [rootComponent, setRootComponent] = useState<EmailComponent | null>(initialRootComponent || null);
  const [originalRootComponent, setOriginalRootComponent] = useState<EmailComponent | null>(null);
  const [originalHtmlContent, setOriginalHtmlContent] = useState<string>('');
  const [isTransforming, setIsTransforming] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentHtmlContent, setCurrentHtmlContent] = useState(htmlContent || '');
  const [isSaving, setIsSaving] = useState(false);
  const [renderKey, setRenderKey] = useState(0); // Force re-render key
  
  // Initialize currentHtmlContent on mount (handle both root_component and semantic_blocks)
  useEffect(() => {
    const initializeHtml = async () => {
      // Skip if we already have HTML content
      if (htmlContent && htmlContent.trim()) {
        return;
      }
      
      try {
        let rootComponentToUse: EmailComponent | null = null;
        
        // Option 1: Use initialRootComponent if available
        if (initialRootComponent) {
          console.log('[V2ChatEditor] Initializing HTML from initialRootComponent');
          rootComponentToUse = initialRootComponent;
        } 
        // Option 2: Transform semanticBlocks if available
        else if (semanticBlocks && semanticBlocks.length > 0) {
          console.log('[V2ChatEditor] Initializing HTML from semanticBlocks');
          const { transformBlocksToEmail } = await import('@/lib/email-v2/ai/transforms');
          
          // Transform semantic blocks to EmailComponent sections
          const components = transformBlocksToEmail(semanticBlocks, initialGlobalSettings);
          
          // Wrap in root HTML structure
          rootComponentToUse = {
            id: 'root',
            component: 'Html',
            props: { lang: 'en' },
            children: [
              {
                id: 'head',
                component: 'Head',
                props: {},
                children: previewText ? [{
                  id: 'preview',
                  component: 'Preview',
                  props: {},
                  content: previewText
                }] : undefined,
              },
              {
                id: 'body',
                component: 'Body',
                props: {
                  style: {
                    fontFamily: initialGlobalSettings.fontFamily,
                    backgroundColor: initialGlobalSettings.backgroundColor || '#ffffff',
                    margin: 0,
                    padding: 0,
                  },
                },
                children: [
                  {
                    id: 'main-container',
                    component: 'Container',
                    props: {
                      style: {
                        maxWidth: initialGlobalSettings.maxWidth || '600px',
                        margin: '0 auto',
                      },
                    },
                    children: components,
                  },
                ],
              },
            ],
          };
        }
        
        // Render to HTML if we have a component
        if (rootComponentToUse) {
          const { html } = await renderEmailComponent(rootComponentToUse, initialGlobalSettings);
          setCurrentHtmlContent(html);
          console.log('[V2ChatEditor] HTML initialized successfully');
        }
      } catch (error) {
        console.error('[V2ChatEditor] Failed to initialize HTML:', error);
      }
    };
    
    initializeHtml();
  }, [initialRootComponent, semanticBlocks, htmlContent, initialGlobalSettings, previewText]);
  
  const [globalSettings, setGlobalSettings] = useState(initialGlobalSettings);
  const [selectedComponent, setSelectedComponent] = useState<SelectedComponent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [showComponentEditor, setShowComponentEditor] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activePanel, setActivePanel] = useState<'content' | 'styles' | 'spacing' | null>(null);
  const [showDiscardSaveButtons, setShowDiscardSaveButtons] = useState(false);
  const chatInterfaceRef = useRef<ChatInterfaceRef>(null);
  const pendingChangesRef = useRef<Map<string, any>>(new Map());
  
  // Function to send live preview updates via postMessage (doesn't trigger React re-renders)
  const sendLivePreview = useCallback((componentId: string, updates: any) => {
    // Find the iframe within EmailV2Frame component
    const iframe = document.querySelector('[data-email-frame] iframe') as HTMLIFrameElement;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'LIVE_EDIT_UPDATE',
        componentId,
        updates
      }, '*');
    }
    
    // Store pending changes
    const existing = pendingChangesRef.current.get(componentId) || {};
    pendingChangesRef.current.set(componentId, { ...existing, ...updates });
    
    // Mark as having unsaved changes
    setHasUnsavedChanges(true);
  }, []);
  
  // Component registry for O(1) lookups (built from rootComponent tree)
  const componentRegistryRef = useRef<Map<string, EmailComponent>>(new Map());
  
  // Build component registry when rootComponent changes
  useEffect(() => {
    if (!rootComponent) {
      componentRegistryRef.current.clear();
      return;
    }
    
    const registry = new Map<string, EmailComponent>();
    
    function addToRegistry(component: EmailComponent) {
      registry.set(component.id, component);
      if (component.children) {
        component.children.forEach(addToRegistry);
      }
    }
    
    addToRegistry(rootComponent);
    componentRegistryRef.current = registry;
    console.log('[V2ChatEditor] Built component registry with', registry.size, 'components');
  }, [rootComponent]);


  // Handle enter visual edit mode (lazy transformation + lazy save)
  const handleEnterVisualEdit = useCallback(async () => {
    console.log('=== ENTERING VISUAL EDIT MODE ===');
    console.log('Current rootComponent state:', JSON.parse(JSON.stringify(rootComponent)));
    console.log('initialRootComponent prop:', initialRootComponent ? 'exists' : 'null');
    
    setIsSaving(true);
    
    try {
      let rootComponentToUse: EmailComponent | null = null;
      
      // IMPORTANT: Use current rootComponent state if available (updated after saves)
      // Only fall back to initialRootComponent prop if state is null
      if (rootComponent) {
        console.log('✅ [V2ChatEditor] Using current rootComponent state (includes all saves)');
        rootComponentToUse = rootComponent;
      } else if (initialRootComponent) {
        console.log('[V2ChatEditor] Using initialRootComponent prop (first time only)');
        rootComponentToUse = initialRootComponent;
      } else if (semanticBlocks && semanticBlocks.length > 0) {
        // Fallback: Generate rootComponent from semanticBlocks
        console.log('[V2ChatEditor] No rootComponent found, generating from semanticBlocks...');
        setIsTransforming(true);
        
        try {
          // Import transform function
          const { transformBlocksToEmail } = await import('@/lib/email-v2/ai/transforms');
          
          // Transform semantic blocks to EmailComponent tree
          const components = transformBlocksToEmail(semanticBlocks, initialGlobalSettings);
          
          // Wrap in root structure
          rootComponentToUse = {
            id: 'root',
            component: 'Html',
            props: { lang: 'en' },
            children: [
              {
                id: 'head',
                component: 'Head',
                props: {},
                children: previewText ? [{
                  id: 'preview',
                  component: 'Preview',
                  props: {},
                  content: previewText
                }] : undefined,
              },
              {
                id: 'body',
                component: 'Body',
                props: {
                  style: {
                    fontFamily: initialGlobalSettings.fontFamily,
                    backgroundColor: initialGlobalSettings.backgroundColor || '#ffffff',
                    margin: 0,
                    padding: 0,
                  }
                },
                children: [
                  {
                    id: 'main-container',
                    component: 'Container',
                    props: {
                      style: {
                        maxWidth: initialGlobalSettings.maxWidth || '600px',
                        margin: '0 auto',
                      },
                    },
                    children: components,
                  },
                ],
              },
            ],
          };
        } catch (error) {
          console.error('[V2ChatEditor] Failed to generate rootComponent:', error);
          throw error;
        } finally {
          setIsTransforming(false);
        }
      }
      
      if (!rootComponentToUse) {
        throw new Error('No root component or semantic blocks available');
      }
      
      console.log('✅ rootComponentToUse prepared:', JSON.parse(JSON.stringify(rootComponentToUse)));
      
      // LAZY SAVE: Save rootComponent and htmlContent to database now (if not already saved)
      // Only do this if we're using initialRootComponent and haven't saved before
      if (!rootComponent && !initialRootComponent) {
        console.log('[V2ChatEditor] Performing lazy save to database...');
        const { html } = await renderEmailComponent(rootComponentToUse, initialGlobalSettings);
        
        const saveResponse = await fetch(`/api/campaigns/${campaignId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            root_component: rootComponentToUse,
            html_content: html,
          }),
        });
        
        if (!saveResponse.ok) {
          throw new Error('Failed to save to database');
        }
        
        console.log('[V2ChatEditor] Lazy save successful');
        setCurrentHtmlContent(html);
      }
      
      // Set state and enter visual edit mode
      // Only update rootComponent if it's null (first time)
      if (!rootComponent) {
        setRootComponent(rootComponentToUse);
      }
      setOriginalRootComponent(rootComponentToUse); // Keep original for discard
      setOriginalHtmlContent(currentHtmlContent); // Save original HTML for discard
      setVisualEditMode(true);
      setHasUnsavedChanges(false);
      setShowDiscardSaveButtons(false); // Clear any existing discard/save buttons when entering edit mode
      pendingChangesRef.current.clear(); // Clear any pending changes
      
      console.log('✅ Visual edit mode entered - state updated');
      
    } catch (error) {
      console.error('[V2ChatEditor] Failed to enter visual edit mode:', error);
      alert(`Failed to enter visual edit mode: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  }, [initialRootComponent, semanticBlocks, initialGlobalSettings, previewText, campaignId, rootComponent, currentHtmlContent]);

  // Handle exit visual edit mode - show discard/save buttons if there are changes
  const handleExitVisualEdit = useCallback(async () => {
    console.log('[V2ChatEditor] Exiting visual edit mode', { 
      hasUnsavedChanges,
      showDiscardSaveButtons,
      rootComponentId: rootComponent?.id,
      pendingChanges: Array.from(pendingChangesRef.current.entries())
    });
    
    if (hasUnsavedChanges && rootComponent) {
      // Apply pending changes to rootComponent so preview shows updated version
      console.log('[V2ChatEditor] Has unsaved changes, applying to preview...');
      
      let updatedRoot: EmailComponent = rootComponent;
      
      // Apply deletions first
      pendingChangesRef.current.forEach((updates, componentId) => {
        if (updates.deleted) {
          console.log(`🗑️ [Exit] Applying deletion to ${componentId}`);
          const result = deleteComponentById(updatedRoot, componentId);
          if (result) updatedRoot = result;
        }
      });
      
      // Then apply other updates
      pendingChangesRef.current.forEach((updates, componentId) => {
        if (updates.deleted) return;
        
        const component = findComponentById(updatedRoot, componentId);
        if (!component) return;
        
        const normalizedUpdates: Partial<EmailComponent> = {};
        
        if (updates.content !== undefined) {
          normalizedUpdates.content = updates.content;
        }
        
        const mergedProps = { ...component.props };
        const mergedStyle = { ...component.props?.style };
        
        if (updates.styles) {
          Object.assign(mergedStyle, updates.styles);
        }
        
        if (updates.spacing) {
          Object.assign(mergedStyle, updates.spacing);
        }
        
        if (updates.props) {
          Object.assign(mergedProps, updates.props);
        }
        
        normalizedUpdates.props = {
          ...mergedProps,
          style: mergedStyle
        };
        
        updatedRoot = updateComponentById(updatedRoot, componentId, normalizedUpdates);
      });
      
      console.log('[V2ChatEditor] Pending changes applied to preview');
      
      // Render updated component to HTML for preview
      const { html } = await renderEmailComponent(updatedRoot, globalSettings);
      
      // Update rootComponent and HTML for preview
      setRootComponent(updatedRoot);
      setCurrentHtmlContent(html);
      
      // Show discard/save buttons
      setShowDiscardSaveButtons(true);
      setVisualEditMode(false);
      
      console.log('[V2ChatEditor] Preview updated with pending changes');
    } else {
      // No changes, exit immediately
      console.log('[V2ChatEditor] No unsaved changes, exiting immediately');
      setVisualEditMode(false);
      setRootComponent(null);
      setOriginalRootComponent(null);
      setSelectedComponent(null);
      setShowComponentEditor(false);
      setActivePanel(null);
    }
  }, [hasUnsavedChanges, rootComponent, globalSettings]);

  // Toggle visual edits mode (legacy function, now redirects to enter visual edit)
  const handleVisualEditsToggle = useCallback(() => {
    console.log('[V2ChatEditor] handleVisualEditsToggle called', { visualEditMode });
    if (visualEditMode) {
      console.log('[V2ChatEditor] Exiting visual edit mode');
      handleExitVisualEdit();
    } else {
      console.log('[V2ChatEditor] Entering visual edit mode');
      handleEnterVisualEdit();
    }
  }, [visualEditMode, handleEnterVisualEdit, handleExitVisualEdit]);

  // Store toolbar position ref to keep it stable during re-renders
  const toolbarPositionRef = useRef<{ x: number; y: number } | null>(null);

  // Better toolbar positioning using viewport bounds
  const handleComponentClick = useCallback((id: string, bounds: DOMRect) => {
    // Only allow clicks when visual edit mode is active
    if (!visualEditMode || !rootComponent) return;
    
    // Use component registry for O(1) lookup instead of tree traversal
    const component = componentRegistryRef.current.get(id) || findComponentById(rootComponent, id);
    const path = getComponentPath(rootComponent, id);
    
    if (component && path) {
      setSelectedComponent({ id, component, path, bounds });
      setShowComponentEditor(true);
      
      // Bounds are already in viewport coordinates from EmailV2Frame
      const toolbarWidth = 400; // Approximate toolbar width
      const toolbarHeight = 60; // Approximate toolbar height
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Calculate horizontal position (centered on element)
      let toolbarX = bounds.left + (bounds.width / 2) - (toolbarWidth / 2);
      
      // Keep toolbar on screen horizontally
      const minX = 20;
      const maxX = viewportWidth - toolbarWidth - 20;
      toolbarX = Math.max(minX, Math.min(toolbarX, maxX));
      
      // Calculate vertical position (prefer below, fallback to above)
      let toolbarY;
      const spaceBelow = viewportHeight - bounds.bottom;
      const spaceAbove = bounds.top;
      
      if (spaceBelow >= toolbarHeight + 10) {
        // Enough space below - position below element
        toolbarY = bounds.bottom + 10;
      } else if (spaceAbove >= toolbarHeight + 10) {
        // Not enough space below, but enough above - position above element
        toolbarY = bounds.top - toolbarHeight - 10;
      } else {
        // Not enough space either way - position below anyway but adjust
        toolbarY = Math.max(10, viewportHeight - toolbarHeight - 10);
      }
      
      // Keep toolbar on screen vertically
      const minY = 10;
      const maxY = viewportHeight - toolbarHeight - 10;
      toolbarY = Math.max(minY, Math.min(toolbarY, maxY));
      
      const newPosition = { x: toolbarX, y: toolbarY };
      toolbarPositionRef.current = newPosition;
      setToolbarPosition(newPosition);
    }
  }, [rootComponent, visualEditMode]);

  // Keep toolbar position stable during re-renders and iframe reloads
  useEffect(() => {
    // Always use the ref value to keep position stable, even during iframe reloads
    if (toolbarPositionRef.current) {
      setToolbarPosition(toolbarPositionRef.current);
    }
  }, [selectedComponent?.id, rootComponent]); // Update when component changes, but keep position stable during edits

  // Handle chat submit - full email generation
  const handleChatSubmit = useCallback(async (message: string) => {
    setIsGenerating(true);
    
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

      console.log('[V2ChatEditor] Generation result:', {
        success: result.success,
        hasRootComponent: !!result.rootComponent,
        rootComponentId: result.rootComponent?.id,
        rootComponentType: result.rootComponent?.component,
        childrenCount: result.rootComponent?.children?.length,
      });

      // Defer expensive tree inspection to avoid blocking
      setTimeout(() => {
        if (result.rootComponent?.component === 'Html' && result.rootComponent.children) {
          const body = result.rootComponent.children.find((c: any) => c.component === 'Body');
          const container = body?.children?.find((c: any) => c.component === 'Container');
          if (container) {
            console.log('[V2ChatEditor] Container has', container.children?.length || 0, 'sections');
          }
        }
      }, 0);

      if (result.success && result.rootComponent) {
        console.log('[V2ChatEditor] Updating rootComponent state');
        console.log('[V2ChatEditor] Full rootComponent structure:', JSON.stringify(result.rootComponent, null, 2));
        setRootComponent(result.rootComponent);
        
        // NOTE: Database save is already done by the generation API
        // No need to save again here
        
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: `✓ Generated new email successfully`,
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
      setIsGenerating(false);
    }
  }, [campaignId, globalSettings]);

  // Handle manual component updates from panels (apply button)
  const handleManualUpdate = useCallback(async (updates: { props?: Record<string, any>; content?: string }) => {
    if (!selectedComponent || !rootComponent) return;

    // Merge updates into component
    const updatedComponent: EmailComponent = {
      ...selectedComponent.component,
      ...(updates.content !== undefined && { content: updates.content }),
      ...(updates.props && { props: { ...selectedComponent.component.props, ...updates.props } }),
    };

    // Update in tree
    const newRoot = updateComponentById(rootComponent, selectedComponent.id, updatedComponent);
    if (newRoot) {
      setRootComponent(newRoot);
      setHasUnsavedChanges(true);
      
      // Update selected component with new data
      setSelectedComponent(prev => prev ? {
        ...prev,
        component: updatedComponent,
      } : null);
      
      // Close panel after applying
      setActivePanel(null);
    }
  }, [selectedComponent, rootComponent]);

  // Handle component deletion
  const handleDeleteComponent = useCallback(async () => {
    if (!selectedComponent || !rootComponent) return;

    // DON'T trigger React re-render - use postMessage to hide element
    const iframe = document.querySelector('[data-email-frame] iframe') as HTMLIFrameElement;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'DELETE_COMPONENT',
        componentId: selectedComponent.id
      }, '*');
    }

    // Store deletion in pending changes
    pendingChangesRef.current.set(selectedComponent.id, { deleted: true });
    setHasUnsavedChanges(true);
    
    // Clear selection
    setSelectedComponent(null);
    setShowComponentEditor(false);
    setActivePanel(null);
  }, [selectedComponent, rootComponent]);

  // Handle toolbar AI submit
  const handleToolbarAISubmit = useCallback(async (prompt: string) => {
    if (!selectedComponent) return;
    await handleComponentRefinement(prompt);
  }, [selectedComponent]);

  // Handle click outside to deselect or select next component
  useEffect(() => {
    if (!visualEditMode) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if click is on toolbar, panel, or label
      const isToolbarClick = target.closest('[data-floating-toolbar]');
      const isPanelClick = target.closest('[data-manual-panel]');
      const isLabelClick = target.closest('[data-component-label]');
      
      if (isToolbarClick || isPanelClick || isLabelClick) {
        return; // Don't close if clicking on our UI
      }
      
      // Close panels and toolbar
      setActivePanel(null);
      setSelectedComponent(null);
      setShowComponentEditor(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visualEditMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC - Clear selection
      if (e.key === 'Escape' && selectedComponent) {
        e.preventDefault();
        setSelectedComponent(null);
        setShowComponentEditor(false);
        setActivePanel(null);
      }
      
      // Delete key - Delete selected component
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponent) {
        // Only if not in an input/textarea
        if (document.activeElement?.tagName !== 'INPUT' && 
            document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handleDeleteComponent();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponent, handleDeleteComponent]);

  // Create ElementDescriptor for FloatingToolbar
  const toolbarDescriptor: ElementDescriptor | null = useMemo(() => {
    if (!selectedComponent) return null;
    
    return {
      blockId: selectedComponent.id,
      elementId: selectedComponent.id,
      elementType: selectedComponent.component.component as any,
      contentPath: 'content',
      editableProperties: [],
      currentValue: { content: selectedComponent.component.content || '' },
      currentSettings: selectedComponent.component.props || {},
    };
  }, [selectedComponent]);

  // Get toolbar configuration for V2 component
  const toolbarConfig = useMemo(() => {
    if (!selectedComponent) return null;
    return getToolbarConfig(selectedComponent.component.component);
  }, [selectedComponent]);

  // Get component descriptor for label
  const componentDescriptor = useMemo(() => {
    if (!selectedComponent) return null;
    return getComponentDescriptor(selectedComponent.component.component);
  }, [selectedComponent]);
  const handleComponentRefinement = useCallback(async (prompt: string) => {
    if (!selectedComponent) return;

    setIsRefining(true);

    try {
      const response = await fetch('/api/ai/refine-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          componentPath: selectedComponent.path,
          prompt,
        }),
      });

      const result = await response.json();

      if (result.success && result.rootComponent) {
        setRootComponent(result.rootComponent);
        setHasUnsavedChanges(true);
        
        // Add success message to chat
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: `✓ Updated ${selectedComponent.component.component.toLowerCase()} successfully`,
          timestamp: new Date(),
        };
        setChatHistory(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(result.error || 'Refinement failed');
      }
    } catch (error) {
      console.error('Component refinement error:', error);
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `✗ Failed to update: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsRefining(false);
    }
  }, [selectedComponent, campaignId]);

  // Handle save changes (final save after exiting edit mode)
  const handleSaveChanges = useCallback(async () => {
    if (!rootComponent) return;
    
    setIsSaving(true);
    try {
      console.log('=== BEFORE SAVE ===');
      console.log('pendingChangesRef:', Array.from(pendingChangesRef.current.entries()));
      console.log('Original rootComponent:', JSON.parse(JSON.stringify(rootComponent)));
      
      let updatedRoot: EmailComponent = rootComponent;
      
      // Apply deletions first
      pendingChangesRef.current.forEach((updates, componentId) => {
        if (updates.deleted) {
          console.log(`🗑️ Applying deletion to ${componentId}`);
          const result = deleteComponentById(updatedRoot, componentId);
          if (result) updatedRoot = result; // Only update if deletion succeeded (not deleting root)
        }
      });
      
      // Then apply other updates
      pendingChangesRef.current.forEach((updates, componentId) => {
        if (updates.deleted) return; // Skip deleted components
        
        console.log(`✏️ Applying updates to ${componentId}:`, updates);
        
        const component = findComponentById(updatedRoot, componentId);
        if (!component) {
          console.warn(`⚠️ Component ${componentId} not found in tree`);
          return;
        }
        
        // Normalize updates to EmailComponent format
        const normalizedUpdates: Partial<EmailComponent> = {};
        
        // Handle content updates
        if (updates.content !== undefined) {
          normalizedUpdates.content = updates.content;
          console.log(`  - Content: "${updates.content}"`);
        }
        
        // Merge all prop/style updates
        const mergedProps = { ...component.props };
        const mergedStyle = { ...component.props?.style };
        
        // Handle style updates (from V2StylesPanel)
        if (updates.styles) {
          Object.assign(mergedStyle, updates.styles);
          console.log('  - Styles:', updates.styles);
        }
        
        // Handle spacing updates (from V2SpacingPanel)
        if (updates.spacing) {
          Object.assign(mergedStyle, updates.spacing);
          console.log('  - Spacing:', updates.spacing);
        }
        
        // Handle prop updates (from V2ContentPanel)
        if (updates.props) {
          Object.assign(mergedProps, updates.props);
          console.log('  - Props:', updates.props);
        }
        
        // Set merged props and style
        normalizedUpdates.props = {
          ...mergedProps,
          style: mergedStyle
        };
        
        console.log(`  - Normalized updates:`, normalizedUpdates);
        
        updatedRoot = updateComponentById(updatedRoot, componentId, normalizedUpdates);
      });
      
      console.log('=== AFTER APPLYING CHANGES ===');
      console.log('Updated rootComponent:', JSON.parse(JSON.stringify(updatedRoot)));
      
      const { html } = await renderEmailComponent(updatedRoot, globalSettings);
      
      // Use React Query mutation instead of direct fetch
      await saveMutation.mutateAsync({
        root_component: updatedRoot,
        html_content: html,
      });
      
      console.log('=== AFTER DATABASE SAVE ===');
      console.log('State will be updated with:', JSON.parse(JSON.stringify(updatedRoot)));
      
      // Invalidate React Query cache to refetch fresh data
      await queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      
      // Refresh Next.js router to update server components
      router.refresh();
      
      // Update state directly without clearing to null
      setRootComponent(updatedRoot);
      setOriginalRootComponent(updatedRoot);
      setCurrentHtmlContent(html);
      pendingChangesRef.current.clear();
      setHasUnsavedChanges(false);
      setShowDiscardSaveButtons(false);
      
      console.log('✅ State updated - rootComponent and originalRootComponent set to updated version');
      
      // Clear edit mode state completely to force clean re-entry
      setSelectedComponent(null);
      setShowComponentEditor(false);
      setActivePanel(null);
      setVisualEditMode(false); // Exit edit mode after save
      
      // Increment render key to force complete remount
      setRenderKey(prev => prev + 1);
      
      // Short delay then end loading
      setTimeout(() => {
        setIsSaving(false);
      }, 300);
      
    } catch (error) {
      console.error('❌ [V2ChatEditor] Save error:', error);
      alert(`Failed to save changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsSaving(false);
    }
  }, [rootComponent, globalSettings, campaignId, saveMutation, queryClient, router]);

  // Handle discard changes (revert to original)
  const handleDiscardChanges = useCallback(() => {
    console.log('[V2ChatEditor] Discarding changes, reverting to original');
    
    // Reset iframe to original state by sending postMessage for each changed component
    pendingChangesRef.current.forEach((updates, componentId) => {
      const iframe = document.querySelector('[data-email-frame] iframe') as HTMLIFrameElement;
      
      // Restore deleted elements
      if (updates.deleted) {
        if (iframe?.contentWindow) {
          const element = iframe.contentDocument?.querySelector(`[data-component-id="${componentId}"]`) as HTMLElement;
          if (element) {
            element.style.display = '';
            element.removeAttribute('data-deleted');
          }
        }
      } else {
        // Restore other changes
        const originalComponent = originalRootComponent ? findComponentById(originalRootComponent, componentId) : null;
        if (originalComponent && iframe?.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'LIVE_EDIT_UPDATE',
            componentId,
            updates: {
              content: originalComponent.content,
              styles: originalComponent.props?.style || {},
              props: originalComponent.props || {}
            }
          }, '*');
        }
      }
    });
    
    // Reset to original state
    setRootComponent(originalRootComponent);
    setCurrentHtmlContent(originalHtmlContent);
    pendingChangesRef.current.clear();
    setHasUnsavedChanges(false);
    setShowDiscardSaveButtons(false);
    
    // Clear edit mode state
    setSelectedComponent(null);
    setShowComponentEditor(false);
    setActivePanel(null);
    
    // Force iframe remount to show original state cleanly
    setRenderKey(prev => prev + 1);
  }, [originalRootComponent, originalHtmlContent]);

  // Render split-screen layout
  const chatPanel = (
    <ChatInterface
      ref={chatInterfaceRef}
      campaignId={campaignId}
      onRefine={async (message) => {
        if (selectedComponent && showComponentEditor && visualEditMode) {
          // If component is selected, refine that component
          await handleComponentRefinement(message);
        } else {
          // Otherwise, generate/refine whole email
          await handleChatSubmit(message);
        }
      }}
      isRefining={isGenerating || isRefining}
      chatHistory={chatHistory}
      visualEditsMode={visualEditMode}
      onVisualEditsToggle={handleVisualEditsToggle}
      showDiscardSaveButtons={showDiscardSaveButtons}
      selectedElement={null}
      onClearSelection={() => {
        setShowComponentEditor(false);
        setSelectedComponent(null);
      }}
    />
  );

  // Note: Save dialog removed - using floating discard/save buttons instead
  // Buttons appear after exiting visual edit mode if there are unsaved changes

  // Preview mode (default - show HTML)
  if (!visualEditMode) {
    const previewPanel = (
      <div className="flex flex-col h-full overflow-auto">
        <iframe
          srcDoc={currentHtmlContent}
          className="w-full border-0"
          title="Email Preview"
          style={{ minHeight: '100%' }}
        />
      </div>
    );

    return (
      <div className="h-full flex flex-col relative">
        {renderMode === 'both' ? (
          <SplitScreenLayout
            leftPanel={chatPanel}
            rightPanel={previewPanel}
          />
        ) : renderMode === 'preview-only' ? (
          <div className="flex-1 overflow-hidden">{previewPanel}</div>
        ) : (
          <div className="flex-1 overflow-hidden">{chatPanel}</div>
        )}
        
        {/* Discard/Save Buttons - shown after exiting edit mode with unsaved changes */}
        {(() => {
          console.log('[V2ChatEditor] Checking DiscardSaveButtons render condition (preview mode)', {
            showDiscardSaveButtons,
            hasUnsavedChanges,
            isSaving,
            visualEditMode
          });
          return showDiscardSaveButtons;
        })() && (
          <DiscardSaveButtons
            position={{ x: 0, y: 0 }} // Position is handled by component CSS
            onDiscard={handleDiscardChanges}
            onSave={handleSaveChanges}
            isSaving={isSaving}
            hasChanges={hasUnsavedChanges}
          />
        )}
      </div>
    );
  }

  // Loading state during transformation
  if (isTransforming) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Preparing editor...</p>
          <p className="text-sm text-gray-600 mt-2">Transforming email structure</p>
        </div>
      </div>
    );
  }

  // Visual edit mode
  const previewPanel = rootComponent ? (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <EmailV2Frame
          key={`email-frame-${renderKey}`} // Use renderKey to force complete remount on save
          rootComponent={rootComponent}
          globalSettings={globalSettings}
          selectedComponentId={selectedComponent?.id}
          onComponentClick={handleComponentClick}
          deviceMode={deviceMode}
        />
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-full bg-gray-50">
      {isSaving ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Refreshing preview...</p>
          <p className="text-sm text-gray-600 mt-2">Applying saved changes</p>
        </div>
      ) : (
        <p className="text-gray-500">No email component loaded</p>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col relative">
      {renderMode === 'both' ? (
        <SplitScreenLayout
          leftPanel={chatPanel}
          rightPanel={previewPanel}
        />
      ) : renderMode === 'chat-only' ? (
        <div className="flex-1 overflow-hidden">{chatPanel}</div>
      ) : (
        <div className="flex-1 overflow-hidden">{previewPanel}</div>
      )}
      
      {/* FloatingToolbar - render at root with viewport coords */}
      {visualEditMode && selectedComponent && toolbarDescriptor && toolbarConfig && (
        <>
          {/* Component Label Badge */}
          <ComponentLabel
            componentType={selectedComponent.component.component}
            position={{
              x: selectedComponent.bounds.left,
              y: selectedComponent.bounds.top,
            }}
          />
          
          {/* Floating Toolbar */}
          <div data-floating-toolbar>
            <FloatingToolbar
              descriptor={toolbarDescriptor}
              position={toolbarPosition}
              onAISubmit={handleToolbarAISubmit}
              onContentClick={() => {
                setActivePanel(activePanel === 'content' ? null : 'content');
              }}
              onStylesClick={() => {
                setActivePanel(activePanel === 'styles' ? null : 'styles');
              }}
              onSpacingClick={() => {
                setActivePanel(activePanel === 'spacing' ? null : 'spacing');
              }}
              onGlobalSettingsClick={() => {
                alert('Global settings coming soon!');
              }}
              onDeleteClick={handleDeleteComponent}
              isAILoading={isRefining}
              toolbarConfig={toolbarConfig}
              componentType={selectedComponent.component.component}
            />
          </div>

          {/* Manual Control Panels */}
          {activePanel === 'content' && toolbarConfig.showContentButton && (
            <V2ContentPanel
              component={selectedComponent.component}
              position={{
                x: toolbarPosition.x,
                y: toolbarPosition.y + 70, // Below toolbar
              }}
              onUpdate={handleManualUpdate}
              onLivePreview={(updates) => sendLivePreview(selectedComponent.id, updates)}
            />
          )}

          {activePanel === 'styles' && toolbarConfig.showStylesButton && (
            <V2StylesPanel
              component={selectedComponent.component}
              position={{
                x: toolbarPosition.x,
                y: toolbarPosition.y + 70, // Below toolbar
              }}
              onUpdate={handleManualUpdate}
              onLivePreview={(updates) => sendLivePreview(selectedComponent.id, { styles: updates })}
            />
          )}

          {activePanel === 'spacing' && toolbarConfig.showSpacingButton && (
            <V2SpacingPanel
              component={selectedComponent.component}
              position={{
                x: toolbarPosition.x,
                y: toolbarPosition.y + 70, // Below toolbar
              }}
              onUpdate={handleManualUpdate}
              onLivePreview={(updates) => sendLivePreview(selectedComponent.id, { spacing: updates })}
            />
          )}
        </>
      )}
      
      {/* Loading overlay */}
      {(isGenerating || isRefining) && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
              <div>
                <p className="font-medium text-gray-900">
                  {isGenerating ? 'Generating email...' : 'Refining component...'}
                </p>
                <p className="text-sm text-gray-600">This may take a few seconds</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

