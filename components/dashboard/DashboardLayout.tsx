'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { DashboardHeader, type CampaignEditorControls } from './DashboardHeader';
import { AuthModal } from '@/components/auth/AuthModal';
import { useState, useEffect } from 'react';
import { useSidebarStore } from '@/hooks/use-sidebar-store';

interface DashboardLayoutProps {
  children: React.ReactNode;
  campaignEditor?: CampaignEditorControls;
}

export function DashboardLayout({ children, campaignEditor }: DashboardLayoutProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isOpen, setOpen } = useSidebarStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={() => setShowAuthModal(false)} 
      />
      <SidebarProvider open={isOpen} onOpenChange={setOpen}>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader campaignEditor={campaignEditor} />
          <main className="flex-1 bg-gray-50 overflow-hidden">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

