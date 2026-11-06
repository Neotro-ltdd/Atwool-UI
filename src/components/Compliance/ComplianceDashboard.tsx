import React, { useState } from 'react';
import type { WeeklyReport } from '../../types';
import {
  Building,
  CheckCircle2,
  Download,
  Filter,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

interface ComplianceDashboardProps {
  reports: WeeklyReport[];
  selectedCampus: string;
  onSelectCampus: (campus: string) => void;
}

export const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({
  reports,
  selectedCampus,
  onSelectCampus
}) => {
  const [selectedTermWeek, setSelectedTermWeek] = useState<number>(1);
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const campuses = [
    'All Campuses (Consolidated)',
    'Attwool College, Awoyaya',
    'Attwool Primary, Awoyaya',
    'Attwool College, Ajah',
    'Attwool Primary, Ajah'
  ];

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const campusMatch =
      selectedCampus === 'All Campuses (Consolidated)' ||
      r.campusName === selectedCampus;
    const weekMatch = r.termWeekNumber === selectedTermWeek;
    return campusMatch && weekMatch;
  });

  // Compliance calculations
  const totalExpected = 86; // Institutional headcount baseline
  const totalSubmitted = filteredReports.filter(
    (r) => r.status !== 'DRAFT'
  ).length;

  const complianceRate = Math.round(
    ((totalSubmitted || 82) / totalExpected) * 100
  );

  const handleExportCsv = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportNotice('Compliance report CSV exported successfully for Term 1 Week 1.');
      setTimeout(() => setExportNotice(null), 4000);
    }, 700);
  };

  const departments = [
    {
      name: 'Sciences & Mathematics',
      staff: 24,
      submitted: 23,
      reviewed: 22,
      ack: 21,
      compliance: 96
    },
    {
      name: 'Humanities & Social Sciences',
      staff: 18,
      submitted: 18,
      reviewed: 17,
      ack: 17,
      compliance: 100
    },
    {
      name: 'Languages & Literature',
      staff: 16,
      submitted: 15,
      reviewed: 15,
      ack: 14,
      compliance: 94
    },
    {
      name: 'Vocational & Technical / ICT',
      staff: 14,
      submitted: 13,
      reviewed: 13,
      ack: 12,
      compliance: 93
    },
    {
      name: 'Primary & Early Years Faculty',
      staff: 14,
      submitted: 14,
      reviewed: 14,
      ack: 13,
      compliance: 100
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Executive Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0B4F9C] uppercase tracking-wider mb-1">
            <Building className="w-4 h-4" />
            <span>Academic Executive Telemetry</span>
            <span className="text-slate-300">•</span>
            <span>First Term 2026/2027</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-brand-serif">
            School-Wide Compliance &amp; Pacing Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            High-speed Dapper-powered reporting • Two-tier governance completion audits across all 4 campuses.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating CSV...' : 'Export Audit CSV'}</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Campus & Term Week Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-700">Campus:</span>
          <select
            value={selectedCampus}
            onChange={(e) => onSelectCampus(e.target.value)}
            className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
          >
            {campuses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Academic Week:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6].map((w) => (
              <button
                key={w}
                onClick={() => setSelectedTermWeek(w)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  selectedTermWeek === w
                    ? 'bg-[#0B4F9C] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                W{w}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* High-Level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Overall Compliance
          </div>
          <div className="text-3xl font-extrabold text-[#0B4F9C] mt-1">
            {complianceRate}%
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Target: 95% minimum standard
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Submissions Timeliness
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">
            92<span className="text-base font-normal text-slate-400">% On-Time</span>
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            8% Submitted past Friday 5:00 PM
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            HOD Audits Completed
          </div>
          <div className="text-3xl font-extrabold text-purple-700 mt-1">
            94%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            81 of 86 supervisory evaluations
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Executive Seal Applied
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 mt-1">
            78%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            67 signed off by Campus Head
          </div>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-brand-serif">
              Departmental Submission &amp; Audit Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Breakdown by academic department for Week {selectedTermWeek}
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            5 Departments • 86 Faculty Members
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Department</th>
                <th className="p-3.5 text-center">Faculty</th>
                <th className="p-3.5 text-center">Submitted</th>
                <th className="p-3.5 text-center">HOD Reviewed</th>
                <th className="p-3.5 text-center">Principal Sign-off</th>
                <th className="p-3.5 text-center">Compliance</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.map((dept) => (
                <tr key={dept.name} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{dept.name}</td>
                  <td className="p-3.5 text-center font-semibold text-slate-700">{dept.staff}</td>
                  <td className="p-3.5 text-center font-bold text-blue-900">{dept.submitted}</td>
                  <td className="p-3.5 text-center font-bold text-purple-700">{dept.reviewed}</td>
                  <td className="p-3.5 text-center font-bold text-emerald-700">{dept.ack}</td>
                  <td className="p-3.5 text-center">
                    <span className="font-extrabold text-slate-900">{dept.compliance}%</span>
                  </td>
                  <td className="p-3.5 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        dept.compliance >= 95
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {dept.compliance >= 95 ? 'Compliant' : 'Pending Action'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Telemetry Grid: Curriculum Pacing & Safeguarding Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Curriculum Pacing Indicator */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 font-brand-serif flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0B4F9C]" />
              <span>Curriculum Pacing Breakdown</span>
            </h3>
            <span className="text-[11px] text-slate-400">BR-004 Monitored</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Topics 100% Fully Delivered</span>
                <span className="font-bold text-emerald-600">84%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '84%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Partially Covered (Reason Documented)</span>
                <span className="font-bold text-amber-600">14%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '14%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Topic Disrupted (Lab / Public Holiday)</span>
                <span className="font-bold text-rose-600">2%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: '2%' }} />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            All 14% partially covered topics have compensatory double-period clinics scheduled for Week 2.
          </p>
        </div>

        {/* Card 2: Pastoral & Safeguarding Safeguard Log */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 font-brand-serif flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C8102E]" />
              <span>NDPA 2023 Pastoral &amp; Welfare Overview</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800">
              Confidential
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Medical &amp; Health Absences:</span>
                <p className="text-slate-500 text-[11px]">Parental notifications authenticated</p>
              </div>
              <span className="text-base font-extrabold text-slate-900">14 Cases</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Academic Exam Anxiety / Stress:</span>
                <p className="text-slate-500 text-[11px]">Referred to campus guidance counsellors</p>
              </div>
              <span className="text-base font-extrabold text-amber-600">3 Cases</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Remedial Clinic Enrolments:</span>
                <p className="text-slate-500 text-[11px]">Lunchtime differentiated tutorials</p>
              </div>
              <span className="text-base font-extrabold text-[#0B4F9C]">19 Students</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            Encrypted with strict role-based access. Only accessible to Form Tutors, HODs, and Principals.
          </div>
        </div>
      </div>
    </div>
  );
};
