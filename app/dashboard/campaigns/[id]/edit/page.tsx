'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SplitScreenLayout } from '@/components/campaigns/SplitScreenLayout';
import { ChatInterface, type ChatMessage } from '@/components/campaigns/ChatInterface';
import { DirectEditor } from '@/components/campaigns/DirectEditor';
import { EmailPreview, type DeviceMode, type ViewMode } from '@/components/campaigns/EmailPreview';
import { MessageSquare, Edit3, Edit2, Save, RotateCcw, Send, Monitor, Tablet, Smartphone, Code, Eye, Copy } from 'lucide-react';

interface CampaignData {
  id: string;
  campaign: {
    campaignName: string;
    campaignType: string;
    design: {
      template: string;
      ctaColor?: string;
      accentColor?: string;
      headerGradient?: {
        from: string;
        to: string;
      };
    };
    recommendedSegment: string;
    sendTimeSuggestion: string;
    successMetrics: string;
  };
  renderedEmails: Array<{
    subject: string;
    previewText: string;
    html: string;
    plainText: string;
    ctaText: string;
    ctaUrl: string;
  }>;
  metadata: {
    model: string;
    tokensUsed: number;
    promptTokens: number;
    completionTokens: number;
    costUsd: number;
    generationTimeMs: number;
    generatedAt: Date;
  };
}

type EditorMode = 'chat' | 'edit';

