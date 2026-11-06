import React from 'react';
import type { ReflectionSection } from '../../types';
import { Sparkles, Target, Award } from 'lucide-react';

interface Step6ReflectionProps {
  data: ReflectionSection;
  onChange: (updated: ReflectionSection) => void;
  disabled?: boolean;
}

export const Step6Reflection: React.FC<Step6ReflectionProps> = ({ data, onChange, disabled }) => {
  const getCharBadge = (val: string, min = 10) => {
    const len = (val || '').trim().length;
    if (len >= min) {
      return <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">✓ Valid ({len} chars)</span>;
    }
    return <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Min 10 chars ({len}/{min})</span>;
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Section 6: Professional Reflection &amp; Target Setting.</strong> Self-reflection is foundational to teaching mastery. Under <strong>BR-009</strong>, achievements and goals enforce a strict <strong>minimum 10-character quality threshold</strong> to prevent empty placeholders.
        </div>
      </div>

      {/* Major Achievement */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Major Instructional Breakthrough or Achievement <span className="text-[#C8102E]">*</span></span>
          </label>
          {getCharBadge(data.majorAchievement)}
        </div>
        <textarea
          rows={3}
          value={data.majorAchievement}
          onChange={(e) => onChange({ ...data, majorAchievement: e.target.value })}
          disabled={disabled}
          placeholder="e.g. Over 85% of SS 1 students achieved grade B and above in the optics theory quiz..."
          className="w-full p-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            What Went Particularly Well in Your Teaching?
          </label>
          <textarea
            rows={2}
            value={data.wentWell}
            onChange={(e) => onChange({ ...data, wentWell: e.target.value })}
            disabled={disabled}
            placeholder="e.g. High engagement during hands-on optical ray demonstrations..."
            className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            What Challenges Affected Your Work This Week?
          </label>
          <textarea
            rows={2}
            value={data.challenges || ''}
            onChange={(e) => onChange({ ...data, challenges: e.target.value })}
            disabled={disabled}
            placeholder="e.g. Insufficient optical ray kits in the laboratory necessitated larger student clusters..."
            className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          What Resources or Support Do You Need from Management?
        </label>
        <textarea
          rows={2}
          value={data.supportNeeded}
          onChange={(e) => onChange({ ...data, supportNeeded: e.target.value })}
          disabled={disabled}
          placeholder="e.g. Requisition for additional ray boxes submitted to Science HOD..."
          className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
        />
      </div>

      {/* Areas to Improve */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Instructional Area to Improve Next Week <span className="text-[#C8102E]">*</span>
          </label>
          {getCharBadge(data.improveNextWeek)}
        </div>
        <input
          type="text"
          value={data.improveNextWeek}
          onChange={(e) => onChange({ ...data, improveNextWeek: e.target.value })}
          disabled={disabled}
          placeholder="e.g. Provide differentiated scaffolding worksheets for struggling students."
          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
        />
      </div>

      {/* Two Concrete Goals (BR-009) */}
      <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Target className="w-4 h-4 text-[#0B4F9C]" />
          <span>Measurable Goals for Next Academic Week (BR-009)</span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">Goal 1 <span className="text-[#C8102E]">*</span></label>
            {getCharBadge(data.goal1)}
          </div>
          <input
            type="text"
            value={data.goal1}
            onChange={(e) => onChange({ ...data, goal1: e.target.value })}
            disabled={disabled}
            placeholder="e.g. Complete practical assessments on critical angle and total internal reflection."
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">Goal 2 <span className="text-[#C8102E]">*</span></label>
            {getCharBadge(data.goal2)}
          </div>
          <input
            type="text"
            value={data.goal2}
            onChange={(e) => onChange({ ...data, goal2: e.target.value })}
            disabled={disabled}
            placeholder="e.g. Conduct 30-minute remedial tutorial for the 4 borderline physics students."
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
          />
        </div>
      </div>
    </div>
  );
};
