'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  placeholder?: string;
  compact?: boolean;
  disableAnimation?: boolean;
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
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  // Animated typing effect - only active when input is empty and animation is enabled
  const animatedText = useTypingAnimation(TYPING_EXAMPLES, value === '' && !disableAnimation);
  const dynamicPlaceholder = !disableAnimation && value === '' ? `Ask Jolti to create ${animatedText}` : placeholder;

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
            className={`w-full ${compact ? 'min-h-[80px] max-h-[200px] px-4 py-3 text-sm' : 'min-h-[140px] max-h-[300px] px-6 py-6 text-lg'} font-normal text-black placeholder-black bg-transparent border-none outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{ 
              lineHeight: '1.6',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              caretColor: 'black'
            }}
          />

          {/* Send button */}
          <button
            onClick={handleSubmitClick}
            disabled={!value.trim() || isLoading}
            className={`
              absolute ${compact ? 'right-3 bottom-3 w-10 h-10' : 'right-4 bottom-4 w-12 h-12'}
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
              <div className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} border-2 border-white border-t-transparent rounded-full animate-spin`} />
            ) : (
              <ArrowUp className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} group-hover:-translate-y-0.5 transition-transform duration-300`} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
