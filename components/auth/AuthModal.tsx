'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { X, ChevronLeft } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type AuthMode = 'signin' | 'signup';

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const supabase = createClient();

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowEmailForm(false);
      setEmail('');
      setFullName('');
      setMessage(null);
      setLoading(false);
      setMode('signin');
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Listen for OAuth popup completion
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data?.type === 'auth-success') {
        // Wait for cookies to settle across windows
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
          const { data: { session } } = await supabase.auth.refreshSession();
          
          if (session) {
            onSuccess();
          } else {
            const { data: { session: fallbackSession } } = await supabase.auth.getSession();
            if (fallbackSession) {
              onSuccess();
            }
          }
        } catch (err) {
          console.error('Failed to refresh session:', err);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [supabase, onSuccess]);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Store that we want to return to generator after auth
      sessionStorage.setItem('auth_redirect', '/');
      
      const options: any = {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      };

      if (mode === 'signup' && fullName) {
        options.data = { full_name: fullName };
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options,
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Check your email for the magic link!',
      });
      setEmail('');
      setFullName('');
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to send magic link',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      sessionStorage.setItem('auth_redirect', '/');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?popup=true`,
          skipBrowserRedirect: true, // Prevent PARENT from redirecting
        },
      });

      if (error) throw error;

      if (data?.url) {
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        // Open popup - this window WILL redirect fully (not affected by skipBrowserRedirect)
        window.open(
          data.url,
          'oauth',
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
        );
        
        // Parent stays on landing page, popup handles OAuth
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || `Failed to ${mode === 'signin' ? 'sign in' : 'sign up'} with ${provider}`,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden border border-white/30"
        style={{
          boxShadow: '0 0 0 1px rgba(26, 26, 255, 0.1), 0 20px 50px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-10">
          {!showEmailForm ? (
            // Initial view: OAuth + Email button
            <>
              {/* Logo and Header */}
              <div className="mb-8 text-center">
                <div className="flex items-center justify-center mb-6">
                  <span className="text-2xl text-black">joltibase</span>
                </div>
                <h2 className="text-3xl font-bold text-black">
                  Start Building
                </h2>
                <p className="mt-2 text-base text-gray-600">
                  Log in to your account
                </p>
              </div>

              {/* Message Display */}
              {message && (
                <div
                  className={`mb-4 p-3 rounded-lg text-sm ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* OAuth Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleOAuth('google')}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border-2 border-gray-200/80 rounded-lg bg-white/50 backdrop-blur-sm text-base font-medium text-gray-700 hover:bg-white/70 hover:border-gray-300 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={() => handleOAuth('github')}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border-2 border-gray-200/80 rounded-lg bg-white/50 backdrop-blur-sm text-base font-medium text-gray-700 hover:bg-white/70 hover:border-gray-300 transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Continue with GitHub
                </button>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200/50" />
                </div>
              </div>

              {/* Continue with Email Button */}
              <button
                onClick={() => setShowEmailForm(true)}
                className="w-full py-3.5 px-4 bg-white/50 backdrop-blur-sm border-2 border-gray-200/80 text-gray-700 rounded-lg text-base font-medium hover:bg-white/70 hover:border-gray-300 transition-all"
              >
                Continue with email
              </button>
            </>
          ) : (
            // Expanded view: Email form
            <>
              {/* Back button */}
              <button
                onClick={() => {
                  setShowEmailForm(false);
                  setMessage(null);
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>

              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-gray-100/50 backdrop-blur-sm rounded-lg mb-6">
                <button
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                    mode === 'signin'
                      ? 'bg-white/70 backdrop-blur-sm text-black shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                    mode === 'signup'
                      ? 'bg-white/70 backdrop-blur-sm text-black shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-black">
                  {mode === 'signin' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {mode === 'signin'
                    ? 'Sign in to generate your campaign'
                    : 'Start creating AI-powered email campaigns'}
                </p>
              </div>

              {/* Message Display */}
              {message && (
                <div
                  className={`mb-4 p-3 rounded-lg text-sm ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Magic Link Form */}
              <form onSubmit={handleMagicLink} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-gray-200/80 rounded-lg focus:outline-none focus:border-gray-300 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white/50 backdrop-blur-sm border-2 border-gray-200/80 rounded-lg focus:outline-none focus:border-gray-300 transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#1a1aff] text-white rounded-lg font-semibold hover:bg-[#0000cc] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'Sending...' : 'Continue with email'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
