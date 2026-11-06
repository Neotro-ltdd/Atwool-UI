import React, { useState, useEffect } from 'react';
import type { WeeklyReport } from '../../types';
import { Step1General } from './Step1General';
import { Step2Teaching } from './Step2Teaching';
import { Step3Learning } from './Step3Learning';
import { Step4Attendance } from './Step4Attendance';
import { Step5Classroom } from './Step5Classroom';
import { Step6Reflection } from './Step6Reflection';
import { Step7SelfAssessment } from './Step7SelfAssessment';
import { PdfPreviewModal } from '../PdfPreviewModal';
import {
  Save,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  ArrowRight,
  Send,
  Lock,
  Printer,
  FileCheck
} from 'lucide-react';

interface ReportWizardProps {
  initialReport: WeeklyReport;
  onSaveReport: (report: WeeklyReport) => void;
  onSubmitReport: (report: WeeklyReport) => void;
  onBackToDashboard: () => void;
}

export const ReportWizard: React.FC<ReportWizardProps> = ({
  initialReport,
  onSaveReport,
  onSubmitReport,
  onBackToDashboard
}) => {
  const [report, setReport] = useState<WeeklyReport>(initialReport);
  const [currentStep, setCurrentStep] = useState(1);
  const [autosaveSeconds, setAutosaveSeconds] = useState(20);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(initialReport.status !== 'DRAFT' && initialReport.status !== 'RETURNED');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // 20-Second Autosave Interval Hook
  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setAutosaveSeconds((prev) => {
        if (prev <= 1) {
          triggerAutosave();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [report, isSubmitted]);

  const triggerAutosave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setReport((prev) => ({
        ...prev,
        version: prev.version + 1
      }));
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      onSaveReport(report);
    }, 600);
  };

  // Comprehensive Business Rules Validation (BR-001 through BR-010)
  const validateReport = (): string[] => {
    const errors: string[] = [];

    // General (BR-005)
    if (!report.general.classesTaught) errors.push('Section 1: Classes taught is required.');
    if (!report.general.subjectsTaught) errors.push('Section 1: Subjects taught is required.');
    if (report.general.isFormTutor && (!report.general.formTutorClassName || !report.general.studentCount)) {
      errors.push('Section 1 (BR-005): Form Tutor class name and student headcount are mandatory.');
    }

    // Teaching (BR-004)
    if (report.teaching.topicsCovered !== 'YES') {
      if (!report.teaching.notCoveredReason || report.teaching.notCoveredReason.trim().length < 5) {
        errors.push('Section 2 (BR-004): Reason for incomplete topic delivery is required.');
      }
      if (!report.teaching.notCoveredTopics) {
        errors.push('Section 2 (BR-004): Specific list of uncovered topics is required.');
      }
    }
    if (!report.teaching.methodsUsed) errors.push('Section 2: Teaching methods used is required.');

    // Learning
    if (!report.learning.assessmentsConducted) errors.push('Section 3: Assessments conducted description is required.');

    // Classroom (BR-007, BR-008)
    if (report.classroom.hasChallenges && !report.classroom.challengeDetails) {
      errors.push('Section 5 (BR-007): Challenge details are mandatory when challenges are flagged.');
    }
    if (report.classroom.dutiesCompleted !== 'YES' && report.classroom.dutiesCompleted !== 'NOT_APPLICABLE' && !report.classroom.outstandingTasks) {
      errors.push('Section 5 (BR-008): Outstanding duty task description is mandatory.');
    }

    // Reflection (BR-009 10-char min)
    if ((report.reflection.majorAchievement || '').trim().length < 10) {
      errors.push('Section 6 (BR-009): Major Achievement must be at least 10 characters.');
    }
    if ((report.reflection.improveNextWeek || '').trim().length < 10) {
      errors.push('Section 6 (BR-009): Area to improve must be at least 10 characters.');
    }
    if ((report.reflection.goal1 || '').trim().length < 10) {
      errors.push('Section 6 (BR-009): Goal 1 must be at least 10 characters.');
    }
    if ((report.reflection.goal2 || '').trim().length < 10) {
      errors.push('Section 6 (BR-009): Goal 2 must be at least 10 characters.');
    }

    // Self Assessment (BR-010)
    const sa = report.selfAssessment;
    if (!sa.preparationRating || !sa.effectivenessRating || !sa.assessmentRating || !sa.managementRating || !sa.recordsRating || !sa.conductRating) {
      errors.push('Section 7 (BR-010): All 6 teacher self-assessment standards must be rated (1 to 5).');
    }

    return errors;
  };

  const handleValidateClick = () => {
    const errors = validateReport();
    setValidationErrors(errors);
    setShowValidationModal(true);
  };

  const handleSubmit = () => {
    const errors = validateReport();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationModal(true);
      return;
    }

    // Friday 5:00 PM Deadline Detection
    const now = new Date();
    const isFriday = now.getDay() === 5;
    const isPastFive = now.getHours() >= 17;
    const late = (!isFriday && now.getDay() > 5) || (isFriday && isPastFive);

    const submitted: WeeklyReport = {
      ...report,
      status: 'SUBMITTED',
      isLate: late,
      submittedAt: new Date().toISOString()
    };

    setReport(submitted);
    setIsSubmitted(true);
    onSubmitReport(submitted);
  };

  const steps = [
    '1. General',
    '2. Curriculum',
    '3. Assessment',
    '4. Attendance',
    '5. Classroom',
    '6. Reflection',
    '7. Evaluation'
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0B4F9C] mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to My Reports</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900 font-brand-serif flex items-center gap-2">
            <span>Weekly Report: Week {report.termWeekNumber}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-[#0B4F9C] uppercase font-sans">
              {report.status}
            </span>
            {report.isLate && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 uppercase font-sans">
                Submitted Late
              </span>
            )}
          </h1>
          <div className="text-xs text-slate-500">
            {report.campusName} • {report.termName} • Ref: <span className="font-mono text-slate-700 font-bold">{report.referenceNo}</span>
          </div>
        </div>

        {/* Autosave Sync Status & Quick Actions */}
        <div className="flex items-center gap-3">
          {!isSubmitted ? (
            <div className="text-right text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {isSaving ? (
                  <span className="text-[#0B4F9C] font-bold animate-pulse">Syncing draft...</span>
                ) : (
                  <span>Autosave in {autosaveSeconds}s</span>
                )}
              </div>
              <div className="text-[10px] text-slate-400">
                Saved at {lastSavedTime} • Version {report.version}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-bold">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Locked &amp; Submitted</span>
            </div>
          )}

          {!isSubmitted && (
            <button
              onClick={triggerAutosave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
          )}

          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF Preview</span>
          </button>
        </div>
      </div>

      {/* 7-Step Progress Stepper Navigation */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px]">
          {steps.map((st, idx) => {
            const stepNum = idx + 1;
            const isCurrent = currentStep === stepNum;
            const isPast = currentStep > stepNum;
            return (
              <button
                key={stepNum}
                onClick={() => setCurrentStep(stepNum)}
                className={`flex-1 py-2 px-2 text-center rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  isCurrent
                    ? 'bg-blue-50 text-[#0B4F9C] border border-[#0B4F9C]/30 shadow-2xs'
                    : isPast
                    ? 'text-slate-700 hover:bg-slate-50'
                    : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                    isCurrent
                      ? 'bg-[#0B4F9C] text-white'
                      : isPast
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isPast ? '✓' : stepNum}
                </div>
                <span className="truncate max-w-[90px]">{st}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Body Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        {currentStep === 1 && (
          <Step1General
            data={report.general}
            onChange={(g) => setReport({ ...report, general: g })}
            disabled={isSubmitted}
          />
        )}
        {currentStep === 2 && (
          <Step2Teaching
            data={report.teaching}
            onChange={(t) => setReport({ ...report, teaching: t })}
            disabled={isSubmitted}
          />
        )}
        {currentStep === 3 && (
          <Step3Learning
            data={report.learning}
            onChange={(l) => setReport({ ...report, learning: l })}
            disabled={isSubmitted}
          />
        )}
        {currentStep === 4 && (
          <Step4Attendance
            data={report.attendance}
            onChange={(a) => setReport({ ...report, attendance: a })}
            disabled={isSubmitted}
          />
        )}
        {currentStep === 5 && (
          <Step5Classroom
            data={report.classroom}
            onChange={(c) => setReport({ ...report, classroom: c })}
            disabled={isSubmitted}
          />
        )}
        {currentStep === 6 && (
          <Step6Reflection
            data={report.reflection}
            onChange={(r) => setReport({ ...report, reflection: r })}
            disabled={isSubmitted}
          />
        )}
        {currentStep === 7 && (
          <Step7SelfAssessment
            data={report.selfAssessment}
            onChange={(sa) => setReport({ ...report, selfAssessment: sa })}
            disabled={isSubmitted}
          />
        )}

        {/* Bottom Navigation Buttons */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <div className="flex items-center gap-3">
            {!isSubmitted && (
              <button
                type="button"
                onClick={handleValidateClick}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 transition-colors"
              >
                <FileCheck className="w-4 h-4 text-[#0B4F9C]" />
                <span>Validate Rules (Dry-Run)</span>
              </button>
            )}

            {currentStep < 7 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(7, prev + 1))}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B4F9C] hover:bg-[#07356B] text-white text-xs font-bold shadow-xs transition-all"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              !isSubmitted && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#a50b24] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Report Directly to Director</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Validation Dry-Run Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
              {validationErrors.length === 0 ? (
                <div className="p-2.5 rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="p-2.5 rounded-full bg-amber-100 text-amber-700">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {validationErrors.length === 0 ? 'Validation Passed' : 'Incomplete Business Rules'}
                </h3>
                <div className="text-xs text-slate-500">
                  {validationErrors.length === 0
                    ? 'All 16 business rules and quality gates are satisfied.'
                    : `Please address ${validationErrors.length} required field(s) before submission:`}
                </div>
              </div>
            </div>

            {validationErrors.length > 0 && (
              <div className="max-h-60 overflow-y-auto space-y-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                {validationErrors.map((err, i) => (
                  <div key={i} className="flex items-start gap-2 text-rose-700">
                    <span>•</span>
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowValidationModal(false)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800"
              >
                Close &amp; Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable PDF Modal */}
      <PdfPreviewModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        report={report}
      />
    </div>
  );
};
