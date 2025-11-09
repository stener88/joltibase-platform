'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { CampaignDetailsStep } from '@/components/campaigns/wizard/CampaignDetailsStep';
import { EmailContentStep } from '@/components/campaigns/wizard/EmailContentStep';
import { AudienceStep } from '@/components/campaigns/wizard/AudienceStep';
import { ReviewStep } from '@/components/campaigns/wizard/ReviewStep';

type Step = 'details' | 'content' | 'audience' | 'review';

interface CampaignData {
  name: string;
  type: 'one-time' | 'sequence' | 'automation';
  from_name: string;
  from_email: string;
  reply_to_email: string;
  subject_line: string;
  preview_text: string;
  html_content: string;
  plain_text: string;
  list_ids: string[];
}

export default function NewCampaignPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: '',
    type: 'one-time',
    from_name: '',
    from_email: '',
    reply_to_email: '',
    subject_line: '',
    preview_text: '',
    html_content: '',
    plain_text: '',
    list_ids: [],
  });

  const steps: { key: Step; label: string; completed: boolean }[] = [
    { key: 'details', label: 'Campaign Details', completed: currentStep !== 'details' },
    { key: 'content', label: 'Email Content', completed: ['audience', 'review'].includes(currentStep) },
    { key: 'audience', label: 'Audience', completed: currentStep === 'review' },
    { key: 'review', label: 'Review & Schedule', completed: false },
  ];

  const updateCampaignData = (updates: Partial<CampaignData>) => {
    setCampaignData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep === 'details') setCurrentStep('content');
    else if (currentStep === 'content') setCurrentStep('audience');
    else if (currentStep === 'audience') setCurrentStep('review');
  };

  const handleBack = () => {
    if (currentStep === 'content') setCurrentStep('details');
    else if (currentStep === 'audience') setCurrentStep('content');
    else if (currentStep === 'review') setCurrentStep('audience');
  };

  const handleSaveDraft = async () => {
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData),
      });

      const result = await response.json();
      if (result.success) {
        router.push('/dashboard/campaigns');
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Campaign</h1>
          <p className="text-gray-600">Create a new email campaign step by step</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, idx) => (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step.completed
                      ? 'bg-[#1a1aff] border-[#1a1aff] text-white'
                      : currentStep === step.key
                      ? 'bg-[#1a1aff] border-[#1a1aff] text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">{idx + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm mt-2 font-medium text-center ${
                    currentStep === step.key ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 -mt-8 ${
                    step.completed ? 'bg-[#1a1aff]' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {currentStep === 'details' && (
            <CampaignDetailsStep
              data={campaignData}
              onUpdate={updateCampaignData}
              onNext={handleNext}
              onSaveDraft={handleSaveDraft}
            />
          )}
          {currentStep === 'content' && (
            <EmailContentStep
              data={campaignData}
              onUpdate={updateCampaignData}
              onNext={handleNext}
              onBack={handleBack}
              onSaveDraft={handleSaveDraft}
            />
          )}
          {currentStep === 'audience' && (
            <AudienceStep
              data={campaignData}
              onUpdate={updateCampaignData}
              onNext={handleNext}
              onBack={handleBack}
              onSaveDraft={handleSaveDraft}
            />
          )}
          {currentStep === 'review' && (
            <ReviewStep
              data={campaignData}
              onBack={handleBack}
              onSaveDraft={handleSaveDraft}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

