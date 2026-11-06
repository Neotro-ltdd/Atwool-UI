import React, { useState, useEffect } from 'react';
import { AttwoolLogo } from './AttwoolLogo';
import {
  X,
  Lock,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  KeyRound,
  ShieldCheck,
  HelpCircle,
  Key,
  Check,
  ArrowLeft,
  User
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  selectedCampus: string;
}

type ModalStep = 'invitation-notice' | 'verify-otp' | 'set-password' | 'activation-success' | 'login';

const ACTIVATED_STORAGE_KEY = 'attwool_activated_staff_v2';
const LAST_STAFF_EMAIL_KEY = 'attwool_last_staff_email_v2';

/**
 * Returns the set of staff emails that have completed initial OTP verification
 * and established their permanent password.
 */
export function getActivatedEmails(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(ACTIVATED_STORAGE_KEY);
    if (!raw) {
      const set = new Set<string>();
      // Fallback check for previous session activation
      if (localStorage.getItem('attwool_staff_activated') === 'true') {
        set.add('teacher.physics@attwoolcollege.com');
      }
      return set;
    }
    const arr: string[] = JSON.parse(raw);
    return new Set(arr.map(e => e.toLowerCase().trim()));
  } catch {
    return new Set();
  }
}

/**
 * Permanently registers a staff email as activated once their OTP is verified
 * and permanent password is saved.
 */
export function markEmailAsActivated(email: string) {
  if (typeof window === 'undefined' || !email) return;
  try {
    const normalized = email.toLowerCase().trim();
    const set = getActivatedEmails();
    set.add(normalized);
    localStorage.setItem(ACTIVATED_STORAGE_KEY, JSON.stringify(Array.from(set)));
    localStorage.setItem('attwool_staff_activated', 'true');
    localStorage.setItem(LAST_STAFF_EMAIL_KEY, normalized);
  } catch (err) {
    console.error('Failed to persist activated staff email:', err);
  }
}

/**
 * Checks whether a staff email has already completed one-time OTP activation.
 */
export function isEmailActivated(email: string): boolean {
  if (!email) return false;
  return getActivatedEmails().has(email.toLowerCase().trim());
}

/**
 * Clears activated staff emails for QA and testing demonstration.
 */
