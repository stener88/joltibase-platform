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

  return (
    <div className={compact ? "w-full" : "w-full max-w-4xl mx-auto"}>
      <div
        className={`relative bg-white ${compact ? 'rounded-xl border-2' : 'rounded-2xl border-[3px]'} border-[#1a1aff]`}
        style={{
          boxShadow: compact 
            ? '0 2px 4px rgba(0, 0, 0, 0.1)' 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      >
        {/* Input container */}
        <div className="relative">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={dynamicPlaceholder}
            disabled={isLoading}
            className={`w-full ${compact ? 'min-h-[80px] max-h-[200px] px-4 py-3 text-base' : 'min-h-[140px] max-h-[300px] px-6 py-6 text-lg'} font-normal text-black placeholder-black bg-transparent border-none outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{ 
              lineHeight: '1.6',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              caretColor: 'black',
              paddingRight: compact ? (onChatOnlyToggle ? '88px' : '48px') : '72px',
              paddingBottom: compact ? '40px' : '48px'
            }}
          />

          {/* Chat mode toggle button (only in compact mode with toggle handler) */}
          {compact && onChatOnlyToggle && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onChatOnlyToggle}
                  disabled={isLoading}
                  className={`
                    absolute right-11 bottom-2 w-7 h-7
                    rounded-full
                    flex items-center justify-center
                    transition-all duration-300
                    disabled:opacity-40 disabled:cursor-not-allowed
                    hover:scale-110
                    active:scale-95
                    ${chatOnly ? 'bg-[#1a1aff] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                  `}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
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
            className={`
              absolute ${compact ? 'right-2 bottom-2 w-7 h-7' : 'right-4 bottom-4 w-12 h-12'}
              rounded-full
              text-white
              flex items-center justify-center
              transition-all duration-300
              disabled:opacity-40 disabled:cursor-not-allowed
              ${!isLoading && value.trim() ? 'hover:scale-110 hover:shadow-lg' : ''}
              active:scale-95
              group
            `}
            style={{
              background: 'linear-gradient(135deg, #1a1aff 0%, #3333ff 100%)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
            }}
          >
            {isLoading ? (
              <div className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} border-2 border-white border-t-transparent rounded-full animate-spin`} />
            ) : (
              <ArrowUp className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} group-hover:-translate-y-0.5 transition-transform duration-300`} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
