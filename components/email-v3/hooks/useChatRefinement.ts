import { useState, useCallback, useRef } from 'react';
import type { CodeChange } from '@/lib/email-v3/diff-generator';
import type { BrandIdentity } from '@/lib/types/brand';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: Date;
}

interface MessageMetadata {
  changes?: CodeChange[];
  intent?: 'question' | 'command';
}

interface UseChatRefinementOptions {
  campaignId: string;
  initialMessages: Message[];
  onCodeUpdate: (newCode: string) => void;
  getCurrentCode: () => string;
  selectedComponentId: string | null;
  componentMap: any;
  brandSettings: BrandIdentity | null;
}

/**
 * Hook for managing chat-based email refinement
 * Handles message state, AI communication, and code updates
 */
export function useChatRefinement({
  campaignId,
  initialMessages,
  onCodeUpdate,
  getCurrentCode,
  selectedComponentId,
  componentMap,
  brandSettings,
}: UseChatRefinementOptions) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Track message metadata (changes, intent)
  const messageMetadataRef = useRef<Map<string, MessageMetadata>>(new Map());

  // Handle chat submission
  const handleChatSubmit = useCallback(async (customPrompt?: string, source: 'chat' | 'toolbar' = 'chat') => {
    const promptToUse = customPrompt || input;
    if (!promptToUse.trim() || isGenerating) return;

    const isToolbar = source === 'toolbar';
    console.log(`[CHAT] Submitting: "${promptToUse}" (source: ${source})`);

    // Add user message (skip for toolbar)
    if (!isToolbar) {
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: promptToUse,
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, userMsg]);
    }

    // Clear input
    if (!customPrompt) {
      setInput('');
    }

    // Create placeholder for assistant (skip for toolbar)
    const assistantId = (Date.now() + 1).toString();
    if (!isToolbar) {
      const assistantMsg: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/v3/campaigns/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          currentTsxCode: getCurrentCode(),
          userMessage: promptToUse,
          selectedComponentId,
          selectedComponentType: selectedComponentId && componentMap[selectedComponentId]
            ? componentMap[selectedComponentId].type
            : null,
          brandSettings,
          source,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(`[CHAT] Intent: ${data.intent}, Success: ${data.success}`);

      // For toolbar: Apply changes first, then return result
      if (isToolbar) {
        if (data.intent === 'command' && data.success && data.tsxCode) {
          onCodeUpdate(data.tsxCode);
          console.log(`[TOOLBAR] Applied ${data.changes?.length || 0} changes`);
        }
        return data;
      }

      // For chat: Apply changes and update messages
      if (data.intent === 'command' && data.success && data.tsxCode) {
        onCodeUpdate(data.tsxCode);

        // Store metadata for changelog
        messageMetadataRef.current.set(assistantId, {
          changes: data.changes || [],
          intent: data.intent,
        });
        
        console.log(`[CHAT] Applied ${data.changes?.length || 0} changes`);
      }

      // Update assistant message
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: data.message }
            : m
        )
      );
    } catch (error) {
      console.error('[CHAT] Error:', error);
      
      if (isToolbar) {
        throw error; // Let toolbar handle it
      }
      
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: 'Sorry, something went wrong. Please try again.' }
            : m
        )
      );
    } finally {
      setIsGenerating(false);
    }
  }, [input, isGenerating, campaignId, selectedComponentId, componentMap, brandSettings, onCodeUpdate, getCurrentCode]);

  return {
    messages,
    input,
    setInput,
    isGenerating,
    messageMetadata: messageMetadataRef.current,
    handleChatSubmit,
  };
}

