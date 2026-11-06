import React, { useState } from 'react';
import type { StaffMember, Campus, UserSession, SystemRole, Faculty, AcademicClass } from '../../types';
import { defaultFaculties, defaultAcademicClasses } from '../../data/mockData';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  GraduationCap,
  Award,
  BookOpen,
  Mail,
  Phone,
  Copy,
  Check,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  ShieldCheck,
  Plus
} from 'lucide-react';

interface StaffOnboardingProps {
  staffList: StaffMember[];
  campuses: Campus[];
  currentUser: UserSession;
  onOnboardStaff: (staff: StaffMember) => void;
  onUpdateStaff: (staff: StaffMember) => void;
  onDeleteStaff: (staffId: string) => void;
  faculties?: Faculty[];
  academicClasses?: AcademicClass[];
}

const COMMON_DEPARTMENTS = [
  'Sciences & Mathematics',
  'Arts & Humanities',
  'Commercial & Social Sciences',
  'Languages & Linguistics',
  'Vocational & Technology',
  'Primary & Early Years',
  'School Administration & Governance'
];

export const STRUCTURED_SUBJECTS = {
  'Senior Secondary': [
    'English Language (SSS)',
    'Literature-in-English',
    'General Mathematics (SSS)',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
    'Government',
    'Financial Accounting',
    'Commerce',
    'Civic Education (SSS)',
    'Agricultural Science (SSS)',
    'Further Mathematics',
    'Technical Drawing',
    'Geography'
  ],
  'Junior Secondary': [
    'English Language (JSS)',
    'General Mathematics (JSS)',
    'Basic Science',
    'Basic Technology',
    'Business Studies',
    'Social Studies',
    'Civic Education (JSS)',
    'Computer Studies / ICT',
    'French (JSS)',
    'Agricultural Science (JSS)',
    'Physical & Health Education (PHE)'
  ],
  'Primary School': [
    'English Studies & Grammar',
    'Phonics & Diction',
    'Primary Mathematics',
    'Basic Science & Technology (Primary)',
    'Social Studies (Primary)',
    'Verbal Reasoning',
    'Quantitative Reasoning',
    'French (Primary)',
    'ICT / Computer Studies (Primary)',
    'Civic Education (Primary)',
    'Christian Religious Studies (CRS)',
    'Islamic Religious Studies (IRS)',
    'Handwriting & Creative Arts'
  ],
  'Nursery & Early Years': [
    'Early Literacy & Letter Sounds',
    'Numeracy & Number Work',
    'Sensory & Motor Skills',
    'Rhymes & Storytelling',
    'Social Habits & Etiquette',
    'Creative Arts & Colouring'
  ]
};

export const STRUCTURED_CLASSES = {
  'Senior Secondary': [
    'SS 1 Science',
    'SS 1 Arts',
    'SS 1 Commercial',
    'SS 2 Science',
    'SS 2 Arts',
    'SS 2 Commercial',
    'SS 3 Science',
    'SS 3 Arts',
    'SS 3 Commercial'
  ],
  'Junior Secondary': [
    'JSS 1 Gold',
    'JSS 1 Diamond',
    'JSS 2 Diamond',
    'JSS 2 Emerald',
    'JSS 3 Gold',
    'JSS 3 Platinum'
  ],
  'Primary School': [
    'Primary 1 Gold',
    'Primary 2 Diamond',
    'Primary 3 Sapphire',
    'Primary 4 Emerald',
    'Primary 5 Ruby',
    'Primary 6 Platinum'
  ],
  'Nursery & Early Years': [
    'Crèche / Playgroup',
    'Nursery 1 Diamond',
    'Nursery 2 Gold',
    'Reception / KG Sapphire'
  ]
};

export const PRESET_SUBJECTS = [
  ...STRUCTURED_SUBJECTS['Senior Secondary'],
  ...STRUCTURED_SUBJECTS['Junior Secondary'],
  ...STRUCTURED_SUBJECTS['Primary School'],
  ...STRUCTURED_SUBJECTS['Nursery & Early Years']
];

export const PRESET_CLASSES = [
  ...STRUCTURED_CLASSES['Senior Secondary'],
  ...STRUCTURED_CLASSES['Junior Secondary'],
  ...STRUCTURED_CLASSES['Primary School'],
  ...STRUCTURED_CLASSES['Nursery & Early Years']
];

