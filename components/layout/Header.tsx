'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User, LogOut, ChevronDown, Home } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface HeaderProps {
  onLoginClick?: () => void;
  campaignMode?: {
    campaignName: string;
    onBack: () => void;
    centerContent?: React.ReactNode;
    rightContent?: React.ReactNode;
  };
}

export function Header({ onLoginClick, campaignMode }: HeaderProps = {}) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
    // Initial user check
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showUserMenu]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setShowUserMenu(false);
    window.location.href = '/';
  };

  // Get user's initial for avatar
  const getUserInitial = () => {
    if (!user) return '';
    
    // Try to get from user metadata (name)
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name.charAt(0).toUpperCase();
    }
    if (user.user_metadata?.name) {
      return user.user_metadata.name.charAt(0).toUpperCase();
    }
    
    // Fallback to first character of email
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  return (
    <header className="relative z-20 bg-transparent">
      <div className="w-full px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
    <Link 
      href="/" 
      className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0"
    >
      <span className="text-xl font-medium text-white">joltibase</span>
    </Link>

        {/* Campaign content (when in campaign mode) */}
        {campaignMode && (
          <>
            <div className="flex items-center" style={{ width: '28%' }}>
              {campaignMode.centerContent || null}
            </div>
            {campaignMode.rightContent && (
              <div className="flex items-center gap-2 flex-1 justify-end">
                {campaignMode.rightContent}
              </div>
            )}
          </>
        )}

        {/* Right side - Auth aware */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {user ? (
            // Logged in: User menu
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 hover:opacity-80 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-medium text-sm">
                  {getUserInitial()}
                </div>
                <ChevronDown className="w-3 h-3 text-white" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                  <Link
                    href="/dashboard"
                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Home className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm text-left text-black hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Logged out: Sign in and Sign up buttons
            <>
              <button
                onClick={onLoginClick}
                className="px-6 py-1.5 text-sm font-normal bg-white text-foreground rounded-lg hover:bg-gray-50 transition-all"
              >
                Sign in
              </button>
              <button
                onClick={onLoginClick}
                className="px-6 py-1.5 text-sm font-normal bg-transparent border border-white/30 text-white rounded-lg hover:bg-white/10 transition-all shadow-sm"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}


