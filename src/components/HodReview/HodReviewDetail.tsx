import React, { useState } from 'react';
import type { WeeklyReport, UserSession, ReviewData } from '../../types';
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Star,
  FileText,
  Clock,
  Printer,
  Lock
} from 'lucide-react';
import { PdfPreviewModal } from '../PdfPreviewModal';

interface HodReviewDetailProps {
  user: UserSession;
  report: WeeklyReport;
  onBackToQueue: () => void;
  onSubmitReview: (updatedReport: WeeklyReport) => void;
  onReturnReport: (updatedReport: WeeklyReport, reason: string) => void;
}

export const HodReviewDetail: React.FC<HodReviewDetailProps> = ({
  user,
  report,
  onBackToQueue,
  onSubmitReview,
  onReturnReport
}) => {
  const isOwnReport = report.teacherId === user.id;

  const [ratings, setRatings] = useState({
    preparationRating: report.review?.preparationRating || 4,
    effectivenessRating: report.review?.effectivenessRating || 4,
    assessmentRating: report.review?.assessmentRating || 4,
    managementRating: report.review?.managementRating || 5,
    recordsRating: report.review?.recordsRating || 5,
    conductRating: report.review?.conductRating || 5
  });

  const [overallComment, setOverallComment] = useState(
    report.review?.overallComment ||
      'Lesson planning shows excellent alignment with national syllabus benchmarks. Lab safety protocols observed and verified.'
  );

  const [sectionComments] = useState({
    teaching: 'Curriculum delivery pacing is satisfactory for Week 1.',
    learning: 'Diagnostic quiz results demonstrate solid concept retention.',
    attendance: 'Absence follow-up procedures followed meticulously.'
  });

  const [returnReason, setReturnReason] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnError, setReturnError] = useState('');
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  const handleRatingChange = (key: keyof typeof ratings, val: number) => {
    if (isOwnReport || report.status === 'ACKNOWLEDGED') return;
    setRatings((prev) => ({ ...prev, [key]: val }));
  };

  const handleCompleteReview = () => {
    if (isOwnReport) return;

    const reviewData: ReviewData = {
      id: report.review?.id || `rev-${Date.now()}`,
      reviewerId: user.id,
      reviewerName: user.name,
      status: 'REVIEWED',
      overallComment: overallComment.trim(),
      preparationRating: ratings.preparationRating,
      effectivenessRating: ratings.effectivenessRating,
      assessmentRating: ratings.assessmentRating,
      managementRating: ratings.managementRating,
      recordsRating: ratings.recordsRating,
      conductRating: ratings.conductRating,
      reviewedAt: new Date().toISOString(),
      comments: [
        { section: 'teaching', comment: sectionComments.teaching },
        { section: 'learning', comment: sectionComments.learning },
        { section: 'attendance', comment: sectionComments.attendance }
      ]
    };

    const updated: WeeklyReport = {
      ...report,
      status: 'REVIEWED',
      reviewedAt: new Date().toISOString(),
      review: reviewData
    };

    onSubmitReview(updated);
  };

  const handleConfirmReturn = () => {
    if (returnReason.trim().length < 10) {
      setReturnError('Mandatory audit requirement (BR-014): Return reason must be at least 10 characters.');
      return;
    }

    const updated: WeeklyReport = {
      ...report,
      status: 'RETURNED',
      review: {
        id: report.review?.id || `rev-${Date.now()}`,
        reviewerId: user.id,
        reviewerName: user.name,
        status: 'RETURNED',
        overallComment: `RETURNED FOR REVISION: ${returnReason.trim()}`,
        preparationRating: ratings.preparationRating,
        effectivenessRating: ratings.effectivenessRating,
        assessmentRating: ratings.assessmentRating,
        managementRating: ratings.managementRating,
        recordsRating: ratings.recordsRating,
        conductRating: ratings.conductRating,
        reviewedAt: new Date().toISOString(),
        comments: [
          { section: 'general', comment: returnReason.trim() }
        ]
      }
    };

    setShowReturnModal(false);
    onReturnReport(updated, returnReason);
  };

  const criteria = [
    { key: 'preparationRating', label: '1. Lesson Planning & Subject Mastery' },
    { key: 'effectivenessRating', label: '2. Delivery & Student Active Engagement' },
    { key: 'assessmentRating', label: '3. Formative Assessment & Grading Pacing' },
    { key: 'managementRating', label: '4. Classroom Order & Laboratory Safety' },
    { key: 'recordsRating', label: '5. Institutional Record Keeping & Promptness' },
    { key: 'conductRating', label: '6. Professional Conduct & Punctuality' }
  ] as const;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={onBackToQueue}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0B4F9C] mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Department Queue</span>
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 font-brand-serif">
              Supervisory Audit: {report.teacherName}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
              report.status === 'SUBMITTED' ? 'bg-blue-50 text-[#0B4F9C] border-blue-200' :
              report.status === 'REVIEWED' ? 'bg-purple-50 text-purple-700 border-purple-200' :
              report.status === 'RETURNED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
              'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {report.status}
            </span>
            {report.isLate && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Submitted Late
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Week {report.termWeekNumber} • {report.general.subjectsTaught} ({report.general.classesTaught}) • Ref:{' '}
            <span className="font-mono font-bold text-slate-700">{report.referenceNo}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPdfOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>View Printable PDF</span>
          </button>
        </div>
      </div>

      {/* Conflict of Interest Warning Notice (BR-015) */}
      {isOwnReport && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="font-bold">Governance Rule BR-015 (Conflict of Interest Protection):</strong> You are the author of this weekly report. Department Heads are strictly barred from auditing or grading their own reports. This report must be evaluated by the Vice Principal or Campus Head.
          </div>
        </div>
      )}

      {/* Main Grid: Teacher Report Submission on Left, HOD Supervisory Evaluation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Teacher Submission Sections (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: General & Form Tutor Headcount */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0B4F9C]" />
                <span>1. General Teaching Allocation</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">BR-005 Verified</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400">Classes Taught:</span>
                <p className="font-bold text-slate-800">{report.general.classesTaught}</p>
              </div>
              <div>
                <span className="text-slate-400">Subjects:</span>
                <p className="font-bold text-slate-800">{report.general.subjectsTaught}</p>
              </div>
              <div>
                <span className="text-slate-400">Form Tutor Allocation:</span>
                <p className="font-bold text-slate-800">
                  {report.general.isFormTutor ? `Yes (${report.general.formTutorClassName})` : 'No'}
                </p>
              </div>
              {report.general.isFormTutor && (
                <div>
                  <span className="text-slate-400">Assigned Student Headcount:</span>
                  <p className="font-bold text-purple-700">{report.general.studentCount} Students</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Teaching & Curriculum Delivery */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0B4F9C]" />
                <span>2. Curriculum Delivery Pacing</span>
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                report.teaching.topicsCovered === 'YES' ? 'bg-emerald-50 text-emerald-800' :
                report.teaching.topicsCovered === 'PARTIALLY' ? 'bg-amber-50 text-amber-800' :
                'bg-rose-50 text-rose-800'
              }`}>
                Topics Covered: {report.teaching.topicsCovered}
              </span>
            </div>
            {report.teaching.topicsCovered !== 'YES' && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-1">
                <span className="font-bold text-amber-900">Uncovered Topics / Interruption Reason (BR-004):</span>
                <p className="text-slate-700">{report.teaching.notCoveredTopics}</p>
                <p className="text-slate-600 italic mt-1">Reason: {report.teaching.notCoveredReason}</p>
              </div>
            )}
            <div className="text-xs space-y-1">
              <span className="text-slate-400">Pedagogical Methods Employed:</span>
              <p className="text-slate-700">{report.teaching.methodsUsed}</p>
            </div>
            <div className="text-xs">
              <span className="text-slate-400">Lesson Notes Verified on Monday:</span>
              <span className="ml-2 font-bold text-slate-800">{report.teaching.lessonNotesPrepared}</span>
            </div>
          </div>

          {/* Section 3: Learning & Assessment */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0B4F9C]" />
                <span>3. Assessment &amp; Comprehension</span>
              </h3>
              <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                Grasp: {report.learning.understanding.replace('_', ' ')}
              </span>
            </div>
            <div className="text-xs space-y-1">
              <span className="text-slate-400">Assessments Administered:</span>
              <p className="text-slate-700">{report.learning.assessmentsConducted}</p>
            </div>
            {report.learning.difficulties && (
              <div className="text-xs space-y-1">
                <span className="text-slate-400">Student Learning Difficulties:</span>
                <p className="text-slate-700">{report.learning.difficulties}</p>
              </div>
            )}
            {report.learning.supportNeededStudents && (
              <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-200/60 text-xs">
                <span className="font-bold text-blue-900">Remedial Support Targets: </span>
                <span className="text-slate-700">{report.learning.supportNeededStudents}</span>
              </div>
            )}
          </div>

          {/* Section 4: Attendance & Safeguarding */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0B4F9C]" />
                <span>4. Attendance &amp; Student Welfare</span>
              </h3>
              {report.attendance.hasWelfareConcern && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#C8102E]" />
                  NDPA 2023 Safeguarding
                </span>
              )}
            </div>
            {report.attendance.hasAbsences ? (
              <div className="text-xs space-y-1">
                <span className="text-slate-400">Absence Records &amp; Follow-up (BR-006):</span>
                <p className="text-slate-700">{report.attendance.absenceDetails}</p>
                <p className="text-slate-600 italic">Follow-up: {report.attendance.followUpEfforts}</p>
              </div>
            ) : (
              <div className="text-xs text-slate-500">No student absences reported this week.</div>
            )}
            {report.attendance.hasWelfareConcern && (
              <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg text-xs space-y-1">
                <span className="font-bold text-rose-900">Confidential Pastoral Disclosure:</span>
                <p className="text-slate-800">{report.attendance.welfareDetails}</p>
                <p className="text-slate-700 italic">Action Initiated: {report.attendance.welfareAction}</p>
              </div>
            )}
          </div>

          {/* Section 5 & 6: Reflection & Self-Ratings */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                6 &amp; 7. Teacher Reflection &amp; Self-Ratings
              </h3>
              <span className="text-[11px] text-slate-400">Self-Evaluation Baseline</span>
            </div>
            <div className="text-xs space-y-1">
              <span className="text-slate-400">Major Achievement:</span>
              <p className="text-slate-800 font-semibold">{report.reflection.majorAchievement}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
              {[
                { label: 'Preparation', score: report.selfAssessment.preparationRating },
                { label: 'Delivery', score: report.selfAssessment.effectivenessRating },
                { label: 'Assessment', score: report.selfAssessment.assessmentRating },
                { label: 'Management', score: report.selfAssessment.managementRating },
                { label: 'Records', score: report.selfAssessment.recordsRating },
                { label: 'Conduct', score: report.selfAssessment.conductRating }
              ].map((item, i) => (
                <div key={i} className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <div className="text-[10px] text-slate-500 uppercase">{item.label}</div>
                  <div className="text-sm font-bold text-[#0B4F9C]">{item.score} / 5 ★</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: HOD Supervisory Audit Form (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border-2 border-[#0B4F9C]/30 p-6 shadow-sm space-y-6 sticky top-24">
            <div className="border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B4F9C] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Tier 1 Supervisory Review</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 font-brand-serif mt-1">
                HOD Standards Assessment
              </h2>
              <p className="text-xs text-slate-500">
                Rate teacher performance independently against institutional rubrics (BR-012, BR-013).
              </p>
            </div>

            {/* 6 Standards Independent Star Rating Inputs */}
            <div className="space-y-4">
              {criteria.map((cr) => {
                const currentRating = ratings[cr.key];
                return (
                  <div key={cr.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">{cr.label}</span>
                      <span className="font-extrabold text-[#0B4F9C]">{currentRating} / 5</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          disabled={isOwnReport || report.status === 'ACKNOWLEDGED'}
                          onClick={() => handleRatingChange(cr.key, star)}
                          className={`p-1.5 rounded-md transition-all ${
                            star <= currentRating
                              ? 'text-amber-400 hover:text-amber-500'
                              : 'text-slate-200 hover:text-slate-300'
                          } disabled:cursor-not-allowed`}
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Section Comments */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">
                Departmental Overall Commendation / Directives
              </label>
              <textarea
                rows={3}
                disabled={isOwnReport || report.status === 'ACKNOWLEDGED'}
                value={overallComment}
                onChange={(e) => setOverallComment(e.target.value)}
                placeholder="Enter formal HOD supervisory feedback..."
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C] disabled:bg-slate-50"
              />
            </div>

            {/* Actions: Return for Revision or Submit Review */}
            {!isOwnReport && report.status !== 'ACKNOWLEDGED' && (
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleCompleteReview}
                  className="w-full py-3 bg-[#0B4F9C] hover:bg-[#07356B] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve &amp; Forward to Principal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowReturnModal(true)}
                  className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Return Report for Revision (BR-014)</span>
                </button>
              </div>
            )}

            {report.status === 'ACKNOWLEDGED' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Governance Complete • Signed off by Campus Head</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Return for Revision Dialog Modal (BR-014) */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-rose-100 text-rose-700">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-brand-serif">
                  Return Report for Revision (BR-014)
                </h3>
                <p className="text-xs text-slate-500">
                  Provide specific reasons and actionable guidance for the teacher.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Mandatory Audit Reason (Min 10 characters) <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={4}
                value={returnReason}
                onChange={(e) => {
                  setReturnReason(e.target.value);
                  setReturnError('');
                }}
                placeholder="e.g. Please clarify optics experiment data and attach the remedial student quiz scoresheet for Week 1."
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              {returnError && (
                <div className="text-xs text-rose-600 font-semibold">{returnError}</div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowReturnModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReturn}
                className="px-4 py-2 rounded-lg bg-[#C8102E] hover:bg-[#a50b24] text-white text-xs font-bold shadow-xs"
              >
                Confirm Return to Teacher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QuestPDF Preview Modal */}
      <PdfPreviewModal
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
        report={report}
      />
    </div>
  );
};
