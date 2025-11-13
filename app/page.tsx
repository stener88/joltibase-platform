'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/Header';
import { AuthModal } from '@/components/auth/AuthModal';
import { GradientBackground } from '@/components/campaigns/GradientBackground';
import { PromptInput } from '@/components/campaigns/PromptInput';
import { GenerationProgress } from '@/components/campaigns/GenerationProgress';
import { EmailSkeleton } from '@/components/campaigns/EmailSkeleton';
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
    if (!prompt.trim()) return;
    
    // Check if user is authenticated
    if (!user) {
      // Store form data before auth
      const formData = {
        prompt,
      };
      sessionStorage.setItem('pending_form_data', JSON.stringify(formData));
      setShowAuthModal(true);
      return;
    }
    
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
      console.log('📥 [FRONTEND] Received response:', { 
        success: result.success, 
        hasData: !!result.data,
        campaignId: result.data?.id
      });
      
      // Redirect to the campaign editor page
      if (result.success && result.data?.id) {
        // Check if user is authenticated
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Authenticated users go to dashboard editor
          router.push(`/dashboard/campaigns/${result.data.id}/edit`);
        } else {
          // Unauthenticated users stay on landing page editor
          router.push(`/campaigns/${result.data.id}`);
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
          rightPanel={<EmailSkeleton />}
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
                onChange={setPrompt}
                onSubmit={handleGenerate}
                isLoading={isLoading}
                placeholder="Build SaaS Dashboard..."
              />

              {/* Error Display */}
              {error && (
                <div className="mt-4 max-w-3xl mx-auto p-4 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl">
                  <p className="text-sm text-red-800 text-center">{error}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
