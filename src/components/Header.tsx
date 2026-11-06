import React, { useState, useEffect } from 'react';
import { AttwoolLogo } from './AttwoolLogo';
import {
  School,
  ShieldCheck,
  LogIn,
  Sun,
  Moon,
  Menu,
  X,
  Layers,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  FileText,
  Award,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  onOpenLogin: (roleHint?: string) => void;
  selectedCampus: string;
  onSelectCampus: (campus: string) => void;
  onNavigateHome?: () => void;
  currentUser?: any;
  onLogout?: () => void;
  onNavigateDashboard?: () => void;
  onNavigateView?: (view: string) => void;
  onOpenProfile?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLogin,
  selectedCampus,
  onSelectCampus,
  onNavigateHome,
  currentUser,
  onLogout,
  onNavigateDashboard,
  onNavigateView,
  onOpenProfile,
  theme = 'light',
  onToggleTheme,
}) => {
  const campuses = [
    { id: 'awoyaya-college', name: 'Attwool College, Awoyaya', type: 'Secondary Campus', location: 'Km 34 Lekki-Epe Expressway, Awoyaya' },
    { id: 'agungi-college', name: 'Attwool College, Agungi', type: 'Secondary Campus', location: 'Agungi Road, Lekki' },
    { id: 'awoyaya-sunflower', name: 'Attwool Sunflower, Awoyaya', type: 'Primary & Nursery Campus', location: 'Awoyaya Annex' },
    { id: 'agungi-sunflower', name: 'Attwool Sunflower, Agungi', type: 'Primary & Nursery Campus', location: 'Agungi Main Campus' },
  ];

  // Collapsible Sidebar / Drawer State (Not visible until triggered)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('cycle');

  // Handle ESC key to dismiss drawer and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSidebarOpen]);

  const reportingSteps = [
    { step: 1, title: 'Curriculum Pacing & Lesson Plan Verification', desc: 'Alignment with Lagos State Ministry & Cambridge schemes of work.' },
    { step: 2, title: 'Classroom Delivery & Attendance Audit', desc: 'Periodic attendance logging, engagement levels, and syllabus tracking.' },
    { step: 3, title: 'Pupil Assessment & Continuous Grading', desc: 'Formative marks, test scores, homework evaluation, and diagnostic review.' },
    { step: 4, title: 'Formative Evidence & Remediation Notes', desc: 'Targeted academic intervention for students requiring differentiated learning.' },
    { step: 5, title: 'Teacher Formal Attestation & Submission', desc: 'Irrevocable digital attestation before Friday 5:00 PM WAT cutoff.' },
    { step: 6, title: 'Principal Supervisory Review & Recommendations', desc: 'Executive academic evaluation, pedagogical recommendations, and actionable staff feedback.' },
    { step: 7, title: 'Campus Head Official Institutional Seal', desc: 'Final principal sign-off, board compliance verification, and QuestPDF archiving.' },
  ];

  const handleNavigate = (view: string) => {
    if (onNavigateView) {
      if (currentUser && (currentUser.role === 'Teacher' || currentUser.role === 'FormTutor')) {
        if (view === 'compliance' || view === 'principal-signoff' || view === 'hod-queue') {
          // Direct teachers strictly to their primary reporting workspace
          onNavigateView('teacher-dashboard');
          setIsSidebarOpen(false);
          return;
        }
      } else if (currentUser && currentUser.role === 'HOD') {
        if (view === 'compliance' || view === 'principal-signoff') {
          // Direct HODs strictly to their review queue
          onNavigateView('hod-queue');
          setIsSidebarOpen(false);
          return;
        }
      }
      onNavigateView(view);
      setIsSidebarOpen(false);
    }
  };

  const isTeacher = currentUser?.role === 'Teacher' || currentUser?.role === 'FormTutor';

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#e6e3dd] shadow-xs transition-colors duration-200">
        {/* Single Consolidated Executive Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* Left: Brand Logo & Academic Menu Drawer Trigger */}
            <div className="flex items-center gap-3 sm:gap-5">
              <button
                type="button"
                onClick={onNavigateHome}
                className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#0B4F9C] rounded-lg p-1 text-left cursor-pointer"
                title="Return to Public Portal"
              >
                <AttwoolLogo size="sm" showSubtitle={false} />
              </button>

              {/* Collapsible Sidebar Trigger (Hidden for teachers as everything they need is directly on their reporting dashboard) */}
              {!isTeacher && (
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-700 hover:text-[#0B4F9C] bg-white hover:bg-slate-50 border border-[#e6e3dd] transition-all cursor-pointer text-xs font-semibold shadow-2xs group"
                  aria-label="Open Academic Navigation & Governance Sidebar"
                  title="Open Academic Navigation & Governance"
                >
                  <Menu className="w-4 h-4 text-[#0B4F9C] group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Academic Menu</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                    <School className="w-3 h-3 text-[#0B4F9C]" />
                    {selectedCampus.split(',')[0]}
                  </span>
                </button>
              )}
            </div>

            {/* Right Action Controls: Theme Switcher, Authenticated Profile Badge, Sign Out / In */}
            <div className="flex items-center gap-3">
              {/* Day / Night Theme Toggle */}
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-2 rounded-lg border border-[#e6e3dd] bg-white text-slate-600 hover:text-[#0B4F9C] transition-all cursor-pointer flex items-center justify-center shadow-2xs"
                aria-label={theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'}
                title={theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>

              {currentUser ? (
                <div className="flex items-center gap-2.5">
                  {/* Single Bar Authenticated Staff Profile Badge */}
                  <button
                    type="button"
                    onClick={onOpenProfile || onNavigateDashboard}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-[#e6e3dd] transition-colors cursor-pointer text-left group shadow-2xs"
                    title="View & Edit Staff Profile"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#0B4F9C] group-hover:bg-[#094080] text-white flex items-center justify-center text-xs font-bold uppercase shadow-2xs transition-colors">
                      {currentUser.name
                        ? currentUser.name
                            .split(' ')
                            .filter((n: string) => !['mr.', 'mr', 'mrs.', 'mrs', 'dr.', 'dr', 'ms.', 'ms'].includes(n.toLowerCase()))
                            .map((n: string) => n[0])
                            .slice(0, 2)
                            .join('') || currentUser.name.slice(0, 2).toUpperCase()
                        : 'ST'}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#0B4F9C] transition-colors">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] font-semibold text-[#0B4F9C] flex items-center gap-1">
                        <span>{currentUser.role}</span>
                        <span className="text-[9px] text-slate-400 group-hover:text-[#0B4F9C] transition-colors">• Profile</span>
                      </div>
                    </div>
                  </button>

                  {/* Sign Out Action */}
                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-[#C8102E] text-xs font-semibold px-2.5 py-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Sign Out of Session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenLogin()}
                  className="inline-flex items-center gap-2 bg-[#C8102E] hover:bg-[#a50b24] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:ring-offset-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Staff Portal Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Collapsible Sidebar / Drawer Component (Visible Only When Triggered) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 transition-opacity animate-in fade-in duration-200"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-88 sm:w-96 max-w-[90vw] bg-white dark:bg-[#161c27] text-slate-900 dark:text-slate-100 shadow-2xl border-r border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Academic Navigation and Governance Drawer"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <AttwoolLogo size="sm" showSubtitle={false} />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Academic Menu
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Institutional Governance
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close navigation sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* 1. Attwool Campus Switcher Section */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-[#0B4F9C] dark:text-[#5b9bf0]" />
                Select Attwool Campus
              </span>
              <span className="text-[10px] text-slate-400">4 Locations</span>
            </div>
            <div className="space-y-1.5">
              {campuses.map((c) => {
                const isSelected = selectedCampus === c.name;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelectCampus(c.name);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border cursor-pointer flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-blue-50/90 dark:bg-blue-950/50 border-[#0B4F9C] dark:border-[#5b9bf0] text-[#0B4F9C] dark:text-[#5b9bf0] shadow-xs'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        {c.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {c.type} • {c.location}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#0B4F9C] dark:text-[#5b9bf0] shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Institutional Governance & Frameworks (Requested Options) */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0B4F9C] dark:text-[#5b9bf0]" />
              Academic Governance Options
            </div>

            <div className="space-y-2">
              {/* Option 1: 7-Step Reporting Cycle */}
              <div className="border border-slate-200 dark:border-slate-700/80 rounded-xl overflow-hidden bg-white dark:bg-slate-800/40">
                <button
                  type="button"
                  onClick={() => setExpandedSection(expandedSection === 'cycle' ? null : 'cycle')}
                  className="w-full p-3 text-left flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-950/80 rounded-lg text-[#0B4F9C] dark:text-blue-300">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">7-Step Reporting Cycle</div>
                      <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400">Weekly curriculum pacing &amp; submission</div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      expandedSection === 'cycle' ? 'rotate-180 text-[#0B4F9C]' : ''
                    }`}
                  />
                </button>

                {expandedSection === 'cycle' && (
                  <div className="p-3 border-t border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-900/40 space-y-2 text-[11px]">
                    {reportingSteps.map((s) => (
                      <div key={s.step} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0B4F9C] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {s.step}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{s.title}</div>
                          <div className="text-slate-500 dark:text-slate-400 text-[10px]">{s.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Option 2: HOD & Head Governance */}
              <div className="border border-slate-200 dark:border-slate-700/80 rounded-xl overflow-hidden bg-white dark:bg-slate-800/40">
                <button
                  type="button"
                  onClick={() => setExpandedSection(expandedSection === 'governance' ? null : 'governance')}
                  className="w-full p-3 text-left flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950/80 rounded-lg text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">HOD &amp; Head Governance</div>
                      <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400">Supervisory reviews &amp; institutional seal</div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      expandedSection === 'governance' ? 'rotate-180 text-[#0B4F9C]' : ''
                    }`}
                  />
                </button>

                {expandedSection === 'governance' && (
                  <div className="p-3 border-t border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-900/40 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                      <strong>Dual-Tier Verification:</strong> Under Attwool institutional guidelines, every weekly report must be vetted by the Subject HOD and sealed by the Campus Head.
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                      <li>HOD review queue with audit directives &amp; return capabilities.</li>
                      <li>Campus Head official digital seal and QuestPDF generation.</li>
                      <li>Strict Friday 5:00 PM WAT cutoff window enforcement.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Option 3: Dapper Compliance Matrix */}
              <div className="border border-slate-200 dark:border-slate-700/80 rounded-xl overflow-hidden bg-white dark:bg-slate-800/40">
                <button
                  type="button"
                  onClick={() => handleNavigate('compliance')}
                  className="w-full p-3 text-left flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-purple-100 dark:bg-purple-950/80 rounded-lg text-purple-700 dark:text-purple-300">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        Dapper Compliance Matrix
                        <span className="text-[9px] bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-1.5 py-0.2 rounded font-bold">Live</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400">High-speed submission analytics &amp; audits</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Option 4: Campuses Overview */}
              <div className="border border-slate-200 dark:border-slate-700/80 rounded-xl overflow-hidden bg-white dark:bg-slate-800/40">
                <button
                  type="button"
                  onClick={() => setExpandedSection(expandedSection === 'campuses' ? null : 'campuses')}
                  className="w-full p-3 text-left flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-amber-100 dark:bg-amber-950/80 rounded-lg text-amber-700 dark:text-amber-300">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">Campuses Overview</div>
                      <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400">Multi-campus operations &amp; facilities</div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      expandedSection === 'campuses' ? 'rotate-180 text-[#0B4F9C]' : ''
                    }`}
                  />
                </button>

                {expandedSection === 'campuses' && (
                  <div className="p-3 border-t border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-900/40 space-y-2 text-[11px]">
                    <div className="text-slate-600 dark:text-slate-300">
                      Attwool Schools operates co-educational boarding and day facilities across two strategic Lekki peninsula hubs:
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[10px]">
                      • <strong>Awoyaya Hub:</strong> College (Secondary) &amp; Sunflower (Nursery/Primary)<br />
                      • <strong>Agungi Hub:</strong> College (Secondary) &amp; Sunflower (Nursery/Primary)
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Staff Workspace Navigation (If user is authenticated) */}
          {currentUser && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                Staff Workspace Views
              </div>
              <div className="space-y-1">
                {/* Teacher Workspace: Available to Teacher, FormTutor, HOD, and SuperAdmin */}
                {(currentUser.role === 'Teacher' || currentUser.role === 'FormTutor' || currentUser.role === 'HOD' || currentUser.role === 'SuperAdmin') && (
                  <button
                    type="button"
                    onClick={() => handleNavigate('teacher-dashboard')}
                    className="w-full text-left p-2.5 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#0B4F9C]" />
                      Teacher Workspace
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}

                {/* HOD Review Queue: Available to HOD and SuperAdmin */}
                {(currentUser.role === 'HOD' || currentUser.role === 'SuperAdmin') && (
                  <button
                    type="button"
                    onClick={() => handleNavigate('hod-queue')}
                    className="w-full text-left p-2.5 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      HOD Review Queue
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}

                {/* Campus Head Sign-off: Available to CampusHead / Principal and SuperAdmin */}
                {(currentUser.role === 'CampusHead' || currentUser.role === 'SuperAdmin') && (
                  <button
                    type="button"
                    onClick={() => handleNavigate('principal-signoff')}
                    className="w-full text-left p-2.5 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      Campus Head Sign-off
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}

                {/* Executive Analytics: Available to CampusHead and SuperAdmin */}
                {(currentUser.role === 'CampusHead' || currentUser.role === 'SuperAdmin') && (
                  <button
                    type="button"
                    onClick={() => handleNavigate('compliance')}
                    className="w-full text-left p-2.5 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
                      Executive Analytics
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          {currentUser ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{currentUser.email}</div>
                </div>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-950/80 text-[#0B4F9C] dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
                  {currentUser.role}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="flex-1 py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{theme === 'dark' ? 'Day Mode' : 'Night Mode'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSidebarOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="py-1.5 px-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs font-semibold text-[#C8102E] dark:text-[#e5334f] flex items-center gap-1.5 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/40"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsSidebarOpen(false);
                  onOpenLogin();
                }}
                className="w-full bg-[#C8102E] hover:bg-[#a50b24] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Staff Portal Login</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
