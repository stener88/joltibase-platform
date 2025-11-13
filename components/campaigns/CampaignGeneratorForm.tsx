'use client';

import { useState } from 'react';

interface CampaignFormData {
  prompt: string;
  companyName?: string;
  productDescription?: string;
  targetAudience?: string;
  tone: 'professional' | 'friendly' | 'casual' | 'enthusiastic' | 'urgent';
  campaignType: 'one-time' | 'drip' | 'newsletter' | 'announcement';
}

interface CampaignGeneratorFormProps {
  onSubmit: (data: CampaignFormData) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export function CampaignGeneratorForm({ onSubmit, isLoading, error }: CampaignGeneratorFormProps) {
  const [formData, setFormData] = useState<CampaignFormData>({
    prompt: '',
    companyName: '',
    productDescription: '',
    targetAudience: '',
    tone: 'friendly',
    campaignType: 'one-time',
  });

  const [validationError, setValidationError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.prompt.trim()) {
      setValidationError('Please provide a campaign prompt');
      return;
    }

    if (formData.prompt.length < 10) {
      setValidationError('Prompt should be at least 10 characters');
      return;
    }

    setValidationError('');
    await onSubmit(formData);
  };

  const updateField = (field: keyof CampaignFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationError) setValidationError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Main Prompt */}
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-900 mb-2">
          Campaign Prompt <span className="text-red-500">*</span>
        </label>
        <textarea
          id="prompt"
          rows={4}
          value={formData.prompt}
          onChange={(e) => updateField('prompt', e.target.value)}
          placeholder="Describe the email campaign you want to create. E.g., 'Create a welcome email for new trial users that highlights key features and encourages activation'"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          disabled={isLoading}
        />
        <p className="mt-2 text-sm text-gray-500">
          Be specific about the purpose, audience, and key messages you want to include.
        </p>
      </div>

      {/* Optional Fields - Collapsible */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">
          Additional Context (Optional)
        </h3>
        
        <div className="space-y-4">
          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
              placeholder="e.g., YourCompany Inc"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              disabled={isLoading}
            />
          </div>

          {/* Product Description */}
          <div>
            <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Product Description
            </label>
            <textarea
              id="productDescription"
              rows={3}
              value={formData.productDescription}
              onChange={(e) => updateField('productDescription', e.target.value)}
              placeholder="Brief description of your product or service"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Target Audience */}
          <div>
            <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            <input
              type="text"
              id="targetAudience"
              value={formData.targetAudience}
              onChange={(e) => updateField('targetAudience', e.target.value)}
              placeholder="e.g., Small business owners, SaaS founders"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              disabled={isLoading}
            />
          </div>

          {/* Tone */}
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <select
              id="tone"
              value={formData.tone}
              onChange={(e) => updateField('tone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              disabled={isLoading}
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="casual">Casual</option>
              <option value="enthusiastic">Enthusiastic</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Campaign Type */}
          <div>
            <label htmlFor="campaignType" className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Type
            </label>
            <select
              id="campaignType"
              value={formData.campaignType}
              onChange={(e) => updateField('campaignType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              disabled={isLoading}
            >
              <option value="one-time">One-Time Email</option>
              <option value="drip">Drip Campaign</option>
              <option value="newsletter">Newsletter</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {(validationError || error) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{validationError || error}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="text-sm text-gray-500">
          {isLoading && (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#e9a589]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating campaign... This may take 30-60 seconds
            </span>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? 'Generating...' : 'Generate Campaign'}
        </button>
      </div>
    </form>
  );
}

