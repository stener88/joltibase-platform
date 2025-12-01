'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';

export interface CampaignEditorControls {
  modeSelector?: ReactNode;
  editorActions: ReactNode;
}

interface DashboardHeaderProps {
  campaignEditor?: CampaignEditorControls;
}

export function DashboardHeader({ campaignEditor }: DashboardHeaderProps) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: { label: string; href: string }[] = [];

    // Map of route segments to readable labels
    const labelMap: Record<string, string> = {
      dashboard: 'Dashboard',
      contacts: 'Contacts',
      campaigns: 'Campaigns',
      analytics: 'Analytics',
      settings: 'Settings',
      new: 'New',
      edit: 'Edit',
      import: 'Import',
      generate: 'Generate',
      brand: 'Brand Kit',
    };

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip analytics segment
      if (segment === 'analytics') {
        return;
      }
      
      // Skip UUIDs or dynamic segments (assume segments with hyphens and length > 30 are IDs)
      if (segment.includes('-') && segment.length > 30) {
        breadcrumbs.push({
          label: 'Details',
          href: currentPath,
        });
      } else {
        breadcrumbs.push({
          label: labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
          href: currentPath,
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="sticky top-0 z-10 grid grid-cols-3 h-12 items-center gap-4 bg-background px-6">
      {/* Left: Sidebar toggle and breadcrumbs */}
      <div className="flex items-center gap-4 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 flex-shrink-0 text-foreground hover:text-foreground hover:bg-muted"
        >
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        <div className="h-6 w-px bg-border flex-shrink-0" />

        <nav className="flex items-center gap-2 text-sm min-w-0">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const isUUID = crumb.label === 'Details';
            
            // Skip UUID - we'll show it after "Edit"
            if (isUUID && campaignEditor) {
              return null;
            }
            
            return (
              <div key={crumb.href} className="flex items-center gap-2">
                {isLast || isUUID ? (
                  <span className="font-medium text-foreground">{crumb.label}</span>
                ) : (
                  <>
                    <Link
                      href={crumb.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {crumb.label}
                    </Link>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Center: Mode Selector */}
      {campaignEditor && campaignEditor.modeSelector ? (
        <div className="flex items-center justify-center">
          {campaignEditor.modeSelector}
        </div>
      ) : (
        <div></div>
      )}

      {/* Right: Other Editor Actions */}
      {campaignEditor ? (
        <div className="flex items-center gap-2 justify-end">
          {campaignEditor.editorActions}
        </div>
      ) : (
        <div></div>
      )}
    </header>
  );
}

