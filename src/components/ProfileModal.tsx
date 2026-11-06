import React, { useState, useEffect } from 'react';
import type { UserSession } from '../types';
import {
  X,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession;
  onSaveProfile: (updated: { firstName: string; lastName: string; phoneNumber: string; name: string }) => void;
}

/**
 * Extracts default first and last names from a full name (handling titles like Mr., Mrs., Dr.)
 */
function parseFirstAndLastName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const titles = ['mr.', 'mr', 'mrs.', 'mrs', 'ms.', 'ms', 'dr.', 'dr', 'prof.', 'prof'];
  
  let startIndex = 0;
  if (parts.length > 1 && titles.includes(parts[0].toLowerCase())) {
    startIndex = 1;
  }

  const validParts = parts.slice(startIndex);
  if (validParts.length === 0) {
    return { firstName: '', lastName: '' };
  }
  if (validParts.length === 1) {
    return { firstName: validParts[0], lastName: '' };
  }
  return {
    firstName: validParts[0],
    lastName: validParts.slice(1).join(' ')
  };
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveProfile
}) => {
  const defaultNames = parseFirstAndLastName(user.name);

  const [firstName, setFirstName] = useState(user.firstName || defaultNames.firstName);
  const [lastName, setLastName] = useState(user.lastName || defaultNames.lastName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '+234 803 000 0001');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);

  // Sync state whenever modal opens or user prop changes
  useEffect(() => {
    if (isOpen) {
      const parsed = parseFirstAndLastName(user.name);
      setFirstName(user.firstName || parsed.firstName);
      setLastName(user.lastName || parsed.lastName);
      setPhoneNumber(user.phoneNumber || '+234 803 000 0001');
      setValidationError(null);
      setShowSuccessBadge(false);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Live computed avatar initials
  const initials = [firstName, lastName]
    .map((n) => n.trim().charAt(0).toUpperCase())
    .filter(Boolean)
    .join('') || user.name.slice(0, 2).toUpperCase() || 'ST';

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const cleanPhone = phoneNumber.trim();

    if (!cleanFirst || cleanFirst.length < 2) {
      setValidationError('Please enter a valid first name (minimum 2 characters).');
      return;
    }

    if (!cleanLast || cleanLast.length < 2) {
      setValidationError('Please enter a valid last name (minimum 2 characters).');
      return;
    }

    if (!cleanPhone || cleanPhone.length < 7) {
      setValidationError('Please enter a valid official telephone or WhatsApp number.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessBadge(true);
      const updatedFullName = `${cleanFirst} ${cleanLast}`;
      
      onSaveProfile({
        firstName: cleanFirst,
        lastName: cleanLast,
        phoneNumber: cleanPhone,
        name: updatedFullName
      });

      setTimeout(() => {
        onClose();
      }, 400);
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#e6e3dd] overflow-hidden text-slate-900 transition-colors animate-in zoom-in-95 duration-200">
        {/* Top Heraldic Accent Line */}
        <div className="h-2 w-full bg-gradient-to-r from-[#94A3B8] via-[#C8102E] to-[#0B4F9C]" />

        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close profile dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Live Avatar Initials */}
        <div className="p-6 sm:p-7 pb-4 border-b border-slate-100 bg-[#fbfaf8]">
          <div className="flex items-center gap-4">
            {/* Live Interactive Initials Beacon */}
            <div className="w-16 h-16 rounded-2xl bg-[#0B4F9C] text-white flex items-center justify-center text-xl font-bold uppercase shadow-sm shrink-0 ring-4 ring-blue-50">
              {initials}
            </div>
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#0B4F9C] border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Staff Profile
              </span>
              <h2 id="profile-modal-title" className="text-xl font-bold font-brand-serif text-slate-900">
                {firstName || lastName ? `${firstName} ${lastName}`.trim() : user.name}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {user.role} • {user.department || 'Academic Directorate'}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleFormSubmit} className="p-6 sm:p-7 space-y-5">
          {validationError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {showSuccessBadge && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Profile updated successfully! Syncing credentials...</span>
            </div>
          )}

          {/* First Name & Last Name (Editable) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="profile-first-name" className="block text-xs font-bold text-slate-700">
                First Name <span className="text-[#C8102E]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="profile-first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Babatunde"
                  required
                  className="w-full pl-9.5 pr-3 py-2.5 rounded-xl text-xs sm:text-sm bg-white border border-[#e6e3dd] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-last-name" className="block text-xs font-bold text-slate-700">
                Last Name <span className="text-[#C8102E]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="profile-last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Fashola"
                  required
                  className="w-full pl-9.5 pr-3 py-2.5 rounded-xl text-xs sm:text-sm bg-white border border-[#e6e3dd] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Phone Number (Editable) */}
          <div className="space-y-1.5">
            <label htmlFor="profile-phone" className="block text-xs font-bold text-slate-700">
              Official Phone / WhatsApp Number <span className="text-[#C8102E]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="profile-phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+234 803 123 4567"
                required
                className="w-full pl-9.5 pr-3 py-2.5 rounded-xl text-xs sm:text-sm bg-white border border-[#e6e3dd] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C] transition-colors"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Used for emergency academic governance notices and submission reminders.
            </p>
          </div>

          {/* Official Staff Email (NON-EDITABLE / IMMUTABLE) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="profile-email" className="block text-xs font-bold text-slate-700">
                Official Staff Email
              </label>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                <Lock className="w-3 h-3 text-slate-400" />
                Locked &amp; Immutable
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="profile-email"
                type="email"
                value={user.email}
                disabled
                readOnly
                className="w-full pl-9.5 pr-10 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-500 cursor-not-allowed select-none font-mono"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            {/* Informative governance alert explaining why email is non-editable */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0B4F9C] shrink-0 mt-0.5" />
              <span>
                Staff email is provisioned by the School ICT Directorate and cryptographically anchored to your Google SSO credentials and NDPA 2023 audit registry.
              </span>
            </div>
          </div>

          {/* Contextual Academic Credentials (Read-Only) */}
          <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/60 space-y-2 text-xs">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Institutional Allocation
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Building2 className="w-3.5 h-3.5 text-[#0B4F9C] shrink-0" />
                <span className="truncate">{user.campus}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>{user.isFormTutor ? 'Form Tutor (SS 1 Science)' : 'Subject Specialist'}</span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0B4F9C] hover:bg-[#083a73] shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
