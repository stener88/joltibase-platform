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
    <Sidebar collapsible="icon" className="border-r border-gray-200">
      {/* Logo Header */}
      <SidebarHeader className="h-12 border-b border-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Joltibase">
              <Link href="/dashboard">
                <div className="w-5 h-5 bg-[#1a1aff] rounded flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-xs">J</span>
                </div>
                <span className="text-xl font-medium text-gray-900">joltibase</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.name}</span>
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
      <SidebarFooter className="border-t border-gray-200">
        {userData && <NavUser user={userData} />}
      </SidebarFooter>
    </Sidebar>
  );
}

