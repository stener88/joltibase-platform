'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CampaignGeneratorForm } from '@/components/campaigns/CampaignGeneratorForm';
import { CampaignResults } from '@/components/campaigns/CampaignResults';
import type { User } from '@supabase/supabase-js';

interface CampaignFormData {
  prompt: string;
  companyName?: string;
  productDescription?: string;
  targetAudience?: string;
  tone: string;
  campaignType: string;
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
  renderedEmails: Array<{
    subject: string;
    previewText: string;
    html: string;
    plainText: string;
    ctaText: string;
    ctaUrl: string;
  }>;
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

export default function GenerateCampaignPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          router.push('/login');
          return;
        }
        
        setUser(user);
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/login');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (formData: CampaignFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate campaign');
      }

      const result = await response.json();
      console.log('📥 [FRONTEND] Received response:', { 
        success: result.success, 
        hasData: !!result.data,
        emailCount: result.data?.renderedEmails?.length 
      });
      
      // Extract data from the response envelope
      setCampaignData(result.data);
    } catch (err: any) {
      console.error('Campaign generation error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    setCampaignData(null);
    setError(null);
  };

  const handleSave = async () => {
    // TODO: Implement save functionality
    alert('Save functionality coming soon!');
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    alert('Edit functionality coming soon!');
  };

  const handleSendTest = async (emailIndex: number) => {
    // TODO: Implement send test functionality
    alert(`Send test for email ${emailIndex + 1} coming soon!`);
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Campaign Generator</h1>
          <p className="mt-2 text-gray-600">
            Generate professional email campaigns powered by AI in seconds
          </p>
        </div>

        {/* Main Content */}
        {!campaignData ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <CampaignGeneratorForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />
          </div>
        ) : (
          <CampaignResults
            data={campaignData}
            onSave={handleSave}
            onEdit={handleEdit}
            onSendTest={handleSendTest}
            onRegenerate={handleRegenerate}
          />
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="flex flex-col items-center">
                <svg
                  className="animate-spin h-12 w-12 text-blue-600 mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Generating Your Campaign
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  Our AI is crafting the perfect email campaign for you. This usually takes 30-60 seconds.
                </p>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

