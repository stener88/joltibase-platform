'use client';

import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { PromptInput } from './PromptInput';
import { FloatingToolbar } from './visual-edits/FloatingToolbar';
import { InlineContentPanel } from './visual-edits/InlineContentPanel';
import { InlineStylesPanel } from './visual-edits/InlineStylesPanel';
import { InlineSpacingPanel } from './visual-edits/InlineSpacingPanel';
import { GlobalSettingsToolbar } from './visual-edits/GlobalSettingsToolbar';
import { SaveDiscardBar } from './visual-edits/SaveDiscardBar';
import type { ElementDescriptor } from '@/lib/email-v2/visual-edits/element-descriptor';
import type { GlobalEmailSettings } from '@/lib/email/blocks/types';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatInterfaceRef {
  insertText: (text: string) => void;
}

interface ChatInterfaceProps {
  campaignId: string;
  onRefine: (message: string) => Promise<void>;
  isRefining: boolean;
  chatHistory: ChatMessage[];
  chatInterfaceRef?: React.RefObject<ChatInterfaceRef>;
  visualEditsMode?: boolean;
  onVisualEditsToggle?: () => void;
  showDiscardSaveButtons?: boolean;
  // Visual edits state
  selectedElement?: ElementDescriptor | null;
  pendingChangesCount?: number;
  showExitPrompt?: boolean;
  currentGlobalSettings?: GlobalEmailSettings;
  onUpdateElement?: (elementId: string, changes: Record<string, any>) => void;
  onDeleteElement?: (elementId: string) => void;
  onSaveChanges?: () => void;
  onDiscardChanges?: () => void;
  onClearSelection?: () => void;
  onUpdateGlobalSettings?: (settings: Partial<GlobalEmailSettings>) => void;
  onAIRefineElement?: (prompt: string) => Promise<void>;
  isAIRefining?: boolean;
  isChatDisabled?: boolean;
}

