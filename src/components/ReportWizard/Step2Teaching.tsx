import React from 'react';
import type { TeachingSection, Coverage, Prepared } from '../../types';
import { BookOpen, AlertTriangle } from 'lucide-react';

interface Step2TeachingProps {
  data: TeachingSection;
  onChange: (updated: TeachingSection) => void;
  disabled?: boolean;
}

export const Step2Teaching: React.FC<Step2TeachingProps> = ({ data, onChange, disabled }) => {
  const isPartiallyOrNotCovered = data.topicsCovered === 'PARTIALLY' || data.topicsCovered === 'NO';

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-[#0B4F9C] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Section 2: Weekly Teaching Activities &amp; Curriculum Pacing.</strong> Evaluate your delivery against the approved termly Scheme of Work. Under <strong>BR-004</strong>, any partial coverage or missed topics must be supported with specific reasons and catch-up schedules.
        </div>
      </div>

      {/* Topics Covered Selection Buttons */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Were all planned weekly topics covered? (BR-004) <span className="text-[#C8102E]">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['YES', 'PARTIALLY', 'NO'] as Coverage[]).map((option) => {
            const isSelected = data.topicsCovered === option;
            return (
              <button
                key={option}
                type="button"
                disabled={disabled}
                onClick={() => onChange({ ...data, topicsCovered: option })}
                className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  isSelected
                    ? option === 'YES'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/30'
                      : option === 'PARTIALLY'
                      ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/30'
                      : 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/30'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{option === 'YES' ? 'Fully Covered' : option === 'PARTIALLY' ? 'Partially Covered' : 'Not Covered'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conditional Rationale Fields for BR-004 */}
      {isPartiallyOrNotCovered && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-4 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Conditional Rule BR-004 Triggered: Reason and Missed Topics Required</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Reason for Incomplete Topic Delivery <span className="text-[#C8102E]">*</span>
            </label>
            <textarea
              rows={2}
              value={data.notCoveredReason || ''}
              onChange={(e) => onChange({ ...data, notCoveredReason: e.target.value })}
              disabled={disabled}
              placeholder="e.g. Laboratory power disruption delayed optical ray experiments..."
              className="w-full p-2.5 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Exact Topics Not Covered <span className="text-[#C8102E]">*</span>
            </label>
            <input
              type="text"
              value={data.notCoveredTopics || ''}
              onChange={(e) => onChange({ ...data, notCoveredTopics: e.target.value })}
              disabled={disabled}
              placeholder="e.g. Refraction through glass prisms and Snell's Law"
              className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      )}

      {/* Teaching Methods Used */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Teaching Methods &amp; Instructional Aids Used <span className="text-[#C8102E]">*</span>
        </label>
        <textarea
          rows={3}
          value={data.methodsUsed}
          onChange={(e) => onChange({ ...data, methodsUsed: e.target.value })}
          disabled={disabled}
          placeholder="e.g. Interactive smartboard demonstrations, collaborative group problem solving, and hands-on laboratory exercises..."
          className="w-full p-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
        />
      </div>

      {/* Lesson Notes Prepared */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Lesson Notes &amp; Plan Prepared Prior to Class <span className="text-[#C8102E]">*</span>
        </label>
        <div className="flex gap-4">
          {(['YES', 'PARTIALLY', 'NO'] as Prepared[]).map((opt) => (
            <label key={opt} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="lessonNotesPrepared"
                checked={data.lessonNotesPrepared === opt}
                onChange={() => onChange({ ...data, lessonNotesPrepared: opt })}
                disabled={disabled}
                className="text-[#0B4F9C] focus:ring-[#0B4F9C]"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
