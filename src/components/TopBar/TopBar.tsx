import React from 'react';
import type { UserSession, Campus } from '../../types';
import {
  Sun,
  Moon
} from 'lucide-react';

interface TopBarProps {
  user: UserSession;
  selectedCampus?: string;
  campuses?: Campus[];
  onSelectCampus?: (campusName: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenProfile: () => void;
  currentViewTitle?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  user,
  theme,
  onToggleTheme,
  onOpenProfile,
  currentViewTitle = 'Weekly Reporting & Governance'
}) => {
  // Avatar initials helper
  const initials = user.name
    ? user.name
        .split(' ')
        .filter((n) => !['mr.', 'mr', 'mrs.', 'mrs', 'dr.', 'dr', 'ms.', 'ms'].includes(n.toLowerCase()))
        .map((n) => n[0])
        .slice(0, 2)
        .join('') || user.name.slice(0, 2).toUpperCase()
    : 'AT';

  return (
    <header className="sticky top-0 z-20 w-full bg-white/95 dark:bg-[#0e131b]/95 backdrop-blur-md border-b border-[#e6e3dd] dark:border-[#262f3d] px-6 sm:px-8 py-3.5 flex items-center justify-between transition-colors duration-200">
      {/* Left: View Breadcrumb / Title */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 dark:text-slate-500 font-medium">Attwool Portal</span>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="font-bold text-slate-800 dark:text-white">{currentViewTitle}</span>
      </div>

      {/* Right Controls: Theme Toggle, Profile Card (Matching Image 2) */}
      <div className="flex items-center gap-3">
        {/* Day / Night Mode Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="p-2 rounded-xl border border-[#e6e3dd] dark:border-[#262f3d] bg-white dark:bg-[#161c27] text-slate-600 dark:text-amber-400 hover:text-[#0B4F9C] dark:hover:text-amber-300 transition-all cursor-pointer flex items-center justify-center shadow-2xs"
          aria-label={theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'}
          title={theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Authenticated User Profile Pill (Matching Image 2 Top-Right Pill) */}
        <button
          type="button"
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-white dark:bg-[#161c27] hover:bg-slate-50 dark:hover:bg-[#1f2735] border border-[#e6e3dd] dark:border-[#262f3d] transition-all cursor-pointer shadow-2xs group"
          title="Manage Staff Profile"
        >
          <div className="w-7 h-7 rounded-xl bg-[#0B4F9C] dark:bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase shadow-2xs">
            {initials}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0B4F9C] dark:group-hover:text-[#5b9bf0] transition-colors leading-tight">
              {user.name}
            </div>
            <div className="text-[10px] font-semibold text-[#0B4F9C] dark:text-[#5b9bf0] capitalize leading-none pt-0.5">
              {user.role === 'Director' || user.role === 'CampusHead'
                ? 'School Director'
                : user.role === 'SuperAdmin'
                ? 'Administrator'
                : 'Teacher'}
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
