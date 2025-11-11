'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';

export interface CampaignEditorControls {
  campaignName: string;
  isEditingName: boolean;
  editedCampaignName: string;
  onStartEditName: () => void;
  onCancelEditName: () => void;
  onSaveEditName: () => void;
  onNameChange: (value: string) => void;
  onNameKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  nameInputRef: React.RefObject<HTMLInputElement | null>;
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
    <header className="sticky top-0 z-10 flex h-12 items-center gap-4 bg-gray-50 border-b border-gray-200 px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="h-8 w-8"
      >
        <PanelLeft className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      <div className="h-6 w-px bg-gray-300" />

      <nav className="flex items-center gap-2 text-sm flex-1">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isUUID = crumb.label === 'Details';
          const isEditAfterUUID = index > 0 && breadcrumbs[index - 1].label === 'Details' && crumb.label === 'Edit';
          
          // Skip UUID - we'll show it after "Edit"
          if (isUUID && campaignEditor) {
            return null;
          }
          
          // For "Edit" after UUID, show it with campaign name after
          if (isEditAfterUUID && campaignEditor) {
            return (
              <div key={crumb.href} className="flex items-center gap-2">
                <Link
                  href={crumb.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {crumb.label}
                </Link>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                {/* Show campaign name after Edit */}
                {campaignEditor.isEditingName ? (
                  <input
                    ref={campaignEditor.nameInputRef}
                    type="text"
                    value={campaignEditor.editedCampaignName}
                    onChange={(e) => campaignEditor.onNameChange(e.target.value)}
                    onBlur={campaignEditor.onSaveEditName}
                    onKeyDown={campaignEditor.onNameKeyDown}
                    className="font-medium text-gray-900 border border-transparent hover:border-gray-200 focus:border-gray-400 rounded px-2 py-0.5 focus:outline-none transition-colors text-sm"
                  />
                ) : (
                  <button
                    onClick={campaignEditor.onStartEditName}
                    className="font-medium text-gray-900 hover:text-gray-700 transition-colors px-2 py-0.5 rounded hover:bg-gray-100"
                  >
                    {campaignEditor.campaignName}
                  </button>
                )}
              </div>
            );
          }
          
          return (
            <div key={crumb.href} className="flex items-center gap-2">
              {isLast || isUUID ? (
                <span className="font-medium text-gray-900">{crumb.label}</span>
              ) : (
                <>
                  <Link
                    href={crumb.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </>
              )}
            </div>
          );
        })}
      </nav>

      {/* Campaign Editor Controls */}
      {campaignEditor && (
        <div className="flex items-center gap-2">
          {campaignEditor.editorActions}
        </div>
      )}
    </header>
  );
}

