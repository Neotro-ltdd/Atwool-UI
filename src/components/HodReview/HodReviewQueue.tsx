import React, { useState } from 'react';
import type { WeeklyReport, UserSession } from '../../types';
import {
  Clock,
  Search,
  ChevronRight,
  ShieldCheck,
  Building
} from 'lucide-react';

interface HodReviewQueueProps {
  user: UserSession;
  reports: WeeklyReport[];
  onSelectReportToReview: (report: WeeklyReport) => void;
}

export const HodReviewQueue: React.FC<HodReviewQueueProps> = ({
  user,
  reports,
  onSelectReportToReview
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredReports = reports.filter((r) => {
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesSearch =
      r.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.general.subjectsTaught.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.referenceNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* HOD Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C8102E] uppercase tracking-wider mb-1">
            <Building className="w-4 h-4" />
            <span>{user.campus}</span>
            <span className="text-slate-300">•</span>
            <span>Department: {user.department || 'Sciences & Mathematics'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-brand-serif">
            HOD Departmental Review Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Supervisory evaluation, independent rating audits, and curriculum pacing verification.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-[#0B4F9C]" />
          <span>Two-Tier Governance (BR-012..015)</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by teacher name, subject, or reference number..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
          {['ALL', 'SUBMITTED', 'RETURNED', 'REVIEWED', 'ACKNOWLEDGED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterStatus === st
                  ? 'bg-[#0B4F9C] text-white border-[#0B4F9C]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Items */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-100 text-slate-600 font-bold text-xs border-b border-slate-200 flex items-center justify-between">
          <span>Department Submissions ({filteredReports.length})</span>
          <span className="text-[11px] text-slate-500 font-normal">Prioritized by Late Submissions &amp; Timestamp</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredReports.map((rep) => (
            <div
              key={rep.id}
              className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-sm font-bold text-slate-900">
                    {rep.teacherName} — {rep.general.subjectsTaught} ({rep.general.classesTaught})
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    rep.status === 'SUBMITTED' ? 'bg-blue-50 text-[#0B4F9C] border-blue-200' :
                    rep.status === 'REVIEWED' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    rep.status === 'RETURNED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {rep.status}
                  </span>
                  {rep.isLate && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Late Submission
                    </span>
                  )}
                  {rep.attendance.hasWelfareConcern && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#C8102E]" />
                      Safeguarding Disclosure
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                  <span>Week {rep.termWeekNumber}</span>
                  <span>•</span>
                  <span>Ref: <strong className="font-mono text-slate-700">{rep.referenceNo}</strong></span>
                  <span>•</span>
                  <span>Curriculum: <strong className="text-slate-800">{rep.teaching.topicsCovered}</strong></span>
                  <span>•</span>
                  <span>Comprehension: <strong className="text-slate-800">{rep.learning.understanding.replace('_', ' ')}</strong></span>
                </div>
              </div>

              <button
                onClick={() => onSelectReportToReview(rep)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0B4F9C] hover:bg-[#07356B] text-white text-xs font-bold rounded-lg transition-all shadow-xs"
              >
                <span>Audit &amp; Review</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
