'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { PromptInput } from './PromptInput';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const suggestionPrompts = [
    'Make it more casual',
    'Add urgency',
    'Shorten the content',
    'Add more personalization',
    'Make it more professional',
    'Include more benefits',
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Start a conversation to refine your campaign
            </p>
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
              {suggestionPrompts.slice(0, 4).map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(prompt)}
                  className="px-3 py-2 text-sm bg-white border border-gray-200 hover:border-[#1a1aff] rounded-lg text-black transition-all text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
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
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="flex-shrink-0 px-6 py-4">
        <PromptInput
          value={message}
          onChange={setMessage}
          onSubmit={handleSubmit}
          isLoading={isRefining}
          placeholder="Describe how you want to refine the campaign..."
          compact
          disableAnimation
        />
      </div>
    </div>
  );
}

