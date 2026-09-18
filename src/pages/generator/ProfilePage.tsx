import React, { useState } from 'react';
import { PageHeader } from '@/src/components/layout/PageHeader';
import { useAuth } from '@/src/context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { profile, user, updateProfile } = useAuth();

  const [name, setName] = useState(profile?.name || '');
  const [organization, setOrganization] = useState(profile?.organization || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      await updateProfile({
        name: name.trim(),
        organization: organization.trim(),
        location: location.trim(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full px-4 md:px-6 py-6 gap-6 max-w-4xl mx-auto">
      <PageHeader
        nodeTag={`${profile?.organization || 'Facility Node'} • ${profile?.location || 'Regional Zone'}`}
        statusTag="Verified Generator Node"
        title="Plant Facility Node Profile"
        description="Operational registration, environmental compliance audits, and authorized material dispatcher credentials."
      />

      <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-xl shadow-xs flex flex-col gap-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <span className="material-symbols-outlined text-[30px]">precision_manufacturing</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {profile?.organization || 'Industrial Facility Node'}
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200 uppercase">
                {profile?.role || 'generator'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {profile?.location || 'Regional Industrial Corridor'} • Authenticated via Supabase
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
            <span>Profile record updated successfully in Supabase.</span>
          </div>
        )}

        {saveError && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-rose-600 text-[18px]">error</span>
            <span>{saveError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Node ID (UUID)</span>
            <div className="font-mono text-xs text-slate-800 font-medium truncate mt-0.5" title={profile?.id}>
              {profile?.id || '—'}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Corporate Email</span>
            <div className="text-xs text-slate-800 font-medium truncate mt-0.5">
              {profile?.email || user?.email || '—'}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Member Since</span>
            <div className="text-xs text-slate-800 font-medium mt-0.5">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Active'}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4 pt-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Update Facility Details</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Dispatcher / Manager Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Facility / Entity Name</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Plant Location / Industrial Corridor</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:bg-slate-300 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <span>Save Facility Profile</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
