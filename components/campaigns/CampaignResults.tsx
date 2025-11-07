'use client';

import { useState } from 'react';
import { EmailPreview } from './EmailPreview';

interface Email {
  subject: string;
  previewText: string;
  html: string;
  plainText: string;
  ctaText: string;
  ctaUrl: string;
}

interface CampaignData {
  id: string;
  campaign: {
    campaignName: string;
    campaignType: string;
    design: {
      template: string;
      ctaColor?: string;
      accentColor?: string;
      headerGradient?: {
        from: string;
        to: string;
      };
    };
    recommendedSegment: string;
    sendTimeSuggestion: string;
    successMetrics: string;
  };
  renderedEmails: Email[];
  metadata: {
    model: string;
    tokensUsed: number;
    promptTokens: number;
    completionTokens: number;
    costUsd: number;
    generationTimeMs: number;
    generatedAt: Date;
  };
}

interface CampaignResultsProps {
  data: CampaignData;
  onSave?: () => void;
  onEdit?: () => void;
  onSendTest?: (emailIndex: number) => void;
  onRegenerate?: () => void;
}

export function CampaignResults({ data, onSave, onEdit, onSendTest, onRegenerate }: CampaignResultsProps) {
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'html' | 'text'>('html');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Safety check for undefined data
  if (!data || !data.renderedEmails || data.renderedEmails.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-900 mb-2">Error: Invalid Campaign Data</h3>
        <p className="text-sm text-red-700">
          The campaign data is incomplete or missing. This might be due to a generation error.
        </p>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  const selectedEmail = data.renderedEmails[selectedEmailIndex];

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{data.campaign.campaignName}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Generated {new Date(data.metadata.generatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Regenerate
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Edit
            </button>
          )}
          {onSave && (
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Campaign
            </button>
          )}
        </div>
      </div>

      {/* Campaign Overview Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Campaign Type</h3>
            <p className="text-lg font-medium text-gray-900 capitalize">{data.campaign.campaignType}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Template</h3>
            <p className="text-lg font-medium text-gray-900 capitalize">{data.campaign.design.template.replace('-', ' ')}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Emails Generated</h3>
            <p className="text-lg font-medium text-gray-900">{data.renderedEmails.length}</p>
          </div>
        </div>
      </div>

      {/* Email Selection Tabs */}
      {data.renderedEmails.length > 1 && (
        <div className="border-b border-gray-200">
          <div className="flex space-x-4">
            {data.renderedEmails.map((email, index) => (
              <button
                key={index}
                onClick={() => setSelectedEmailIndex(index)}
                className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                  selectedEmailIndex === index
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Email {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Email Details Card */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Email Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Subject Line</h3>
              <p className="text-lg font-medium text-gray-900">{selectedEmail.subject}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Preview Text</h3>
              <p className="text-sm text-gray-700">{selectedEmail.previewText}</p>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">CTA Button</h3>
                <p className="text-sm text-gray-900 font-medium">{selectedEmail.ctaText}</p>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500 mb-1">CTA URL</h3>
                <p className="text-sm text-gray-700 truncate">{selectedEmail.ctaUrl}</p>
              </div>
            </div>
          </div>
        </div>

        {/* View Controls */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('html')}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                viewMode === 'html'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              HTML Preview
            </button>
            <button
              onClick={() => setViewMode('text')}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                viewMode === 'text'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Plain Text
            </button>
          </div>
          {viewMode === 'html' && (
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  previewMode === 'desktop'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Desktop
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  previewMode === 'mobile'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mobile
              </button>
            </div>
          )}
        </div>

        {/* Email Preview */}
        <div className="p-6">
          {viewMode === 'html' ? (
            <EmailPreview 
              html={selectedEmail.html} 
              mode={previewMode}
            />
          ) : (
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono bg-gray-50 p-4 rounded border border-gray-200">
              {selectedEmail.plainText}
            </pre>
          )}
        </div>

        {/* Email Actions */}
        {onSendTest && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => onSendTest(selectedEmailIndex)}
              className="px-4 py-2 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Send Test Email
            </button>
          </div>
        )}
      </div>

      {/* Metadata Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Model</span>
              <span className="text-sm font-medium text-gray-900">{data.metadata.model}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tokens Used</span>
              <span className="text-sm font-medium text-gray-900">
                {data.metadata.tokensUsed.toLocaleString()} 
                <span className="text-gray-500 ml-1">
                  ({data.metadata.promptTokens} + {data.metadata.completionTokens})
                </span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cost</span>
              <span className="text-sm font-medium text-gray-900">
                ${data.metadata.costUsd.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Generation Time</span>
              <span className="text-sm font-medium text-gray-900">
                {(data.metadata.generationTimeMs / 1000).toFixed(1)}s
              </span>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">AI Recommendations</h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">Target Segment</h4>
              <p className="text-sm text-gray-900">{data.campaign.recommendedSegment}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">Best Send Time</h4>
              <p className="text-sm text-gray-900">{data.campaign.sendTimeSuggestion}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">Success Metrics</h4>
              <p className="text-sm text-gray-900">{data.campaign.successMetrics}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

