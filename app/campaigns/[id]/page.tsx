'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/Header';
import { AuthModal } from '@/components/auth/AuthModal';
import { GradientBackground } from '@/components/campaigns/GradientBackground';
import { SplitScreenLayout } from '@/components/campaigns/SplitScreenLayout';
import { ChatInterface, type ChatMessage } from '@/components/campaigns/ChatInterface';
import { DirectEditor } from '@/components/campaigns/DirectEditor';
import { EmailPreview, type DeviceMode, type ViewMode } from '@/components/campaigns/EmailPreview';
import { MessageSquare, Edit3, Save, RotateCcw, Send, ChevronLeft, ChevronRight, Monitor, Tablet, Smartphone, Code, Eye, Copy, PanelLeftClose, PanelRightOpen } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

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
    blocks?: any[];
    globalSettings?: any;
  }>;
  blocks?: any[];
  design_config?: any;
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

/**
 * Generate a meaningful placeholder name from campaign content
 */
function getCampaignPlaceholderName(campaignData: CampaignData): string {
  // Try subject line from first email (most descriptive)
  if (campaignData.renderedEmails && campaignData.renderedEmails.length > 0) {
    const firstEmail = campaignData.renderedEmails[0];
    if (firstEmail.subject) {
      const subject = firstEmail.subject.trim();
      // Limit to 50 chars and remove trailing punctuation
      return subject.length > 50 ? subject.substring(0, 47) + '...' : subject.replace(/[.!?]+$/, '');
    }
  }
  
  // Try first heading block text
  if (campaignData.blocks && Array.isArray(campaignData.blocks)) {
    const headingBlock = campaignData.blocks.find((block: any) => 
      block.type === 'heading' || block.type === 'text'
    );
    if (headingBlock?.content?.text) {
      const text = headingBlock.content.text.trim();
      return text.length > 50 ? text.substring(0, 47) + '...' : text.replace(/[.!?]+$/, '');
    }
  }
  
  // Try preview text from first email
  if (campaignData.renderedEmails && campaignData.renderedEmails.length > 0) {
    const firstEmail = campaignData.renderedEmails[0];
    if (firstEmail.previewText) {
      const preview = firstEmail.previewText.trim();
      const words = preview.split(/\s+/).slice(0, 6).join(' ');
      return words.length > 50 ? words.substring(0, 47) + '...' : words;
    }
  }
  
  // Try campaign type as fallback
  if (campaignData.campaign?.campaignType) {
    const type = campaignData.campaign.campaignType;
    return type === 'one-time' ? 'One-time Campaign' : 
           type === 'sequence' ? 'Email Sequence' : 
           type === 'automation' ? 'Automated Campaign' : 'Campaign';
  }
  
  // Last resort
  return 'Campaign';
}

