'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export function DashboardHeader() {
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

      <nav className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isUUID = crumb.label === 'Details';
          
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
              {!isLast && isUUID && (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </div>
          );
        })}
      </nav>
    </header>
  );
}

