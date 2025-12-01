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
    <div className="flex flex-col h-full bg-background p-8 border-r border-border">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Creating your campaign
        </h2>
        <p className="text-sm text-muted-foreground">AI is crafting your perfect email...</p>
      </div>

      {/* Your prompt card */}
      <div className="bg-card rounded-lg border border-border p-6 mb-8 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-foreground" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-card-foreground mb-2">Your Prompt</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {prompt}
            </p>
          </div>
        </div>
      </div>

      {/* Progress steps */}
      <div className="space-y-3 flex-1">
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
                transition-all duration-300
                ${isActive ? 'bg-muted border-l-2 border-primary' : ''}
                ${isComplete ? 'bg-card border border-border' : ''}
                ${isPending ? 'opacity-40 bg-muted/30' : ''}
              `}
            >
              {/* Icon */}
              <div
                className={`
                  flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                  transition-all duration-300
                  ${isActive ? 'bg-muted text-foreground' : ''}
                  ${isComplete ? 'bg-muted text-foreground' : ''}
                  ${isPending ? 'bg-muted/30 text-muted-foreground' : ''}
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
                    text-sm font-medium transition-colors duration-300
                    ${isActive ? 'text-foreground' : ''}
                    ${isComplete ? 'text-muted-foreground' : ''}
                    ${isPending ? 'text-muted-foreground' : ''}
                  `}
                >
                  {step.label}
                </p>
                {isComplete && (
                  <p className="text-xs text-muted-foreground mt-0.5">✓ Complete</p>
                )}
              </div>

              {/* Status indicator */}
              {isActive && (
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
