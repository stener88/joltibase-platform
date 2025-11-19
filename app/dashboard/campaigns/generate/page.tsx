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
      <div className="h-full flex flex-col items-center justify-center overflow-y-auto">
        <div className="w-full max-w-3xl px-8">
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleGenerate}
            isLoading={isLoading}
            placeholder="Ask Jolti..."
            disableAnimation={true}
            compact={true}
          />

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Example Prompts */}
          <div className="mt-8">
            <ExamplePrompts onSelectPrompt={(p) => setPrompt(p)} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

