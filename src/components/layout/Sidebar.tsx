import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { UserRole } from '@/src/types';

interface SidebarProps {
  role?: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);

  // Simple Customer-Friendly Navigation (Section 1 Requirement)
  // Home, Buy Materials, Sell Waste, My Listings, My Requests, Messages, Profile
  const mainNavItems = [
    { to: '/app', label: 'Home', icon: 'storefront', end: true },
    { to: '/app/buy', label: 'Buy Materials', icon: 'shopping_bag' },
    { to: '/app/sell', label: 'Sell Waste', icon: 'add_circle', badge: 'AI' },
    { to: '/app/my-listings', label: 'My Listings', icon: 'inventory_2' },
    { to: '/app/my-requests', label: 'My Requests', icon: 'assignment' },
    { to: '/app/messages', label: 'Messages', icon: 'chat', badge: '1' },
    { to: '/app/profile', label: 'Profile', icon: 'account_circle' },
  ];

  // Preserved advanced engineering tools accessible without cluttering ordinary users
  const advancedTools = [
    { to: '/app/analyze', label: 'Industrial AI Lab', icon: 'document_scanner' },
    { to: '/app/valorize', label: 'Valorization Engine', icon: 'alt_route' },
    { to: '/app/exchange', label: 'B2B Trade Terminal', icon: 'swap_horiz' },
    { to: '/app/analytics', label: 'ESG & CO₂ Intelligence', icon: 'bar_chart' },
    { to: '/admin', label: 'Admin Dashboard', icon: 'admin_panel_settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-white border-r border-slate-200 h-[calc(100vh-4rem)] sticky top-16 select-none p-3 justify-between overflow-y-auto">
      <div className="flex flex-col gap-5">
        {/* Main Simple Navigation */}
        <div className="flex flex-col gap-1">
          <div className="px-3 py-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Marketplace
          </div>

          <nav className="flex flex-col gap-0.5">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-600 shadow-2xs font-bold'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          isActive ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                        style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.badge === 'AI'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Collapsible Advanced Engineering Tools */}
        <div className="pt-2 border-t border-slate-100 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setShowAdvancedTools(!showAdvancedTools)}
            className="flex items-center justify-between px-3 py-1 text-[11px] font-bold tracking-wider text-slate-400 hover:text-slate-600 uppercase transition-colors"
          >
            <span>Advanced Process</span>
            <span className="material-symbols-outlined text-[16px]">
              {showAdvancedTools ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {showAdvancedTools && (
            <nav className="flex flex-col gap-0.5 animate-in fade-in">
              {advancedTools.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[17px] text-slate-400">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </div>

      {/* Footer Support Info */}
      <div className="pt-3 border-t border-slate-100 px-3">
        <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
            <span className="material-symbols-outlined text-[16px] text-emerald-700">verified_user</span>
            <span>AI Verified Circular Hub</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-tight">
            Industrial waste analyzed with high accuracy characterization algorithms.
          </p>
        </div>
      </div>
    </aside>
  );
};
