import React from 'react';
import type { AttendanceSection } from '../../types';
import { ShieldCheck, UserX, HeartHandshake, Sparkles } from 'lucide-react';

interface Step4AttendanceProps {
  data: AttendanceSection;
  onChange: (updated: AttendanceSection) => void;
  disabled?: boolean;
}

export const Step4Attendance: React.FC<Step4AttendanceProps> = ({ data, onChange, disabled }) => {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Section 4: Attendance, Form Tutor &amp; Student Safeguarding (NDPA 2023).</strong> In compliance with the Nigeria Data Protection Act (NDPA 2023), any confidential student welfare or pastoral disclosures recorded here are strictly encrypted and restricted to authorized safeguarding personnel.
        </div>
      </div>

      {/* Part A: Student Absences */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserX className="w-5 h-5 text-slate-700" />
            <div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Student Absences Recorded this Week?</div>
              <div className="text-[11px] text-slate-500">Were any students absent from school or your class this week?</div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.hasAbsences}
              onChange={(e) => onChange({ ...data, hasAbsences: e.target.checked })}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0B4F9C]"></div>
          </label>
        </div>

        {data.hasAbsences && (
          <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Absence Details &amp; Relevant Student Names
              </label>
              <input
                type="text"
                value={data.absenceDetails || ''}
                onChange={(e) => onChange({ ...data, absenceDetails: e.target.value })}
                disabled={disabled}
                placeholder="e.g. David Adeleke absent Tuesday and Wednesday due to fever."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Follow-up Actions with Parents
                </label>
                <input
                  type="text"
                  value={data.followUpEfforts || ''}
                  onChange={(e) => onChange({ ...data, followUpEfforts: e.target.value })}
                  disabled={disabled}
                  placeholder="e.g. Phone call placed; medical excuse note received."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Feedback Received from Parents / Guardians
                </label>
                <input
                  type="text"
                  value={data.feedbackReceived || ''}
                  onChange={(e) => onChange({ ...data, feedbackReceived: e.target.value })}
                  disabled={disabled}
                  placeholder="e.g. Parent confirmed student recovery and return."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Part B: Additional Learning Support & Accommodations */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Students Requiring Additional Learning Support / Accommodations?</div>
              <div className="text-[11px] text-slate-500">Any students requiring IEP, disability-related, or specialized learning accommodations?</div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.hasSupportNeeds}
              onChange={(e) => onChange({ ...data, hasSupportNeeds: e.target.checked })}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {data.hasSupportNeeds && (
          <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Support or Intervention Provided / Recommended
              </label>
              <textarea
                rows={2}
                value={data.supportProvided || ''}
                onChange={(e) => onChange({ ...data, supportProvided: e.target.value })}
                disabled={disabled}
                placeholder="e.g. Provided enlarged font worksheets and front-row seating for visually impaired student."
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Part C: Student Welfare & Safeguarding (NDPA 2023) */}
      <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-[#C8102E]" />
            <div>
              <div className="text-xs font-bold text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                <span>Student Behavioural or Welfare Concerns Requiring Attention?</span>
                <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.2 rounded font-bold">NDPA 2023</span>
              </div>
              <div className="text-[11px] text-rose-800">Did any student exhibit behavioural challenges or acute pastoral concerns?</div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.hasWelfareConcern}
              onChange={(e) => onChange({ ...data, hasWelfareConcern: e.target.checked })}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C8102E]"></div>
          </label>
        </div>

        {data.hasWelfareConcern && (
          <div className="pt-3 border-t border-rose-200 space-y-3 animate-in fade-in">
            <div className="p-3 rounded-lg bg-rose-100/70 text-rose-900 text-xs font-medium">
              🔒 <strong>Sensitive Safeguarding Notice:</strong> This disclosure will be automatically redacted to <code>[RESTRICTED SAFEGUARDING DATA - NDPA 2023]</code> for third-party viewings and audited on access.
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-950 mb-1">
                Concern Details &amp; Student Notes
              </label>
              <textarea
                rows={2}
                value={data.welfareDetails || ''}
                onChange={(e) => onChange({ ...data, welfareDetails: e.target.value })}
                disabled={disabled}
                placeholder="e.g. Student expressed acute anxiety regarding mid-term examinations..."
                className="w-full p-2.5 text-xs bg-white border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-950 mb-1">
                Action Taken / Intervention
              </label>
              <input
                type="text"
                value={data.welfareAction || ''}
                onChange={(e) => onChange({ ...data, welfareAction: e.target.value })}
                disabled={disabled}
                placeholder="e.g. Referred to campus guidance counsellor Mrs. Peters for counselling sessions."
                className="w-full px-3 py-2 text-xs bg-white border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

