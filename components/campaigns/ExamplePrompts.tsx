'use client';

import { UserPlus, Rocket, Sparkles, Newspaper } from 'lucide-react';


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
      {/* Grid of example prompts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXAMPLE_PROMPTS.map((example, index) => {
          return (
          <button
            key={index}
            onClick={() => onSelectPrompt(example.prompt)}
            className="group relative p-6 bg-white/30 backdrop-blur-sm rounded-lg border border-white/30 hover:border-white/60 hover:shadow-md transition-all duration-200 text-left hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Title */}
            <h3 className="font-semibold text-gray-900 mb-2 transition-colors">
              {example.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-700 leading-relaxed">
              {example.prompt}
            </p>

            {/* Hover indicator */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-xs text-gray-700 font-medium">
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
          <div className="w-full border-t border-white/20"></div>
        </div>
        
      </div>
    </div>
  );
}
