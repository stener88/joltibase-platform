'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Wand2, CheckCircle2, Loader2 } from 'lucide-react';

interface GenerationProgressProps {
  prompt: string;
}

const STEPS = [
  { id: 1, label: 'Understanding your prompt', icon: Sparkles, duration: 2000 },
  { id: 2, label: 'Analyzing brand guidelines', icon: Wand2, duration: 3000 },
  { id: 3, label: 'Generating email content', icon: Wand2, duration: 5000 },
  { id: 4, label: 'Rendering beautiful design', icon: CheckCircle2, duration: 3000 },
];

export function GenerationProgress({ prompt }: GenerationProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, STEPS[currentStep].duration);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className="flex flex-col h-full bg-white p-8 border-r border-gray-200">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black mb-2">
          Creating your campaign
        </h2>
       
      </div>

      {/* Your prompt card */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Sparkles className="w-5 h-5 text-[#1a1aff]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-black mb-2">Your Prompt</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {prompt}
            </p>
          </div>
        </div>
      </div>

      {/* Progress steps */}
      <div className="space-y-4 flex-1">
        {STEPS.map((step, index) => {
          const isComplete = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`
                flex items-center gap-4 p-4 rounded-lg
                transition-all duration-500
                ${isActive ? 'bg-gray-50 scale-105' : ''}
                ${isComplete ? 'bg-white' : ''}
                ${isPending ? 'opacity-40' : ''}
              `}
            >
              {/* Icon */}
              <div
                className={`
                  flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                  transition-colors duration-300
                  ${isActive ? 'bg-[#1a1aff] text-white animate-pulse' : ''}
                  ${isComplete ? 'bg-black text-white' : ''}
                  ${isPending ? 'bg-gray-200 text-gray-400' : ''}
                `}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              {/* Label */}
              <div className="flex-1">
                <p
                  className={`
                    text-sm font-medium
                    ${isActive ? 'text-black' : ''}
                    ${isComplete ? 'text-gray-600' : ''}
                    ${isPending ? 'text-gray-400' : ''}
                  `}
                >
                  {step.label}
                </p>
              </div>

              {/* Status indicator */}
              {isActive && (
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#1a1aff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#1a1aff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#1a1aff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fun fact or tip */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          Pro tip: You can refine your email with natural language after it's generated
        </p>
      </div>
    </div>
  );
}