export const ChatInterface = forwardRef<ChatInterfaceRef, ChatInterfaceProps>(({
  campaignId,
  onRefine,
  isRefining,
  chatHistory,
  visualEditsMode = false,
  onVisualEditsToggle,
  showDiscardSaveButtons = false,
  selectedElement = null,
  pendingChangesCount = 0,
  showExitPrompt = false,
  currentGlobalSettings,
  onUpdateElement,
  onDeleteElement,
  onSaveChanges,
  onDiscardChanges,
  onClearSelection,
  onUpdateGlobalSettings,
  onAIRefineElement,
  isAIRefining = false,
  isChatDisabled = false,
}, ref) => {
  const [message, setMessage] = useState('');
  const [chatOnly, setChatOnly] = useState(false);
  const [showChips, setShowChips] = useState(false);
  const [activePanel, setActivePanel] = useState<'content' | 'styles' | 'spacing' | 'globalSettings' | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle outside clicks to close toolbars in visual edits mode
  useEffect(() => {
    if (!visualEditsMode || (!selectedElement && !showExitPrompt)) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside the chat container (which includes the email preview)
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
        // Clear selection and close panels
        if (onClearSelection) {
          onClearSelection();
        }
        setActivePanel(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visualEditsMode, selectedElement, showExitPrompt, onClearSelection]);
  
  // Expose method to insert block reference
  useImperativeHandle(ref, () => ({
    insertText: (text: string) => {
      setMessage((prev) => {
        const separator = prev.trim() && !prev.trim().endsWith(',') ? ', ' : '';
        return prev + separator + text;
      });
      // Focus input after a short delay to ensure state update
      setTimeout(() => {
        inputRef.current?.focus();
        // Move cursor to end
        if (inputRef.current) {
          const length = inputRef.current.value.length;
          inputRef.current.setSelectionRange(length, length);
        }
      }, 0);
    },
  }));

  const suggestionChips = [
    { 
      label: 'Add Pricing Section',
      prompt: 'Add a pricing section with three tiers (Basic, Pro, Enterprise) including feature comparison cards and pricing details'
    },
    {
      label: 'Include Testimonials',
      prompt: 'Include 2-3 customer testimonials with quotes, names, titles, and company names for social proof'
    },
    {
      label: 'Add Urgency',
      prompt: 'Add urgency messaging with a limited-time offer, countdown timer, or scarcity indicators'
    },
    {
      label: 'Make it Professional',
      prompt: 'Make the tone more professional and corporate-appropriate for B2B decision-makers and executives'
    },
    {
      label: 'Shorten Content',
      prompt: 'Shorten the email to under 200 words while keeping the main message and CTA clear and prominent'
    },
    {
      label: 'Add Personalization',
      prompt: 'Add more personalization using merge tags like {{first_name}}, {{company_name}}, and industry-specific content'
    },
    {
      label: 'Include Stats',
      prompt: 'Include impressive statistics and numbers to build credibility (e.g., user count, uptime, growth metrics, success rates)'
    },
    {
      label: 'Add Hero Section',
      prompt: 'Add a visually striking hero section with a bold headline (60-70px), compelling subheadline, and optional hero image'
    },
    {
      label: 'Tell a Story',
      prompt: 'Restructure as a story-driven narrative with a clear problem, solution, and transformation arc'
    },
    {
      label: 'Make it Casual',
      prompt: 'Make the tone more casual and conversational, as if writing to a friend or close colleague'
    },
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Update toolbar position when element is selected
  useEffect(() => {
    if (selectedElement && visualEditsMode) {
      const element = document.querySelector(`[data-element-id="${selectedElement.elementId}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const toolbarHeight = 200; // Estimated toolbar height
        const toolbarWidth = 500; // Estimated toolbar width (centered, so 250 on each side)
        
        // Calculate available space above and below
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        // Calculate horizontal position with viewport boundary detection
        let xPos = rect.left + rect.width / 2 - 250; // Center toolbar by default
        
        // Check if toolbar would go off-screen on the left
        if (xPos < 20) {
          xPos = 20; // 20px margin from left edge
        }
        
        // Check if toolbar would go off-screen on the right
        if (xPos + toolbarWidth > viewportWidth - 20) {
          xPos = viewportWidth - toolbarWidth - 20; // 20px margin from right edge
        }
        
        // Smart vertical positioning: prefer below, fall back to above if not enough space
        let yPos;
        if (spaceBelow >= toolbarHeight) {
          // Position below the element
          yPos = rect.bottom + 10; // 10px below element
        } else if (spaceAbove >= toolbarHeight) {
          // Position above the element
          yPos = rect.top - toolbarHeight - 10; // 10px above element
        } else {
          // Not enough space either way, prefer below and let it scroll
          yPos = rect.bottom + 10; // 10px below element
        }
        
        setToolbarPosition({ x: xPos, y: yPos });
      }
    }
  }, [selectedElement, visualEditsMode]);

  const handleSubmit = async () => {
    if (!message.trim() || isRefining) return;

    const userMessage = message.trim();
    setMessage('');
    await onRefine(userMessage);
  };

  const handleAISubmit = async (prompt: string) => {
    if (onAIRefineElement) {
      await onAIRefineElement(prompt);
    }
  };

  const handleContentClick = () => {
    setActivePanel(prev => prev === 'content' ? null : 'content');
  };

  const handleStylesClick = () => {
    setActivePanel(prev => prev === 'styles' ? null : 'styles');
  };

  const handleSpacingClick = () => {
    setActivePanel(prev => prev === 'spacing' ? null : 'spacing');
  };

  const handleGlobalSettingsClick = () => {
    setActivePanel(prev => prev === 'globalSettings' ? null : 'globalSettings');
  };

  const handleDeleteClick = () => {
    if (selectedElement && onDeleteElement) {
      onDeleteElement(selectedElement.elementId);
    }
  };

  const handleAddBlockClick = () => {
    // TODO: Implement add block functionality
    console.log('Add block clicked');
  };

  const handleClosePanel = () => {
    setActivePanel(null);
  };

  return (
    <div ref={chatContainerRef} className="flex flex-col h-full bg-[#faf9f5]">
      {/* Pending Changes Indicator */}
      {visualEditsMode && pendingChangesCount > 0 && (
        <div className="sticky top-0 z-10 px-4 py-2 bg-amber-50 border-b border-amber-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-amber-800 font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {pendingChangesCount} {pendingChangesCount === 1 ? 'change' : 'changes'} pending
            </p>
            {onSaveChanges && onDiscardChanges && (
              <div className="flex items-center gap-2">
                <button
                  onClick={onDiscardChanges}
                  className="px-3 py-1 text-sm text-amber-700 hover:text-amber-900 font-medium"
                >
                  Discard
                </button>
                <button
                  onClick={onSaveChanges}
                  className="px-3 py-1 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Chat Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-[#e8e7e5] mx-auto mb-4" />
            <p className="text-[#6b6b6b]">
              Start a conversation to refine your campaign
            </p>
          </div>
        ) : (
          <>
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-5 py-3 ${
                    msg.role === 'user'
                      ? 'bg-[#f0eee8] text-[#3d3d3a] border border-[#e8e7e5]'
                      : 'bg-white text-[#3d3d3a] border border-[#e8e7e5] shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed" style={{ fontSize: '15px' }}>{msg.content}</p>
                  <span className="text-xs text-[#6b6b6b] mt-1.5 block">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}

        {isRefining && (
          <div className="flex justify-start">
            <div className="bg-white text-[#3d3d3a] border border-[#e8e7e5] shadow-sm rounded-xl px-5 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#e9a589]" />
                <span className="text-[#6b6b6b]">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form with Quick Prompts */}
      <div className="relative flex-shrink-0 px-6 py-4">
        {/* Quick Prompts Popover */}
        {showChips && (
          <div className="absolute bottom-full left-6 right-6 mb-2 p-3 bg-white rounded-xl shadow-lg border border-[#e8e7e5] flex flex-wrap gap-2 z-10">
            {suggestionChips.map((chip, index) => (
              <button
                key={index}
                onClick={() => {
                  setMessage(chip.prompt);
                  setShowChips(false);
                }}
                disabled={isRefining || isChatDisabled}
                className="px-3 py-1.5 text-sm bg-[#f5f4ed] hover:bg-[#e9a589] hover:text-white rounded-full text-[#3d3d3a] transition-all disabled:opacity-50 font-medium border border-[#e8e7e5]"
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}
        
        <PromptInput
          value={message}
          onChange={setMessage}
          onSubmit={handleSubmit}
          isLoading={isRefining}
          disabled={isChatDisabled}
          disabledReason={isChatDisabled ? "Save or discard your visual changes to continue chatting" : undefined}
          placeholder="Ask Jolti..."
          compact
          disableAnimation
          chatOnly={chatOnly}
          onChatOnlyToggle={() => setChatOnly(!chatOnly)}
          onLightningToggle={() => setShowChips(!showChips)}
          showLightningChips={showChips}
          visualEditsMode={visualEditsMode}
          onVisualEditsToggle={onVisualEditsToggle}
          showDiscardSaveButtons={showDiscardSaveButtons}
          inputRef={inputRef}
        />
      </div>
      
      {/* Visual Edits UI */}
      {visualEditsMode && selectedElement && (
        <>
          {/* Compact Icon Toolbar */}
          <FloatingToolbar
            descriptor={selectedElement}
            position={toolbarPosition}
            onAISubmit={handleAISubmit}
            onContentClick={handleContentClick}
            onStylesClick={handleStylesClick}
            onSpacingClick={handleSpacingClick}
            onGlobalSettingsClick={handleGlobalSettingsClick}
            onDeleteClick={handleDeleteClick}
            isAILoading={isAIRefining}
          />
          
          {/* Inline Content Panel - Appears below toolbar */}
          {activePanel === 'content' && onUpdateElement && (
            <InlineContentPanel
              descriptor={selectedElement}
              position={{
                x: toolbarPosition.x + 150,
                y: toolbarPosition.y + 60,
              }}
              onUpdate={(changes) => onUpdateElement(selectedElement.elementId, changes)}
            />
          )}
          
          {/* Inline Styles Panel - Appears below toolbar */}
          {activePanel === 'styles' && onUpdateElement && (
            <InlineStylesPanel
              descriptor={selectedElement}
              position={{
                x: toolbarPosition.x + 150,
                y: toolbarPosition.y + 60,
              }}
              onUpdate={(changes) => onUpdateElement(selectedElement.elementId, changes)}
            />
          )}

          {/* Inline Spacing Panel - Appears below toolbar */}
          {activePanel === 'spacing' && onUpdateElement && (
            <InlineSpacingPanel
              descriptor={selectedElement}
              position={{
                x: toolbarPosition.x + 150,
                y: toolbarPosition.y + 60,
              }}
              onUpdate={(changes) => onUpdateElement(selectedElement.elementId, changes)}
            />
          )}

          {/* Inline Global Settings Panel - Appears below toolbar */}
          {activePanel === 'globalSettings' && currentGlobalSettings && onUpdateGlobalSettings && (
            <GlobalSettingsToolbar
              position={{
                x: toolbarPosition.x + 150,
                y: toolbarPosition.y + 60,
              }}
              currentSettings={currentGlobalSettings}
              onUpdate={onUpdateGlobalSettings}
            />
          )}
        </>
      )}
      
      {/* Save/Discard Bar - Only show when trying to exit with pending changes */}
      {showExitPrompt && pendingChangesCount > 0 && (
        <SaveDiscardBar
          changesCount={pendingChangesCount}
          onSave={onSaveChanges || (() => {})}
          onDiscard={onDiscardChanges || (() => {})}
        />
      )}
    </div>
  );
});

ChatInterface.displayName = 'ChatInterface';

