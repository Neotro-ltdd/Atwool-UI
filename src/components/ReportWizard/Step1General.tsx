import React from 'react';
import type { GeneralSection } from '../../types';
import { Users, Info } from 'lucide-react';

interface Step1GeneralProps {
  data: GeneralSection;
  onChange: (updated: GeneralSection) => void;
  disabled?: boolean;
}

export const Step1General: React.FC<Step1GeneralProps> = ({ data, onChange, disabled }) => {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#0B4F9C] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Section 1: General Information &amp; Form Allocation.</strong> This section is automatically populated from your active teaching assignments for the current term. If you are a designated Form Tutor, your class and student headcount must be specified in accordance with <strong>BR-005</strong>.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Class(es) Taught this Week
          </label>
          <input
            type="text"
            value={data.classesTaught}
            onChange={(e) => onChange({ ...data, classesTaught: e.target.value })}
            disabled={disabled}
            placeholder="e.g. SS 1 Science, SS 2 Arts"
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C] disabled:bg-slate-100"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">Separated by commas for multi-class allocations</span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Subject(s) Taught
          </label>
          <input
            type="text"
            value={data.subjectsTaught}
            onChange={(e) => onChange({ ...data, subjectsTaught: e.target.value })}
            disabled={disabled}
            placeholder="e.g. Physics, Basic Science"
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C] disabled:bg-slate-100"
          />
        </div>
      </div>

      {/* Form Tutor Designation Card (BR-005) */}
      <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#0B4F9C]" />
            <div>
              <div className="text-sm font-bold text-slate-900 font-brand-sans">Form Tutor Allocation (BR-005)</div>
              <div className="text-xs text-slate-500">Are you designated as the welfare Form Tutor for a class?</div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.isFormTutor}
              onChange={(e) => onChange({ ...data, isFormTutor: e.target.checked })}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0B4F9C]"></div>
          </label>
        </div>

        {data.isFormTutor && (
          <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Form Tutor Assigned Class <span className="text-[#C8102E]">*</span>
              </label>
              <input
                type="text"
                value={data.formTutorClassName || ''}
                onChange={(e) => onChange({ ...data, formTutorClassName: e.target.value })}
                disabled={disabled}
                placeholder="e.g. SS 1 Science"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Total Students in Class <span className="text-[#C8102E]">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={data.studentCount || ''}
                onChange={(e) => onChange({ ...data, studentCount: parseInt(e.target.value) || 0 })}
                disabled={disabled}
                placeholder="e.g. 22"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
