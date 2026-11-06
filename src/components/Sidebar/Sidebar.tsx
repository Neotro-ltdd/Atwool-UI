import React from 'react';
import { AttwoolLogo } from '../AttwoolLogo';
import type { UserSession } from '../../types';
import {
  FileText,
  Building2,
  Users,
  LogOut,
  ChevronRight,
  Sliders,
  LayoutDashboard
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigateView: (view: string) => void;
  user: UserSession;
  selectedCampus: string;
  onLogout: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  targetView: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigateView,
  user,
  selectedCampus,
  onLogout
}) => {
  const isDirector = user.role === 'Director' || user.role === 'CampusHead';
  const isAdmin = user.role === 'SuperAdmin';

  // Role workspace descriptive badge
  const workspaceTitle = isDirector
    ? 'Director Workspace'
    : isAdmin
    ? 'Admin Workspace'
    : 'Teacher Workspace';

  const navItems: NavItem[] = [];

  // Admin handles Campus Mgt, Setup, and Staff Onboarding (Admin does NOT see Reports)
  if (isAdmin) {
    navItems.push(
      {
        id: 'campus-mgt',
        label: 'Campus Mgt',
        icon: Building2,
        description: 'Create, edit & delete campuses',
        targetView: 'campus-mgt'
      },
      {
        id: 'setup',
        label: 'Setup',
        icon: Sliders,
        description: 'Faculties, subjects & class arms',
        targetView: 'setup'
      },
      {
        id: 'staff-onboarding',
        label: 'Staff Onboarding',
        icon: Users,
        description: 'Invite, provision & allocate faculty',
        targetView: 'staff-onboarding'
      }
    );
  } else if (isDirector) {
    // School Director lands on Executive Dashboard and reviews reports
    navItems.push(
      {
        id: 'director-dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        description: 'Network overview & academic telemetry',
        targetView: 'director-dashboard'
      },
      {
        id: 'reports',
        label: 'Reports & Review',
        icon: FileText,
        description: 'Review, feedback & seal reports across campuses',
        targetView: 'principal-signoff'
      }
    );
  } else {
    // Teachers access Reports
    navItems.push({
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      description: 'Weekly curriculum submissions',
      targetView: 'teacher-dashboard'
    });
  }

  // Active check helper
  const isNavActive = (item: NavItem) => {
    if (item.id === 'director-dashboard') {
      return currentView === 'director-dashboard';
    }
    if (item.id === 'reports') {
      return (
        currentView === 'reports' ||
        currentView === 'teacher-dashboard' ||
        currentView === 'principal-signoff' ||
        currentView === 'report-wizard'
      );
    }
    if (item.id === 'campus-mgt') {
      return currentView === 'campus-mgt';
    }
    if (item.id === 'setup') {
      return currentView === 'setup';
    }
    if (item.id === 'staff-onboarding') {
      return currentView === 'staff-onboarding';
    }
    if (item.id === 'compliance') {
      return currentView === 'compliance';
    }
    return currentView === item.targetView;
  };

  return (
    <aside className="w-64 sm:w-72 h-screen sticky top-0 bg-white dark:bg-[#0e131b] border-r border-[#e6e3dd] dark:border-[#262f3d] flex flex-col justify-between p-5 z-30 select-none shrink-0 transition-all duration-200">
      {/* 1. TOP BRAND LOGO & WORKSPACE CONTEXT CARD */}
      <div className="space-y-5">
        {/* Top Logo & Title */}
        <div className="pt-1">
          <AttwoolLogo size="sm" showSubtitle={true} />
        </div>

        {/* Workspace Identity Pill Card (Matching Image 2) */}
        <div className="p-3.5 rounded-2xl bg-[#fbfaf8] dark:bg-[#161c27] border border-[#e6e3dd] dark:border-[#262f3d] shadow-2xs space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-[#0B4F9C] dark:text-[#5b9bf0] flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate" title={isDirector ? 'All Campuses Network' : selectedCampus}>
                {isDirector ? 'All Campuses Network' : selectedCampus.split(',')[0]}
              </div>
              <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="truncate">{workspaceTitle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. PRIMARY SIDEBAR NAVIGATION (Matching Image 2) */}
        <nav className="space-y-1.5 pt-1" aria-label="Portal Navigation">
          {navItems.map((item) => {
            const active = isNavActive(item);
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigateView(item.targetView)}
                className={`w-full text-left rounded-2xl px-4 py-3 flex items-center justify-between transition-all cursor-pointer group ${
                  active
                    ? 'bg-[#1e293b] text-white font-bold shadow-sm dark:bg-[#1a2333] dark:border dark:border-[#2f3b4f]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-[#fbfaf8] dark:hover:bg-[#161c27] font-medium border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                      active ? 'text-white' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}
                  />
                  <div className="truncate">
                    <span className="text-xs">{item.label}</span>
                  </div>
                </div>

                {active && (
                  <ChevronRight className="w-4 h-4 text-white/80 shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. BOTTOM FOOTER & SIGN OUT ACTION (Matching Image 2) */}
      <div className="pt-4 border-t border-[#e6e3dd] dark:border-[#262f3d]">
        {/* Clean Sign Out CTA (Red Icon & Text matching Image 2) */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full text-left px-3 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-2.5 text-xs font-bold cursor-pointer group"
          title="Sign out of active session"
        >
          <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
