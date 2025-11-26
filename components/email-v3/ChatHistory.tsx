'use client';

import { useEffect, useRef } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatHistoryProps {
  messages: Message[];
  isGenerating?: boolean;
}

export function ChatHistory({ messages, isGenerating = false }: ChatHistoryProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  if (messages.length === 0 && !isGenerating) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center">
        <div className="max-w-md">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
          <p className="text-sm text-gray-600">
            Ask me to modify your email. For example:
          </p>
          <ul className="mt-4 text-sm text-gray-600 text-left space-y-2">
            <li>• "Make the header text larger"</li>
            <li>• "Change the CTA button to green"</li>
            <li>• "Add more spacing between sections"</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              message.role === 'user'
                ? 'bg-[#e9a589] text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            <p className={`text-xs mt-1 ${
              message.role === 'user' ? 'text-white/70' : 'text-gray-500'
            }`}>
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
      ))}

      {isGenerating && (
        <div className="flex justify-start">
          <div className="bg-gray-100 text-gray-900 rounded-2xl px-4 py-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

