'use client';

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import type { EmailComponent, GlobalEmailSettings } from '@/lib/email-v2/types';
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

interface V2ChatEditorProps {
  initialRootComponent: EmailComponent;
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
  initialGlobalSettings,
  campaignId,
  deviceMode = 'desktop',
  renderMode = 'both',
}: V2ChatEditorProps) {
  const [rootComponent, setRootComponent] = useState(initialRootComponent);
  const [globalSettings, setGlobalSettings] = useState(initialGlobalSettings);
  const [selectedComponent, setSelectedComponent] = useState<SelectedComponent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [showComponentEditor, setShowComponentEditor] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [visualEditsMode, setVisualEditsMode] = useState(false); // Toggle for visual edits
  const [activePanel, setActivePanel] = useState<'content' | 'styles' | 'spacing' | null>(null);
  const chatInterfaceRef = useRef<ChatInterfaceRef>(null);

  // Toggle visual edits mode
  const handleVisualEditsToggle = useCallback(() => {
    setVisualEditsMode(prev => {
      const newMode = !prev;
      
      // Clear selection when turning off visual edits
      if (!newMode) {
        setSelectedComponent(null);
        setShowComponentEditor(false);
        setActivePanel(null);
      }
      return newMode;
    });
  }, []);

  // Better toolbar positioning using viewport bounds
  const handleComponentClick = useCallback((id: string, bounds: DOMRect) => {
    // Only allow clicks when visual edits mode is active
    if (!visualEditsMode) return;
    
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
  }, [rootComponent, visualEditsMode]);

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
    if (!selectedComponent) return;

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
      
      // Update selected component with new data
      setSelectedComponent(prev => prev ? {
        ...prev,
        component: updatedComponent,
      } : null);
      
      // Save to database immediately
      await fetch(`/api/campaigns/${campaignId}/v2`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rootComponent: newRoot,
          globalSettings,
        }),
      });
      
      // Close panel after applying
      setActivePanel(null);
    }
  }, [selectedComponent, rootComponent, campaignId, globalSettings]);

  // Handle component deletion
  const handleDeleteComponent = useCallback(async () => {
    if (!selectedComponent) return;

    const newRoot = deleteComponentById(rootComponent, selectedComponent.id);
    if (newRoot) {
      setRootComponent(newRoot);
      setSelectedComponent(null);
      setShowComponentEditor(false);
      setActivePanel(null);
      
      // Save to database
      await fetch(`/api/campaigns/${campaignId}/v2`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rootComponent: newRoot,
          globalSettings,
        }),
      });
    }
  }, [selectedComponent, rootComponent, campaignId, globalSettings]);

  // Handle toolbar AI submit
  const handleToolbarAISubmit = useCallback(async (prompt: string) => {
    if (!selectedComponent) return;
    await handleComponentRefinement(prompt);
  }, [selectedComponent]);

  // Handle click outside to deselect or select next component
  useEffect(() => {
    if (!visualEditsMode) return;

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
  }, [visualEditsMode]);

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
        
        // Save to database
        await fetch(`/api/campaigns/${campaignId}/v2`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rootComponent: result.rootComponent,
            globalSettings,
          }),
        });
        
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
  }, [selectedComponent, campaignId, globalSettings]);

  // Render split-screen layout
  const chatPanel = (
    <ChatInterface
      ref={chatInterfaceRef}
      campaignId={campaignId}
      onRefine={async (message) => {
        if (selectedComponent && showComponentEditor && visualEditsMode) {
          // If component is selected, refine that component
          await handleComponentRefinement(message);
        } else {
          // Otherwise, generate/refine whole email
          await handleChatSubmit(message);
        }
      }}
      isRefining={isGenerating || isRefining}
      chatHistory={chatHistory}
      visualEditsMode={visualEditsMode}
      onVisualEditsToggle={handleVisualEditsToggle}
      selectedElement={null}
      onClearSelection={() => {
        setShowComponentEditor(false);
        setSelectedComponent(null);
      }}
    />
  );

  const previewPanel = (
    <EmailV2Frame
      rootComponent={rootComponent}
      globalSettings={globalSettings}
      selectedComponentId={visualEditsMode ? selectedComponent?.id : undefined}
      onComponentClick={visualEditsMode ? handleComponentClick : undefined}
      deviceMode={deviceMode}
    />
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
      {visualEditsMode && selectedComponent && toolbarDescriptor && toolbarConfig && (
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

