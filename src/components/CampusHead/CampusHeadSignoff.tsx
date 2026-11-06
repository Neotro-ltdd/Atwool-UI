import React, { useState, useEffect } from 'react';
import type { WeeklyReport, UserSession, AcknowledgementData, ReviewData } from '../../types';
import {
  Building,
  ShieldCheck,
  CheckCircle2,
  Printer,
  AlertTriangle,
  Award,
  Sparkles,
  Search,
  RotateCcw,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { PdfPreviewModal } from '../PdfPreviewModal';

interface CampusHeadSignoffProps {
  user: UserSession;
  reports: WeeklyReport[];
  selectedReportIdProp?: string;
  onAcknowledgeReport: (updatedReport: WeeklyReport) => void;
  onReturnReport?: (updatedReport: WeeklyReport, reason: string) => void;
  onPreviewPdf: (report: WeeklyReport) => void;
}

export const CampusHeadSignoff: React.FC<CampusHeadSignoffProps> = ({
  user,
  reports,
  selectedReportIdProp,
  onAcknowledgeReport,
  onReturnReport,
  onPreviewPdf
}) => {
  // Direct Teacher-to-Director Flow: School Director receives submitted reports directly across all campuses
  const signoffQueue = reports.filter(
    (r) =>
      r.status === 'SUBMITTED' ||
      r.status === 'REVIEWED' ||
      r.status === 'ACKNOWLEDGED' ||
      r.status === 'RETURNED'
  );

  const [activeTab, setActiveTab] = useState<'PENDING' | 'ACKNOWLEDGED' | 'RETURNED' | 'ALL'>('PENDING');
  const [selectedCampusFilter, setSelectedCampusFilter] = useState('ALL');
  const [selectedReportId, setSelectedReportId] = useState<string>(
    selectedReportIdProp ||
    signoffQueue.find((r) => r.status === 'SUBMITTED' || r.status === 'REVIEWED')?.id || signoffQueue[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [returnValidationErr, setReturnValidationErr] = useState<string | null>(null);
  const [showAckSuccessModal, setShowAckSuccessModal] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  useEffect(() => {
    if (selectedReportIdProp) {
      setSelectedReportId(selectedReportIdProp);
    }
  }, [selectedReportIdProp]);

  const activeReport = reports.find((r) => r.id === selectedReportId) || signoffQueue[0];

  // Sync feedback field when selected report changes
  useEffect(() => {
    if (activeReport) {
      setFeedbackText(activeReport.review?.overallComment || '');
      setReturnValidationErr(null);
    }
  }, [activeReport?.id]);

  const handleAcknowledge = () => {
    if (!activeReport) return;

    const ackData: AcknowledgementData = {
      id: `ack-${Date.now()}`,
      evaluatorId: user.id,
      evaluatorName: user.name,
      acknowledgedAt: new Date().toISOString()
    };

    // Principal's direct review & recommendations are preserved in report.review
    const revData: ReviewData = {
      id: activeReport.review?.id || `rev-${Date.now()}`,
      reviewerId: user.id,
      reviewerName: user.name,
      status: 'ACKNOWLEDGED',
      overallComment: feedbackText.trim() || 'Verified and approved with institutional seal.',
      preparationRating: activeReport.selfAssessment.preparationRating || 5,
      effectivenessRating: activeReport.selfAssessment.effectivenessRating || 5,
      assessmentRating: activeReport.selfAssessment.assessmentRating || 5,
      managementRating: activeReport.selfAssessment.managementRating || 5,
      recordsRating: activeReport.selfAssessment.recordsRating || 5,
      conductRating: activeReport.selfAssessment.conductRating || 5,
      reviewedAt: new Date().toISOString(),
      comments: activeReport.review?.comments || []
    };

    const updated: WeeklyReport = {
      ...activeReport,
      status: 'ACKNOWLEDGED',
      acknowledgedAt: new Date().toISOString(),
      acknowledgement: ackData,
      review: revData
    };

    onAcknowledgeReport(updated);
    setShowAckSuccessModal(true);
  };

  const handleReturnToStaff = () => {
    if (!activeReport) return;
    if (!feedbackText.trim() || feedbackText.trim().length < 5) {
      setReturnValidationErr('Please enter specific recommendations or revision directives for the staff member.');
      return;
    }

    const revData: ReviewData = {
      id: activeReport.review?.id || `rev-${Date.now()}`,
      reviewerId: user.id,
      reviewerName: user.name,
      status: 'RETURNED',
      overallComment: feedbackText.trim(),
      preparationRating: activeReport.selfAssessment.preparationRating || 4,
      effectivenessRating: activeReport.selfAssessment.effectivenessRating || 4,
      assessmentRating: activeReport.selfAssessment.assessmentRating || 4,
      managementRating: activeReport.selfAssessment.managementRating || 4,
      recordsRating: activeReport.selfAssessment.recordsRating || 4,
      conductRating: activeReport.selfAssessment.conductRating || 4,
      reviewedAt: new Date().toISOString(),
      comments: activeReport.review?.comments || []
    };

    const updated: WeeklyReport = {
      ...activeReport,
      status: 'RETURNED',
      review: revData
    };

    if (onReturnReport) {
      onReturnReport(updated, feedbackText.trim());
    } else {
      onAcknowledgeReport(updated);
    }
  };

  const filteredQueue = signoffQueue.filter((r) => {
    // Tab filter
    if (activeTab === 'PENDING' && r.status !== 'SUBMITTED' && r.status !== 'REVIEWED') return false;
    if (activeTab === 'ACKNOWLEDGED' && r.status !== 'ACKNOWLEDGED') return false;
    if (activeTab === 'RETURNED' && r.status !== 'RETURNED') return false;

    // Campus filter (Director oversight across all campuses)
    if (selectedCampusFilter !== 'ALL' && !r.campusName.includes(selectedCampusFilter)) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        r.teacherName.toLowerCase().includes(q) ||
        r.general.subjectsTaught.toLowerCase().includes(q) ||
        r.referenceNo.toLowerCase().includes(q) ||
        r.campusName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = signoffQueue.filter((r) => r.status === 'SUBMITTED' || r.status === 'REVIEWED').length;
  const sealedCount = signoffQueue.filter((r) => r.status === 'ACKNOWLEDGED').length;
  const returnedCount = signoffQueue.filter((r) => r.status === 'RETURNED').length;

  const standards = [
    { key: 'preparationRating', label: '1. Lesson Planning & Subject Mastery' },
    { key: 'effectivenessRating', label: '2. Delivery & Active Engagement' },
    { key: 'assessmentRating', label: '3. Formative Assessment & Grading' },
    { key: 'managementRating', label: '4. Classroom Order & Lab Safety' },
    { key: 'recordsRating', label: '5. Institutional Record Keeping' },
    { key: 'conductRating', label: '6. Professional Conduct & Punctuality' }
  ] as const;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      {/* 1. Director Academic Governance Banner (Clean White Theme like Image 2) */}
      <div className="bg-white rounded-3xl border border-[#e6e3dd] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0B4F9C] uppercase tracking-wider mb-1">
            <Building className="w-4 h-4" />
            <span>Attwool Schools Network (All Campuses)</span>
            <span className="text-slate-300">•</span>
            <span>Office of the School Director</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-brand-serif">
            Executive Academic Governance &amp; Staff Review
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Direct Teacher-to-Director Review across All Campuses • Pedagogical Recommendations • Institutional Seal
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-[#0B4F9C] border border-blue-200 rounded-xl text-xs font-bold shadow-2xs">
            <Award className="w-4 h-4 text-[#0B4F9C]" />
            <span>Director Review Authority • Network Oversight</span>
          </div>
        </div>
      </div>

      {signoffQueue.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#e6e3dd] p-12 text-center space-y-3 shadow-2xs">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 font-brand-serif">No Weekly Reports in Queue</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Once academic staff submit their weekly curriculum reports, they will transmit directly here for your review and institutional seal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Direct Report Queue Sidebar (4 Columns) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-[#e6e3dd] shadow-2xs p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Submissions ({signoffQueue.length})
              </h3>
              <span className="text-[10px] text-slate-400">Direct Staff Flow</span>
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-[11px] font-semibold border border-slate-200 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('PENDING')}
                className={`flex-1 py-1 px-2 rounded-lg transition-all text-center whitespace-nowrap cursor-pointer ${
                  activeTab === 'PENDING'
                    ? 'bg-white text-[#0B4F9C] shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ACKNOWLEDGED')}
                className={`flex-1 py-1 px-2 rounded-lg transition-all text-center whitespace-nowrap cursor-pointer ${
                  activeTab === 'ACKNOWLEDGED'
                    ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sealed ({sealedCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('RETURNED')}
                className={`flex-1 py-1 px-2 rounded-lg transition-all text-center whitespace-nowrap cursor-pointer ${
                  activeTab === 'RETURNED'
                    ? 'bg-white text-rose-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Returned ({returnedCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ALL')}
                className={`py-1 px-2 rounded-lg transition-all text-center whitespace-nowrap cursor-pointer ${
                  activeTab === 'ALL'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
            </div>

            {/* Network Campus Filter (Director Oversight) */}
            <div>
              <select
                value={selectedCampusFilter}
                onChange={(e) => setSelectedCampusFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-[#fbfaf8] border border-[#e6e3dd] rounded-lg font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Network Campuses</option>
                <option value="Awoyaya">Attwool College, Awoyaya</option>
                <option value="Agungi">Attwool College, Agungi</option>
                <option value="Sunflower, Awoyaya">Attwool Sunflower, Awoyaya</option>
                <option value="Sunflower, Agungi">Attwool Sunflower, Agungi</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter teacher, campus, or subject..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#fbfaf8] border border-[#e6e3dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
              />
            </div>

            {/* Report Queue List */}
            <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto space-y-1">
              {filteredQueue.length > 0 ? (
                filteredQueue.map((rep) => {
                  const isSelected = rep.id === activeReport?.id;
                  const isAck = rep.status === 'ACKNOWLEDGED';
                  const isRet = rep.status === 'RETURNED';

                  return (
                    <button
                      key={rep.id}
                      onClick={() => setSelectedReportId(rep.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all space-y-1.5 block cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/80 border border-[#0B4F9C]/40 shadow-2xs'
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {rep.teacherName}
                        </span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            isAck
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : isRet
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-blue-100 text-[#0B4F9C] border border-blue-200'
                          }`}
                        >
                          {isAck ? 'Sealed' : isRet ? 'Returned' : 'Needs Review'}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span>Week {rep.termWeekNumber}: {rep.general.subjectsTaught}</span>
                        <span className="font-mono text-[10px] text-slate-400">{rep.referenceNo.slice(-6)}</span>
                      </div>

                      <div className="text-[10px] text-[#0B4F9C] font-semibold flex items-center gap-1">
                        <Building className="w-3 h-3 text-[#0B4F9C]" />
                        <span>{rep.campusName.split(',')[0]}</span>
                      </div>

                      {rep.attendance?.hasWelfareConcern && (
                        <div className="text-[10px] font-bold text-rose-700 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-rose-600" />
                          <span>Safeguarding Concern (NDPA 2023)</span>
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No reports in this tab.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Deep Inspection, Teacher Reflections & Principal Actions (8 Columns) */}
          {activeReport && (
            <div className="lg:col-span-8 bg-white rounded-3xl border border-[#e6e3dd] shadow-2xs p-6 sm:p-8 space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 font-brand-serif">
                      {activeReport.teacherName} — Week {activeReport.termWeekNumber}
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        activeReport.status === 'ACKNOWLEDGED'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : activeReport.status === 'RETURNED'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-blue-50 text-[#0B4F9C] border border-blue-200'
                      }`}
                    >
                      {activeReport.status === 'ACKNOWLEDGED'
                        ? 'Sealed & Archived'
                        : activeReport.status === 'RETURNED'
                        ? 'Returned to Staff'
                        : 'Pending Director Review'}
                    </span>
                    {activeReport.isLate && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Late Submission
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                    <span>{activeReport.general.subjectsTaught} ({activeReport.general.classesTaught})</span>
                    <span>•</span>
                    <span>Ref: <strong className="font-mono text-slate-700">{activeReport.referenceNo}</strong></span>
                    {activeReport.submittedAt && (
                      <>
                        <span>•</span>
                        <span>Submitted: {new Date(activeReport.submittedAt).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onPreviewPdf(activeReport);
                      setIsPdfModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Printable PDF</span>
                  </button>
                </div>
              </div>

              {/* 1. TEACHER'S SELF-ASSESSMENT SCORECARD */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-brand-serif flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Teacher Self-Assessment Evaluation (BR-010)</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Standardized ratings submitted directly by {activeReport.teacherName}.
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-400 font-semibold">
                    Scale: 1 (Needs Improvement) to 5 (Outstanding)
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {standards.map((st) => {
                    const score = (activeReport.selfAssessment as any)[st.key] || 0;
                    return (
                      <div
                        key={st.key}
                        className="p-3 rounded-xl bg-[#fbfaf8] border border-[#e6e3dd] space-y-1"
                      >
                        <div className="text-[11px] font-bold text-slate-700 truncate" title={st.label}>
                          {st.label}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span key={s} className={s <= score ? 'text-amber-500' : 'text-slate-200'}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-xs font-bold text-[#0B4F9C]">{score} / 5</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {activeReport.selfAssessment?.evidence && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                    <strong>Self-Assessment Evidence: </strong>
                    <span>{activeReport.selfAssessment.evidence}</span>
                  </div>
                )}
              </div>

              {/* 2. CURRICULUM DELIVERY & PACING INSPECTION */}
              <div className="p-4 rounded-2xl bg-white border border-[#e6e3dd] space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#0B4F9C]" />
                    <span>Curriculum Coverage &amp; Delivery</span>
                  </h4>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      activeReport.teaching.topicsCovered === 'YES'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Topics Covered: {activeReport.teaching.topicsCovered}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Teaching Methods Used:</span>
                    <span className="font-semibold text-slate-800">{activeReport.teaching.methodsUsed}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Lesson Notes Stamped:</span>
                    <span className="font-semibold text-slate-800">{activeReport.teaching.lessonNotesPrepared}</span>
                  </div>
                </div>

                {activeReport.teaching.topicsCovered !== 'YES' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-amber-900">Uncovered Syllabus Items:</div>
                    <div className="text-slate-800">{activeReport.teaching.notCoveredTopics}</div>
                    <div className="text-[11px] text-amber-800 italic">
                      Reason: {activeReport.teaching.notCoveredReason}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. PUPIL ASSESSMENT & REMEDIATION */}
              <div className="p-4 rounded-2xl bg-white border border-[#e6e3dd] space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pupil Assessment &amp; Learner Remediation</span>
                </h4>
                <div className="text-xs space-y-1.5">
                  <div>
                    <span className="text-slate-500">Assessments Conducted: </span>
                    <span className="font-semibold text-slate-800">{activeReport.learning.assessmentsConducted}</span>
                  </div>
                  {activeReport.learning.supportNeededStudents && (
                    <div className="p-2.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-950">
                      <strong>Targeted Students Requiring Intervention: </strong>
                      <span>{activeReport.learning.supportNeededStudents}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. SAFEGUARDING & WELFARE NOTE (NDPA 2023) */}
              {activeReport.attendance?.hasWelfareConcern && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-900 font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#C8102E]" />
                    <span>Confidential Pastoral Care / Safeguarding Note (NDPA 2023)</span>
                  </div>
                  <p className="text-slate-800">
                    <strong>Observation:</strong> {activeReport.attendance.welfareDetails}
                  </p>
                  <p className="text-slate-700 italic">
                    <strong>Remedial Step Taken:</strong> {activeReport.attendance.welfareAction}
                  </p>
                </div>
              )}

              {/* 5. REFLECTIONS & NEXT WEEK'S GOALS */}
              <div className="p-4 rounded-2xl bg-white border border-[#e6e3dd] space-y-2 text-xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Teacher Reflection &amp; Goals
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block">Major Achievement:</span>
                    <span className="font-semibold text-slate-800">{activeReport.reflection.majorAchievement}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Area to Improve Next Week:</span>
                    <span className="font-semibold text-slate-800">{activeReport.reflection.improveNextWeek}</span>
                  </div>
                </div>
              </div>

              {/* 6. DIRECTOR'S RECOMMENDATIONS & EXECUTIVE ACTION */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#0B4F9C]" />
                    <span>Director's Supervisory Recommendations &amp; Feedback to Staff</span>
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Provide constructive advice, pedagogical commendations, or actionable revision directives for {activeReport.teacherName}.
                  </p>
                  <textarea
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => {
                      setFeedbackText(e.target.value);
                      if (returnValidationErr) setReturnValidationErr(null);
                    }}
                    disabled={activeReport.status === 'ACKNOWLEDGED'}
                    placeholder="Enter academic feedback, commendations, or revision instructions for the staff..."
                    className="w-full p-3 text-xs bg-white border border-[#e6e3dd] rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C] disabled:bg-slate-50 disabled:text-slate-600"
                  />
                  {returnValidationErr && (
                    <div className="text-xs font-bold text-rose-700 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>{returnValidationErr}</span>
                    </div>
                  )}
                </div>

                {/* State: Acknowledged / Sealed */}
                {activeReport.status === 'ACKNOWLEDGED' ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs space-y-2">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Official Director's Institutional Seal &amp; Executive Sign-off Active</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 text-[11px] pt-1">
                      <div>
                        Acknowledged By:{' '}
                        <strong className="text-slate-900">
                          {activeReport.acknowledgement?.evaluatorName || user.name} (Director of Schools)
                        </strong>
                      </div>
                      <div>
                        Timestamp:{' '}
                        <strong className="text-slate-900">
                          {activeReport.acknowledgedAt
                            ? new Date(activeReport.acknowledgedAt).toLocaleString()
                            : 'Confirmed'}
                        </strong>
                      </div>
                      <div>
                        Campus Governance:{' '}
                        <strong className="text-slate-900">{activeReport.campusName}</strong>
                      </div>
                      <div>
                        Document Status:{' '}
                        <strong className="text-emerald-700 font-mono">SEALED &amp; ARCHIVED</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Action Controls for Director: Approve & Seal OR Return to Staff */
                  <div className="p-5 bg-white border border-[#e6e3dd] rounded-2xl space-y-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 font-brand-serif">
                          Executive Academic Decision
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          As School Director overseeing all Attwool campuses, you have direct supervisory authority over this submission. Approve with your institutional seal or return to the staff member with feedback.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
                      <div className="text-[11px] text-slate-500">
                        Reviewer: <strong className="text-slate-900">{user.name}</strong> • Role: School Director
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={handleReturnToStaff}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                          <span>Return to Staff for Revision</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleAcknowledge}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#C8102E] hover:bg-[#a50b24] text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
                        >
                          <Award className="w-4 h-4" />
                          <span>Approve &amp; Apply Director's Seal</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success Modal */}
      {showAckSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-brand-serif">
                Weekly Report Formally Acknowledged &amp; Sealed
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                The institutional seal and your supervisory recommendations have been recorded. The teacher has been notified and the final QuestPDF document is now sealed.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowAckSuccessModal(false);
                  setIsPdfModalOpen(true);
                }}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                Inspect Official PDF
              </button>
              <button
                onClick={() => setShowAckSuccessModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QuestPDF Preview Modal */}
      {activeReport && (
        <PdfPreviewModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          report={activeReport}
        />
      )}
    </div>
  );
};
