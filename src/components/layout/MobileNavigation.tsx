import React from 'react';
import { NavLink } from 'react-router-dom';
import type { UserRole } from '@/src/types';

interface MobileNavigationProps {
  role?: UserRole;
}

interface NavItemConfig {
  path: string;
  label: string;
  icon: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = () => {
  const items: NavItemConfig[] = [
    { path: '/app', label: 'Home', icon: 'storefront' },
    { path: '/app/buy', label: 'Buy', icon: 'shopping_bag' },
    { path: '/app/sell', label: 'Sell', icon: 'add_circle' },
    { path: '/app/my-listings', label: 'Listings', icon: 'inventory_2' },
    { path: '/app/my-requests', label: 'Requests', icon: 'assignment' },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-md"
    >
      <div className="flex justify-around items-center h-15 px-2 max-w-md mx-auto">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/app'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] h-12 px-1 transition-colors ${
                isActive ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span
                  className={`text-[10px] mt-0.5 tracking-tight ${
                    isActive ? 'font-bold text-emerald-700' : 'font-medium'
                  }`}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
