import React from 'react';
import type { LearningSection, Understanding, MarkingStatus } from '../../types';
import { ClipboardCheck } from 'lucide-react';

interface Step3LearningProps {
  data: LearningSection;
  onChange: (updated: LearningSection) => void;
  disabled?: boolean;
}

export const Step3Learning: React.FC<Step3LearningProps> = ({ data, onChange, disabled }) => {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
        <ClipboardCheck className="w-5 h-5 text-[#0B4F9C] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Section 3: Student Learning &amp; Continuous Assessment.</strong> Log continuous quizzes, diagnostic homework, or class activities. Gauge overall student comprehension and flag students who require remedial lunch clinics.
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Assessments &amp; Learning Activities Conducted <span className="text-[#C8102E]">*</span>
        </label>
        <textarea
          rows={3}
          value={data.assessmentsConducted}
          onChange={(e) => onChange({ ...data, assessmentsConducted: e.target.value })}
          disabled={disabled}
          placeholder="e.g. Diagnostic weekly quiz on rectilinear propagation of light (20 questions)..."
          className="w-full p-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Comprehension Level */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Overall Student Understanding Level <span className="text-[#C8102E]">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['VERY_WELL', 'WELL', 'FAIRLY', 'POORLY'] as Understanding[]).map((level) => {
              const isSelected = data.understanding === level;
              return (
                <button
                  key={level}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange({ ...data, understanding: level })}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all text-center ${
                    isSelected
                      ? 'bg-blue-50 border-[#0B4F9C] text-[#0B4F9C] ring-2 ring-[#0B4F9C]/30'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {level.replace('_', ' ')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Marking Completed */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Marking &amp; Feedback Completed <span className="text-[#C8102E]">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['YES', 'PARTIALLY', 'NO', 'NOT_APPLICABLE'] as MarkingStatus[]).map((status) => {
              const isSelected = data.markingStatus === status;
              return (
                <button
                  key={status}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange({ ...data, markingStatus: status })}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all text-center ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/30'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Specific Learning Difficulties */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Specific Learning Difficulties or Misconceptions Identified
        </label>
        <textarea
          rows={2}
          value={data.difficulties || ''}
          onChange={(e) => onChange({ ...data, difficulties: e.target.value })}
          disabled={disabled}
          placeholder="e.g. Several students struggled with calculating angles of refraction in dense optical media..."
          className="w-full p-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
        />
      </div>

      {/* Targeted Students for Clinic */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Students Requiring Remedial Attention / Lunch Clinic
        </label>
        <input
          type="text"
          value={data.supportNeededStudents || ''}
          onChange={(e) => onChange({ ...data, supportNeededStudents: e.target.value })}
          disabled={disabled}
          placeholder="e.g. Tobi Alabi and Zainab Musa require remedial sessions on Snell's Law."
          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
        />
      </div>
    </div>
  );
};
