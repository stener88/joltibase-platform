'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/Header';
import { AuthModal } from '@/components/auth/AuthModal';
import { GradientBackground } from '@/components/campaigns/GradientBackground';
import { PromptInput } from '@/components/campaigns/PromptInput';
import { GenerationProgress } from '@/components/campaigns/GenerationProgress';
import { GenerationCarousel } from '@/components/onboarding/GenerationCarousel';
import { SplitScreenLayout } from '@/components/campaigns/SplitScreenLayout';
import type { User } from '@supabase/supabase-js';

interface CampaignFormData {
  prompt: string;
  companyName?: string;
  productDescription?: string;
  targetAudience?: string;
  tone?: string;
  campaignType: string;
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [prompt, setPrompt] = useState('');

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (err) {
        console.error('Auth check failed:', err);
      }
    };

    checkAuth();

    // Listen for auth changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Check for stored form state after auth
  useEffect(() => {
    if (user) {
      const storedFormData = sessionStorage.getItem('pending_form_data');
      if (storedFormData) {
        try {
          const formData = JSON.parse(storedFormData);
          setPrompt(formData.prompt || '');
          sessionStorage.removeItem('pending_form_data');
          
          // Auto-trigger generation
          setTimeout(() => {
            handleGenerate();
          }, 100);
        } catch (err) {
          console.error('Failed to restore form data:', err);
        }
      }
    }
  }, [user]);

  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim();
    
    // Frontend validation
    if (!trimmedPrompt) {
      setError('Please describe what you want to create');
      return;
    }
    
    if (trimmedPrompt.length < 10) {
      setError('Please provide more details (at least 10 characters)');
      return;
    }
    
    if (trimmedPrompt.length > 1000) {
      setError('Your prompt is too long. Please keep it under 1000 characters.');
      return;
    }
    
    // Check if user is authenticated
    if (!user) {
      // Store form data before auth
      const formData = {
        prompt: trimmedPrompt,
      };
      sessionStorage.setItem('pending_form_data', JSON.stringify(formData));
      setShowAuthModal(true);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const formData: CampaignFormData = {
        prompt: trimmedPrompt,
        campaignType: 'one-time',
      };

      const response = await fetch('/api/v3/campaigns/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: formData.prompt }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to generate campaign';
        if (response.status === 401) {
          setShowAuthModal(true);
          errorMessage = 'Authentication required. Please sign in again.';
        } else if (response.status === 429) {
          errorMessage = 'Rate limited. Please try again in a moment.';
        } else if (response.status >= 500) {
          errorMessage = `Server error (${response.status}): ${response.statusText || 'Failed to generate campaign'}`;
        } else {
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (parseError) {
            errorMessage = `Server error (${response.status}): ${response.statusText || 'Failed to generate campaign'}`;
          }
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('📥 [FRONTEND] Received response:', { 
        success: result.success, 
        hasData: !!result.data,
        campaignId: result.data?.id
      });
      
      // Redirect to the campaign editor page
      if (result.success && result.campaign?.id) {
        // Check if user is authenticated
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Authenticated users go to dashboard editor
          router.push(`/dashboard/campaigns/${result.campaign.id}/edit`);
        } else {
          // Unauthenticated users stay on landing page editor
          router.push(`/campaigns/${result.campaign.id}`);
        }
      } else {
        throw new Error('No campaign ID received from server');
      }
    } catch (err: any) {
      console.error('Campaign generation error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  // Show loading split-screen while generating
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col">
        <GradientBackground />
        <SplitScreenLayout
          leftPanel={<GenerationProgress prompt={prompt} />}
          rightPanel={<GenerationCarousel />}
        />
      </div>
    );
  }

  // Landing page view
  return (
    <>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={handleAuthSuccess}
      />
      
      <div className="min-h-screen flex flex-col">
        <Header onLoginClick={() => setShowAuthModal(true)} />
        <GradientBackground />
        
        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Hero Section */}
          <div className="flex-1 flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-6xl">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-[1.1] tracking-[-0.03em]" style={{ 
                  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 500,
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  Email marketing in
                  <br />
                  <span className="text-white text-7xl md:text-8xl italic font-light" style={{ 
                    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    opacity: 0.9,
                    letterSpacing: '-0.02em'
                  }}>
                    one conversation
                  </span>
                </h1>
              
              </div>

              {/* Main Input */}
              <PromptInput
                value={prompt}
                onChange={(value) => {
                  setPrompt(value);
                  if (error) setError(null); // Clear error when typing
                }}
                onSubmit={handleGenerate}
                isLoading={isLoading}
                placeholder="Build SaaS Dashboard..."
              />

              {/* Error Display */}
              {error && (
                <div className="mt-4 max-w-3xl mx-auto p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/50 rounded-xl">
                  <p className="text-sm text-red-200 text-center font-medium">{error}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