export default function CampaignEditorPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  
  // Split-screen editor state
  const [editorMode, setEditorMode] = useState<EditorMode>('chat');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isRefining, setIsRefining] = useState(false);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (campaignId && chatHistory.length > 0) {
      const storageKey = `chat-history-${campaignId}`;
      localStorage.setItem(storageKey, JSON.stringify(chatHistory));
    }
  }, [chatHistory, campaignId]);
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(0);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('html');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Local editable campaign state (for direct editing)
  const [editedEmails, setEditedEmails] = useState<CampaignData['renderedEmails']>([]);

  // Check authentication and load campaign
  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        // Show auth modal for unauthenticated users, but allow viewing
        if (authError || !user) {
          setShowAuthModal(true);
          setIsLoading(false);
          return;
        }
        
        setUser(user);

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
              blocks: rawCampaign.blocks || [],
              design_config: rawCampaign.design_config || null,
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
              blocks: rawCampaign.blocks || [],
              design_config: rawCampaign.design_config || null,
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
          
          // Restore chat history from localStorage, or set initial message
          const storageKey = `chat-history-${campaignId}`;
          const savedHistory = localStorage.getItem(storageKey);
          if (savedHistory) {
            try {
              const parsed = JSON.parse(savedHistory);
              // Convert timestamp strings back to Date objects
              const restoredHistory: ChatMessage[] = parsed.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              }));
              setChatHistory(restoredHistory);
            } catch (error) {
              console.error('Failed to restore chat history:', error);
              // Fallback to initial message
              const placeholderName = transformedData.campaign.campaignName || getCampaignPlaceholderName(transformedData);
              setChatHistory([
                {
                  role: 'assistant',
                  content: `I've loaded your campaign: "${placeholderName}". How would you like to refine it?`,
                  timestamp: new Date(),
                },
              ]);
            }
          } else {
            // Set initial chat message
            const placeholderName = transformedData.campaign.campaignName || getCampaignPlaceholderName(transformedData);
            setChatHistory([
              {
                role: 'assistant',
                content: `I've loaded your campaign: "${placeholderName}". How would you like to refine it?`,
                timestamp: new Date(),
              },
            ]);
          }
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
  }, [campaignId, router]);

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
            blocks: editedEmails[selectedEmailIndex].blocks || campaignData.blocks || [],
            globalSettings: editedEmails[selectedEmailIndex].globalSettings || campaignData.design_config || {},
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
            blocks: refined.blocks,
            globalSettings: refined.globalSettings,
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

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Reload the page to fetch campaign data with authenticated user
    window.location.reload();
  };

  const handleRegenerate = () => {
    if (confirm('Start over with a new campaign? This will take you back to the form.')) {
      router.push('/');
    }
  };

  const handleBackToForm = () => {
    router.push('/');
  };

  const handleSave = async () => {
    alert('Save functionality coming soon!');
  };

  const handleSendTest = async () => {
    alert('Send test functionality coming soon!');
  };

  // Show loading state
  if (isLoading) {
    return (
      <>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          onSuccess={handleAuthSuccess}
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      </>
    );
  }

  // Show error state
  if (error || !campaignData) {
    return (
      <>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          onSuccess={handleAuthSuccess}
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-[#1a1aff] text-white rounded-lg hover:bg-[#0000cc] transition-colors"
            >
              Create New Campaign
            </button>
          </div>
        </div>
      </>
    );
  }

  // Show split-screen editor
  const currentEmail = editedEmails[selectedEmailIndex];
  
  return (
    <>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={handleAuthSuccess}
      />
      <div className="h-screen flex flex-col">
        <Header 
          onLoginClick={() => setShowAuthModal(true)}
          campaignMode={{
            campaignName: campaignData.campaign.campaignName,
            onBack: handleBackToForm,
            centerContent: (
              <div className="flex items-center justify-between w-full ml-3 pr-3">
                <h2 className="text-base font-semibold text-black">
                  {campaignData.campaign.campaignName}
                </h2>
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all flex-shrink-0"
                  title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {isSidebarCollapsed ? (
                    <PanelRightOpen className="w-5 h-5 text-gray-600" />
                  ) : (
                    <PanelLeftClose className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            ),
            rightContent: (
              <>
            {/* Mode Toggle */}
            <button
              onClick={() => setEditorMode(editorMode === 'chat' ? 'edit' : 'chat')}
              className="px-4 py-2 text-xs rounded-lg flex items-center gap-2 transition-all bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black"
            >
              {editorMode === 'chat' ? (
                <>
                  <Edit3 className="w-5 h-5" />
                  Edit
                </>
              ) : (
                <>
                  <MessageSquare className="w-5 h-5" />
                  Chat
                </>
              )}
            </button>

            <div className="h-5 w-px bg-gray-200 mx-1" />

            {/* Preview Controls */}
            <div className="flex items-center gap-2">
              {/* Device toggle - cycles through modes */}
              <button
                onClick={() => {
                  const modes: DeviceMode[] = ['desktop', 'tablet', 'mobile'];
                  const currentIndex = modes.indexOf(deviceMode);
                  const nextIndex = (currentIndex + 1) % modes.length;
                  setDeviceMode(modes[nextIndex]);
                }}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                title={`${deviceMode.charAt(0).toUpperCase() + deviceMode.slice(1)} view - Click to cycle`}
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

            <div className="h-5 w-px bg-gray-200 mx-1" />

            {/* Action Buttons */}
            <button
              onClick={handleSendTest}
              className="px-4 py-2 text-xs bg-white border border-gray-200 text-black rounded-lg hover:border-gray-300 transition-all flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Test
            </button>
            <button
              onClick={handleRegenerate}
              className="px-4 py-2 text-xs bg-white border border-gray-200 text-black rounded-lg hover:border-gray-300 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              New
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs bg-[#1a1aff] text-white rounded-lg hover:bg-[#3333ff] transition-all flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save
            </button>
            </>
            )
          }}
        />
        <GradientBackground />

      {/* Split Screen Layout */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <SplitScreenLayout
          isCollapsed={isSidebarCollapsed}
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
    </>
  );
}

