import React, { useState } from 'react';
import type { WeeklyReport, UserSession } from '../../types';
import {
  Plus,
  Printer,
  ChevronRight,
  Building2,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  Search,
  FileText,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Info
} from 'lucide-react';

interface TeacherDashboardProps {
  user: UserSession;
  reports: WeeklyReport[];
  onOpenReport: (report: WeeklyReport) => void;
  onStartNewReport: () => void;
  onPreviewPdf: (report: WeeklyReport) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  user,
  reports,
  onOpenReport,
  onStartNewReport,
  onPreviewPdf
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'DRAFT' | 'SUBMITTED' | 'APPROVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGuidance, setShowGuidance] = useState(false);

  // Status Badge Mapper
  const getStatusBadge = (status: string, isLate: boolean) => {
    switch (status) {
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Draft (In Progress)
          </span>
        );
      case 'SUBMITTED':
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            isLate
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : 'bg-blue-50 text-[#0B4F9C] border border-blue-200'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            Submitted to Director {isLate ? '• Late' : '• On-Time'}
          </span>
        );
      case 'RETURNED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Returned for Revision
          </span>
        );
      case 'REVIEWED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            Reviewed by Director
          </span>
        );
      case 'ACKNOWLEDGED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Sealed by Director
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  // Filter Reports by Active Tab & Search Query
  const filteredReports = reports.filter((r) => {
    // Tab filtering
    if (activeTab === 'DRAFT' && r.status !== 'DRAFT' && r.status !== 'RETURNED') return false;
    if (activeTab === 'SUBMITTED' && r.status !== 'SUBMITTED' && r.status !== 'REVIEWED') return false;
    if (activeTab === 'APPROVED' && r.status !== 'ACKNOWLEDGED') return false;

    // Search filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const refMatch = r.referenceNo.toLowerCase().includes(q);
      const subMatch = (r.general?.subjectsTaught || '').toLowerCase().includes(q);
      const clsMatch = (r.general?.classesTaught || '').toLowerCase().includes(q);
      const weekMatch = `week ${r.termWeekNumber}`.includes(q);
      return refMatch || subMatch || clsMatch || weekMatch;
    }

    return true;
  });

  const draftCount = reports.filter(r => r.status === 'DRAFT' || r.status === 'RETURNED').length;
  const submittedCount = reports.filter(r => r.status === 'SUBMITTED' || r.status === 'REVIEWED').length;
  const approvedCount = reports.filter(r => r.status === 'ACKNOWLEDGED').length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. CLEAN INSTITUTIONAL HERO GREETING BANNER (WHITE LIKE IMAGE 2) */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#e6e3dd] shadow-sm">
        {/* Heraldic Top Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#94A3B8] via-[#C8102E] to-[#0B4F9C]" />

        <div className="p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            {/* Campus & Department Breadcrumb Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-[#0B4F9C] border border-blue-200 font-bold">
                <Building2 className="w-3.5 h-3.5" />
                <span>{user.campus}</span>
              </span>
              <span>•</span>
              <span className="text-slate-700 font-medium">
                {user.department || 'Sciences & Mathematics Department'}
              </span>
              {user.isFormTutor && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-semibold">
                    <Users className="w-3 h-3" />
                    Form Tutor (SS 1 Science)
                  </span>
                </>
              )}
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 font-brand-serif tracking-tight">
              Welcome back, {user.name}
            </h1>

            {/* Subtitle & Term Schedule Indicator */}
            <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
              <p className="text-xs sm:text-sm text-slate-600">
                Academic Governance &amp; Weekly Reporting Subsystem • First Term 2026/2027
              </p>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300" />
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Week 1 Reporting Cycle Open
              </span>
            </div>
          </div>

          {/* Primary Action Button (Crimson Red matching Image 2) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={onStartNewReport}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#C8102E] hover:bg-[#a50b24] text-white font-bold text-sm rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Start Week 1 Report Draft</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. OPERATIONAL TELEMETRY & CUTOFF GOVERNANCE CARDS (CLEAN WHITE CARDS LIKE IMAGE 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Term Week */}
        <div className="p-5 rounded-2xl bg-white border border-[#e6e3dd] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0B4F9C]" />
              Current Cycle
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Term 1
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-brand-serif">
              Week 1 of 12
            </div>
            <div className="text-xs text-emerald-600 font-semibold mt-0.5">
              Period: 07 Sept – 11 Sept 2026
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#0B4F9C] h-full rounded-full" style={{ width: '8.3%' }} />
          </div>
        </div>

        {/* Card 2: Submission Deadline */}
        <div className="p-5 rounded-2xl bg-white border border-[#e6e3dd] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C8102E]" />
              Friday Cutoff
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-[#C8102E] border border-rose-200">
              5:00 PM WAT
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#C8102E] font-brand-serif">
              Friday 5:00 PM
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Automated late flag (BR-003)
            </div>
          </div>
          <div className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5 font-medium">
            <Info className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span>Submission window closes in 4 days</span>
          </div>
        </div>

        {/* Card 3: Draft Autosave & Concurrency */}
        <div className="p-5 rounded-2xl bg-white border border-[#e6e3dd] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Data Integrity
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Sync
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-brand-serif">
              Every 20 Secs
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Optimistic Concurrency Protection
            </div>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero report loss guarantee</span>
          </div>
        </div>

        {/* Card 4: Form Tutor Allocation */}
        <div className="p-5 rounded-2xl bg-white border border-[#e6e3dd] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              Class Allocation
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              Assigned Form
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-700 font-brand-serif">
              SS 1 Science
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              22 Enrolled Students • Physics
            </div>
          </div>
          <div className="text-[11px] text-purple-600 flex items-center gap-1 font-medium">
            <span>Special welfare tracking enabled</span>
          </div>
        </div>
      </div>

      {/* 3. ACADEMIC GOVERNANCE QUICK-DIRECTIVES ACCORDION (CLEAN WHITE CARD) */}
      <div className="rounded-2xl border border-[#e6e3dd] bg-white p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0B4F9C] border border-blue-200 flex items-center justify-center shrink-0 shadow-2xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>7-Step Academic Governance &amp; Attestation Standards</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-[#0B4F9C] border border-blue-200 font-semibold">
                  Policy 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Reports follow rigorous syllabus verification, formative remediation, and direct Director review.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowGuidance(!showGuidance)}
            className="text-xs font-bold text-[#0B4F9C] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{showGuidance ? 'Hide Standards' : 'View Reporting Steps'}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showGuidance ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {showGuidance && (
          <div className="mt-4 pt-4 border-t border-[#e6e3dd] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs animate-in fade-in">
            <div className="p-3.5 rounded-xl bg-[#fbfaf8] border border-[#e6e3dd] space-y-1">
              <div className="font-bold text-[#0B4F9C]">1. Pacing &amp; Delivery</div>
              <p className="text-[11px] text-slate-500">Lesson note compliance, Ministry scheme alignment, and laboratory experiments.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#fbfaf8] border border-[#e6e3dd] space-y-1">
              <div className="font-bold text-[#0B4F9C]">2. Pupil Assessment</div>
              <p className="text-[11px] text-slate-500">Diagnostic quizzes, continuous assessment grades, and remedial lunch clinics.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#fbfaf8] border border-[#e6e3dd] space-y-1">
              <div className="font-bold text-[#0B4F9C]">3. Student Welfare</div>
              <p className="text-[11px] text-slate-500">Mandatory logging of student absences, health notes, and counselling referrals under NDPA 2023.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#fbfaf8] border border-[#e6e3dd] space-y-1">
              <div className="font-bold text-[#0B4F9C]">4. Attestation &amp; Seal</div>
              <p className="text-[11px] text-slate-500">Irrevocable digital signing before Friday 5:00 PM followed by direct Director review and seal.</p>
            </div>
          </div>
        )}
      </div>

      {/* 4. WEEKLY SUBMISSIONS & REPORT MANAGEMENT (CLEAN WHITE CARD LIKE IMAGE 2) */}
      <div className="bg-white rounded-3xl border border-[#e6e3dd] shadow-sm overflow-hidden">
        {/* Section Header with Tabs & Search */}
        <div className="p-6 border-b border-[#e6e3dd] bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-brand-serif">
              My Weekly Submissions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review active draft reports, supervisor audit comments, and generated printable PDF documents.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold self-stretch sm:self-auto overflow-x-auto border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Reports ({reports.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('DRAFT')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'DRAFT'
                  ? 'bg-white text-amber-800 shadow-xs font-bold border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Drafts ({draftCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('SUBMITTED')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'SUBMITTED'
                  ? 'bg-white text-[#0B4F9C] shadow-xs font-bold border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Submitted to Director ({submittedCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('APPROVED')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'APPROVED'
                  ? 'bg-white text-emerald-800 shadow-xs font-bold border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sealed ({approvedCount})
            </button>
          </div>
        </div>

        {/* Search & Sub-Filter Bar */}
        <div className="px-6 py-3.5 bg-[#fbfaf8] border-b border-[#e6e3dd] flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by week, subject, or reference code (e.g. ATT-2026)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#e6e3dd] rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C] focus:border-[#0B4F9C]"
            />
          </div>
          <span className="text-[11px] text-slate-400 font-semibold shrink-0">
            Showing {filteredReports.length} of {reports.length} report(s)
          </span>
        </div>

        {/* Report Cards / List */}
        {filteredReports.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredReports.map((rep) => (
              <div
                key={rep.id}
                className="p-6 hover:bg-[#fbfaf8] transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
              >
                {/* Left Report Summary Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-base font-bold text-slate-900 font-brand-serif">
                      Week {rep.termWeekNumber}: {rep.general.subjectsTaught} ({rep.general.classesTaught})
                    </span>
                    {getStatusBadge(rep.status, rep.isLate)}
                  </div>

                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      <FileText className="w-3 h-3 text-[#0B4F9C]" />
                      {rep.referenceNo}
                    </span>
                    <span>•</span>
                    <span>Version {rep.version}</span>
                    <span>•</span>
                    <span className="font-medium text-slate-600">
                      Period: {rep.weekStart} to {rep.weekEnd}
                    </span>
                    {rep.submittedAt && (
                      <>
                        <span>•</span>
                        <span>Submitted {new Date(rep.submittedAt).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>

                  {/* Form Tutor Welfare Notice */}
                  {rep.attendance?.hasWelfareConcern && (
                    <div className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-start gap-2 max-w-2xl">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Welfare Flag Logged: </strong>
                        <span>{rep.attendance.welfareDetails}</span>
                        {rep.attendance.welfareAction && (
                          <div className="text-[11px] text-amber-800 mt-0.5">
                            Action Taken: {rep.attendance.welfareAction}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Director Feedback / Supervisory Recommendations */}
                  {rep.review?.overallComment && (
                    <div className="text-xs text-blue-900 bg-blue-50/80 p-2.5 rounded-xl border border-blue-200 max-w-2xl">
                      <strong>Director Feedback &amp; Recommendations: </strong> {rep.review.overallComment}
                    </div>
                  )}
                </div>

                {/* Right Action CTA Buttons */}
                <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
                  <button
                    type="button"
                    onClick={() => onPreviewPdf(rep)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all cursor-pointer shadow-2xs"
                    title="Print or view official QuestPDF report"
                  >
                    <Printer className="w-4 h-4 text-slate-500" />
                    <span>PDF Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenReport(rep)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B4F9C] hover:bg-[#083a73] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-[0.98]"
                  >
                    <span>{rep.status === 'DRAFT' || rep.status === 'RETURNED' ? 'Continue Draft' : 'View Report'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty / No Matches State */
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No Weekly Reports Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? `No reports matched your query "${searchQuery}". Clear your search to see all records.`
                : 'You have not created any reports matching this filter. Start your Week 1 report draft now.'}
            </p>
            <div className="pt-2">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 text-xs font-semibold text-[#0B4F9C] hover:underline cursor-pointer"
                >
                  Clear Search Filter
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onStartNewReport}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C8102E] hover:bg-[#a50b24] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start Week 1 Report Draft</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 5. FOOTER STATUTORY ACCREDITATION CHIP (CLEAN WHITE CARD) */}
      <div className="p-4 rounded-2xl bg-white border border-[#e6e3dd] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Statutory compliance monitored under Nigeria Data Protection Act (NDPA 2023).</span>
        </div>
        <div className="text-[11px] font-medium text-slate-400">
          Attwool Schools Academic Governance Subsystem • v2.6.4
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
