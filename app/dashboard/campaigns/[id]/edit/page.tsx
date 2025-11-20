'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useCampaignQuery, useCampaignMutation, useCampaignRefineMutation } from '@/hooks/use-campaign-query';
import { useEditorHistory } from '@/hooks/use-editor-history';
import { useVisualEditsState, getWorkingBlocks } from '@/hooks/use-visual-edits-state';
import { renderBlocksToEmail, renderBlocksToEmailSync } from '@/lib/email/blocks';
import { createDescriptorFromElement } from '@/lib/email/visual-edits/element-mapper';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import type { CampaignEditorControls } from '@/components/dashboard/DashboardHeader';
import { SplitScreenLayout } from '@/components/campaigns/SplitScreenLayout';
import { ChatInterface, type ChatMessage, type ChatInterfaceRef } from '@/components/campaigns/ChatInterface';
import { DirectEditor } from '@/components/campaigns/DirectEditor';
import { EmailPreview, type DeviceMode, type ViewMode } from '@/components/campaigns/EmailPreview';
import type { EmailBlock, GlobalEmailSettings } from '@/lib/email/blocks/types';
import { MessageSquare, Edit3, Edit2, Save, RotateCcw, Monitor, Smartphone } from 'lucide-react';
// V2 React Email imports
import { V2ChatEditor } from '@/components/email-editor/V2ChatEditor';
import { EmailV2Frame } from '@/components/email-editor/EmailV2Frame';
import type { EmailComponent, GlobalEmailSettings as V2GlobalSettings } from '@/lib/email-v2/types';
import { semanticBlocksToEmailComponent } from '@/lib/email-v2/blocks-converter';
import type { SemanticBlock } from '@/lib/email-v2/ai/blocks';

type EditorMode = 'chat' | 'edit';

/**
 * Generate a meaningful placeholder name from campaign content
 */
function getCampaignPlaceholderName(campaign: any): string {
  // Try subject line first (most descriptive)
  if (campaign?.subject_line) {
    const subject = campaign.subject_line.trim();
    // Limit to 50 chars and remove trailing punctuation
    return subject.length > 50 ? subject.substring(0, 47) + '...' : subject.replace(/[.!?]+$/, '');
  }
  
  // Try first text block
  if (campaign?.blocks && Array.isArray(campaign.blocks)) {
    const headingBlock = campaign.blocks.find((block: any) => 
      block.type === 'text'
    );
    if (headingBlock?.content?.text) {
      const text = headingBlock.content.text.trim();
      return text.length > 50 ? text.substring(0, 47) + '...' : text.replace(/[.!?]+$/, '');
    }
  }
  
  // Try preview text (first few words)
  if (campaign?.preview_text) {
    const preview = campaign.preview_text.trim();
    const words = preview.split(/\s+/).slice(0, 6).join(' ');
    return words.length > 50 ? words.substring(0, 47) + '...' : words;
  }
  
  // Try campaign type as fallback
  if (campaign?.campaign?.campaignType) {
    const type = campaign.campaign.campaignType;
    return type === 'one-time' ? 'One-time Campaign' : 
           type === 'sequence' ? 'Email Sequence' : 
           type === 'automation' ? 'Automated Campaign' : 'Campaign';
  }
  
  // Last resort
  return 'Campaign';
}

