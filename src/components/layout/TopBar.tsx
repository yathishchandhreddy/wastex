import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import type { UserRole } from '@/src/types';

interface TopBarProps {
  role?: UserRole;
  nodeId?: string;
  onRoleChange?: (role: UserRole) => void;
}

export const TopBar: React.FC<TopBarProps> = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      setShowUserMenu(false);
      await signOut();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Sign out error:', err);
      navigate('/login', { replace: true });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/app/buy?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/app/buy');
    }
  };

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Facility Partner';
  const displayOrg = profile?.organization || 'Apex Precision Ltd.';
  const initials =
    displayName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'WX';

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-white border-b border-slate-200 shadow-xs">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between max-w-7xl mx-auto w-full gap-4">
        {/* Brand */}
        <Link to="/app" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-xs group-hover:bg-emerald-700 transition-colors">
            <span className="material-symbols-outlined text-[22px]">recycling</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-slate-900 text-base tracking-tight leading-none">
              WasteX AI
            </span>
            <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mt-0.5">
              Circular Marketplace
            </span>
          </div>
        </Link>

        {/* Global Search Bar (Section 1 Requirement) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md relative items-center"
        >
          <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">
            search
          </span>
          <input
            id="topbar-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for plastic, metal, textile, paper, slag..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
          />
        </form>

        {/* Actions: [Sell Waste], [Buy Materials], Admin Dashboard, User Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Sell Waste Button */}
          <Link
            id="topbar-btn-sell-waste"
            to="/app/sell"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[17px]">add_circle</span>
            <span className="hidden sm:inline">Sell Waste</span>
          </Link>

          {/* Buy Materials Button */}
          <Link
            id="topbar-btn-buy-materials"
            to="/app/buy"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[17px]">shopping_bag</span>
            <span className="hidden sm:inline">Buy Materials</span>
          </Link>

          {/* Admin Dashboard (Separate Link as requested in Section 1) */}
          <Link
            id="topbar-btn-admin-dashboard"
            to="/admin"
            className="hidden lg:flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
            title="Access System Admin Audit & Infrastructure"
          >
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            <span>Admin Dashboard</span>
          </Link>

          {/* Notifications */}
          <Link
            to="/app/messages"
            aria-label="Messages"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
          </Link>

          {/* User Profile & Company Dropdown */}
          <div className="relative pl-1 border-l border-slate-200" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="User Account Menu"
              className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold group-hover:bg-emerald-700 transition-colors shadow-2xs">
                {initials}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[130px]">
                  {displayName}
                </span>
                <span className="text-[10px] text-slate-500 truncate max-w-[130px]">
                  {displayOrg}
                </span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-slate-600 hidden sm:block">
                expand_more
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 flex flex-col gap-1">
                <div className="px-3 py-2 border-b border-slate-100 flex flex-col">
                  <span className="text-xs font-bold text-slate-900 truncate">{displayName}</span>
                  <span className="text-[11px] text-slate-500 truncate">{user?.email || 'Verified Partner'}</span>
                  <span className="text-[10px] font-semibold mt-1 inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                    {displayOrg}
                  </span>
                </div>

                <Link
                  to="/app/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-500">account_circle</span>
                  <span>My Profile & Facility Info</span>
                </Link>

                <Link
                  to="/app/my-listings"
                  onClick={() => setShowUserMenu(false)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-500">inventory_2</span>
                  <span>My Listings (Seller)</span>
                </Link>

                <Link
                  to="/app/my-requests"
                  onClick={() => setShowUserMenu(false)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-500">assignment</span>
                  <span>My Requests (Buyer)</span>
                </Link>

                <Link
                  to="/admin"
                  onClick={() => setShowUserMenu(false)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-500">admin_panel_settings</span>
                  <span>Admin Dashboard</span>
                </Link>

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors w-full text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-rose-500">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
