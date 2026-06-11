import React, { useState } from 'react';
import { Sidebar } from '../sidebar/Sidebar';
import { TopBar } from './TopBar';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { employee } = useAuthStore();

  if (!employee) return null;

  // Kitchen view is completely full screen, no sidebar or topbar
  if (employee.role === 'kitchen') {
    return <div className="min-h-screen bg-gray-900 text-white">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
        collapsed ? "md:ml-[72px]" : "md:ml-[260px]"
      )}>
        <TopBar onMenuToggle={() => setMobileOpen(true)} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
