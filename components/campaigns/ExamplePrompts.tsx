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
    <div className="w-full">
      <h2 className="text-lg font-semibold text-foreground mb-4">Example Prompts</h2>
      
      {/* Grid of example prompts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXAMPLE_PROMPTS.map((example, index) => {
          const IconComponent = example.icon;
          return (
          <button
            key={index}
            onClick={() => onSelectPrompt(example.prompt)}
            className="group relative p-6 bg-card rounded-lg border border-border hover:border-foreground hover:shadow-sm transition-all duration-200 text-left"
          >
            {/* Icon and Title */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center shrink-0 transition-colors">
                <IconComponent className="w-5 h-5 text-foreground transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2 transition-colors">
                  {example.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {example.prompt}
            </p>

            {/* Hover indicator */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-xs text-muted-foreground font-medium">
                Click to use →
              </div>
            </div>
          </button>
          );
        })}
      </div>
    </div>
  );
}
