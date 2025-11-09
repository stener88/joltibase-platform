'use client';

import { useState } from 'react';

interface EmailContentStepProps {
  data: {
    subject_line: string;
    preview_text: string;
    html_content: string;
    plain_text: string;
  };
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
  onSaveDraft: () => void;
}

export function EmailContentStep({ data, onUpdate, onNext, onBack, onSaveDraft }: EmailContentStepProps) {
  const [showMergeTags, setShowMergeTags] = useState(false);

  const mergeTags = [
    { tag: '{{first_name}}', description: 'Contact first name' },
    { tag: '{{last_name}}', description: 'Contact last name' },
    { tag: '{{email}}', description: 'Contact email' },
    { tag: '{{company}}', description: 'Company name' },
  ];

  const insertMergeTag = (tag: string) => {
    // Insert at cursor position in HTML content
    onUpdate({ html_content: data.html_content + ' ' + tag });
  };

  const handleNext = () => {
    if (!data.subject_line || !data.html_content) {
      alert('Please fill in subject line and email content');
      return;
    }
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Content</h2>
      <p className="text-gray-600 mb-6">Compose your email message</p>

      <div className="space-y-6">
        {/* Subject Line */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject Line <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            value={data.subject_line}
            onChange={(e) => onUpdate({ subject_line: e.target.value })}
            placeholder="e.g., Welcome to our community!"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1aff] focus:border-transparent"
          />
        </div>

        {/* Preview Text */}
        <div>
          <label htmlFor="preview" className="block text-sm font-medium text-gray-700 mb-2">
            Preview Text (optional)
          </label>
          <input
            type="text"
            id="preview"
            value={data.preview_text}
            onChange={(e) => onUpdate({ preview_text: e.target.value })}
            placeholder="Text that appears in email inbox preview"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1aff] focus:border-transparent"
          />
        </div>

        {/* Merge Tags Helper */}
        <div>
          <button
            type="button"
            onClick={() => setShowMergeTags(!showMergeTags)}
            className="text-sm text-[#1a1aff] hover:text-[#0000cc] font-medium"
          >
            {showMergeTags ? 'Hide' : 'Show'} merge tags
          </button>
          {showMergeTags && (
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">Click to insert:</p>
              <div className="flex flex-wrap gap-2">
                {mergeTags.map((item) => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => insertMergeTag(item.tag)}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs hover:border-[#1a1aff] hover:text-[#1a1aff] transition-colors"
                    title={item.description}
                  >
                    {item.tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* HTML Content (Simple Textarea for now) */}
        <div>
          <label htmlFor="html_content" className="block text-sm font-medium text-gray-700 mb-2">
            Email Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="html_content"
            value={data.html_content}
            onChange={(e) => onUpdate({ html_content: e.target.value })}
            placeholder="Write your email content here..."
            rows={12}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1aff] focus:border-transparent font-mono text-sm"
          />
          <p className="mt-1 text-sm text-gray-500">
            You can use HTML tags for formatting or plain text
          </p>
        </div>

        {/* Plain Text (Auto-generate option) */}
        <div>
          <label htmlFor="plain_text" className="block text-sm font-medium text-gray-700 mb-2">
            Plain Text Version (optional)
          </label>
          <textarea
            id="plain_text"
            value={data.plain_text}
            onChange={(e) => onUpdate({ plain_text: e.target.value })}
            placeholder="Auto-generated from HTML if left empty"
            rows={6}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1aff] focus:border-transparent font-mono text-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-900 rounded-lg hover:border-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            onClick={onSaveDraft}
            className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-900 rounded-lg hover:border-gray-300 transition-colors"
          >
            Save as Draft
          </button>
        </div>
        <button
          onClick={handleNext}
          className="px-6 py-2.5 bg-[#1a1aff] text-white rounded-lg hover:bg-[#0000cc] transition-colors"
        >
          Continue to Audience
        </button>
      </div>
    </div>
  );
}

