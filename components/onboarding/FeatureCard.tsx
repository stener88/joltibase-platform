'use client';

import { useState } from 'react';
import type { FeatureCard as FeatureCardType } from '@/lib/onboarding/feature-cards';

interface FeatureCardProps {
  card: FeatureCardType;
  isActive: boolean;
}

export function FeatureCard({ card, isActive }: FeatureCardProps) {
  const [imageError, setImageError] = useState(false);

  const renderMedia = () => {
    if (imageError) {
      // Fallback gradient when image fails to load
      return (
        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
          <div className="text-4xl opacity-50">✨</div>
        </div>
      );
    }

    switch (card.media.type) {
      case 'video':
        return (
          <video
            src={card.media.src}
            poster={card.media.poster}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        );
      
      case 'gif':
      case 'image':
      default:
        return (
          <img
            src={card.media.src}
            alt={card.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        );
    }
  };

  return (
    <div
      className={`
        absolute inset-0 flex flex-col
        transition-all duration-500 ease-out
        ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}
      `}
    >
      {/* Media Container */}
      <div className="flex-1 relative overflow-hidden rounded-xl bg-muted/50">
        {renderMedia()}
        
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
      </div>

      {/* Text Content */}
      <div className="pt-5 pb-2">
        <h3 className="text-lg font-semibold text-foreground mb-1.5">
          {card.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {card.description}
        </p>
      </div>
    </div>
  );
}

