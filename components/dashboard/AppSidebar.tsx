'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Home, Users, Mail, BarChart3 } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { NavUser } from '@/components/nav-user';

export function AppSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  // Navigation items
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Contacts', href: '/dashboard/contacts', icon: Users },
    { name: 'Campaigns', href: '/dashboard/campaigns', icon: Mail },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  ];

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    loadUser();
  }, []);
  
  const userData = user ? {
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    avatar: user.user_metadata?.avatar_url || '',
  } : null;

  return (
    <Sidebar collapsible="icon" className="border-r border-[#e8e7e5]">
      {/* Logo Header */}
      <SidebarHeader className="h-12 border-b border-[#e8e7e5] shrink-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Joltibase" className="hover:!bg-black/[0.07]">
              <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
                <div className="w-8 h-8 bg-transparent flex items-center justify-center shrink-0 transition-none">
                  <span className="text-[#6b6b6b] font-bold text-base">J</span>
                </div>
                <span className="text-xl font-medium text-[#3d3d3a] group-data-[collapsible=icon]:hidden">joltibase</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => {
                // Dashboard should only be active on exact match, others can use startsWith
                const isActive = item.href === '/dashboard' 
                  ? pathname === '/dashboard'
                  : pathname === item.href || pathname?.startsWith(`${item.href}/`);
                const Icon = item.icon;
                
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.name}
                      className={isActive ? "!bg-black/[0.07] hover:!bg-black/[0.07]" : "hover:!bg-black/[0.07]"}
                    >
                      <Link href={item.href} className="flex items-center gap-2">
                        <Icon className="text-[#6b6b6b]" />
                        <span className={isActive ? "text-[#3d3d3a] font-medium" : "text-[#6b6b6b]"}>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile Footer */}
      <SidebarFooter className="border-t border-[#e8e7e5]">
        {userData && <NavUser user={userData} />}
      </SidebarFooter>
    </Sidebar>
  );
}