export default function DashboardCampaignEditorPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const campaignId = params.id as string;
  
  // Server state (React Query)
  const { data: campaign, isLoading, error: queryError } = useCampaignQuery(campaignId);
  const saveMutation = useCampaignMutation(campaignId);
  const refineMutation = useCampaignRefineMutation(campaignId);
  
  // Detect V2 campaign and lazily generate EmailComponent from semantic blocks if needed
  const isV2Campaign = campaign?.version === 'v2';
  const [v2RootComponent, setV2RootComponent] = useState<EmailComponent | null>(null);
  
  // Lazily convert semantic blocks to EmailComponent when editor opens
  useEffect(() => {
    if (isV2Campaign && campaign) {
      // If root_component already exists, use it
      if ((campaign as any).root_component) {
        setV2RootComponent((campaign as any).root_component as EmailComponent);
        return;
      }
      
      // If semantic_blocks exist, convert them to EmailComponent
      if ((campaign as any).semantic_blocks && (campaign as any).global_settings) {
        console.log('[Editor] Lazily converting semantic blocks to EmailComponent tree');
        const emailComponent = semanticBlocksToEmailComponent(
          (campaign as any).semantic_blocks.blocks as SemanticBlock[],
          (campaign as any).global_settings as V2GlobalSettings,
          (campaign as any).semantic_blocks.previewText
        );
        setV2RootComponent(emailComponent);
        
        // Save the generated root_component back to database for future opens
        saveMutation.mutate({
          root_component: emailComponent,
        } as any);
      }
    }
  }, [isV2Campaign, campaign, saveMutation]);
  
  // Check for initial mode from query params
  const initialMode = searchParams.get('mode') as EditorMode | null;
  const [editorMode, setEditorMode] = useState<EditorMode>(
    initialMode === 'edit' ? initialMode : 'chat'
  );
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatVersions, setChatVersions] = useState<any[]>([]);
  const [chatVersionIndex, setChatVersionIndex] = useState(0);
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(0);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('html');
  const chatInterfaceRef = useRef<ChatInterfaceRef>(null);
  const chatHistoryLoadedRef = useRef<string | null>(null);
  
  // Undo/redo history (for visual & text modes)
  const editorHistory = useEditorHistory((state) => {
    // Auto-save callback
    saveMutation.mutate({
      blocks: state.blocks,
      design_config: state.globalSettings,
    });
  });
  
  // Visual edits state (for element-level editing)
  const visualEdits = useVisualEditsState(editorHistory.state?.blocks || []);
  const [isAIRefining, setIsAIRefining] = useState(false);
  
  // Get working blocks (with pending changes applied for preview)
  const workingBlocks = useMemo(() => {
    if (!editorHistory.state?.blocks) return [];
    return getWorkingBlocks(editorHistory.state.blocks, visualEdits.state.pendingChanges);
  }, [editorHistory.state?.blocks, visualEdits.state.pendingChanges]);
  
  // Handle element click from EmailFrame
  const handleElementClick = useCallback((element: HTMLElement) => {
    const descriptor = createDescriptorFromElement(element, editorHistory.state?.blocks || []);
    
    if (descriptor) {
      visualEdits.selectElement(descriptor, element);
    }
  }, [editorHistory.state?.blocks, visualEdits]);
  
  // Handle element update (content/styles)
  const handleUpdateElement = useCallback((elementId: string, changes: Record<string, any>) => {
    if (visualEdits.state.selectedElement) {
      const blockId = visualEdits.state.selectedElement.descriptor.blockId;
      visualEdits.updatePendingChanges(blockId, elementId, changes);
    }
  }, [visualEdits]);
  
  // Handle element deletion
  const handleDeleteElement = useCallback((elementId: string) => {
    if (visualEdits.state.selectedElement) {
      const success = visualEdits.deleteElement(visualEdits.state.selectedElement.descriptor);
      
      if (success) {
        // Clear selection after successful delete
        visualEdits.clearSelection();
      } else {
        console.error('Failed to delete element:', elementId);
      }
    }
  }, [visualEdits]);
  
  // Handle save changes
  const handleSaveChanges = useCallback(() => {
    const updatedBlocks = visualEdits.applyChanges();
    editorHistory.update({
      blocks: updatedBlocks,
      globalSettings: editorHistory.state?.globalSettings || {
        backgroundColor: '#f3f4f6',
        contentBackgroundColor: '#ffffff',
        maxWidth: 600,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        mobileBreakpoint: 480,
      },
    });
  }, [visualEdits, editorHistory]);
  
  // Keyboard shortcuts for visual edits mode
  useEffect(() => {
    // Skip keyboard shortcuts for V2 campaigns (they handle their own)
    if (!visualEdits.state.isActive || isV2Campaign) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape - Deselect element
      if (e.key === 'Escape') {
        e.preventDefault();
        visualEdits.selectElement(null as any, null as any); // Deselect
        return;
      }
      
      // Delete/Backspace - Delete selected element
      if ((e.key === 'Delete' || e.key === 'Backspace') && visualEdits.state.selectedElement) {
        // Only if not in an input/textarea
        if (document.activeElement?.tagName !== 'INPUT' && 
            document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          visualEdits.deleteElement(visualEdits.state.selectedElement.descriptor);
          return;
        }
      }
      
      // Cmd+Z / Ctrl+Z - Undo (in visual mode)
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (editorHistory.canUndo) {
          editorHistory.undo();
        }
        return;
      }
      
      // Cmd+Shift+Z / Ctrl+Shift+Z - Redo (in visual mode)
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        if (editorHistory.canRedo) {
          editorHistory.redo();
        }
        return;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visualEdits, editorHistory, isV2Campaign]);
  
  // Handle discard changes
  const handleDiscardChanges = useCallback(() => {
    visualEdits.discardChanges();
  }, [visualEdits]);
  
  // Handle global settings update
  const handleGlobalSettingsUpdate = useCallback((settings: Partial<GlobalEmailSettings>) => {
    if (editorHistory.state) {
      editorHistory.update({
        blocks: editorHistory.state.blocks,
        globalSettings: {
          ...editorHistory.state.globalSettings,
          ...settings,
        },
      });
    }
  }, [editorHistory]);
  
  // Handle AI element refinement
  const handleAIRefineElement = useCallback(async (prompt: string) => {
    if (!visualEdits.state.selectedElement) return;
    
    setIsAIRefining(true);
    try {
      const { descriptor } = visualEdits.state.selectedElement;
      
      const response = await fetch('/api/ai/refine-element', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          blockId: descriptor.blockId,
          elementId: descriptor.elementId,
          elementType: descriptor.elementType,
          currentValue: descriptor.currentValue,
          currentSettings: descriptor.currentSettings, // ADD: Include settings
          prompt,
        }),
      });
      
      const result = await response.json();
      
      if (result.success && result.data?.changes) {
        handleUpdateElement(descriptor.elementId, result.data.changes);
      } else {
        console.error('AI refinement failed:', result.error);
      }
    } catch (error) {
      console.error('AI refinement error:', error);
    } finally {
      setIsAIRefining(false);
    }
  }, [visualEdits.state.selectedElement, campaignId, handleUpdateElement]);
  
  // Load chat history from server on mount (only once per campaignId)
  useEffect(() => {
    // Reset ref when campaignId changes
    if (chatHistoryLoadedRef.current !== campaignId) {
      chatHistoryLoadedRef.current = null;
    }
    
    // Only load if we have campaignId, campaign is available, and we haven't loaded for this campaignId yet
    if (campaignId && campaign && chatHistoryLoadedRef.current !== campaignId) {
      chatHistoryLoadedRef.current = campaignId;
      const loadChatHistory = async () => {
        try {
          const response = await fetch(`/api/campaigns/${campaignId}/chat-history`);
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data && Array.isArray(result.data) && result.data.length > 0) {
              // Convert timestamp strings back to Date objects
              const restoredHistory: ChatMessage[] = result.data.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              }));
              setChatHistory(restoredHistory);
              return;
            }
          }
        } catch (error) {
          console.error('Failed to load chat history from server:', error);
        }

        // Fallback to localStorage if server load fails or returns empty
        const storageKey = `chat-history-${campaignId}`;
        const savedHistory = localStorage.getItem(storageKey);
        if (savedHistory) {
          try {
            const parsed = JSON.parse(savedHistory);
            const restoredHistory: ChatMessage[] = parsed.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            }));
            setChatHistory(restoredHistory);
            
            // Migrate localStorage data to server
            const historyForServer = restoredHistory.map(msg => ({
              ...msg,
              timestamp: msg.timestamp.toISOString(),
            }));
            await fetch(`/api/campaigns/${campaignId}/chat-history`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(historyForServer),
            });
            return;
          } catch (error) {
            console.error('Failed to restore chat history from localStorage:', error);
          }
        }

        // If no history exists, set initial message
        const placeholderName = getCampaignPlaceholderName(campaign);
        const initialMessage: ChatMessage = {
          role: 'assistant',
          content: `I've loaded your campaign: "${placeholderName}". How would you like to refine it?`,
          timestamp: new Date(),
        };
        setChatHistory([initialMessage]);
        
        // Save initial message to server
        try {
          await fetch(`/api/campaigns/${campaignId}/chat-history`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([{
              ...initialMessage,
              timestamp: initialMessage.timestamp.toISOString(),
            }]),
          });
        } catch (error) {
          console.error('Failed to save initial chat message:', error);
        }
      };

      loadChatHistory();
    }
  }, [campaignId, campaign]);

  // Save chat history to server (debounced) and localStorage (immediate cache)
  useEffect(() => {
    if (campaignId && chatHistory.length > 0) {
      // Save to localStorage immediately as cache
      const storageKey = `chat-history-${campaignId}`;
      localStorage.setItem(storageKey, JSON.stringify(chatHistory));

      // Debounce server save
      const timeoutId = setTimeout(async () => {
        try {
          const historyForServer = chatHistory.map(msg => ({
            ...msg,
            timestamp: msg.timestamp.toISOString(),
          }));
          await fetch(`/api/campaigns/${campaignId}/chat-history`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(historyForServer),
          });
        } catch (error) {
          console.error('Failed to save chat history to server:', error);
        }
      }, 2000); // 2 second debounce

      return () => clearTimeout(timeoutId);
    }
  }, [chatHistory, campaignId]);

  // Initialize history when campaign loads
  useEffect(() => {
    if (campaign && !editorHistory.state) {
      const blocks = campaign.blocks || [];
      // Use default design config if none exists
      const globalSettings = campaign.design_config || {
        backgroundColor: '#f3f4f6',
        contentBackgroundColor: '#ffffff',
        maxWidth: 600,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        mobileBreakpoint: 480,
      };
      
      editorHistory.initialize({
        blocks,
        globalSettings,
      });
      
      // Initialize chat versions
      setChatVersions([{
        blocks,
        globalSettings,
        timestamp: new Date(),
      }]);
      
      // Chat history is loaded separately via useEffect hook above (triggered when campaign changes)
    }
  }, [campaign, campaignId, editorHistory]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Z (Undo)
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (editorMode !== 'chat') {
          editorHistory.undo();
        }
      }
      
      // Cmd/Ctrl + Shift + Z (Redo)
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        if (editorMode !== 'chat') {
          editorHistory.redo();
        }
      }
      
      // Cmd/Ctrl + S (Save)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (editorHistory.state) {
          saveMutation.mutate({
            blocks: editorHistory.state.blocks,
            design_config: editorHistory.state.globalSettings,
          });
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorMode, editorHistory, saveMutation]);
  
  // Handle refinement from chat
  const handleRefine = async (message: string) => {
    if (!editorHistory.state) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, userMessage]);
    
    try {
      const result = await refineMutation.mutateAsync({
        message,
        currentEmail: {
          blocks: editorHistory.state.blocks,
          globalSettings: editorHistory.state.globalSettings,
          subject: campaign?.subject_line || '',
          previewText: campaign?.preview_text || '',
        },
      });
      
      // Add to chat versions
      const newVersion = {
        blocks: result.data.refinedEmail.blocks,
        globalSettings: result.data.refinedEmail.globalSettings,
        timestamp: new Date(),
      };
      
      setChatVersions([...chatVersions, newVersion]);
      setChatVersionIndex(chatVersions.length);
      
      // Update history
      editorHistory.update({
        blocks: result.data.refinedEmail.blocks,
        globalSettings: result.data.refinedEmail.globalSettings,
      });
      
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: result.data.message || 'I\'ve updated your campaign.',
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('❌ Refinement error:', err);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}. Please try again.`,
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    }
  };
  
  // Handle direct editor updates
  const handleEmailUpdate = (updates: Partial<{ blocks: EmailBlock[]; globalSettings: GlobalEmailSettings; subject: string; previewText: string; html: string; plainText: string }>) => {
    if (updates.blocks || updates.globalSettings) {
      editorHistory.update({
        blocks: updates.blocks || editorHistory.state!.blocks,
        globalSettings: updates.globalSettings || editorHistory.state!.globalSettings,
      });
    }
  };
  
  // Chat version navigation
  const goToPreviousChatVersion = () => {
    if (chatVersionIndex > 0) {
      const newIndex = chatVersionIndex - 1;
      const version = chatVersions[newIndex];
      setChatVersionIndex(newIndex);
      editorHistory.update({
        blocks: version.blocks,
        globalSettings: version.globalSettings,
      });
    }
  };
  
  const goToNextChatVersion = () => {
    if (chatVersionIndex < chatVersions.length - 1) {
      const newIndex = chatVersionIndex + 1;
      const version = chatVersions[newIndex];
      setChatVersionIndex(newIndex);
      editorHistory.update({
        blocks: version.blocks,
        globalSettings: version.globalSettings,
      });
    }
  };
  
  const handleRegenerate = () => {
    if (confirm('Start over with a new campaign? This will take you to the campaign generator.')) {
      router.push('/dashboard/campaigns/generate');
    }
  };
  
  // Generate HTML from blocks in real-time
  const currentEmail = useMemo(() => {
    if (!editorHistory.state) return null;
    
    // Use working blocks (includes pending changes) for preview
    const blocksToRender = visualEdits.state.isActive ? workingBlocks : editorHistory.state.blocks;
    
    // Generate fresh HTML from current blocks (using sync version for real-time preview)
    const html = renderBlocksToEmailSync(
      blocksToRender,
      editorHistory.state.globalSettings
    );
    
    // Generate plain text from text blocks
    const plainText = blocksToRender
      .filter((block: EmailBlock) => block.type === 'text')
      .map((block: EmailBlock) => {
        if (block.type === 'text' && 'text' in block.content) {
          return block.content.text;
        }
        return '';
      })
      .filter((text: string) => text)
      .join('\n\n');
    
    return {
      subject: campaign?.subject_line || '',
      previewText: campaign?.preview_text || '',
      html,
      plainText: plainText || campaign?.subject_line || '',
      ctaText: '',
      ctaUrl: '',
      blocks: blocksToRender,
      globalSettings: editorHistory.state.globalSettings,
    };
  }, [editorHistory.state, workingBlocks, visualEdits.state.isActive, campaign?.subject_line, campaign?.preview_text]);

  if (isLoading || !editorHistory.state || !currentEmail) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e9a589] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading campaign...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (queryError) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load campaign</p>
            <button
              onClick={() => router.push('/dashboard/campaigns')}
              className="px-4 py-2 bg-[#e9a589] text-white rounded hover:bg-[#e9a589]/90"
            >
              Back to Campaigns
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Build campaign editor controls for global header
  const campaignEditorControls: CampaignEditorControls = {
    modeSelector: (
      <div className="flex items-center gap-1">
        <button
          onClick={() => setEditorMode('chat')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm ${
            editorMode === 'chat'
              ? 'bg-[#e9a589]/10 text-[#e9a589] font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </button>
        <button
          onClick={() => setEditorMode('edit')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm ${
            editorMode === 'edit'
              ? 'bg-[#e9a589]/10 text-[#e9a589] font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          Code Editor
        </button>
      </div>
    ),
    editorActions: (
      <>
        {/* Device Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm ${
              deviceMode === 'desktop'
                ? 'bg-white text-[#e9a589] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Desktop view"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm ${
              deviceMode === 'mobile'
                ? 'bg-white text-[#e9a589] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Mobile view"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Undo/Redo (Code editor mode) */}
        {editorMode === 'edit' && (
          <div className="flex items-center gap-2">
            <button
              onClick={editorHistory.undo}
              disabled={!editorHistory.canUndo}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo (Cmd+Z)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={editorHistory.redo}
              disabled={!editorHistory.canRedo}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo (Cmd+Shift+Z)"
            >
              <RotateCcw className="w-4 h-4 scale-x-[-1]" />
            </button>
          </div>
        )}

        {/* Version Navigation (Chat mode) */}
        {editorMode === 'chat' && chatVersions.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousChatVersion}
              disabled={chatVersionIndex === 0}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-600">
              {chatVersionIndex + 1}/{chatVersions.length}
            </span>
            <button
              onClick={goToNextChatVersion}
              disabled={chatVersionIndex === chatVersions.length - 1}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4 scale-x-[-1]" />
            </button>
          </div>
        )}

        {/* Save Status */}
        <div className="flex items-center gap-2 px-2 py-1 rounded bg-gray-100">
          {saveMutation.isPending && (
            <>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-600">Saving...</span>
            </>
          )}
          {saveMutation.isSuccess && !saveMutation.isPending && (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs text-gray-600">Saved</span>
            </>
          )}
          {saveMutation.isError && (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-xs text-gray-600">Error</span>
            </>
          )}
        </div>
      </>
    ),
  };
  
  return (
    <DashboardLayout campaignEditor={campaignEditorControls}>
      <div className="flex flex-col h-full">
        {/* Editor content */}
        <div className="flex-1 overflow-hidden">
          {/* V2 Campaign uses simplified editor */}
          {isV2Campaign && v2RootComponent ? (
            <V2ChatEditor
              initialRootComponent={v2RootComponent}
              initialGlobalSettings={
                campaign.global_settings || {
                  fontFamily: 'system-ui, sans-serif',
                  primaryColor: '#7c3aed',
                  maxWidth: '600px',
                }
              }
              campaignId={campaignId}
              deviceMode={deviceMode}
            />
          ) : isV2Campaign ? (
            /* Loading V2 component tree */
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e9a589] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading editor...</p>
              </div>
            </div>
          ) : (
            /* V1 Campaign - existing code */
            <SplitScreenLayout
              leftPanel={
                editorMode === 'chat' ? (
                  <ChatInterface
                    ref={chatInterfaceRef}
                    campaignId={campaignId}
                    onRefine={handleRefine}
                    isRefining={refineMutation.isPending}
                    chatHistory={chatHistory}
                    visualEditsMode={visualEdits.state.isActive}
                    onVisualEditsToggle={visualEdits.toggleVisualEdits}
                    selectedElement={visualEdits.state.selectedElement?.descriptor || null}
                    pendingChangesCount={visualEdits.state.pendingChanges.size}
                    showExitPrompt={visualEdits.state.showExitPrompt}
                    currentGlobalSettings={editorHistory.state.globalSettings}
                    onUpdateElement={handleUpdateElement}
                    onDeleteElement={handleDeleteElement}
                    onSaveChanges={handleSaveChanges}
                    onDiscardChanges={handleDiscardChanges}
                    onClearSelection={visualEdits.clearSelection}
                    onUpdateGlobalSettings={handleGlobalSettingsUpdate}
                    onAIRefineElement={handleAIRefineElement}
                    isAIRefining={isAIRefining}
                    isChatDisabled={visualEdits.state.isActive && visualEdits.state.pendingChanges.size > 0}
                  />
                ) : (
                  <DirectEditor
                    campaign={campaign?.campaign || {
                      campaignName: campaign ? getCampaignPlaceholderName(campaign) : 'Campaign',
                      campaignType: 'one-time',
                      design: { template: 'modern' },
                      recommendedSegment: '',
                      sendTimeSuggestion: '',
                      successMetrics: ''
                    }}
                    renderedEmails={[currentEmail]}
                    selectedEmailIndex={0}
                    onUpdate={handleEmailUpdate}
                    onSelectEmail={setSelectedEmailIndex}
                  />
                )
              }
              rightPanel={
                <EmailPreview
                  blocks={workingBlocks}
                  designConfig={editorHistory.state.globalSettings}
                  plainText={currentEmail.plainText}
                  subject={currentEmail.subject}
                  deviceMode={deviceMode}
                  viewMode={viewMode}
                  onDeviceModeChange={setDeviceMode}
                  onViewModeChange={setViewMode}
                  chatMode={editorMode === 'chat'}
                  onBlockClick={(blockId, blockType, blockName) => {
                    if (chatInterfaceRef.current) {
                      const reference = `the ${blockName.toLowerCase()} block`;
                      chatInterfaceRef.current.insertText(reference);
                    }
                  }}
                  visualEditsMode={visualEdits.state.isActive}
                  selectedElement={visualEdits.state.selectedElement?.descriptor || null}
                  onElementClick={handleElementClick}
                  onUpdateGlobalSettings={handleGlobalSettingsUpdate}
                />
              }
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