export type AcademicDivisionTier = 'All' | 'Senior Secondary' | 'Junior Secondary' | 'Primary School' | 'Nursery & Early Years';

export const StaffOnboarding: React.FC<StaffOnboardingProps> = ({
  staffList,
  campuses,
  currentUser: _currentUser,
  onOnboardStaff,
  onUpdateStaff,
  onDeleteStaff,
  faculties = defaultFaculties,
  academicClasses = defaultAcademicClasses
}) => {
  // Derive dynamic subjects, classes, and departments from setup props
  const dynamicDepartments = React.useMemo(() => {
    const depts = (faculties || []).map((f) => f.name);
    return depts.length > 0 ? depts : COMMON_DEPARTMENTS;
  }, [faculties]);

  const dynamicStructuredSubjects = React.useMemo(() => {
    const map: Record<string, string[]> = {
      'Senior Secondary': [],
      'Junior Secondary': [],
      'Primary School': [],
      'Nursery & Early Years': []
    };
    (faculties || []).forEach((fac) => {
      if (fac.category === 'Cross-Cutting') {
        Object.keys(map).forEach((key) => map[key].push(...fac.subjects));
      } else if (map[fac.category]) {
        map[fac.category].push(...fac.subjects);
      }
    });
    // Deduplicate within each tier
    Object.keys(map).forEach((key) => {
      map[key] = Array.from(new Set(map[key]));
      if (map[key].length === 0 && STRUCTURED_SUBJECTS[key as keyof typeof STRUCTURED_SUBJECTS]) {
        map[key] = STRUCTURED_SUBJECTS[key as keyof typeof STRUCTURED_SUBJECTS];
      }
    });
    return map;
  }, [faculties]);

  const dynamicAllSubjects = React.useMemo(() => {
    const all = Array.from(new Set((faculties || []).flatMap((f) => f.subjects)));
    return all.length > 0 ? all : PRESET_SUBJECTS;
  }, [faculties]);

  const dynamicStructuredClasses = React.useMemo(() => {
    const map: Record<string, string[]> = {
      'Senior Secondary': [],
      'Junior Secondary': [],
      'Primary School': [],
      'Nursery & Early Years': []
    };
    (academicClasses || []).forEach((c) => {
      if (map[c.tier]) {
        map[c.tier].push(c.name);
      }
    });
    // Deduplicate and fallback
    Object.keys(map).forEach((key) => {
      map[key] = Array.from(new Set(map[key]));
      if (map[key].length === 0 && STRUCTURED_CLASSES[key as keyof typeof STRUCTURED_CLASSES]) {
        map[key] = STRUCTURED_CLASSES[key as keyof typeof STRUCTURED_CLASSES];
      }
    });
    return map;
  }, [academicClasses]);

  const dynamicAllClasses = React.useMemo(() => {
    const all = Array.from(new Set((academicClasses || []).map((c) => c.name)));
    return all.length > 0 ? all : PRESET_CLASSES;
  }, [academicClasses]);

  // Filtering & search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampusFilter, setSelectedCampusFilter] = useState('ALL');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  // Modal states
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selected item states
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Form states for Create / Edit
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCampusId, setFormCampusId] = useState(campuses[0]?.id || '');
  const [formRole, setFormRole] = useState<SystemRole>('Teacher');
  const [formDepartment, setFormDepartment] = useState(COMMON_DEPARTMENTS[0]);
  const [formSubjects, setFormSubjects] = useState<string[]>([]);
  const [formClasses, setFormClasses] = useState<string[]>([]);
  const [formIsFormTutor, setFormIsFormTutor] = useState(false);
  const [formFormTutorClass, setFormFormTutorClass] = useState('');
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [customClassInput, setCustomClassInput] = useState('');
  const [subjectTierTab, setSubjectTierTab] = useState<AcademicDivisionTier>('All');
  const [classTierTab, setClassTierTab] = useState<AcademicDivisionTier>('All');
  const [formError, setFormError] = useState<string | null>(null);

  // Computed telemetry metrics
  const totalStaffCount = staffList.length;
  const activeTeachersCount = staffList.filter((s) => s.status === 'ACTIVE' && (s.role === 'Teacher' || s.role === 'FormTutor')).length;
  const formTutorsCount = staffList.filter((s) => s.isFormTutor).length;
  const pendingActivationsCount = staffList.filter((s) => s.status === 'PENDING_ACTIVATION').length;

  // Filtered staff list
  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.subjects.some((sub) => sub.toLowerCase().includes(searchTerm.toLowerCase())) ||
      staff.classes.some((cls) => cls.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCampus =
      selectedCampusFilter === 'ALL' || staff.campusId === selectedCampusFilter || staff.campusName.includes(selectedCampusFilter);

    const matchesRole =
      selectedRoleFilter === 'ALL' ||
      (selectedRoleFilter === 'FormTutor' ? staff.isFormTutor : staff.role === selectedRoleFilter);

    const matchesStatus = selectedStatusFilter === 'ALL' || staff.status === selectedStatusFilter;

    return matchesSearch && matchesCampus && matchesRole && matchesStatus;
  });

  // Open Onboard Modal
  const handleOpenOnboard = () => {
    setFormFirstName('');
    setFormLastName('');
    setFormEmail('');
    setFormPhone('');
    setFormCampusId(campuses[0]?.id || '');
    setFormRole('Teacher');
    setFormDepartment(dynamicDepartments[0] || COMMON_DEPARTMENTS[0]);
    setFormSubjects([dynamicAllSubjects[0] || 'English Language (SSS)']);
    setFormClasses([dynamicAllClasses[0] || 'SS 1 Science']);
    setFormIsFormTutor(false);
    setFormFormTutorClass('');
    setCustomSubjectInput('');
    setCustomClassInput('');
    setSubjectTierTab('All');
    setClassTierTab('All');
    setFormError(null);
    setIsOnboardModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setFormFirstName(staff.firstName);
    setFormLastName(staff.lastName);
    setFormEmail(staff.email);
    setFormPhone(staff.phoneNumber || '');
    setFormCampusId(staff.campusId);
    setFormRole(staff.role);
    setFormDepartment(staff.department);
    setFormSubjects([...staff.subjects]);
    setFormClasses([...staff.classes]);
    setFormIsFormTutor(staff.isFormTutor);
    setFormFormTutorClass(staff.formTutorClass || '');
    setCustomSubjectInput('');
    setCustomClassInput('');
    setSubjectTierTab('All');
    setClassTierTab('All');
    setFormError(null);
    setIsEditModalOpen(true);
  };

  // Open Invite / Credentials Modal
  const handleOpenInvite = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setCopiedLink(false);
    setCopiedOtp(false);
    setIsInviteModalOpen(true);
  };

  // Toggle subject selection
  const handleToggleSubject = (subject: string) => {
    setFormSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  // Add custom subject
  const handleAddCustomSubject = () => {
    const trimmed = customSubjectInput.trim();
    if (trimmed && !formSubjects.includes(trimmed)) {
      setFormSubjects((prev) => [...prev, trimmed]);
      setCustomSubjectInput('');
    }
  };

  // Toggle class selection
  const handleToggleClass = (cls: string) => {
    setFormClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  };

  // Add custom class
  const handleAddCustomClass = () => {
    const trimmed = customClassInput.trim();
    if (trimmed && !formClasses.includes(trimmed)) {
      setFormClasses((prev) => [...prev, trimmed]);
      setCustomClassInput('');
    }
  };

  // Submit Onboard Staff
  const handleSubmitOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFirstName.trim() || !formLastName.trim() || !formEmail.trim()) {
      setFormError('First name, last name, and staff email are mandatory.');
      return;
    }

    if (staffList.some((s) => s.email.toLowerCase() === formEmail.trim().toLowerCase())) {
      setFormError(`A faculty member with email "${formEmail.trim()}" is already registered.`);
      return;
    }

    const assignedCampus = campuses.find((c) => c.id === formCampusId) || campuses[0];
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const fullName = `${formFirstName.trim()} ${formLastName.trim()}`;

    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      firstName: formFirstName.trim(),
      lastName: formLastName.trim(),
      name: fullName,
      email: formEmail.trim().toLowerCase(),
      phoneNumber: formPhone.trim() || undefined,
      role: formIsFormTutor ? 'FormTutor' : formRole,
      campusId: assignedCampus ? assignedCampus.id : '11111111-0000-0000-0000-000000000001',
      campusName: assignedCampus ? assignedCampus.name : 'Attwool College, Awoyaya',
      department: formDepartment,
      subjects: formSubjects.length > 0 ? formSubjects : ['General Academics'],
      classes: formClasses.length > 0 ? formClasses : ['General'],
      isFormTutor: formIsFormTutor,
      formTutorClass: formIsFormTutor ? (formFormTutorClass.trim() || formClasses[0] || 'SS 1 Science') : undefined,
      status: 'PENDING_ACTIVATION',
      invitedAt: new Date().toISOString(),
      tempOtp: generatedOtp
    };

    onOnboardStaff(newStaff);
    setIsOnboardModalOpen(false);
    // Directly show invitation details so the admin can copy credentials
    handleOpenInvite(newStaff);
  };

  // Submit Update Staff
  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;

    if (!formFirstName.trim() || !formLastName.trim()) {
      setFormError('First name and last name are required.');
      return;
    }

    const assignedCampus = campuses.find((c) => c.id === formCampusId) || campuses[0];
    const fullName = `${formFirstName.trim()} ${formLastName.trim()}`;

    const updated: StaffMember = {
      ...selectedStaff,
      firstName: formFirstName.trim(),
      lastName: formLastName.trim(),
      name: fullName,
      phoneNumber: formPhone.trim() || undefined,
      role: formIsFormTutor ? 'FormTutor' : formRole,
      campusId: assignedCampus ? assignedCampus.id : selectedStaff.campusId,
      campusName: assignedCampus ? assignedCampus.name : selectedStaff.campusName,
      department: formDepartment,
      subjects: formSubjects.length > 0 ? formSubjects : ['General Academics'],
      classes: formClasses.length > 0 ? formClasses : ['General'],
      isFormTutor: formIsFormTutor,
      formTutorClass: formIsFormTutor ? (formFormTutorClass.trim() || formClasses[0] || 'SS 1 Science') : undefined
    };

    onUpdateStaff(updated);
    setIsEditModalOpen(false);
    setSelectedStaff(null);
  };

  // Generate Invite URL
  const getInviteUrl = (staff: StaffMember) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5180';
    return `${origin}?invite=true&email=${encodeURIComponent(staff.email)}&otp=${staff.tempOtp || '849201'}`;
  };

  const handleCopyInviteLink = (staff: StaffMember) => {
    const link = getInviteUrl(staff);
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopyOtp = (otp: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* 1. TOP HERO HEADER (Matching Image 2 clean style) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-[#e6e3dd] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B4F9C] mb-1">
            <Users className="w-4 h-4" />
            <span>Academic Faculty Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-brand-serif">
            Staff Onboarding & Role Allocations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Invite new teachers, assign campuses, departments, curriculum subjects, classes, and Form Tutor responsibilities across the Attwool school group.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenOnboard}
          className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-[#1e293b] hover:bg-[#0f172a] text-white text-xs sm:text-sm font-bold shadow-sm transition-all hover:shadow cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4 text-emerald-400" />
          <span>+ Onboard New Staff</span>
        </button>
      </div>

      {/* 2. TELEMETRY METRIC CARDS (4-Column Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Faculty */}
        <div className="bg-white p-5 rounded-2xl border border-[#e6e3dd] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Faculty</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0B4F9C] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalStaffCount}</div>
          <div className="text-[11px] text-slate-500 font-medium">Provisioned across 4 campuses</div>
        </div>

        {/* Card 2: Active Teachers */}
        <div className="bg-white p-5 rounded-2xl border border-[#e6e3dd] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Teachers</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{activeTeachersCount}</div>
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Activated & submitting reports</span>
          </div>
        </div>

        {/* Card 3: Form Tutors */}
        <div className="bg-white p-5 rounded-2xl border border-[#e6e3dd] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Form Tutors</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{formTutorsCount}</div>
          <div className="text-[11px] text-purple-700 font-medium">Assigned pastoral class welfare</div>
        </div>

        {/* Card 4: Pending Activations */}
        <div className="bg-white p-5 rounded-2xl border border-[#e6e3dd] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Activations</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900">{pendingActivationsCount}</div>
          <div className="text-[11px] text-amber-700 font-medium">Awaiting one-time OTP login</div>
        </div>
      </div>

      {/* 3. FILTER, SEARCH & CONTROLS BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e6e3dd] shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by faculty name, email, subject, or class allocation..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e6e3dd] text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-[#fbfaf8]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold px-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Campus Filter */}
          <select
            value={selectedCampusFilter}
            onChange={(e) => setSelectedCampusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="ALL">All Campuses</option>
            {campuses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name.replace('Attwool ', '')}
              </option>
            ))}
          </select>

          {/* Role Filter */}
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            <option value="Teacher">Subject Teacher</option>
            <option value="FormTutor">Form Tutor</option>
            <option value="Director">School Director</option>
            <option value="SuperAdmin">Administrator</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING_ACTIVATION">Pending Activation</option>
          </select>
        </div>
      </div>

      {/* 4. FACULTY ROSTER TABLE / LIST */}
      <div className="bg-white rounded-2xl border border-[#e6e3dd] shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#e6e3dd] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Enrolled Faculty Members</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
              {filteredStaff.length}
            </span>
          </div>
          <span className="text-xs text-slate-400">Click invitation icon to view & copy OTP / direct link</span>
        </div>

        {filteredStaff.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-slate-700">No faculty members found</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search query or filters, or onboard a new staff member using the button above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#e6e3dd]">
            {filteredStaff.map((staff) => {
              const isPending = staff.status === 'PENDING_ACTIVATION';

              return (
                <div
                  key={staff.id}
                  className="p-5 hover:bg-[#fbfaf8] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left Column: Staff Persona Info */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 text-[#0B4F9C] font-bold flex items-center justify-center shrink-0 text-sm shadow-2xs">
                      {staff.firstName[0]}
                      {staff.lastName[0]}
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{staff.name}</span>

                        {/* Status Badge */}
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            <span>Pending Activation</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Active</span>
                          </span>
                        )}

                        {/* Form Tutor Badge */}
                        {staff.isFormTutor && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            <Award className="w-3 h-3" />
                            <span>Form Tutor / Class Teacher: {staff.formTutorClass || 'Assigned'}</span>
                          </span>
                        )}
                      </div>

                      {/* Contact & Campus Subtitle */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1 text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{staff.email}</span>
                        </span>
                        {staff.phoneNumber && (
                          <span className="flex items-center gap-1 text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{staff.phoneNumber}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[#0B4F9C] font-medium">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{staff.campusName.split(',')[0]}</span>
                        </span>
                      </div>

                      {/* Allocations: Department, Subjects, Classes */}
                      <div className="pt-1 flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {staff.department}
                        </span>

                        {/* Subject Chips */}
                        {staff.subjects.map((sub, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200"
                          >
                            <BookOpen className="w-3 h-3 text-blue-600" />
                            <span>{sub}</span>
                          </span>
                        ))}

                        {/* Class Chips */}
                        {staff.classes.map((cls, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-slate-700 border border-[#e6e3dd]"
                          >
                            <GraduationCap className="w-3 h-3 text-slate-400" />
                            <span>{cls}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                    {/* View / Copy Invitation */}
                    <button
                      type="button"
                      onClick={() => handleOpenInvite(staff)}
                      title="View invitation credentials & copy activation link"
                      className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-blue-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-blue-600" />
                      <span>{isPending ? 'Invitation Link & OTP' : 'Credentials'}</span>
                    </button>

                    {/* Edit Allocations */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(staff)}
                      title="Edit role, subjects, or class allocations"
                      className="p-2 rounded-xl border border-[#e6e3dd] text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Staff */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStaff(staff);
                        setIsDeleteModalOpen(true);
                      }}
                      title="Remove staff member"
                      className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL 1: ONBOARD NEW STAFF MODAL */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e6e3dd] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-[#e6e3dd] flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0B4F9C] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Onboard New Faculty Member</h3>
                  <p className="text-xs text-slate-500">Provision account, assign campus, subjects, and Form Tutor duties</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOnboardModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitOnboard} className="p-6 space-y-5">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {formError}
                </div>
              )}

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                    placeholder="e.g. Babatunde"
                    className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    placeholder="e.g. Fashola"
                    className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Staff Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. b.fashola@attwoolcollege.com"
                    className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="e.g. +234 803 123 4567"
                    className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Campus & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assigned Campus <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formCampusId}
                    onChange={(e) => setFormCampusId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {campuses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {dynamicDepartments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role & Form Tutor / Class Teacher Allocation */}
              <div className="p-4 rounded-xl bg-[#fbfaf8] border border-[#e6e3dd] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Staff Designation</label>
                    <select
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs sm:text-sm text-slate-900 bg-white focus:outline-none"
                    >
                      <option value="Teacher">Subject Teacher / Faculty</option>
                      <option value="FormTutor">Form Tutor / Class Teacher</option>
                      <option value="Director">School Director</option>
                      <option value="SuperAdmin">Administrator</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-white transition-colors">
                      <input
                        type="checkbox"
                        checked={formIsFormTutor}
                        onChange={(e) => setFormIsFormTutor(e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-slate-300"
                      />
                      <span className="text-xs font-bold text-slate-800">Assign Form Tutor / Class Teacher Duties</span>
                    </label>
                  </div>
                </div>

                {formIsFormTutor ? (
                  <div className="space-y-3 pt-2 border-t border-slate-200 animate-in fade-in">
                    <div>
                      <label className="block text-xs font-bold text-purple-900 mb-1">
                        Designated Pastoral Homeroom Class <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formFormTutorClass}
                        onChange={(e) => setFormFormTutorClass(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none"
                      >
                        <option value="">Select Homeroom Class...</option>
                        {Object.entries(dynamicStructuredClasses).map(([tierName, classList]) => (
                          <optgroup key={tierName} label={tierName}>
                            {classList.map((cls) => (
                              <option key={cls} value={cls}>
                                {cls}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs">
                      <div className="font-bold flex items-center gap-1.5 text-purple-950">
                        <Users className="w-3.5 h-3.5 text-purple-700" />
                        <span>Form Tutor (Secondary) / Class Teacher (Primary & Nursery) Mode</span>
                      </div>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-purple-800">
                        In addition to teaching syllabus curriculum, this educator holds pastoral guardianship over <strong>{formFormTutorClass || 'their designated class'}</strong>. Weekly reporting activates daily roll-call attendance, absent pupil follow-up, and NDPA 2023 confidential student safeguarding.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-600 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span><strong>Subject Teacher Only:</strong> Reports strictly on syllabus topics covered, lesson notes prepared, continuous assessments, and academic comprehension across assigned classes.</span>
                  </div>
                )}
              </div>

              {/* Subject Allocations with Division Tabs */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Assigned Teaching Subjects ({formSubjects.length} selected)
                  </label>
                  <span className="text-[10px] text-slate-500">
                    Filter by division to assign cross-tier subjects (e.g. English across SSS, JSS, and Primary)
                  </span>
                </div>

                {/* Division Tabs */}
                <div className="flex flex-wrap items-center gap-1 mb-2 p-1 bg-slate-100 rounded-lg">
                  {(['All', 'Senior Secondary', 'Junior Secondary', 'Primary School', 'Nursery & Early Years'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSubjectTierTab(tier)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                        subjectTierTab === tier
                          ? 'bg-white text-blue-700 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2 max-h-36 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-white">
                  {(subjectTierTab === 'All' ? dynamicAllSubjects : (dynamicStructuredSubjects[subjectTierTab] || [])).map((sub) => {
                    const isSelected = formSubjects.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => handleToggleSubject(sub)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                        {sub}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSubjectInput}
                    onChange={(e) => setCustomSubjectInput(e.target.value)}
                    placeholder="Add custom subject (e.g. Primary Diction, IGCSE English)..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-[#e6e3dd] text-xs text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSubject}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Class Allocations with Division Tabs */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Assigned Teaching Classes ({formClasses.length} selected)
                  </label>
                  <span className="text-[10px] text-slate-500">
                    Select classes where this educator delivers instruction
                  </span>
                </div>

                {/* Division Tabs */}
                <div className="flex flex-wrap items-center gap-1 mb-2 p-1 bg-slate-100 rounded-lg">
                  {(['All', 'Senior Secondary', 'Junior Secondary', 'Primary School', 'Nursery & Early Years'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setClassTierTab(tier)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                        classTierTab === tier
                          ? 'bg-white text-slate-900 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2 max-h-36 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-white">
                  {(classTierTab === 'All' ? dynamicAllClasses : (dynamicStructuredClasses[classTierTab] || [])).map((cls) => {
                    const isSelected = formClasses.includes(cls);
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => handleToggleClass(cls)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#1e293b] text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                        {cls}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customClassInput}
                    onChange={(e) => setCustomClassInput(e.target.value)}
                    placeholder="Add custom class (e.g. Primary 5 Sapphire, SS 1 Cambridge)..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-[#e6e3dd] text-xs text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomClass}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#e6e3dd] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#e6e3dd] text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1e293b] hover:bg-[#0f172a] text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Provision Faculty Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ALLOCATIONS MODAL */}
      {isEditModalOpen && selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e6e3dd] max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-[#e6e3dd] flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0B4F9C] flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Faculty Allocations</h3>
                  <p className="text-xs text-slate-500">Updating settings for {selectedStaff.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-6 space-y-5">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {formError}
                </div>
              )}

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs sm:text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs sm:text-sm text-slate-900"
                  />
                </div>
              </div>

              {/* Campus & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Campus</label>
                  <select
                    value={formCampusId}
                    onChange={(e) => setFormCampusId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs sm:text-sm text-slate-900 bg-white"
                  >
                    {campuses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs sm:text-sm text-slate-900 bg-white"
                  >
                    {dynamicDepartments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Form Tutor / Class Teacher assignment */}
              <div className="p-4 rounded-xl bg-[#fbfaf8] border border-[#e6e3dd] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsFormTutor}
                        onChange={(e) => setFormIsFormTutor(e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-800">Assign Form Tutor / Class Teacher Duties</span>
                    </label>
                  </div>
                </div>

                {formIsFormTutor ? (
                  <div className="space-y-3 pt-2 border-t border-slate-200 animate-in fade-in">
                    <div>
                      <label className="block text-xs font-bold text-purple-900 mb-1">
                        Designated Pastoral Homeroom Class <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formFormTutorClass}
                        onChange={(e) => setFormFormTutorClass(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none"
                      >
                        <option value="">Select Homeroom Class...</option>
                        {Object.entries(dynamicStructuredClasses).map(([tierName, classList]) => (
                          <optgroup key={tierName} label={tierName}>
                            {classList.map((cls) => (
                              <option key={cls} value={cls}>
                                {cls}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs">
                      <div className="font-bold flex items-center gap-1.5 text-purple-950">
                        <Users className="w-3.5 h-3.5 text-purple-700" />
                        <span>Form Tutor (Secondary) / Class Teacher (Primary & Nursery) Mode</span>
                      </div>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-purple-800">
                        In addition to teaching syllabus curriculum, this educator holds pastoral guardianship over <strong>{formFormTutorClass || 'their designated class'}</strong>. Weekly reporting activates daily roll-call attendance, absent pupil follow-up, and NDPA 2023 confidential student safeguarding.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-600 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span><strong>Subject Teacher Only:</strong> Reports strictly on syllabus topics covered, lesson notes prepared, continuous assessments, and academic comprehension across assigned classes.</span>
                  </div>
                )}
              </div>

              {/* Subject Allocations with Division Tabs */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Assigned Teaching Subjects ({formSubjects.length} selected)
                  </label>
                  <span className="text-[10px] text-slate-500">
                    Filter by division to assign cross-tier subjects (e.g. English across SSS, JSS, and Primary)
                  </span>
                </div>

                {/* Division Tabs */}
                <div className="flex flex-wrap items-center gap-1 mb-2 p-1 bg-slate-100 rounded-lg">
                  {(['All', 'Senior Secondary', 'Junior Secondary', 'Primary School', 'Nursery & Early Years'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSubjectTierTab(tier)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                        subjectTierTab === tier
                          ? 'bg-white text-blue-700 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2 max-h-36 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-white">
                  {(subjectTierTab === 'All' ? dynamicAllSubjects : (dynamicStructuredSubjects[subjectTierTab] || [])).map((sub) => {
                    const isSelected = formSubjects.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => handleToggleSubject(sub)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                        {sub}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSubjectInput}
                    onChange={(e) => setCustomSubjectInput(e.target.value)}
                    placeholder="Add custom subject (e.g. Primary Diction, IGCSE English)..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-[#e6e3dd] text-xs text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSubject}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Class Allocations with Division Tabs */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Assigned Teaching Classes ({formClasses.length} selected)
                  </label>
                  <span className="text-[10px] text-slate-500">
                    Select classes where this educator delivers instruction
                  </span>
                </div>

                {/* Division Tabs */}
                <div className="flex flex-wrap items-center gap-1 mb-2 p-1 bg-slate-100 rounded-lg">
                  {(['All', 'Senior Secondary', 'Junior Secondary', 'Primary School', 'Nursery & Early Years'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setClassTierTab(tier)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                        classTierTab === tier
                          ? 'bg-white text-slate-900 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2 max-h-36 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-white">
                  {(classTierTab === 'All' ? dynamicAllClasses : (dynamicStructuredClasses[classTierTab] || [])).map((cls) => {
                    const isSelected = formClasses.includes(cls);
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => handleToggleClass(cls)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#1e293b] text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                        {cls}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customClassInput}
                    onChange={(e) => setCustomClassInput(e.target.value)}
                    placeholder="Add custom class (e.g. Primary 5 Sapphire, SS 1 Cambridge)..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-[#e6e3dd] text-xs text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomClass}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-[#e6e3dd] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#e6e3dd] text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1e293b] text-white text-xs font-bold shadow-sm"
                >
                  Save Allocation Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INVITATION DETAILS & CREDENTIALS MODAL */}
      {isInviteModalOpen && selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e6e3dd] overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-[#94A3B8] via-[#C8102E] to-[#0B4F9C]" />

            <button
              type="button"
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-7 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Faculty Invitation Credentials</h3>
                  <p className="text-xs text-slate-500">One-time provisioning link for {selectedStaff.name}</p>
                </div>
              </div>

              {/* Staff Profile Overview Card */}
              <div className="p-4 rounded-xl bg-[#fbfaf8] border border-[#e6e3dd] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Faculty Name:</span>
                  <span className="font-bold text-slate-900">{selectedStaff.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email Address:</span>
                  <span className="font-semibold text-slate-700">{selectedStaff.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Campus:</span>
                  <span className="font-semibold text-[#0B4F9C]">{selectedStaff.campusName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-amber-700">
                    {selectedStaff.status === 'ACTIVE' ? 'Activated' : 'Pending Activation'}
                  </span>
                </div>
              </div>

              {/* 6-Digit Temporary OTP Code */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0B4F9C] uppercase tracking-wider">
                    One-Time Password (OTP)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyOtp(selectedStaff.tempOtp || '849201')}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B4F9C] hover:underline"
                  >
                    {copiedOtp ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-2xl font-mono font-extrabold text-slate-900 tracking-widest text-center py-1">
                  {selectedStaff.tempOtp || '849201'}
                </div>
                <p className="text-[11px] text-blue-900/80 leading-relaxed text-center">
                  This 6-digit code is strictly consumed upon first-time permanent password creation.
                </p>
              </div>

              {/* Direct Invitation Link */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Direct Activation Link</label>
                  <span className="text-[11px] text-slate-400">Pre-authenticates OTP</span>
                </div>
                <div className="p-2.5 rounded-xl border border-[#e6e3dd] bg-[#fbfaf8] text-[11px] font-mono text-slate-700 break-all select-all">
                  {getInviteUrl(selectedStaff)}
                </div>
              </div>

              {/* Copy Full Link CTA */}
              <button
                type="button"
                onClick={() => handleCopyInviteLink(selectedStaff)}
                className="w-full py-3 rounded-xl bg-[#1e293b] hover:bg-[#0f172a] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Activation Link Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 text-emerald-400" />
                    <span>Copy Direct Activation Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE CONFIRMATION */}
      {isDeleteModalOpen && selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#e6e3dd] p-6 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Remove Faculty Member?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-slate-800">{selectedStaff.name}</span> from the Attwool faculty roster? Their allocations and pending credentials will be revoked.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedStaff(null);
                }}
                className="px-4 py-2 rounded-xl border border-[#e6e3dd] text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteStaff(selectedStaff.id);
                  setIsDeleteModalOpen(false);
                  setSelectedStaff(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
              >
                Yes, Remove Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
