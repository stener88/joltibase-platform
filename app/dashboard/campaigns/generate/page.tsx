'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PromptInput } from '@/components/campaigns/PromptInput';
import { ExamplePrompts } from '@/components/campaigns/ExamplePrompts';
import { GenerationProgress } from '@/components/campaigns/GenerationProgress';
import { EmailSkeleton } from '@/components/campaigns/EmailSkeleton';
import { SplitScreenLayout } from '@/components/campaigns/SplitScreenLayout';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface CampaignFormData {
  prompt: string;
  companyName?: string;
  productDescription?: string;
  targetAudience?: string;
  tone?: string;
  campaignType: string;
}

export default function DashboardGeneratePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const formData: CampaignFormData = {
        prompt: prompt.trim(),
        campaignType: 'one-time',
      };

      const response = await fetch('/api/ai/generate-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to generate campaign';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = `Server error (${response.status}): ${response.statusText || 'Failed to generate campaign'}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('📥 [DASHBOARD-GENERATE] Received response:', { 
        success: result.success, 
        hasData: !!result.data,
        campaignId: result.data?.id
      });
      
      // Redirect to the campaign editor page (dashboard version)
      if (result.success && result.data?.id) {
        router.push(`/dashboard/campaigns/${result.data.id}/edit`);
      } else {
        throw new Error('No campaign ID received from server');
      }
    } catch (err: any) {
      console.error('Campaign generation error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Show loading split-screen while generating
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-[calc(100vh-4rem)] flex flex-col">
          <SplitScreenLayout
            leftPanel={<GenerationProgress prompt={prompt} />}
            rightPanel={<EmailSkeleton />}
          />
        </div>
      </DashboardLayout>
    );
  }

  // Dashboard generator view
  return (
    <DashboardLayout>
      <div className="h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/dashboard/campaigns')}
              className="group flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Campaigns
            </button>
          </div>

          {/* Header with Icon */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Generate Campaign
                </h1>
              </div>
            </div>
            <p className="text-gray-600 ml-15">
              Describe your campaign and let AI create it for you
            </p>
          </div>

          {/* Main Input Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6 shadow-sm">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Campaign Description
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Tell us about your campaign goals, target audience, and key message
              </p>
            </div>

            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleGenerate}
              isLoading={isLoading}
              placeholder="Ask Jolti..."
              disableAnimation={true}
            />

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>

          {/* Example Prompts */}
          <div className="mb-8">
            <ExamplePrompts onSelectPrompt={(p) => setPrompt(p)} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

