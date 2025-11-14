'use client';

import { useState, useEffect } from 'react';
import { Edit3, Wand2 } from 'lucide-react';

/**
 * Rendered email structure (used for direct editing)
 */
export interface RenderedEmail {
  html: string;
  plainText: string;
  previewText: string;
  subject: string;
}

interface CampaignInfo {
  campaignName: string;
  campaignType?: string;
  design: {
    template: string;
    tone?: string;
  };
}

interface DirectEditorProps {
  campaign: CampaignInfo;
  renderedEmails: RenderedEmail[];
  selectedEmailIndex: number;
  onUpdate: (updates: Partial<RenderedEmail>) => void;
  onSelectEmail: (index: number) => void;
}

export function DirectEditor({
  campaign,
  renderedEmails,
  selectedEmailIndex,
  onUpdate,
  onSelectEmail,
}: DirectEditorProps) {
  const selectedEmail = renderedEmails[selectedEmailIndex];
  const [localSubject, setLocalSubject] = useState(selectedEmail.subject);
  const [localPreviewText, setLocalPreviewText] = useState(selectedEmail.previewText || '');
  const [localBodyText, setLocalBodyText] = useState('');

  // Extract plain text from HTML for editing
  useEffect(() => {
    if (selectedEmail.plainText) {
      setLocalBodyText(selectedEmail.plainText);
    }
  }, [selectedEmail]);

  // Update local state when email selection changes
  useEffect(() => {
    setLocalSubject(selectedEmail.subject);
    setLocalPreviewText(selectedEmail.previewText || '');
    if (selectedEmail.plainText) {
      setLocalBodyText(selectedEmail.plainText);
    }
  }, [selectedEmailIndex, selectedEmail]);

  const handleSubjectChange = (value: string) => {
    setLocalSubject(value);
    onUpdate({ subject: value });
  };

  const handlePreviewTextChange = (value: string) => {
    setLocalPreviewText(value);
    onUpdate({ previewText: value });
  };

  const handleBodyChange = (value: string) => {
    setLocalBodyText(value);
    onUpdate({ plainText: value });
  };

  return (
    <div className="flex flex-col h-full bg-[#faf9f5]">
      {/* Email Selector */}
      {renderedEmails.length > 1 && (
        <div className="flex-shrink-0 px-6 py-3 border-b border-gray-200 bg-gray-50">
          <label className="text-xs font-medium text-gray-700 block mb-2">
            Select Email
          </label>
          <div className="flex gap-2 overflow-x-auto">
            {renderedEmails.map((email, index) => (
              <button
                key={index}
                onClick={() => onSelectEmail(index)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  index === selectedEmailIndex
                    ? 'bg-[#1a1aff] text-white'
                    : 'bg-white text-black hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Email {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Editor Fields */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Subject Line */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Subject Line
          </label>
          <input
            type="text"
            value={localSubject}
            onChange={(e) => handleSubjectChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
            placeholder="Enter subject line..."
          />
          <p className="text-xs text-gray-500 mt-1">
            {localSubject.length} characters
          </p>
        </div>

        {/* Preview Text */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Preview Text
            <span className="text-gray-400 font-normal ml-2">(Optional)</span>
          </label>
          <input
            type="text"
            value={localPreviewText}
            onChange={(e) => handlePreviewTextChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
            placeholder="Text that appears in inbox preview..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Shown in email client previews (50-100 characters recommended)
          </p>
        </div>

        {/* Body Content */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Email Body (Plain Text)
          </label>
          <textarea
            value={localBodyText}
            onChange={(e) => handleBodyChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            rows={20}
            placeholder="Email content..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Note: HTML rendering is generated automatically. Edit plain text here.
          </p>
        </div>

     
      </div>
    </div>
  );
}

