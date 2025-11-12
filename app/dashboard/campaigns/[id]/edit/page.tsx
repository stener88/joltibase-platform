'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCampaignQuery, useCampaignMutation, useCampaignRefineMutation } from '@/hooks/use-campaign-query';
import { useEditorHistory } from '@/hooks/use-editor-history';
import { renderBlocksToEmail } from '@/lib/email/blocks/renderer';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import type { CampaignEditorControls } from '@/components/dashboard/DashboardHeader';
import { SplitScreenLayout } from '@/components/campaigns/SplitScreenLayout';
import { ChatInterface, type ChatMessage } from '@/components/campaigns/ChatInterface';
import { DirectEditor } from '@/components/campaigns/DirectEditor';
import { EmailPreview, type DeviceMode, type ViewMode } from '@/components/campaigns/EmailPreview';
import { VisualBlockEditor } from '@/components/email-editor/VisualBlockEditor';
import type { EmailBlock, GlobalEmailSettings } from '@/lib/email/blocks/types';
import { MessageSquare, Edit3, Edit2, Save, RotateCcw, Monitor, Smartphone, Layers } from 'lucide-react';

type EditorMode = 'chat' | 'edit' | 'visual';

export default function DashboardCampaignEditorPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  
  // Server state (React Query)
  const { data: campaign, isLoading, error: queryError } = useCampaignQuery(campaignId);
  const saveMutation = useCampaignMutation(campaignId);
  const refineMutation = useCampaignRefineMutation(campaignId);
  
  // UI state
  const [editorMode, setEditorMode] = useState<EditorMode>('chat');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatVersions, setChatVersions] = useState<any[]>([]);
  const [chatVersionIndex, setChatVersionIndex] = useState(0);
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(0);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('html');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedCampaignName, setEditedCampaignName] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  // Undo/redo history (for visual & text modes)
  const editorHistory = useEditorHistory((state) => {
    // Auto-save callback
    saveMutation.mutate({
      blocks: state.blocks,
      design_config: state.globalSettings,
    });
  });
  
  // Initialize history when campaign loads
  useEffect(() => {
    if (campaign && !editorHistory.state) {
      const blocks = campaign.blocks || [];
      const globalSettings = campaign.design_config || {};
      
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
      
      // Set initial chat messages
      const initialMessages: ChatMessage[] = [];
      
      // Add assistant greeting
      initialMessages.push({
        role: 'assistant',
        content: `I've loaded your campaign: "${campaign.campaign?.campaignName || 'Untitled'}". How would you like to refine it?`,
        timestamp: new Date(),
      });
      
      setChatHistory(initialMessages);
    }
  }, [campaign]);
  
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
  
  // Handle visual editor updates
  const handleVisualUpdate = async (blocks: EmailBlock[], globalSettings: GlobalEmailSettings) => {
    editorHistory.update({ blocks, globalSettings });
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
    
    // Generate fresh HTML from current blocks
    const html = renderBlocksToEmail(
      editorHistory.state.blocks,
      editorHistory.state.globalSettings
    );
    
    // Generate plain text from text blocks
    const plainText = editorHistory.state.blocks
      .filter(block => block.type === 'text' || block.type === 'heading')
      .map(block => {
        if ((block.type === 'text' || block.type === 'heading') && 'text' in block.content) {
          return block.content.text;
        }
        return '';
      })
      .filter(text => text)
      .join('\n\n');
    
    return {
      subject: campaign?.subject_line || '',
      previewText: campaign?.preview_text || '',
      html,
      plainText: plainText || campaign?.subject_line || '',
      ctaText: '',
      ctaUrl: '',
      blocks: editorHistory.state.blocks,
      globalSettings: editorHistory.state.globalSettings,
    };
  }, [editorHistory.state, campaign?.subject_line, campaign?.preview_text]);

  if (isLoading || !editorHistory.state || !currentEmail) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
    campaignName: campaign?.campaign?.campaignName || 'Untitled Campaign',
    isEditingName,
    editedCampaignName,
    onStartEditName: () => {
      setEditedCampaignName(campaign?.campaign?.campaignName || 'Untitled');
      setIsEditingName(true);
    },
    onCancelEditName: () => setIsEditingName(false),
    onSaveEditName: () => {
      setIsEditingName(false);
      // TODO: Save campaign name to database
    },
    onNameChange: (value) => setEditedCampaignName(value),
    onNameKeyDown: (e) => {
      if (e.key === 'Enter') {
        setIsEditingName(false);
      }
    },
    nameInputRef,
    editorActions: (
      <>
        {/* Editor Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setEditorMode('chat')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm ${
              editorMode === 'chat'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </button>
          <button
            onClick={() => setEditorMode('visual')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm ${
              editorMode === 'visual'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            Visual
          </button>
          <button
            onClick={() => setEditorMode('edit')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm ${
              editorMode === 'edit'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            Text
          </button>
        </div>

        {/* Device Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm ${
              deviceMode === 'desktop'
                ? 'bg-white text-blue-600 shadow-sm'
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
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Mobile view"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Undo/Redo (Visual & Text modes) */}
        {(editorMode === 'visual' || editorMode === 'edit') && (
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
        {editorMode === 'visual' ? (
          <div className="flex-1 overflow-hidden">
            <VisualBlockEditor
              initialBlocks={editorHistory.state.blocks}
              initialDesignConfig={editorHistory.state.globalSettings}
              campaignId={campaignId}
              deviceMode={deviceMode}
              onSave={handleVisualUpdate}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <SplitScreenLayout
              leftPanel={
                editorMode === 'chat' ? (
                  <ChatInterface
                    campaignId={campaignId}
                    onRefine={handleRefine}
                    isRefining={refineMutation.isPending}
                    chatHistory={chatHistory}
                  />
                ) : (
                  <DirectEditor
                    campaign={campaign?.campaign || {
                      campaignName: 'Untitled',
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
                  blocks={editorHistory.state.blocks}
                  designConfig={editorHistory.state.globalSettings}
                  plainText={currentEmail.plainText}
                  subject={currentEmail.subject}
                  deviceMode={deviceMode}
                  viewMode={viewMode}
                  onDeviceModeChange={setDeviceMode}
                  onViewModeChange={setViewMode}
                />
              }
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