export default function DashboardCampaignEditorPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  
  // Split-screen editor state
  const [editorMode, setEditorMode] = useState<EditorMode>('chat');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isRefining, setIsRefining] = useState(false);
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(0);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('html');
  
  // Local editable campaign state (for direct editing)
  const [editedEmails, setEditedEmails] = useState<CampaignData['renderedEmails']>([]);

  // Inline campaign name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedCampaignName, setEditedCampaignName] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Load campaign (authentication is handled by DashboardLayout)
  useEffect(() => {
    const loadCampaign = async () => {
      try {
        // Fetch campaign data
        const response = await fetch(`/api/campaigns/${campaignId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Campaign not found');
          } else if (response.status === 403) {
            throw new Error('You do not have access to this campaign');
          } else {
            throw new Error('Failed to load campaign');
          }
        }

        const result = await response.json();
        
        if (result.success && result.data) {
          const rawCampaign = result.data;
          
          // Transform raw database structure to editor format
          let transformedData: CampaignData;
          if (rawCampaign.ai_generated && rawCampaign.ai_metadata) {
            const aiMetadata = rawCampaign.ai_metadata as any;
            transformedData = {
              id: rawCampaign.id,
              campaign: aiMetadata.campaign || {
                campaignName: rawCampaign.name,
                campaignType: rawCampaign.type,
                design: { template: 'modern' },
                recommendedSegment: '',
                sendTimeSuggestion: '',
                successMetrics: ''
              },
              renderedEmails: aiMetadata.renderedEmails || [],
              metadata: {
                model: rawCampaign.ai_model || 'gpt-4-turbo-preview',
                tokensUsed: 0,
                promptTokens: 0,
                completionTokens: 0,
                costUsd: 0,
                generationTimeMs: 0,
                generatedAt: new Date(rawCampaign.created_at)
              }
            };
          } else {
            // For manually created campaigns, construct a compatible structure
            transformedData = {
              id: rawCampaign.id,
              campaign: {
                campaignName: rawCampaign.name,
                campaignType: rawCampaign.type,
                design: { template: 'modern' },
                recommendedSegment: '',
                sendTimeSuggestion: '',
                successMetrics: ''
              },
              renderedEmails: rawCampaign.html_content ? JSON.parse(rawCampaign.html_content) : [],
              metadata: {
                model: 'manual',
                tokensUsed: 0,
                promptTokens: 0,
                completionTokens: 0,
                costUsd: 0,
                generationTimeMs: 0,
                generatedAt: new Date(rawCampaign.created_at)
              }
            };
          }
          
          setCampaignData(transformedData);
          setEditedEmails(transformedData.renderedEmails);
          
          // Set initial chat message
          setChatHistory([
            {
              role: 'assistant',
              content: `I've loaded your campaign: "${transformedData.campaign.campaignName}". How would you like to refine it?`,
              timestamp: new Date(),
            },
          ]);
        } else {
          throw new Error('Invalid campaign data received');
        }
      } catch (err: any) {
        console.error('Failed to load campaign:', err);
        setError(err.message || 'An error occurred while loading the campaign');
      } finally {
        setIsLoading(false);
      }
    };

    if (campaignId) {
      loadCampaign();
    }
  }, [campaignId]);

  const handleRefine = async (message: string) => {
    if (!campaignData) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, userMessage]);
    
    setIsRefining(true);
    
    try {
      console.log('🔄 [FRONTEND] Sending refinement request...');
      
      const response = await fetch('/api/ai/refine-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId: campaignData.id,
          message,
          currentEmail: {
            subject: editedEmails[selectedEmailIndex].subject,
            previewText: editedEmails[selectedEmailIndex].previewText,
            html: editedEmails[selectedEmailIndex].html,
            plainText: editedEmails[selectedEmailIndex].plainText,
            ctaText: editedEmails[selectedEmailIndex].ctaText,
            ctaUrl: editedEmails[selectedEmailIndex].ctaUrl,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to refine campaign');
      }

      const result = await response.json();
      console.log('✅ [FRONTEND] Refinement response received:', {
        hasRefinedEmail: !!result.data?.refinedEmail,
        changes: result.data?.refinedEmail?.changes?.length || 0,
      });
      
      if (result.success && result.data.refinedEmail) {
        const refined = result.data.refinedEmail;
        
        console.log('🔄 [FRONTEND] Updating email state with refined content...');
        
        setEditedEmails((prev) => {
          const newEmails = [...prev];
          newEmails[selectedEmailIndex] = {
            ...newEmails[selectedEmailIndex],
            subject: refined.subject,
            previewText: refined.previewText || '',
            html: refined.html,
            plainText: refined.plainText,
            ctaText: refined.ctaText,
            ctaUrl: refined.ctaUrl,
          };
          console.log('✅ [FRONTEND] Email state updated, preview should refresh');
          return newEmails;
        });
        
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: result.data.message,
          timestamp: new Date(),
        };
        setChatHistory((prev) => [...prev, aiMessage]);
      }
    } catch (err: any) {
      console.error('❌ [FRONTEND] Refinement error:', err);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}. Please try again.`,
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsRefining(false);
    }
  };

  const handleEmailUpdate = (updates: Partial<CampaignData['renderedEmails'][0]>) => {
    console.log('📝 [FRONTEND] Direct edit update:', Object.keys(updates));
    setEditedEmails((prev) => {
      const newEmails = [...prev];
      newEmails[selectedEmailIndex] = {
        ...newEmails[selectedEmailIndex],
        ...updates,
      };
      return newEmails;
    });
  };

  const handleRegenerate = () => {
    if (confirm('Start over with a new campaign? This will take you to the campaign generator.')) {
      router.push('/dashboard/campaigns/generate');
    }
  };

  const handleSave = async () => {
    alert('Save functionality coming soon!');
  };

  const handleSendTest = async () => {
    alert('Send test functionality coming soon!');
  };

  const handleSaveCampaignName = async () => {
    const trimmedName = editedCampaignName.trim();
    
    // Validation: don't allow empty names
    if (!trimmedName) {
      setEditedCampaignName(campaignData?.campaign.campaignName || '');
      setIsEditingName(false);
      return;
    }

    // No change, just exit
    if (trimmedName === campaignData?.campaign.campaignName) {
      setIsEditingName(false);
      return;
    }

    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: trimmedName }),
      });

      if (!response.ok) {
        throw new Error('Failed to update campaign name');
      }

      // Update local state
      if (campaignData) {
        setCampaignData({
          ...campaignData,
          campaign: {
            ...campaignData.campaign,
            campaignName: trimmedName,
          },
        });
      }

      setIsEditingName(false);
    } catch (error) {
      console.error('Error updating campaign name:', error);
      // Revert to original name on error
      setEditedCampaignName(campaignData?.campaign.campaignName || '');
      setIsEditingName(false);
      alert('Failed to update campaign name. Please try again.');
    }
  };

  const handleCancelNameEdit = () => {
    setEditedCampaignName(campaignData?.campaign.campaignName || '');
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveCampaignName();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelNameEdit();
    }
  };

  // Auto-focus input when entering edit mode
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <svg
              className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-600">Loading campaign...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error || !campaignData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {error || 'Campaign not found'}
            </h1>
            <p className="text-gray-600 mb-6">
              {error === 'Campaign not found' 
                ? "This campaign doesn't exist or has been deleted."
                : error === 'You do not have access to this campaign'
                ? "You don't have permission to view this campaign."
                : "Something went wrong while loading the campaign."}
            </p>
            <button
              onClick={() => router.push('/dashboard/campaigns/generate')}
              className="px-6 py-3 bg-[#1a1aff] text-white rounded-lg hover:bg-[#0000cc] transition-colors"
            >
              Create New Campaign
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show split-screen editor
  const currentEmail = editedEmails[selectedEmailIndex];
  
  return (
    <DashboardLayout>
      <div className="flex flex-col" style={{ height: 'calc(100vh - 48px)' }}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Inline Editable Campaign Name */}
            <div className="relative group flex-1 max-w-2xl">
              {isEditingName ? (
                <input
                  ref={nameInputRef}
                  type="text"
                  value={editedCampaignName}
                  onChange={(e) => setEditedCampaignName(e.target.value)}
                  onBlur={handleSaveCampaignName}
                  onKeyDown={handleNameKeyDown}
                  className="text-2xl font-bold text-gray-900 border border-transparent hover:border-gray-200 focus:border-gray-400 rounded-lg px-3 py-1 w-full focus:outline-none transition-colors"
                />
              ) : (
                <button
                  onClick={() => {
                    setEditedCampaignName(campaignData.campaign.campaignName);
                    setIsEditingName(true);
                  }}
                  className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors text-left px-3 py-1 rounded-lg hover:bg-gray-50 flex items-center gap-2 group"
                >
                  <span>{campaignData.campaign.campaignName}</span>
                  <Edit2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Mode Toggle */}
              <button
                onClick={() => setEditorMode(editorMode === 'chat' ? 'edit' : 'chat')}
                className="px-4 py-2 text-sm rounded-lg flex items-center gap-2 transition-all bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                {editorMode === 'chat' ? (
                  <>
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </>
                )}
              </button>

              <div className="h-6 w-px bg-gray-200 mx-1" />

              {/* Preview Controls */}
              <div className="flex items-center gap-2">
                {/* Device toggle */}
                <button
                  onClick={() => {
                    const modes: DeviceMode[] = ['desktop', 'tablet', 'mobile'];
                    const currentIndex = modes.indexOf(deviceMode);
                    const nextIndex = (currentIndex + 1) % modes.length;
                    setDeviceMode(modes[nextIndex]);
                  }}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                  title={`${deviceMode.charAt(0).toUpperCase() + deviceMode.slice(1)} view`}
                >
                  {deviceMode === 'mobile' && <Smartphone className="w-5 h-5 text-gray-600" />}
                  {deviceMode === 'tablet' && <Tablet className="w-5 h-5 text-gray-600" />}
                  {deviceMode === 'desktop' && <Monitor className="w-5 h-5 text-gray-600" />}
                </button>

                {/* View toggle */}
                <button
                  onClick={() => setViewMode(viewMode === 'html' ? 'text' : 'html')}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                  title={viewMode === 'html' ? 'Switch to plain text' : 'Switch to HTML'}
                >
                  {viewMode === 'html' ? <Code className="w-5 h-5 text-gray-600" /> : <Eye className="w-5 h-5 text-gray-600" />}
                </button>

                {/* Copy button */}
                <button
                  onClick={() => {
                    const content = viewMode === 'html' ? currentEmail.html : currentEmail.plainText;
                    navigator.clipboard.writeText(content);
                  }}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                  title="Copy to clipboard"
                >
                  <Copy className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="h-6 w-px bg-gray-200 mx-1" />

              {/* Action Buttons */}
              <button
                onClick={handleSendTest}
                className="px-4 py-2 text-sm bg-white border border-gray-200 text-black rounded-lg hover:border-gray-300 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Test
              </button>
              <button
                onClick={handleRegenerate}
                className="px-4 py-2 text-sm bg-white border border-gray-200 text-black rounded-lg hover:border-gray-300 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                New
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-[#1a1aff] text-white rounded-lg hover:bg-[#3333ff] transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="flex-1 overflow-hidden">
          <SplitScreenLayout
            leftPanel={
              editorMode === 'chat' ? (
                <ChatInterface
                  campaignId={campaignData.id}
                  onRefine={handleRefine}
                  isRefining={isRefining}
                  chatHistory={chatHistory}
                />
              ) : (
                <DirectEditor
                  campaign={campaignData.campaign}
                  renderedEmails={editedEmails}
                  selectedEmailIndex={selectedEmailIndex}
                  onUpdate={handleEmailUpdate}
                  onSelectEmail={setSelectedEmailIndex}
                />
              )
            }
            rightPanel={
              <EmailPreview
                html={currentEmail.html}
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
      </div>
    </DashboardLayout>
  );
}