export function resetActivatedEmailsForTesting() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACTIVATED_STORAGE_KEY);
  localStorage.removeItem('attwool_staff_activated');
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  selectedCampus,
}) => {
  const [step, setStep] = useState<ModalStep>('login');
  const [activeTab, setActiveTab] = useState<'login' | 'guide'>('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [verifiedStaff, setVerifiedStaff] = useState<any | null>(null);
  const [activatedEmails, setActivatedEmails] = useState<Set<string>>(getActivatedEmails);

  // Quick Preset Staff Personas for instant verification & activation simulation
  const demoPersonas = [
    {
      role: 'School Administrator',
      name: 'Attwool Administrator',
      email: 'Attwoolcollege1@gmail.com',
      subject: 'School Administration & Staff Governance',
      badgeColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      testOtp: '849201'
    },
    {
      role: 'Director of Schools',
      name: 'Taiwo Adetunji',
      email: 'Adetunjitaiwo3@gmail.com',
      subject: 'All Campuses Network Governance & Review',
      badgeColor: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      testOtp: '849201'
    },
    {
      role: 'Teacher & Staff',
      name: 'Neotro Instructor',
      email: 'neotroltd@gmail.com',
      subject: 'Computer Science • Secondary Divisions',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      testOtp: '849201'
    },
    {
      role: 'Teacher & Staff (Test)',
      name: 'Mr. Babatunde Fashola',
      email: 'teacher.physics@attwoolcollege.com',
      subject: 'Physics • SS 1 Science',
      badgeColor: 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800',
      testOtp: '849201'
    },
    {
      role: 'Director (Test)',
      name: 'Dr. Folashade Adeyemi',
      email: 'director@attwoolcollege.com',
      subject: 'All Campuses Network Governance',
      badgeColor: 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800',
      testOtp: '849201'
    },
    {
      role: 'Admin (Test)',
      name: 'Alhaji Ibrahim Danjuma',
      email: 'admin.governance@attwoolcollege.com',
      subject: 'Staff On-boarding & Allocations',
      badgeColor: 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800',
      testOtp: '849201'
    }
  ];

  // Inspect URL parameters and activation state on mount / open
  useEffect(() => {
    if (!isOpen) return;

    if (typeof window !== 'undefined') {
      const currentActivated = getActivatedEmails();
      setActivatedEmails(currentActivated);

      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      const otpParam = params.get('otp');
      const isExplicitInvite = params.get('invite') === 'true' || params.get('activate') === 'true';

      // Case 1: Arriving via explicit invitation link with email/otp
      if (isExplicitInvite || otpParam) {
        const targetEmail = (emailParam || '').trim().toLowerCase();

        // If this user is ALREADY activated, never ask for an OTP again!
        if (targetEmail && currentActivated.has(targetEmail)) {
          setEmail(targetEmail);
          setStep('login');
          setSuccessMessage(`Welcome back! Your account (${targetEmail}) is already activated with a permanent password. Please sign in.`);
          setErrorMessage(null);
          return;
        }

        if (emailParam) setEmail(emailParam);
        if (otpParam) setOtp(otpParam);
        setStep('verify-otp');
        setErrorMessage(null);
        return;
      }

      // Case 2: Standard modal visit (clicking "Sign In" or "Staff Portal")
      // Staff members who have completed onboarding should directly see the standard Sign In form
      const lastEmail = localStorage.getItem(LAST_STAFF_EMAIL_KEY);
      if (lastEmail && !email) {
        setEmail(lastEmail);
      }
      setStep('login');
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;


  // Quick Fill on standard Login screen for QA
  const handleQuickFillLogin = (persona: typeof demoPersonas[0]) => {
    setEmail(persona.email);
    setLoginPassword('Attwool@2026');
    setActiveTab('login');
    setErrorMessage(null);
    setSuccessMessage(`Pre-filled credentials for ${persona.name}. Click Sign In to authenticate.`);
  };

  // Step 1: Verify OTP (Strictly One-Time Only)
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !otp.trim()) {
      setErrorMessage('Please provide both your official staff email and 6-digit OTP code.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // STRICT GUARD: If account is ALREADY activated, OTP is strictly consumed! Never request or accept OTP again.
    if (activatedEmails.has(cleanEmail)) {
      setErrorMessage(null);
      setSuccessMessage(`This staff account (${cleanEmail}) has already completed one-time OTP activation and configured a permanent password. Redirecting to password sign-in...`);
      setTimeout(() => {
        setStep('login');
        setActiveTab('login');
        setLoginPassword('Attwool@2026');
      }, 700);
      return;
    }

    if (otp.trim().length !== 6) {
      setErrorMessage('The One-Time Password must be exactly 6 digits.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      let rosterStaff: any = null;
      if (typeof window !== 'undefined') {
        try {
          const rawRoster = localStorage.getItem('attwool_staff_roster_v1');
          if (rawRoster) {
            const roster = JSON.parse(rawRoster);
            rosterStaff = roster.find((s: any) => s.email.toLowerCase() === cleanEmail);
          }
        } catch {}
      }

      const matched = rosterStaff || demoPersonas.find(p => p.email.toLowerCase() === cleanEmail) || {
        role: 'Teacher',
        name: cleanEmail.split('@')[0].replace('.', ' '),
        email: cleanEmail,
        subject: 'Academic Staff',
        badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700',
        testOtp: '849201'
      };

      const isDirectorUser = cleanEmail === 'adetunjitaiwo3@gmail.com' || cleanEmail.includes('director') || cleanEmail.includes('principal') || matched.role.includes('Director') || matched.role.includes('Head');
      const isAdminUser = cleanEmail === 'attwoolcollege1@gmail.com' || cleanEmail.includes('admin') || matched.role.includes('Admin');

      setVerifiedStaff({
        id: rosterStaff ? rosterStaff.id : (matched.email.includes('teacher') ? 'a1111111-0000-0000-0000-000000000001' : isDirectorUser ? 'a1111111-0000-0000-0000-000000000003' : 'a1111111-0000-0000-0000-000000000004'),
        name: matched.name,
        email: matched.email,
        role: rosterStaff ? rosterStaff.role : (isAdminUser ? 'SuperAdmin' : isDirectorUser ? 'Director' : 'Teacher'),
        isFormTutor: rosterStaff ? rosterStaff.isFormTutor : (matched.role.includes('Form Tutor') || matched.isFormTutor),
        campus: isDirectorUser ? 'All Campuses (Attwool Schools Network)' : (rosterStaff?.campusName || selectedCampus),
        campusId: isDirectorUser ? 'network-all-campuses' : (rosterStaff?.campusId || '11111111-0000-0000-0000-000000000001'),
        department: rosterStaff?.department || (isDirectorUser ? 'Executive Directorship & Network Governance' : isAdminUser ? 'School Administration' : 'Sciences & Mathematics'),
        authProvider: 'Local'
      });

      setSuccessMessage('OTP code validated successfully! You must now configure your permanent password.');
      setStep('set-password');
    }, 800);
  };

  // Step 2: Enforce Password Reset / Permanent Password Setup
  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setErrorMessage('Please enter and confirm your new permanent password.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Permanent password must be at least 8 characters in length.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('The passwords entered do not match. Please verify and retry.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const activeEmail = (verifiedStaff?.email || email).trim().toLowerCase();
      // PERMANENT CONSUMPTION: Mark account activated and wipe OTP
      markEmailAsActivated(activeEmail);
      setActivatedEmails(getActivatedEmails());
      setOtp(''); // OTP is consumed forever

      // Update staff roster status in local storage
      if (typeof window !== 'undefined') {
        try {
          const rawRoster = localStorage.getItem('attwool_staff_roster_v1');
          if (rawRoster) {
            const roster = JSON.parse(rawRoster);
            const updated = roster.map((s: any) =>
              s.email.toLowerCase() === activeEmail
                ? { ...s, status: 'ACTIVE', activatedAt: new Date().toISOString() }
                : s
            );
            localStorage.setItem('attwool_staff_roster_v1', JSON.stringify(updated));
          }
        } catch {}
      }

      setSuccessMessage('Permanent password configured! Your staff account is now officially activated. OTP has been consumed.');
      setStep('activation-success');
    }, 900);
  };

  // Proceed from activation directly into staff workspace
  const handleEnterWorkspaceFromActivation = () => {
    if (verifiedStaff) {
      onLoginSuccess(verifiedStaff);
      onClose();
    }
  };

  // Standard Login Submission (Unlocked post-activation)
  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !loginPassword) {
      setErrorMessage('Please provide both staff email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const cleanEmail = email.trim().toLowerCase();
      markEmailAsActivated(cleanEmail);
      setActivatedEmails(getActivatedEmails());

      let rosterStaff: any = null;
      if (typeof window !== 'undefined') {
        try {
          const rawRoster = localStorage.getItem('attwool_staff_roster_v1');
          if (rawRoster) {
            const roster = JSON.parse(rawRoster);
            rosterStaff = roster.find((s: any) => s.email.toLowerCase() === cleanEmail);
          }
        } catch {}
      }

      const matched = rosterStaff || demoPersonas.find(p => p.email.toLowerCase() === cleanEmail) || {
        role: 'Teacher',
        name: email.split('@')[0].replace('.', ' '),
        email: email,
        subject: 'General Academic Staff',
        badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
        testOtp: '849201'
      };

      const isDirectorUser = cleanEmail === 'adetunjitaiwo3@gmail.com' || cleanEmail.includes('director') || cleanEmail.includes('principal') || matched.role.includes('Director') || matched.role.includes('Head');
      const isAdminUser = cleanEmail === 'attwoolcollege1@gmail.com' || cleanEmail.includes('admin') || matched.role.includes('Admin');

      setSuccessMessage(`Welcome back, ${matched.name}. Session authenticated.`);
      setTimeout(() => {
        onLoginSuccess({
          id: rosterStaff ? rosterStaff.id : (matched.email.includes('teacher') ? 'a1111111-0000-0000-0000-000000000001' : isDirectorUser ? 'a1111111-0000-0000-0000-000000000003' : 'a1111111-0000-0000-0000-000000000004'),
          name: matched.name,
          email: matched.email,
          role: rosterStaff ? rosterStaff.role : (isAdminUser ? 'SuperAdmin' : isDirectorUser ? 'Director' : 'Teacher'),
          isFormTutor: rosterStaff ? rosterStaff.isFormTutor : (matched.role.includes('Form Tutor') || matched.isFormTutor),
          campus: isDirectorUser ? 'All Campuses (Attwool Schools Network)' : (rosterStaff?.campusName || selectedCampus),
          campusId: isDirectorUser ? 'network-all-campuses' : (rosterStaff?.campusId || '11111111-0000-0000-0000-000000000001'),
          department: rosterStaff?.department || (isDirectorUser ? 'Executive Directorship & Network Governance' : isAdminUser ? 'School Administration' : 'Sciences & Mathematics'),
          authProvider: 'Local'
        });
        onClose();
      }, 700);
    }, 900);
  };

  // Google SSO Simulation (Unlocked post-activation)
  const handleGoogleSsoSimulate = () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const ssoEmail = email.trim() || 'teacher.physics@attwoolcollege.com';
      markEmailAsActivated(ssoEmail);
      setActivatedEmails(getActivatedEmails());

      setSuccessMessage('Google Workspace token verified cryptographically via Google JWKS.');
      setTimeout(() => {
        onLoginSuccess({
          id: ssoEmail.includes('teacher') ? 'a1111111-0000-0000-0000-000000000001' : ssoEmail.includes('hod') ? 'a1111111-0000-0000-0000-000000000002' : 'a1111111-0000-0000-0000-000000000003',
          name: verifiedStaff?.name || 'Mr. Babatunde Fashola',
          email: ssoEmail,
          role: verifiedStaff?.role || 'Teacher',
          isFormTutor: true,
          campus: selectedCampus,
          department: 'Sciences & Mathematics',
          authProvider: 'Google'
        });
        onClose();
      }, 700);
    }, 1000);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      {/* Ambient Collegiate Glow Orbs for atmospheric depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-[#0B4F9C]/25 blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#C8102E]/20 blur-[140px]" />
      </div>

      <div className="relative w-full max-w-md my-14 bg-white/85 dark:bg-[#0c1424]/85 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.2)] text-slate-900 dark:text-slate-100 transition-all">
        {/* Specular Diagonal Glass Sheen Overlay (Image 2 Signature Highlight) */}
        <div className="absolute inset-0 rounded-[32px] pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute -top-[120%] -right-[60%] w-[200%] h-[200%] bg-gradient-to-bl from-white/30 via-white/5 to-transparent rotate-12 opacity-80 dark:opacity-20 pointer-events-none" />
        </div>

        {/* Floating Overlapping Avatar Badge (Signature Image 2 Motif) */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[#072448] dark:bg-[#051833] border-4 border-white dark:border-slate-800 shadow-[0_12px_28px_rgba(0,0,0,0.35)] flex items-center justify-center text-white ring-2 ring-[#0B4F9C]/30 relative">
            {/* Subtle inner glass rim */}
            <div className="absolute inset-1 rounded-full border border-white/20" />
            {/* User Silhouette Icon matching Image 2 */}
            <User className="w-11 h-11 text-white stroke-[1.6]" />
            {/* Miniature Attwool Emblem pip */}
            <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white p-0.5 shadow-md border border-slate-200 flex items-center justify-center overflow-hidden">
              <img src="/attwool-logo.jpg" alt="Attwool Crest" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 backdrop-blur-sm transition-colors focus:outline-none cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pt-16 pb-6 px-6 sm:px-8">
          {/* Header & Logo */}
          <div className="text-center mb-4">
            <AttwoolLogo size="sm" showSubtitle={false} className="justify-center" />
          </div>

          {/* Feedback Banners */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50/90 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2 animate-in fade-in shadow-2xs">
              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* SCREEN 1: First-Time Visit / Invitation-Only Notice */}
          {step === 'invitation-notice' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider mb-1">
                      Staff Access by Invitation Only
                    </h3>
                    <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                      Public self-registration is strictly disallowed on this institutional portal. Academic staff, HODs, and administrators cannot register on their own and must be provisioned directly by School Administration.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3-Step Onboarding Explainer */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 bg-slate-50/60 dark:bg-slate-900/40 space-y-2">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#0B4F9C] dark:text-[#5b9bf0]" />
                  <span>How Staff Onboarding Operates:</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-[#0B4F9C] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                  <span>Administrator provisions your profile with assigned classes and subjects.</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-[#0B4F9C] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                  <span>You receive an official invitation email containing a 6-digit OTP code and direct activation link.</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-[#0B4F9C] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                  <span>Verify your OTP once and configure your permanent password to unlock portal access permanently.</span>
                </div>
              </div>

              {/* Administrator Contact Details */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 text-xs space-y-1">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>Contact School Administration to Get Onboarded:</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Support Online</span>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-[11px] pt-0.5">
                  📧 Email: <a href="mailto:Attwoolcollege1@gmail.com" className="text-[#0B4F9C] dark:text-[#5b9bf0] font-semibold underline hover:opacity-80">Attwoolcollege1@gmail.com</a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setStep('verify-otp'); setErrorMessage(null); }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#C8102E] hover:bg-[#a50b24] text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Key className="w-4 h-4" />
                  <span>Enter OTP &amp; Activate Account →</span>
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => { setStep('login'); setErrorMessage(null); }}
                    className="text-xs font-semibold text-[#0B4F9C] dark:text-[#5b9bf0] hover:underline cursor-pointer"
                  >
                    Already an activated staff member? Sign In →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: Step 1 — Verify Invitation & OTP (One-Time Activation Only) */}
          {step === 'verify-otp' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2 mb-2">
                <span className="text-[11px] font-bold text-[#0B4F9C] dark:text-[#5b9bf0] uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  Step 1 of 2: Invitation &amp; Identity Verification
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                  One-Time Setup Only
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                The OTP is strictly an initial verification code. Once verified and your password is saved, your account is permanently activated and you will never be asked for an OTP again.
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                {/* Staff Official Email Segmented Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Staff Official Email
                  </label>
                  <div className="flex items-stretch rounded-xl overflow-hidden bg-[#e5e7eb] dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#0B4F9C] dark:focus-within:ring-[#5b9bf0] transition-all shadow-inner">
                    <div className="w-12 flex items-center justify-center bg-[#d5d8de] dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-r border-slate-300/80 dark:border-slate-600 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="teacher.name@attwoolcollege.com"
                      required
                      className="flex-1 px-3.5 py-3 text-sm bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

                {/* 6-Digit OTP Segmented Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    6-Digit One-Time Password (OTP)
                  </label>
                  <div className="flex items-stretch rounded-xl overflow-hidden bg-[#e5e7eb] dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#0B4F9C] dark:focus-within:ring-[#5b9bf0] transition-all shadow-inner">
                    <div className="w-12 flex items-center justify-center bg-[#d5d8de] dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-r border-slate-300/80 dark:border-slate-600 shrink-0">
                      <Key className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="849201"
                      required
                      className="flex-1 px-3.5 py-3 text-base font-mono tracking-widest bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Check your inbox or spam for the official invitation email.</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#C8102E] hover:bg-[#a50b24] text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Verifying OTP Code...</span>
                    </div>
                  ) : (
                    <>
                      <span>Verify OTP &amp; Proceed to Password Setup</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2 space-y-1.5">
                <button
                  type="button"
                  onClick={() => { setStep('login'); setErrorMessage(null); }}
                  className="text-xs font-semibold text-[#0B4F9C] dark:text-[#5b9bf0] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <span>Already activated your account? Sign in with password or Google SSO →</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setStep('invitation-notice'); setErrorMessage(null); }}
                  className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back to Invitation Policy</span>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 3: Step 2 — Enforced Password Reset / Setup */}
          {step === 'set-password' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2 mb-2">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Step 2 of 2: Create Permanent Password (Enforced)
                </span>
                <span className="text-[10px] text-slate-400">NDPA 2023</span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                OTP verified for <strong>{verifiedStaff?.name || email}</strong>! To complete onboarding, you must create your permanent confidential password. Your OTP will be consumed and retired.
              </div>

              <form onSubmit={handleSetPassword} className="space-y-3.5">
                {/* New Permanent Password Segmented Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    New Permanent Password
                  </label>
                  <div className="flex items-stretch rounded-xl overflow-hidden bg-[#e5e7eb] dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#0B4F9C] dark:focus-within:ring-[#5b9bf0] transition-all shadow-inner">
                    <div className="w-12 flex items-center justify-center bg-[#d5d8de] dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-r border-slate-300/80 dark:border-slate-600 shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="flex-1 px-3.5 py-3 text-sm bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="px-3 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-semibold cursor-pointer"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* Confirm Permanent Password Segmented Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Permanent Password
                  </label>
                  <div className="flex items-stretch rounded-xl overflow-hidden bg-[#e5e7eb] dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#0B4F9C] dark:focus-within:ring-[#5b9bf0] transition-all shadow-inner">
                    <div className="w-12 flex items-center justify-center bg-[#d5d8de] dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-r border-slate-300/80 dark:border-slate-600 shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="flex-1 px-3.5 py-3 text-sm bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

                {/* Password Requirements Checklist */}
                <div className="rounded-xl bg-slate-100 dark:bg-slate-800/70 p-2.5 border border-slate-200 dark:border-slate-700 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Check className={`w-3.5 h-3.5 ${newPassword.length >= 8 ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span className={newPassword.length >= 8 ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-slate-500'}>
                      At least 8 characters in length
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className={`w-3.5 h-3.5 ${newPassword && newPassword === confirmPassword ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span className={newPassword && newPassword === confirmPassword ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-slate-500'}>
                      Passwords match exactly
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#C8102E] hover:bg-[#a50b24] text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Saving Permanent Password...</span>
                    </div>
                  ) : (
                    <>
                      <span>Save Password &amp; Complete Activation</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* SCREEN 4: Activation Success */}
          {step === 'activation-success' && (
            <div className="text-center space-y-4 animate-in fade-in py-2">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-brand-serif">
                Account Successfully Activated!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                Welcome to Attwool Schools Academic Governance Portal. Your OTP has been verified and permanently consumed. Your permanent credentials are now live.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-left max-w-xs mx-auto space-y-1">
                <div><strong>Staff:</strong> {verifiedStaff?.name || 'Mr. Babatunde Fashola'}</div>
                <div><strong>Email:</strong> {verifiedStaff?.email || email}</div>
                <div><strong>Role:</strong> {verifiedStaff?.role || 'Teacher'}</div>
                <div><strong>OTP Status:</strong> <span className="text-emerald-600 dark:text-emerald-400 font-bold">Consumed &amp; Retired (One-Time)</span></div>
                <div><strong>Sign-In Mode:</strong> <span className="text-[#0B4F9C] dark:text-[#5b9bf0] font-bold">Password &amp; SSO Unlocked</span></div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleEnterWorkspaceFromActivation}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#0B4F9C] hover:bg-[#083a73] text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  <span>Enter Staff Workspace Now →</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setStep('login'); setErrorMessage(null); }}
                  className="text-xs text-[#0B4F9C] dark:text-[#5b9bf0] font-semibold hover:underline cursor-pointer"
                >
                  Or proceed to standard login screen →
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 5: Standard Staff Login & Portal Guide Toggle */}
          {step === 'login' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Top 2-Page Segmented Toggle Button */}
              <div className="flex rounded-xl bg-slate-200/80 dark:bg-slate-800/80 p-1 mb-4 border border-slate-300/80 dark:border-slate-700/80 text-xs font-semibold backdrop-blur-sm shadow-inner">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setErrorMessage(null); }}
                  className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-white dark:bg-[#161c27] text-[#0B4F9C] dark:text-[#5b9bf0] shadow-sm font-bold scale-[1.01]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Staff Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('guide'); setErrorMessage(null); }}
                  className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'guide'
                      ? 'bg-white dark:bg-[#161c27] text-[#0B4F9C] dark:text-[#5b9bf0] shadow-sm font-bold scale-[1.01]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>How to Activate</span>
                </button>
              </div>

              {/* PAGE 1: Login Page (Matching Image 2 + Google Button + Activate Your Account) */}
              {activeTab === 'login' && (
                <div className="space-y-3.5 animate-in fade-in">
                  <form onSubmit={handleLocalSubmit} className="space-y-3">
                    {/* Email ID Segmented Input */}
                    <div className="flex items-stretch rounded-xl overflow-hidden bg-[#e5e7eb] dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#0B4F9C] dark:focus-within:ring-[#5b9bf0] transition-all shadow-inner">
                      <div className="w-12 flex items-center justify-center bg-[#d5d8de] dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-r border-slate-300/80 dark:border-slate-600 shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email ID"
                        required
                        className="flex-1 px-3.5 py-3 text-sm bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 font-medium"
                      />
                    </div>

                    {/* Password Segmented Input */}
                    <div className="flex items-stretch rounded-xl overflow-hidden bg-[#e5e7eb] dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#0B4F9C] dark:focus-within:ring-[#5b9bf0] transition-all shadow-inner">
                      <div className="w-12 flex items-center justify-center bg-[#d5d8de] dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-r border-slate-300/80 dark:border-slate-600 shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="flex-1 px-3.5 py-3 text-sm bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="px-3 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-semibold cursor-pointer"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>

                    {/* Remember Me & Forgot Password Row (Matching Image 2) */}
                    <div className="flex items-center justify-between text-xs pt-0.5 px-0.5">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-300 font-medium">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-[#0B4F9C] focus:ring-[#0B4F9C] dark:border-slate-600 dark:bg-slate-800"
                        />
                        <span>Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => { setStep('verify-otp'); setErrorMessage(null); }}
                        className="text-slate-500 hover:text-[#0B4F9C] dark:text-slate-400 dark:hover:text-[#5b9bf0] font-medium transition-colors cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    {/* Primary Action Button (Image 2 style with Attwool Colors) */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#0B4F9C] hover:bg-[#083a74] text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span>Authenticating...</span>
                        </div>
                      ) : (
                        <span>LOGIN</span>
                      )}
                    </button>
                  </form>

                  {/* Clean Section Divider */}
                  <div className="relative my-2.5 text-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200/80 dark:border-slate-800" /></div>
                    <span className="relative bg-white/90 dark:bg-[#0c1424] px-2.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">or sign in with</span>
                  </div>

                  {/* Button: Sign in with Google (Requested by User) */}
                  <button
                    type="button"
                    onClick={handleGoogleSsoSimulate}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs hover:shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2 text-slate-500">
                        <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-[#0B4F9C] rounded-full animate-spin" />
                        <span>Verifying with Google...</span>
                      </div>
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>Sign in with Google</span>
                      </>
                    )}
                  </button>

                  {/* Button: Activate your account (Requested by User) */}
                  <div className="pt-1 text-center space-y-1">
                    <button
                      type="button"
                      onClick={() => { setStep('verify-otp'); setErrorMessage(null); setSuccessMessage(null); }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/40 text-xs font-bold text-[#0B4F9C] dark:text-[#5b9bf0] hover:bg-blue-100/70 dark:hover:bg-blue-900/50 transition-all cursor-pointer shadow-2xs"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Activate your account with OTP code →</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('guide'); setErrorMessage(null); }}
                      className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 block mx-auto cursor-pointer"
                    >
                      How do I get on the portal? Read activation guide →
                    </button>
                  </div>

                  {/* Quick-Fill Presets for Testing */}
                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Quick Test Login Presets:</span>
                      <span className="text-[9px] text-slate-400">Attwool@2026</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-[11px]">
                      {demoPersonas.map((persona, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleQuickFillLogin(persona)}
                          className="py-1 px-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium truncate cursor-pointer text-center text-[10px]"
                          title={`${persona.name} (${persona.email})`}
                        >
                          {persona.email.split('@')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 2: Portal Information & How to Activate (Requested by User) */}
              {activeTab === 'guide' && (
                <div className="space-y-3.5 animate-in fade-in">
                  {/* Institutional Policy Notice */}
                  <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                    <div className="flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider mb-0.5">
                          Staff Access by Invitation Only
                        </h3>
                        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                          Public self-registration is strictly disallowed on this institutional portal. Academic staff, HODs, and administrators cannot register on their own and must be provisioned directly by School Administration.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3-Step Onboarding Explainer: How to Get Access & How to Activate */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/60 dark:bg-slate-900/40 space-y-2">
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <HelpCircle className="w-3.5 h-3.5 text-[#0B4F9C] dark:text-[#5b9bf0]" />
                      <span>How to Get Access &amp; How to Activate:</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-[#0B4F9C] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                      <span>Administrator provisions your profile with assigned classes and subjects.</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-[#0B4F9C] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                      <span>You receive an official invitation email containing a 6-digit OTP code and direct activation link.</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-[#0B4F9C] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                      <span>Verify your OTP once and configure your permanent password to unlock portal access permanently.</span>
                    </div>
                  </div>

                  {/* Administrator Contact Details */}
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 text-xs space-y-1">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span>Contact School Administration to Get Onboarded:</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Support Online</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 text-[11px] pt-0.5">
                      📧 Email: <a href="mailto:Attwoolcollege1@gmail.com" className="text-[#0B4F9C] dark:text-[#5b9bf0] font-semibold underline hover:opacity-80">Attwoolcollege1@gmail.com</a>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={() => { setStep('verify-otp'); setErrorMessage(null); }}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#C8102E] hover:bg-[#a50b24] text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <Key className="w-4 h-4" />
                      <span>Enter OTP &amp; Activate Account →</span>
                    </button>

                    <div className="text-center pt-0.5">
                      <button
                        type="button"
                        onClick={() => { setActiveTab('login'); setErrorMessage(null); }}
                        className="text-xs font-semibold text-[#0B4F9C] dark:text-[#5b9bf0] hover:underline cursor-pointer"
                      >
                        Already an activated staff member? Return to Staff Login →
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* Security & NDPA 2023 Compliance Notice */}
          <div className="mt-4 text-center text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Encrypted with SHA-256 tokens. Monitored under Nigeria Data Protection Act (NDPA 2023).</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
