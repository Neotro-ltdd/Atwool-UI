import React from 'react';
import { AttwoolLogo } from './AttwoolLogo';
import type { WeeklyReport } from '../types';
import { X, Printer, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: WeeklyReport;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({ isOpen, onClose, report }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden my-8">
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Institutional QuestPDF Document Preview</span>
            <span className="text-slate-500">•</span>
            <span className="font-mono text-slate-300">{report.referenceNo}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C8102E] hover:bg-[#a50b24] text-xs font-semibold rounded-lg text-white transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable PDF Page Canvas */}
        <div className="p-8 sm:p-12 text-slate-900 max-h-[80vh] overflow-y-auto space-y-8 bg-white print:p-0 print:max-h-none">
          {/* Institutional Header */}
          <div className="border-b-2 border-slate-800 pb-6 text-center space-y-2">
            <AttwoolLogo size="md" showSubtitle={false} className="mb-2" />
            <h1 className="text-xl sm:text-2xl font-bold font-brand-serif uppercase tracking-wider text-slate-900">
              Teacher Weekly Curriculum &amp; Assessment Report
            </h1>
            <div className="text-xs font-bold text-[#0B4F9C] uppercase tracking-wider">
              {report.campusName} • {report.termName} • Week {report.termWeekNumber}
            </div>
            <div className="text-[11px] text-slate-500">
              Period: {report.weekStart} to {report.weekEnd} • Document Reference: <span className="font-mono font-bold text-slate-800">{report.referenceNo}</span>
            </div>
          </div>

          {/* Teacher & Assignment Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Teacher Name</span>
              <span className="font-bold text-slate-900">{report.teacherName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Classes Taught</span>
              <span className="font-bold text-slate-900">{report.general.classesTaught}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Subject(s)</span>
              <span className="font-bold text-slate-900">{report.general.subjectsTaught}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Form Tutor Status</span>
              <span className="font-bold text-slate-900">
                {report.general.isFormTutor ? `${report.general.formTutorClassName} (${report.general.studentCount} students)` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Section 2: Weekly Teaching Activities */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold font-brand-serif text-sm text-[#0B4F9C] uppercase tracking-wider border-b border-slate-200 pb-1">
              Section 2: Weekly Teaching Activities
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 font-semibold">Topics Covered Status: </span>
                <span className="font-bold text-slate-900">{report.teaching.topicsCovered}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">Lesson Notes Prepared: </span>
                <span className="font-bold text-slate-900">{report.teaching.lessonNotesPrepared}</span>
              </div>
            </div>
            {report.teaching.notCoveredReason && (
              <div className="p-2.5 rounded bg-amber-50 text-amber-900 border border-amber-200 mt-1">
                <strong>Reason for Partial Coverage: </strong> {report.teaching.notCoveredReason}
                <div className="mt-1"><strong>Uncovered Topics: </strong>{report.teaching.notCoveredTopics}</div>
              </div>
            )}
            <div className="pt-1">
              <span className="text-slate-500 font-semibold">Methods &amp; Practical Activities Used: </span>
              <span className="text-slate-800">{report.teaching.methodsUsed}</span>
            </div>
          </div>

          {/* Section 3: Student Learning and Assessment */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold font-brand-serif text-sm text-[#0B4F9C] uppercase tracking-wider border-b border-slate-200 pb-1">
              Section 3: Student Learning and Assessment
            </h3>
            <div>
              <span className="text-slate-500 font-semibold">Assessments Conducted: </span>
              <span className="text-slate-800">{report.learning.assessmentsConducted}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 font-semibold">Comprehension Level: </span>
                <span className="font-bold text-slate-900">{report.learning.understanding.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">Marking &amp; Feedback Completed: </span>
                <span className="font-bold text-slate-900">{report.learning.markingStatus}</span>
              </div>
            </div>
            {report.learning.difficulties && (
              <div>
                <span className="text-slate-500 font-semibold">Specific Learning Difficulties: </span>
                <span className="text-slate-800">{report.learning.difficulties}</span>
              </div>
            )}
            {report.learning.supportNeededStudents && (
              <div>
                <span className="text-slate-500 font-semibold">Students Needing Academic Support: </span>
                <span className="text-slate-800">{report.learning.supportNeededStudents}</span>
              </div>
            )}
          </div>

          {/* Section 4: Attendance and Form Tutor Report */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold font-brand-serif text-sm text-[#0B4F9C] uppercase tracking-wider border-b border-slate-200 pb-1">
              Section 4: Attendance and Form Tutor Report (NDPA 2023)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 font-semibold">Absences Recorded: </span>
                <span className="font-bold text-slate-900">{report.attendance.hasAbsences ? 'YES' : 'NO'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">Learning Support / Accommodations: </span>
                <span className="font-bold text-slate-900">{report.attendance.hasSupportNeeds ? 'YES' : 'NO'}</span>
              </div>
            </div>
            {report.attendance.absenceDetails && (
              <div>
                <span className="text-slate-500 font-semibold">Absence Details: </span>
                <span className="text-slate-800">{report.attendance.absenceDetails}</span>
                {report.attendance.followUpEfforts && <span className="text-slate-600 block mt-0.5"><strong>Follow-up Efforts:</strong> {report.attendance.followUpEfforts}</span>}
                {report.attendance.feedbackReceived && <span className="text-slate-600 block mt-0.5"><strong>Parent Feedback:</strong> {report.attendance.feedbackReceived}</span>}
              </div>
            )}
            {report.attendance.hasSupportNeeds && report.attendance.supportProvided && (
              <div>
                <span className="text-slate-500 font-semibold">Accommodations Provided: </span>
                <span className="text-slate-800">{report.attendance.supportProvided}</span>
              </div>
            )}
            {report.attendance.welfareDetails && (
              <div className="p-2.5 rounded bg-rose-50 text-rose-900 border border-rose-200 mt-1">
                <div className="font-bold flex items-center gap-1 text-[11px] mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-700" />
                  <span>Confidential Student Welfare / Behavioural Concern (NDPA 2023 Monitored)</span>
                </div>
                <div>{report.attendance.welfareDetails}</div>
                <div className="mt-1 font-semibold">Action Taken: {report.attendance.welfareAction}</div>
              </div>
            )}
          </div>

          {/* Section 5: Classroom Management and Other Responsibilities */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold font-brand-serif text-sm text-[#0B4F9C] uppercase tracking-wider border-b border-slate-200 pb-1">
              Section 5: Classroom Management and Other Responsibilities
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 font-semibold">Registers &amp; Records Updated: </span>
                <span className="font-bold text-slate-900">{report.classroom.recordsUpdated}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">School Duties Completed: </span>
                <span className="font-bold text-slate-900">{report.classroom.dutiesCompleted.replace('_', ' ')}</span>
              </div>
            </div>
            {report.classroom.hasChallenges && (
              <div>
                <span className="text-slate-500 font-semibold">Classroom Challenges: </span>
                <span className="text-slate-800">{report.classroom.challengeDetails}</span>
              </div>
            )}
            {report.classroom.outstandingTasks && (
              <div>
                <span className="text-slate-500 font-semibold">Outstanding Tasks: </span>
                <span className="text-slate-800">{report.classroom.outstandingTasks}</span>
              </div>
            )}
          </div>

          {/* Section 6: Achievements, Challenges and Support */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold font-brand-serif text-sm text-[#0B4F9C] uppercase tracking-wider border-b border-slate-200 pb-1">
              Section 6: Achievements, Challenges and Support
            </h3>
            <div>
              <span className="text-slate-500 font-semibold">Major Achievement: </span>
              <span className="text-slate-800">{report.reflection.majorAchievement}</span>
            </div>
            {report.reflection.wentWell && (
              <div>
                <span className="text-slate-500 font-semibold">What Went Well: </span>
                <span className="text-slate-800">{report.reflection.wentWell}</span>
              </div>
            )}
            {report.reflection.challenges && (
              <div>
                <span className="text-slate-500 font-semibold">Challenges Encountered: </span>
                <span className="text-slate-800">{report.reflection.challenges}</span>
              </div>
            )}
            {report.reflection.supportNeeded && (
              <div>
                <span className="text-slate-500 font-semibold">Support Needed from Management: </span>
                <span className="text-slate-800">{report.reflection.supportNeeded}</span>
              </div>
            )}
            {report.reflection.improveNextWeek && (
              <div>
                <span className="text-slate-500 font-semibold">What to Improve Next Week: </span>
                <span className="text-slate-800">{report.reflection.improveNextWeek}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <span className="text-slate-500 font-semibold">Goal 1 Next Week: </span>
                <span className="text-slate-800">{report.reflection.goal1}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">Goal 2 Next Week: </span>
                <span className="text-slate-800">{report.reflection.goal2}</span>
              </div>
            </div>
          </div>

          {/* Section 7: Teacher Self-Assessment & Dual Standards Alignment */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold font-brand-serif text-sm text-[#0B4F9C] uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>Section 7: Teacher Self-Assessment &amp; Evaluation</span>
              <span className="text-[10px] text-slate-500 lowercase font-sans font-normal">(Scale: 1 Needs Improvement to 5 Outstanding)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-200 rounded-lg">
                <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-2">Standard Competency Area</th>
                    <th className="p-2 text-center">Teacher Self-Rating</th>
                    <th className="p-2 text-center">HOD Review Rating</th>
                    <th className="p-2 text-center">Variance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { label: '1. Lesson Planning & Preparation', self: report.selfAssessment.preparationRating, hod: report.review?.preparationRating || 4 },
                    { label: '2. Teaching Effectiveness & Engagement', self: report.selfAssessment.effectivenessRating, hod: report.review?.effectivenessRating || 4 },
                    { label: '3. Student Assessment & Feedback', self: report.selfAssessment.assessmentRating, hod: report.review?.assessmentRating || 5 },
                    { label: '4. Classroom Management & Welfare', self: report.selfAssessment.managementRating, hod: report.review?.managementRating || 4 },
                    { label: '5. Record Keeping & Administrative Compliance', self: report.selfAssessment.recordsRating, hod: report.review?.recordsRating || 5 },
                    { label: '6. Punctuality & Professional Conduct', self: report.selfAssessment.conductRating, hod: report.review?.conductRating || 5 }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-2 font-medium">{row.label}</td>
                      <td className="p-2 text-center font-bold text-slate-800">{row.self} / 5</td>
                      <td className="p-2 text-center font-bold text-[#0B4F9C]">{report.review ? `${row.hod} / 5` : 'Pending'}</td>
                      <td className="p-2 text-center font-bold text-emerald-600">
                        {report.review ? (row.self === row.hod ? 'Aligned' : `${row.hod - row.self > 0 ? '+' : ''}${row.hod - row.self}`) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {report.selfAssessment.evidence && (
              <div>
                <span className="text-slate-500 font-semibold">Self-Assessment Evidence: </span>
                <span className="text-slate-800">{report.selfAssessment.evidence}</span>
              </div>
            )}
            {report.selfAssessment.improvementArea && (
              <div>
                <span className="text-slate-500 font-semibold">Area to Improve: </span>
                <span className="text-slate-800">{report.selfAssessment.improvementArea}</span>
              </div>
            )}
            {report.selfAssessment.additionalNotes && (
              <div>
                <span className="text-slate-500 font-semibold">Notes for Evaluator: </span>
                <span className="text-slate-800">{report.selfAssessment.additionalNotes}</span>
              </div>
            )}
          </div>

          {/* Institutional Sign-off & Stamps Block */}
          <div className="pt-6 border-t-2 border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="border border-slate-200 p-3 rounded-lg bg-slate-50 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">1. Teacher Digital Submission</span>
              <div className="font-bold text-slate-900">{report.teacherName}</div>
              <div className="text-[11px] text-slate-500">Status: {report.status}</div>
              <div className="text-[10px] text-slate-400">Timestamp: {report.submittedAt ? new Date(report.submittedAt).toLocaleString() : 'Draft Mode'}</div>
            </div>

            <div className="border border-slate-200 p-3 rounded-lg bg-slate-50 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">2. HOD Review &amp; Audit</span>
              <div className="font-bold text-slate-900">{report.review?.reviewerName || 'Pending HOD Audit'}</div>
              <div className="text-[11px] text-slate-500">Overall: {report.review?.overallComment || 'Awaiting departmental review.'}</div>
              <div className="text-[10px] text-slate-400">Verified: {report.review?.reviewedAt ? new Date(report.review.reviewedAt).toLocaleString() : '-'}</div>
            </div>

            <div className="border border-slate-200 p-3 rounded-lg bg-slate-50 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">3. Campus Head Institutional Stamp</span>
              <div className="font-bold text-slate-900">{report.acknowledgement?.evaluatorName || 'Awaiting Final Sign-Off'}</div>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{report.acknowledgement ? 'Official Signature Stamped' : 'Pending'}</span>
              </div>
              <div className="text-[10px] text-slate-400">Recorded: {report.acknowledgement?.acknowledgedAt ? new Date(report.acknowledgement.acknowledgedAt).toLocaleString() : '-'}</div>
            </div>
          </div>

          {/* Footer Accreditation */}
          <div className="text-center pt-4 text-[10px] text-slate-400 border-t border-slate-100">
            Attwool Schools Official Weekly Reporting Chassis • Compiled via QuestPDF Document Engine • Team Vatebra Enterprise Governance
          </div>
        </div>
      </div>
    </div>
  );
};
