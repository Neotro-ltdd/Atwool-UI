import React, { useState } from 'react';
import type { WeeklyReport, UserSession, Campus, StaffMember } from '../../types';
import {
  Building2,
  Users,
  FileText,
  RotateCcw,
  MessageSquare,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  School,
  Search
} from 'lucide-react';

interface DirectorDashboardProps {
  user: UserSession;
  campuses: Campus[];
  staffList: StaffMember[];
  reports: WeeklyReport[];
  onNavigateToReports: () => void;
  onNavigateToReviewReport: (reportId: string) => void;
}

export const DirectorDashboard: React.FC<DirectorDashboardProps> = ({
  user,
  campuses,
  staffList,
  reports,
  onNavigateToReports,
  onNavigateToReviewReport
}) => {
  const [selectedCampusFilter, setSelectedCampusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Telemetry Calculations
  const totalCampuses = campuses.length;
  
  // Teachers count (Faculty who deliver instruction)
  const teachers = staffList.filter((s) => s.role === 'Teacher' || s.role === 'FormTutor');
  const totalTeachers = teachers.length > 0 ? teachers.length : staffList.length;
  const activeTeachers = teachers.filter((t) => t.status === 'ACTIVE').length;
  const pendingTeachers = teachers.filter((t) => t.status === 'PENDING_ACTIVATION').length;

  // Reports Submitted So Far (Exclude DRAFTs)
  const submittedReports = reports.filter((r) => r.status !== 'DRAFT');
  const submittedCount = submittedReports.length;
  const onTimeCount = submittedReports.filter((r) => !r.isLate).length;
  const lateCount = submittedReports.filter((r) => r.isLate).length;
  const onTimeRate = submittedCount > 0 ? Math.round((onTimeCount / submittedCount) * 100) : 100;

  // Reports Returned for Revision
  const returnedReports = reports.filter((r) => r.status === 'RETURNED');
  const returnedCount = returnedReports.length;

  // Feedback Given by Director / Reviewer
  const reportsWithFeedback = reports.filter(
    (r) =>
      (r.review?.overallComment && r.review.overallComment.trim().length > 0) ||
      r.status === 'ACKNOWLEDGED' ||
      r.status === 'REVIEWED' ||
      r.status === 'RETURNED'
  );
  const feedbackGivenCount = reportsWithFeedback.length;
  const sealedReportsCount = reports.filter((r) => r.status === 'ACKNOWLEDGED').length;

  // Pending Director Review Count
  const pendingReviewReports = reports.filter((r) => r.status === 'SUBMITTED' || r.status === 'REVIEWED');
  const pendingReviewCount = pendingReviewReports.length;

  // Filtered reports for recent submissions list
  const filteredReports = reports.filter((r) => {
    if (r.status === 'DRAFT') return false;
    const matchesCampus =
      selectedCampusFilter === 'ALL' ||
      r.campusId === selectedCampusFilter ||
      r.campusName?.toLowerCase().includes(selectedCampusFilter.toLowerCase());

    const matchesSearch =
      !searchQuery.trim() ||
      r.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.general.subjectsTaught.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.campusName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCampus && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. HERO BANNER: DIRECTOR ACADEMIC GOVERNANCE HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#e6e3dd] shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0B4F9C] border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Office of the School Director • {user.name}
              </span>
              <span className="text-slate-400 hidden sm:inline">•</span>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Term 1 2026/2027 Cycle Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 font-brand-serif tracking-tight">
              Director Academic Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              Consolidated supervisory telemetry across all campuses. Monitor curriculum delivery, teacher submissions, revision requests, and direct pedagogical feedback.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              type="button"
              onClick={onNavigateToReports}
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-[#1e293b] hover:bg-[#0f172a] text-white text-xs sm:text-sm font-bold shadow-sm transition-all hover:shadow cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Review Submissions Queue ({pendingReviewCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. THE 5 CORE METRIC KPI CARDS (Requested by User) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Number of Campuses */}
        <div className="bg-white p-5 rounded-2xl border border-[#e6e3dd] shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Campuses</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0B4F9C] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-brand-serif">{totalCampuses}</div>
            <div className="text-xs text-slate-500 mt-0.5">Active Academic Facilities</div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-blue-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Full Network Oversight</span>
          </div>
        </div>

        {/* Card 2: Number of Teachers */}
        <div className="bg-white p-5 rounded-2xl border border-[#e6e3dd] shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Teachers</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-brand-serif">{totalTeachers}</div>
            <div className="text-xs text-slate-500 mt-0.5">{activeTeachers} Active • {pendingTeachers} Pending</div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Curriculum Allocations Set</span>
          </div>
        </div>

        {/* Card 3: Reports Submitted So Far */}
        <div className="bg-white p-5 rounded-2xl border border-[#e6e3dd] shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Submitted So Far</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-brand-serif">{submittedCount}</div>
            <div className="text-xs text-slate-500 mt-0.5">{onTimeCount} On-Time • {lateCount} Late</div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-purple-700">
            <Clock className="w-3 h-3" />
            <span>{onTimeRate}% Punctual Rate</span>
          </div>
        </div>

        {/* Card 4: Reports Returned */}
        <div className="bg-white p-5 rounded-2xl border border-[#e6e3dd] shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reports Returned</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-rose-600 font-brand-serif">{returnedCount}</div>
            <div className="text-xs text-slate-500 mt-0.5">Revision &amp; Note Requests</div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-rose-600">
            {returnedCount > 0 ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Awaiting Staff Revision</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700">Clean Submissions Pipeline</span>
              </>
            )}
          </div>
        </div>

        {/* Card 5: Number of Feedback Given */}
        <div className="bg-white p-5 rounded-2xl border border-[#e6e3dd] shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Feedback Given</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-brand-serif">{feedbackGivenCount}</div>
            <div className="text-xs text-slate-500 mt-0.5">{sealedReportsCount} Officially Sealed</div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
            <Award className="w-3 h-3 text-amber-600" />
            <span>Supervisory Notes Delivered</span>
          </div>
        </div>
      </div>

      {/* 3. CAMPUS NETWORK PERFORMANCE & BREAKDOWN */}
      <div className="bg-white rounded-3xl border border-[#e6e3dd] shadow-2xs p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-brand-serif flex items-center gap-2">
              <School className="w-5 h-5 text-[#0B4F9C]" />
              <span>Campus Delivery Progress &amp; Facility Breakdown</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live submission rate, teaching faculty allocations, and leadership per academic campus.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {campuses.length} Campuses Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {campuses.map((camp) => {
            const campusStaff = staffList.filter((s) => s.campusId === camp.id || s.campusName === camp.name);
            const campusReports = reports.filter(
              (r) => (r.campusId === camp.id || r.campusName === camp.name) && r.status !== 'DRAFT'
            );
            const campusReturned = reports.filter(
              (r) => (r.campusId === camp.id || r.campusName === camp.name) && r.status === 'RETURNED'
            );
            const campusFeedback = reports.filter(
              (r) =>
                (r.campusId === camp.id || r.campusName === camp.name) &&
                r.review?.overallComment &&
                r.review.overallComment.trim().length > 0
            );

            return (
              <div
                key={camp.id}
                className="p-5 rounded-2xl bg-[#fbfaf8] border border-[#e6e3dd] space-y-4 hover:border-blue-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#0B4F9C]">
                      {camp.type}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {camp.studentCount || 350} Pupils
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 truncate" title={camp.name}>
                    {camp.name}
                  </h3>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    Principal: {camp.principalName || 'Principal Designate'}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Teaching Faculty:</span>
                    <strong className="text-slate-900">{campusStaff.length} teachers</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Reports Submitted:</span>
                    <strong className="text-purple-700 font-bold">{campusReports.length} reports</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Returned for Edit:</span>
                    <strong className={campusReturned.length > 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                      {campusReturned.length}
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Feedback Delivered:</span>
                    <strong className="text-emerald-700 font-bold">{campusFeedback.length}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={onNavigateToReports}
                    className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-[#e6e3dd] text-[11px] font-bold text-[#0B4F9C] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View Campus Queue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. TWO-COLUMN OPERATIONAL SECTION: RECENT SUBMISSIONS & SUPERVISORY FEEDBACK LOG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Submissions Awaiting Director Attention (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#e6e3dd] shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 font-brand-serif flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Recent Teacher Submissions ({filteredReports.length})</span>
              </h2>
              <p className="text-xs text-slate-500">
                Weekly curriculum deliveries submitted directly for Director evaluation.
              </p>
            </div>

            {/* Campus Filter & Search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search staff, subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-[#e6e3dd] text-xs font-medium text-slate-700 bg-white placeholder:text-slate-400 w-36 sm:w-44 focus:outline-none focus:ring-1 focus:ring-[#0B4F9C]"
                />
              </div>
              <select
                value={selectedCampusFilter}
                onChange={(e) => setSelectedCampusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-[#e6e3dd] text-xs font-semibold text-slate-700 bg-white cursor-pointer"
              >
                <option value="ALL">All Campuses</option>
                {campuses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name.split(',')[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <div className="text-xs font-bold text-slate-700">All submissions up to date</div>
              <p className="text-[11px] text-slate-400">No reports matching the active filter.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredReports.slice(0, 5).map((rep) => {
                const isPending = rep.status === 'SUBMITTED' || rep.status === 'REVIEWED';
                const isReturned = rep.status === 'RETURNED';
                const isSealed = rep.status === 'ACKNOWLEDGED';

                return (
                  <div
                    key={rep.id}
                    className="p-4 rounded-2xl bg-[#fbfaf8] border border-[#e6e3dd] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">{rep.teacherName}</span>
                        {isPending && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Awaiting Director Review
                          </span>
                        )}
                        {isReturned && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Returned for Revision
                          </span>
                        )}
                        {isSealed && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Sealed &amp; Approved
                          </span>
                        )}
                        {rep.isLate && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-800">
                            Late
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span className="font-semibold text-[#0B4F9C]">
                          {rep.general.subjectsTaught} • {rep.general.classesTaught}
                        </span>
                        <span>{rep.campusName.split(',')[0]}</span>
                        <span className="font-mono text-slate-400">{rep.referenceNo}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigateToReviewReport(rep.id)}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-[#e6e3dd] text-xs font-bold text-[#0B4F9C] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <span>Review Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onNavigateToReports}
              className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Open Complete Director Sign-off Workstation →</span>
            </button>
          </div>
        </div>

        {/* Right Column: Director Feedback Given Log (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#e6e3dd] shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 font-brand-serif flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <span>Director Feedback Given ({reportsWithFeedback.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              Recent pedagogical guidance and recommendations issued to teaching staff.
            </p>
          </div>

          {reportsWithFeedback.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-600">No feedback issued yet</div>
              <p className="text-[11px] text-slate-400">
                Supervisory notes provided during review will appear in this audit log.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reportsWithFeedback.slice(0, 4).map((rep) => {
                const isReturned = rep.status === 'RETURNED';

                return (
                  <div
                    key={rep.id}
                    className="p-3.5 rounded-2xl bg-[#fbfaf8] border border-[#e6e3dd] space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{rep.teacherName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isReturned
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isReturned ? 'Returned for Revision' : 'Approved with Seal'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span className="font-semibold text-[#0B4F9C]">{rep.general.subjectsTaught}</span>
                      <span>•</span>
                      <span>{rep.campusName.split(',')[0]}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 italic">
                      "{rep.review?.overallComment || 'Verified satisfactory instructional pacing and curriculum coverage.'}"
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Institutional Oversight Quality Standard</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Every weekly review submitted by educators across the network receives direct scrutiny from the Director of Schools, safeguarding curriculum pacing and institutional excellence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
