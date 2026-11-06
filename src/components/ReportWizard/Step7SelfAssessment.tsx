import React from 'react';
import type { SelfAssessmentSection } from '../../types';
import { Award, Star } from 'lucide-react';

interface Step7SelfAssessmentProps {
  data: SelfAssessmentSection;
  onChange: (updated: SelfAssessmentSection) => void;
  disabled?: boolean;
}

export const Step7SelfAssessment: React.FC<Step7SelfAssessmentProps> = ({ data, onChange, disabled }) => {
  const standards: { key: keyof SelfAssessmentSection; title: string; desc: string }[] = [
    {
      key: 'preparationRating',
      title: '1. Lesson Planning & Preparation',
      desc: 'Syllabus alignment, curriculum pacing, lesson plan depth, and early resource organization.'
    },
    {
      key: 'effectivenessRating',
      title: '2. Lesson Delivery & Pedagogical Effectiveness',
      desc: 'Clarity of explanation, student engagement, questioning technique, and active participation.'
    },
    {
      key: 'assessmentRating',
      title: '3. Student Assessment & Diagnostic Feedback',
      desc: 'Rigour of weekly testing, promptness of marking, and remedial intervention for struggling students.'
    },
    {
      key: 'managementRating',
      title: '4. Classroom Management & Learning Environment',
      desc: 'Orderliness, time management, mutual respect, lab safety, and minimizing instructional disruption.'
    },
    {
      key: 'recordsRating',
      title: '5. Record Keeping & Administrative Compliance',
      desc: 'Timely register updating, continuous assessment gradebook accuracy, and syllabus trackers.'
    },
    {
      key: 'conductRating',
      title: '6. Professional Conduct & Institutional Ethos',
      desc: 'Punctuality, dress code compliance, collaboration with peers, and duty roster execution.'
    }
  ];

  const ratingDescriptions: Record<number, string> = {
    1: 'Needs Improvement',
    2: 'Below Expectations',
    3: 'Meets Expectations',
    4: 'Above Expectations',
    5: 'Outstanding'
  };

  const handleRatingChange = (key: keyof SelfAssessmentSection, value: number) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 flex items-start gap-3">
        <Award className="w-5 h-5 text-[#C8102E] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Section 7: Teacher Self-Assessment (BR-010).</strong> Evaluate your professional instructional practice across the 6 institutional standards. Under <strong>BR-010</strong>, all 6 ratings are mandatory before final submission. Your self-ratings will be reviewed directly by the School Director for institutional evaluation, feedback, and supervisory recommendations.
        </div>
      </div>

      {/* 6 Standards Rating Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {standards.map((std) => {
          const currentVal = (data[std.key] as number) || 0;
          return (
            <div key={std.key} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#0B4F9C] transition-all space-y-3">
              <div>
                <div className="text-xs font-bold text-slate-900 font-brand-sans">{std.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{std.desc}</div>
              </div>

              {/* 5-Star Rating Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleRatingChange(std.key, star)}
                      className={`p-1.5 rounded-lg transition-transform active:scale-95 ${
                        star <= currentVal
                          ? 'text-amber-500 hover:text-amber-600'
                          : 'text-slate-300 hover:text-slate-400'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${star <= currentVal ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>
                  ))}
                </div>

                <span className="text-xs font-bold text-[#0B4F9C]">
                  {currentVal > 0 ? `${currentVal} / 5 (${ratingDescriptions[currentVal]})` : 'Unrated'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Supporting Evidence Notes */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Self-Rating Evidence &amp; Specific Highlights
        </label>
        <textarea
          rows={2}
          value={data.evidence || ''}
          onChange={(e) => onChange({ ...data, evidence: e.target.value })}
          disabled={disabled}
          placeholder="e.g. Submitted lesson notes on Monday 8:00 AM; graded all 22 quiz scripts within 24 hours..."
          className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Key Area Targeted for Personal Growth
          </label>
          <input
            type="text"
            value={data.improvementArea || ''}
            onChange={(e) => onChange({ ...data, improvementArea: e.target.value })}
            disabled={disabled}
            placeholder="e.g. Allocate more time for plenary summary discussions..."
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Additional Notes for HOD Lesson Observation
          </label>
          <input
            type="text"
            value={data.additionalNotes || ''}
            onChange={(e) => onChange({ ...data, additionalNotes: e.target.value })}
            disabled={disabled}
            placeholder="e.g. Ready for scheduled HOD termly lesson observation in Week 4."
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
          />
        </div>
      </div>
    </div>
  );
};
