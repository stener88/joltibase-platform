'use client';

import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { PromptInput } from './PromptInput';

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
}

export const ChatInterface = forwardRef<ChatInterfaceRef, ChatInterfaceProps>(({
  campaignId,
  onRefine,
  isRefining,
  chatHistory,
}, ref) => {
  const [message, setMessage] = useState('');
  const [chatOnly, setChatOnly] = useState(false);
  const [showChips, setShowChips] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
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

  const handleSubmit = async () => {
    if (!message.trim() || isRefining) return;

    const userMessage = message.trim();
    setMessage('');
    await onRefine(userMessage);
  };

  return (
    <div className="flex flex-col h-full bg-[#faf9f5]">
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
                disabled={isRefining}
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
          placeholder="Ask Jolti..."
          compact
          disableAnimation
          chatOnly={chatOnly}
          onChatOnlyToggle={() => setChatOnly(!chatOnly)}
          onLightningToggle={() => setShowChips(!showChips)}
          showLightningChips={showChips}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
});

ChatInterface.displayName = 'ChatInterface';

