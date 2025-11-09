'use client';

import { useState } from 'react';
import { ChevronDown, Settings } from 'lucide-react';

interface AdvancedOptionsProps {
  companyName: string;
  productDescription: string;
  targetAudience: string;
  tone: string;
  onCompanyNameChange: (value: string) => void;
  onProductDescriptionChange: (value: string) => void;
  onTargetAudienceChange: (value: string) => void;
  onToneChange: (value: string) => void;
}

export function AdvancedOptions({
  companyName,
  productDescription,
  targetAudience,
  tone,
  onCompanyNameChange,
  onProductDescriptionChange,
  onTargetAudienceChange,
  onToneChange,
}: AdvancedOptionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-gray-400" />
          <span className="text-black font-medium">
            Advanced Options
          </span>
          <span className="text-xs text-gray-500">
            (Optional)
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Collapsible content */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
      >
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-black mb-2">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => onCompanyNameChange(e.target.value)}
              placeholder="e.g., YourCompany Inc"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff] transition-all"
            />
          </div>

          {/* Product Description */}
          <div>
            <label htmlFor="productDescription" className="block text-sm font-medium text-black mb-2">
              Product/Service Description
            </label>
            <textarea
              id="productDescription"
              value={productDescription}
              onChange={(e) => onProductDescriptionChange(e.target.value)}
              placeholder="Briefly describe what you offer..."
              rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff] transition-all resize-none"
            />
          </div>

          {/* Target Audience */}
          <div>
            <label htmlFor="targetAudience" className="block text-sm font-medium text-black mb-2">
              Target Audience
            </label>
            <input
              type="text"
              id="targetAudience"
              value={targetAudience}
              onChange={(e) => onTargetAudienceChange(e.target.value)}
              placeholder="e.g., SaaS founders, Small business owners"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff] transition-all"
            />
          </div>

          {/* Tone */}
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-black mb-2">
              Tone
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => onToneChange(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff] transition-all cursor-pointer"
            >
              <option value="">Let AI decide</option>
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          {/* Helper text */}
          <p className="text-xs text-gray-500 italic">
            These options help refine the AI output. Leave blank to let AI make the best choices based on your prompt.
          </p>
        </div>
      </div>
    </div>
  );
}
