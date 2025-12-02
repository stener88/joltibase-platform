'use client';

import { useState, useEffect, useCallback } from 'react';
import { featureCards, getRotationInterval } from '@/lib/onboarding/feature-cards';
import { FeatureCard } from './FeatureCard';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface GenerationCarouselProps {
  /** Optional override for cards to display */
  cards?: typeof featureCards;
  /** Pause auto-rotation */
  paused?: boolean;
}

export function GenerationCarousel({ 
  cards = featureCards,
  paused = false,
}: GenerationCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(paused);
  
  const rotationInterval = getRotationInterval(cards.length);

  // Auto-rotate through cards
  useEffect(() => {
    if (isPaused || paused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, rotationInterval);

    return () => clearInterval(timer);
  }, [isPaused, paused, cards.length, rotationInterval]);

  // Handle dot click
  const handleDotClick = useCallback((index: number) => {
    setActiveIndex(index);
    // Brief pause after manual navigation
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), rotationInterval);
  }, [rotationInterval]);

  // Handle swipe (touch events)
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Swipe threshold: 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - next
        setActiveIndex((prev) => (prev + 1) % cards.length);
      } else {
        // Swipe right - previous
        setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
      }
      // Brief pause after swipe
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), rotationInterval);
    }
    
    setTouchStart(null);
  };

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), rotationInterval);
  }, [cards.length, rotationInterval]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), rotationInterval);
  }, [cards.length, rotationInterval]);

  return (
    <div 
      className="h-full flex flex-col items-center justify-center p-8 bg-background"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header with loading indicator */}
      <div className="flex items-center gap-3 mb-8">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
        <span className="text-sm font-medium text-muted-foreground">
          Generating your email...
        </span>
      </div>

      {/* Card Container with Navigation */}
      <div className="relative w-full max-w-lg flex items-center gap-4 mb-6">
        {/* Previous button */}
        <button
          onClick={handlePrev}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Previous feature"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Cards */}
        <div className="relative flex-1 aspect-[4/3]">
          {cards.map((card, index) => (
            <FeatureCard
              key={card.id}
              card={card}
              isActive={index === activeIndex}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Next feature"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-3">
        {cards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => handleDotClick(index)}
            className={`
              h-2 rounded-full transition-all duration-300
              ${index === activeIndex 
                ? 'bg-primary w-8' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2'
              }
            `}
            aria-label={`Show ${card.title}`}
          />
        ))}
      </div>
    </div>
  );
}

