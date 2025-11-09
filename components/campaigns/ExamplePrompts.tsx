'use client';

import { Lightbulb, UserPlus, Rocket, Sparkles, Newspaper } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const EXAMPLE_PROMPTS = [
  {
    title: "Welcome Email",
    prompt: "Create a welcome email for new SaaS trial users, introducing our product features and onboarding steps",
    icon: UserPlus,
  },
  {
    title: "Product Launch",
    prompt: "Launch announcement for a new AI-powered analytics feature, highlighting benefits and early access",
    icon: Rocket,
  },
  {
    title: "Re-engagement",
    prompt: "Re-engagement campaign for inactive users, reminding them of our value and offering a special incentive",
    icon: Sparkles,
  },
  {
    title: "Newsletter",
    prompt: "Monthly newsletter with company updates, product tips, and customer success stories",
    icon: Newspaper,
  },
];

export function ExamplePrompts({ onSelectPrompt }: ExamplePromptsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <Lightbulb className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-600">
          Try these examples
        </span>
      </div>

      {/* Grid of example prompts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXAMPLE_PROMPTS.map((example, index) => {
          const Icon = example.icon;
          return (
          <button
            key={index}
            onClick={() => onSelectPrompt(example.prompt)}
            className="group relative p-6 bg-white rounded-lg border border-gray-200 hover:border-[#1a1aff] hover:shadow-md transition-all duration-200 text-left hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Icon */}
            <div className="mb-3">
              <Icon className="w-4 h-4 text-black group-hover:text-[#1a1aff] transition-colors" />
            </div>

            {/* Title */}
            <h3 className="font-semibold text-black mb-2 group-hover:text-[#1a1aff] transition-colors">
              {example.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {example.prompt}
            </p>

            {/* Hover indicator */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-xs text-[#1a1aff] font-medium">
                Click to use →
              </div>
            </div>
          </button>
          );
        })}
      </div>

      {/* Or divider */}
      <div className="relative my-12">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        
      </div>
    </div>
  );
}
