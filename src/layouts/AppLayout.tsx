import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from '@/src/components/layout/TopBar';
import { Sidebar } from '@/src/components/layout/Sidebar';
import { MobileNavigation } from '@/src/components/layout/MobileNavigation';
import { ConfigNotice } from '@/src/components/ui/ConfigNotice';
import { useAuth } from '@/src/context/AuthContext';
import type { UserRole } from '@/src/types';

interface AppLayoutProps {
  role?: UserRole;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ role = 'generator' }) => {
  const { profile } = useAuth();
  const effectiveRole: UserRole = profile?.role || role;

  return (
    <div className="bg-[#F8FAF9] text-slate-900 min-h-screen flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header */}
      <TopBar role={effectiveRole} />

      {/* Main Container below fixed header */}
      <div className="pt-16 flex flex-col flex-1">
        {/* Environment Diagnostic Banner */}
        <ConfigNotice />

        <div className="flex flex-1 w-full max-w-7xl mx-auto">
          {/* Responsive Desktop / Tablet Sidebar */}
          <Sidebar role={effectiveRole} />

          {/* Dynamic Content Area with mobile safe padding for bottom nav */}
          <main className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 pb-24 md:pb-12 min-w-0 bg-[#F8FAF9]">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Sticky Navigation */}
      <MobileNavigation role={effectiveRole} />
    </div>
  );
};
