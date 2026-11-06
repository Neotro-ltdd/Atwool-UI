import React from 'react';
import type { ClassroomSection, RecordsUpdated, DutiesCompleted } from '../../types';
import { Building } from 'lucide-react';

interface Step5ClassroomProps {
  data: ClassroomSection;
  onChange: (updated: ClassroomSection) => void;
  disabled?: boolean;
}

export const Step5Classroom: React.FC<Step5ClassroomProps> = ({ data, onChange, disabled }) => {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
        <Building className="w-5 h-5 text-[#0B4F9C] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Section 5: Classroom Management &amp; Institutional Responsibilities.</strong> Record environmental/behavioural challenges (<strong>BR-007</strong>) and audit continuous assessment book keeping and weekly duty assignments (<strong>BR-008</strong>).
        </div>
      </div>

      {/* Part A: Behavioural & Classroom Challenges (BR-007) */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Classroom or Behavioural Challenges Encountered? (BR-007)</div>
            <div className="text-[11px] text-slate-500">Any disciplinary disruptions or equipment shortages during lesson delivery?</div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.hasChallenges}
              onChange={(e) => onChange({ ...data, hasChallenges: e.target.checked })}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0B4F9C]"></div>
          </label>
        </div>

        {data.hasChallenges && (
          <div className="pt-3 border-t border-slate-100 animate-in fade-in">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Details of Challenges Encountered <span className="text-[#C8102E]">*</span>
            </label>
            <textarea
              rows={2}
              value={data.challengeDetails || ''}
              onChange={(e) => onChange({ ...data, challengeDetails: e.target.value })}
              disabled={disabled}
              placeholder="e.g. Minor transition noise during student movement between classroom and physics lab..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
            />
          </div>
        )}
      </div>

      {/* Part B: Records & Duty Roster Audit (BR-008) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Did you update attendance registers, assessment records, and required documents? <span className="text-[#C8102E]">*</span>
          </label>
          <div className="flex gap-4 pt-1">
            {(['YES', 'PARTIALLY', 'NO'] as RecordsUpdated[]).map((opt) => (
              <label key={opt} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="recordsUpdated"
                  checked={data.recordsUpdated === opt}
                  onChange={() => onChange({ ...data, recordsUpdated: opt })}
                  disabled={disabled}
                  className="text-[#0B4F9C] focus:ring-[#0B4F9C]"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Did you complete assigned administrative, extracurricular, or other school duties? <span className="text-[#C8102E]">*</span>
          </label>
          <div className="flex flex-wrap gap-3 pt-1">
            {(['YES', 'PARTIALLY', 'NO', 'NOT_APPLICABLE'] as DutiesCompleted[]).map((opt) => (
              <label key={opt} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="dutiesCompleted"
                  checked={data.dutiesCompleted === opt}
                  onChange={() => onChange({ ...data, dutiesCompleted: opt })}
                  disabled={disabled}
                  className="text-[#0B4F9C] focus:ring-[#0B4F9C]"
                />
                <span>{opt.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Part C: Outstanding Tasks */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          Are there any outstanding tasks? If yes, provide details. {(data.dutiesCompleted !== 'YES' && data.dutiesCompleted !== 'NOT_APPLICABLE') || data.recordsUpdated !== 'YES' ? <span className="text-[#C8102E]">*</span> : null}
        </label>
        <textarea
          rows={2}
          value={data.outstandingTasks || ''}
          onChange={(e) => onChange({ ...data, outstandingTasks: e.target.value })}
          disabled={disabled}
          placeholder="e.g. Completed all lesson plans; continuous assessment marks entry for SS 2 Physics in progress..."
          className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
        />
      </div>
    </div>
  );
};
