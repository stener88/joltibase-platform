'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp, MessageSquare, MousePointer2, Settings2 } from 'lucide-react';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { BrandSettingsModal } from './BrandSettingsModal';
import type { BrandIdentity } from '@/lib/types/brand';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  disabledReason?: string; // NEW: Explain why disabled
  placeholder?: string;
  compact?: boolean;
  disableAnimation?: boolean;
  chatOnly?: boolean;
  onChatOnlyToggle?: () => void;
  onLightningToggle?: () => void;
  showLightningChips?: boolean;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  noBackground?: boolean;
  visualEditsMode?: boolean;
  onVisualEditsToggle?: () => void;
  showDiscardSaveButtons?: boolean;
  // Brand Settings
  brandSettings?: BrandIdentity | null;
  onBrandSettingsSave?: (brand: BrandIdentity) => void;
}

const TYPING_EXAMPLES = [
  'a welcome email for new SaaS users...',
  'a product launch announcement...',
  'a re-engagement campaign...',
  'a monthly newsletter...',
  'a holiday promotion email...',
  'an onboarding email sequence...',
];

export function PromptInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  disabled = false,
  disabledReason,
  placeholder = "Describe your email campaign...",
  compact = false,
  disableAnimation = false,
  chatOnly = false,
  onChatOnlyToggle,
  onLightningToggle,
  showLightningChips = false,
  inputRef,
  noBackground = false,
  visualEditsMode = false,
  onVisualEditsToggle,
  showDiscardSaveButtons = false,
  brandSettings,
  onBrandSettingsSave,
}: PromptInputProps) {
  const internalTextareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef || internalTextareaRef;
  const [isFocused, setIsFocused] = useState(false);
  const [showBrandSettings, setShowBrandSettings] = useState(false);
  
  // Animated typing effect - only active when input is empty and animation is enabled
  const animatedText = useTypingAnimation(TYPING_EXAMPLES, value === '' && !disableAnimation);
  const basePlaceholder = chatOnly ? "💬 Chat mode: Ask questions without modifying..." : placeholder;
  const dynamicPlaceholder = !disableAnimation && value === '' && !chatOnly ? `Ask Jolti to create ${animatedText}` : basePlaceholder;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleSubmitClick = () => {
    if (value.trim() && !isLoading) {
      onSubmit();
    }
  };

  // For non-compact mode (landing page), use dark style
  if (!compact) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div
          className="relative bg-card rounded-2xl border border-border"
          style={{
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Input container */}
          <div className="relative flex items-start">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder={dynamicPlaceholder || "Build SaaS Dashboard..."}
              disabled={isLoading || disabled}
              className="w-full min-h-[180px] max-h-[300px] pl-6 pr-20 py-6 text-lg font-normal text-white placeholder-gray-400 bg-transparent border-none outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                lineHeight: '1.6',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                caretColor: 'white',
                paddingBottom: '56px'
              }}
            />

            {/* Send button - coral square with arrow */}
            <button
              onClick={handleSubmitClick}
              disabled={!value.trim() || isLoading || disabled}
              className="absolute right-4 bottom-4 w-12 h-12 text-white rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group"
              style={{
                backgroundColor: '#5f6ad1',
                boxShadow: '0 2px 4px rgba(95, 106, 209, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading && !disabled && value.trim()) {
                  e.currentTarget.style.backgroundColor = '#4f5ab8';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#5f6ad1';
              }}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Compact mode (chat interface) - light Claude-style
  return (
    <div className="w-full">
      {/* Disabled Reason Message */}
      {disabled && disabledReason && (
        <div className="mb-2 px-3 py-2 bg-muted border border-border rounded-lg">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {disabledReason}
          </p>
        </div>
      )}
      
      {/* Brand Indicator - Above the input (Lovable style) - Only show when enabled */}
      {compact && brandSettings && brandSettings.enabled !== false && onBrandSettingsSave && (
        <div className="mb-2 flex items-center gap-2 text-xs px-1">
          <div 
            className="w-3 h-3 rounded-full border border-border" 
            style={{ backgroundColor: brandSettings.primaryColor }}
          />
          <span className="text-muted-foreground">
            Generating as <span className="text-foreground font-medium">{brandSettings.companyName}</span>
          </span>
          <button 
            onClick={() => setShowBrandSettings(true)}
            className="text-primary hover:underline ml-1"
            type="button"
          >
            Change
          </button>
        </div>
      )}
      
      <div className={`relative ${noBackground ? '' : 'bg-card rounded-2xl border border-border shadow-sm'}`}>
        {/* Input container */}
        <div className="relative flex items-start">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={dynamicPlaceholder || "Reply..."}
            disabled={isLoading || disabled}
            className="w-full min-h-[80px] px-4 pt-4 font-normal text-foreground placeholder-muted-foreground/40 bg-transparent border-none outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              fontSize: '15px',
              lineHeight: '1.6',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              caretColor: '#5f6ad1',
              paddingBottom: '52px'
            }}
          />

          {/* Lightning button (only in compact mode with toggle handler) */}
          {onLightningToggle && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onLightningToggle}
                  disabled={isLoading || disabled || showDiscardSaveButtons}
                  className="absolute left-2 bottom-4 w-8 h-8 rounded-lg bg-transparent border border-border text-muted-foreground hover:border-foreground hover:bg-muted flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed z-10"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{showDiscardSaveButtons ? 'Save or discard changes to continue' : 'Quick prompts - Get instant suggestions for your campaign'}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Visual Edits toggle button (only in compact mode with toggle handler) */}
          {onVisualEditsToggle && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => {
                    console.log('[PromptInput] Visual Edit button clicked', { isLoading, visualEditsMode, hasHandler: !!onVisualEditsToggle, showDiscardSaveButtons });
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isLoading && !showDiscardSaveButtons && onVisualEditsToggle) {
                      console.log('[PromptInput] Calling onVisualEditsToggle');
                      onVisualEditsToggle();
                    } else {
                      console.warn('[PromptInput] Button click ignored', { isLoading, showDiscardSaveButtons, hasHandler: !!onVisualEditsToggle });
                    }
                  }}
                  disabled={isLoading || showDiscardSaveButtons}
                  className={`
                    absolute left-4 bottom-4 w-8 h-8
                    rounded-lg
                    flex items-center justify-center
                    transition-all duration-200
                    disabled:opacity-40 disabled:cursor-not-allowed
                    border border-border
                    ${visualEditsMode ? 'bg-primary text-white border-primary' : 'bg-transparent text-muted-foreground hover:bg-muted hover:border-foreground'}
                  `}
                >
                  <MousePointer2 className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{showDiscardSaveButtons ? 'Save or discard changes to continue editing' : 'Visual Edits - Click elements to edit'}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Brand Settings button (only in compact mode with save handler) */}
          {onBrandSettingsSave && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setShowBrandSettings(true)}
                  disabled={isLoading || showDiscardSaveButtons}
                  className={`
                    absolute left-14 bottom-4 w-8 h-8
                    rounded-lg
                    flex items-center justify-center
                    transition-all duration-200
                    disabled:opacity-40 disabled:cursor-not-allowed
                    border border-border
                    ${brandSettings && brandSettings.enabled !== false ? 'bg-muted text-foreground border-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted hover:border-foreground'}
                  `}
                >
                  <Settings2 className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Brand Settings - Customize colors, logo, and voice</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Chat mode toggle button (only in compact mode with toggle handler) */}
          {onChatOnlyToggle && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onChatOnlyToggle}
                  disabled={isLoading || disabled || showDiscardSaveButtons}
                  className={`
                    absolute right-14 bottom-4 w-8 h-8
                    rounded-lg
                    flex items-center justify-center
                    transition-all duration-200
                    disabled:opacity-40 disabled:cursor-not-allowed
                    border border-border
                    ${chatOnly ? 'bg-primary text-white border-primary' : 'bg-transparent text-muted-foreground hover:bg-muted hover:border-foreground'}
                  `}
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{showDiscardSaveButtons ? 'Save or discard changes to continue' : 'Chat mode - Ask questions without modifying your campaign'}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Send button */}
          <button
            onClick={handleSubmitClick}
            disabled={!value.trim() || isLoading || disabled}
            className="absolute right-4 bottom-4 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 group"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Brand Settings Modal */}
      {onBrandSettingsSave && (
        <BrandSettingsModal
          isOpen={showBrandSettings}
          onClose={() => setShowBrandSettings(false)}
          currentBrand={brandSettings}
          onSave={(brand) => {
            onBrandSettingsSave(brand);
            setShowBrandSettings(false);
          }}
        />
      )}
    </div>
  );
}
