'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp, MessageSquare } from 'lucide-react';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  placeholder?: string;
  compact?: boolean;
  disableAnimation?: boolean;
  chatOnly?: boolean;
  onChatOnlyToggle?: () => void;
  onLightningToggle?: () => void;
  showLightningChips?: boolean;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
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
  placeholder = "Describe your email campaign...",
  compact = false,
  disableAnimation = false,
  chatOnly = false,
  onChatOnlyToggle,
  onLightningToggle,
  showLightningChips = false,
  inputRef,
}: PromptInputProps) {
  const internalTextareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef || internalTextareaRef;
  const [isFocused, setIsFocused] = useState(false);
  
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
          className="relative bg-gray-800 rounded-2xl border border-gray-600"
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
              disabled={isLoading}
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
              disabled={!value.trim() || isLoading}
              className="absolute right-4 bottom-4 w-12 h-12 text-white rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group"
              style={{
                backgroundColor: '#e9a589',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading && value.trim()) {
                  e.currentTarget.style.backgroundColor = '#d89478';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#e9a589';
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
      <div className="relative bg-white rounded-2xl border border-[#e8e7e5] shadow-sm">
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
            disabled={isLoading}
            className="w-full min-h-[80px] max-h-[200px] pr-4 py-4 font-normal text-[#3d3d3a] placeholder-[#6b6b6b]/40 bg-transparent border-none outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              fontSize: '15px',
              lineHeight: '1.6',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              caretColor: '#3d3d3a',
              paddingLeft: onLightningToggle ? '48px' : '12px',
              paddingRight: onChatOnlyToggle ? '96px' : '64px',
              paddingBottom: '52px'
            }}
          />

          {/* Lightning button (only in compact mode with toggle handler) */}
          {onLightningToggle && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onLightningToggle}
                  disabled={isLoading}
                  className="absolute left-2 bottom-4 w-8 h-8 rounded-lg bg-transparent border border-[#e8e7e5] text-[#6b6b6b] hover:border-[#3d3d3a] hover:bg-black/[0.03] flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed z-10"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Quick prompts - Get instant suggestions for your campaign</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Chat mode toggle button (only in compact mode with toggle handler) */}
          {onChatOnlyToggle && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onChatOnlyToggle}
                  disabled={isLoading}
                  className={`
                    absolute right-14 bottom-4 w-8 h-8
                    rounded-lg
                    flex items-center justify-center
                    transition-all duration-200
                    disabled:opacity-40 disabled:cursor-not-allowed
                    border border-[#e8e7e5]
                    ${chatOnly ? 'bg-[#e9a589] text-white border-[#e9a589]' : 'bg-transparent text-[#6b6b6b] hover:bg-black/[0.03] hover:border-[#3d3d3a]'}
                  `}
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Chat mode - Ask questions without modifying your campaign</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Send button */}
          <button
            onClick={handleSubmitClick}
            disabled={!value.trim() || isLoading}
            className="absolute right-4 bottom-4 w-8 h-8 bg-[#e9a589] text-white rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#d89478] group"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
