'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { PromptInput } from './PromptInput';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  campaignId: string;
  onRefine: (message: string) => Promise<void>;
  isRefining: boolean;
  chatHistory: ChatMessage[];
}

export function ChatInterface({
  campaignId,
  onRefine,
  isRefining,
  chatHistory,
}: ChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [chatOnly, setChatOnly] = useState(false);
  const [showChips, setShowChips] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    <div className="flex flex-col h-full bg-white">
      {/* Chat Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-600">
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
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-[#1a1aff] text-white'
                      : 'bg-gray-50 text-black'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
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
            <div className="bg-gray-50 text-black rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#1a1aff]" />
                
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form with Quick Prompts */}
      <div className="relative flex-shrink-0 px-6 py-4">
        {/* Quick Prompts Popover */}
        {showChips && (
          <div className="absolute bottom-full left-6 right-6 mb-2 p-3 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-wrap gap-2 z-10">
            {suggestionChips.map((chip, index) => (
              <button
                key={index}
                onClick={() => {
                  setMessage(chip.prompt);
                  setShowChips(false);
                }}
                disabled={isRefining}
                className="px-3 py-1.5 text-sm bg-gray-50 hover:bg-[#1a1aff] hover:text-white rounded-full text-gray-700 transition-all disabled:opacity-50 font-medium"
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}
        
        {/* Lightning Icon Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setShowChips(!showChips)}
              disabled={isRefining}
              className="absolute left-8 bottom-6 w-7 h-7 rounded-full bg-gray-50 border border-gray-200 hover:border-[#1a1aff] hover:bg-gray-100 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed z-10"
            >
              <svg className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Quick prompts - Get instant suggestions for your campaign</p>
          </TooltipContent>
        </Tooltip>
        
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
        />
      </div>
    </div>
  );
}

