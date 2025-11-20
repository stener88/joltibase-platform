'use client';

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
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
import type { ElementDescriptor } from '@/lib/email/visual-edits/element-descriptor';
import { SplitScreenLayout } from '@/components/campaigns/SplitScreenLayout';
import { getToolbarConfig } from '@/lib/email-v2/toolbar-config';
import { getComponentDescriptor } from '@/lib/email-v2/component-descriptor';
import { semanticBlocksToEmailComponent } from '@/lib/email-v2/blocks-converter';
import { renderEmailComponent } from '@/lib/email-v2/renderer';


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
  // Visual edit mode state
  const [visualEditMode, setVisualEditMode] = useState(false);
  const [rootComponent, setRootComponent] = useState<EmailComponent | null>(initialRootComponent || null);
  const [originalRootComponent, setOriginalRootComponent] = useState<EmailComponent | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentHtmlContent, setCurrentHtmlContent] = useState(htmlContent || '');
  
  const [globalSettings, setGlobalSettings] = useState(initialGlobalSettings);
  const [selectedComponent, setSelectedComponent] = useState<SelectedComponent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [showComponentEditor, setShowComponentEditor] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activePanel, setActivePanel] = useState<'content' | 'styles' | 'spacing' | null>(null);
  const chatInterfaceRef = useRef<ChatInterfaceRef>(null);

  // Handle enter visual edit mode (lazy transformation)
  const handleEnterVisualEdit = useCallback(async () => {
    if (!semanticBlocks) {
      console.error('No semantic blocks available for editing');
      alert('No semantic blocks available for editing');
      return;
    }

    setIsTransforming(true);
    
    try {
      const component = semanticBlocksToEmailComponent(
        semanticBlocks,
        globalSettings,
        previewText
      );
      
      setRootComponent(component);
      setOriginalRootComponent(component); // Keep original for discard
      setVisualEditMode(true);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Transform failed:', error);
      alert('Failed to enter visual edit mode');
    } finally {
      setIsTransforming(false);
    }
  }, [semanticBlocks, globalSettings, previewText]);

  // Handle exit visual edit mode
  const handleExitVisualEdit = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowSaveDialog(true);
    } else {
      // No changes, exit immediately
      setVisualEditMode(false);
      setRootComponent(null);
    }
  }, [hasUnsavedChanges]);

  // Handle save and exit
  const handleSaveAndExit = useCallback(async () => {
    if (!rootComponent) return;
    
    setShowSaveDialog(false);
    
    try {
      // Re-render EmailComponent to HTML
      const { html } = await renderEmailComponent(rootComponent, globalSettings);
      
      // Update database
      await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          root_component: rootComponent,
          html_content: html,
        }),
      });
      
      // Update local state
      setCurrentHtmlContent(html);
      
      // Exit visual edit mode
      setVisualEditMode(false);
      setRootComponent(null);
      setHasUnsavedChanges(false);
      
      console.log('✓ Changes saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save changes');
    }
  }, [rootComponent, globalSettings, campaignId]);

  // Handle discard and exit
  const handleDiscardAndExit = useCallback(() => {
    setShowSaveDialog(false);
    setVisualEditMode(false);
    setRootComponent(null);
    setHasUnsavedChanges(false);
    
    console.log('Changes discarded');
  }, []);

  // Track component updates
  const handleRootComponentUpdate = useCallback((updatedComponent: EmailComponent) => {
    setRootComponent(updatedComponent);
    setHasUnsavedChanges(true);
  }, []);

  // Toggle visual edits mode (legacy function, now redirects to enter visual edit)
  const handleVisualEditsToggle = useCallback(() => {
    if (visualEditMode) {
      handleExitVisualEdit();
    } else {
      handleEnterVisualEdit();
    }
  }, [visualEditMode, handleEnterVisualEdit, handleExitVisualEdit]);

  // Better toolbar positioning using viewport bounds
  const handleComponentClick = useCallback((id: string, bounds: DOMRect) => {
    // Only allow clicks when visual edit mode is active
    if (!visualEditMode || !rootComponent) return;
    
    const component = findComponentById(rootComponent, id);
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
      
      setToolbarPosition({
        x: toolbarX,
        y: toolbarY,
      });
    }
  }, [rootComponent, visualEditMode]);

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
      setHasUnsavedChanges(true); // Mark as changed
      
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

    const newRoot = deleteComponentById(rootComponent, selectedComponent.id);
    if (newRoot) {
      setRootComponent(newRoot);
      setHasUnsavedChanges(true); // Mark as changed
      setSelectedComponent(null);
      setShowComponentEditor(false);
      setActivePanel(null);
    }
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
        setHasUnsavedChanges(true); // Mark as changed
        
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
      selectedElement={null}
      onClearSelection={() => {
        setShowComponentEditor(false);
        setSelectedComponent(null);
      }}
    />
  );

  // Save dialog
  if (showSaveDialog) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]">
        <div className="bg-[#2d2d2d] rounded-xl shadow-2xl border border-gray-700 p-6 max-w-md mx-4">
          <h2 className="text-xl font-semibold text-white mb-2">Save Changes?</h2>
          <p className="text-gray-300 mb-6">
            You have unsaved changes to this email. What would you like to do?
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleDiscardAndExit}
              className="px-4 py-2 bg-[#3d3d3d] hover:bg-[#4d4d4d] text-white rounded-lg transition-colors"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSaveAndExit}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="h-full flex flex-col">
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
          rootComponent={rootComponent}
          globalSettings={globalSettings}
          selectedComponentId={selectedComponent?.id}
          onComponentClick={handleComponentClick}
          deviceMode={deviceMode}
        />
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500">No email component loaded</p>
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

