import React, { useMemo } from 'react';
import type { GeneralSection, AcademicClass } from '../../types';
import { defaultAcademicClasses } from '../../data/mockData';
import { Users, Info, X } from 'lucide-react';

interface Step1GeneralProps {
  data: GeneralSection;
  onChange: (updated: GeneralSection) => void;
  disabled?: boolean;
}

const ACADEMIC_TIERS = [
  'Senior Secondary',
  'Junior Secondary',
  'Primary School',
  'Nursery & Early Years'
] as const;

export const Step1General: React.FC<Step1GeneralProps> = ({ data, onChange, disabled }) => {
  // Load classes from localStorage if configured, fallback to defaultAcademicClasses
  const allClasses = useMemo<AcademicClass[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('attwool_classes_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return defaultAcademicClasses;
  }, []);

  // Parse comma-separated classes taught into an array of class names
  const selectedClasses = useMemo(() => {
    return data.classesTaught
      ? data.classesTaught.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
  }, [data.classesTaught]);

  // Handle adding a class to the classes taught selection
  const handleAddClass = (className: string) => {
    if (!className || selectedClasses.includes(className)) return;
    const updated = [...selectedClasses, className];
    onChange({ ...data, classesTaught: updated.join(', ') });
  };

  // Handle removing a class from the classes taught selection
  const handleRemoveClass = (className: string) => {
    const updated = selectedClasses.filter((c) => c !== className);
    onChange({ ...data, classesTaught: updated.join(', ') });
  };

  // Check if current form tutor class is custom (not in default list)
  const isCustomFormTutorClass = Boolean(
    data.formTutorClassName && !allClasses.some((c) => c.name === data.formTutorClassName)
  );

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
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Class(es) Taught this Week
            </label>
            {selectedClasses.length > 0 && !disabled && (
              <button
                type="button"
                onClick={() => onChange({ ...data, classesTaught: '' })}
                className="text-[10px] text-slate-400 hover:text-[#C8102E] font-medium cursor-pointer"
              >
                Clear all ({selectedClasses.length})
              </button>
            )}
          </div>

          {/* Classes Taught Dropdown */}
          <select
            value=""
            onChange={(e) => {
              handleAddClass(e.target.value);
            }}
            disabled={disabled}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C] disabled:bg-slate-100 cursor-pointer text-slate-700 font-medium"
          >
            <option value="">+ Select class to add...</option>
            {ACADEMIC_TIERS.map((tier) => {
              const classesInTier = allClasses.filter((c) => c.tier === tier);
              if (classesInTier.length === 0) return null;
              return (
                <optgroup key={tier} label={tier}>
                  {classesInTier.map((c) => (
                    <option
                      key={c.id || c.name}
                      value={c.name}
                      disabled={selectedClasses.includes(c.name)}
                    >
                      {c.name} {selectedClasses.includes(c.name) ? '✓ (Selected)' : ''}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>

          {/* Selected Class Badges */}
          {selectedClasses.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {selectedClasses.map((cls, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-[#0B4F9C] border border-blue-200 shadow-2xs animate-in fade-in"
                >
                  <span>{cls}</span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => handleRemoveClass(cls)}
                      className="text-slate-400 hover:text-[#C8102E] transition-colors cursor-pointer"
                      title={`Remove ${cls}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 mt-1 block">
              Select one or multiple classes taught this reporting week from the dropdown
            </span>
          )}
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
          <span className="text-[11px] text-slate-400 mt-1 block">Subject allocations for this week</span>
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
              <select
                value={data.formTutorClassName || ''}
                onChange={(e) => {
                  const selectedName = e.target.value;
                  const matched = allClasses.find((c) => c.name === selectedName);
                  onChange({
                    ...data,
                    formTutorClassName: selectedName,
                    formTutorClassId: matched?.id || data.formTutorClassId
                  });
                }}
                disabled={disabled}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C] disabled:bg-slate-100 cursor-pointer font-medium text-slate-800"
              >
                <option value="">-- Select Form Tutor Class --</option>
                {isCustomFormTutorClass && data.formTutorClassName && (
                  <option value={data.formTutorClassName}>{data.formTutorClassName}</option>
                )}
                {ACADEMIC_TIERS.map((tier) => {
                  const classesInTier = allClasses.filter((c) => c.tier === tier);
                  if (classesInTier.length === 0) return null;
                  return (
                    <optgroup key={tier} label={tier}>
                      {classesInTier.map((c) => (
                        <option key={c.id || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
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
