import React, { useState } from 'react';
import type { Faculty, AcademicClass } from '../../types';
import {
  Sliders,
  BookOpen,
  Layers,
  Plus,
  Trash2,
  Edit2,
  Search,
  AlertTriangle,
  X,
  School,
  Users,
  GraduationCap
} from 'lucide-react';

interface AcademicSetupProps {
  faculties: Faculty[];
  academicClasses: AcademicClass[];
  onCreateFaculty: (newFaculty: Faculty) => void;
  onUpdateFaculty: (updated: Faculty) => void;
  onDeleteFaculty: (facultyId: string) => void;
  onAddSubjectToFaculty: (facultyId: string, subjectName: string) => void;
  onRemoveSubjectFromFaculty: (facultyId: string, subjectName: string) => void;
  onCreateClass: (newClass: AcademicClass) => void;
  onUpdateClass: (updated: AcademicClass) => void;
  onDeleteClass: (classId: string) => void;
}

export const AcademicSetup: React.FC<AcademicSetupProps> = ({
  faculties,
  academicClasses,
  onCreateFaculty,
  onUpdateFaculty,
  onDeleteFaculty,
  onAddSubjectToFaculty,
  onRemoveSubjectFromFaculty,
  onCreateClass,
  onUpdateClass,
  onDeleteClass
}) => {
  const [activeTab, setActiveTab] = useState<'faculties' | 'classes'>('faculties');

  // Search & Filter state
  const [facultySearch, setFacultySearch] = useState('');
  const [classSearch, setClassSearch] = useState('');
  const [classTierFilter, setClassTierFilter] = useState<string>('ALL');

  // Inline subject input state per faculty
  const [newSubjectInputs, setNewSubjectInputs] = useState<Record<string, string>>({});

  // Faculty Modals state
  const [isAddFacultyModalOpen, setIsAddFacultyModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [deletingFaculty, setDeletingFaculty] = useState<Faculty | null>(null);

  // Form state for Faculty
  const [formFacultyName, setFormFacultyName] = useState('');
  const [formFacultyCategory, setFormFacultyCategory] = useState<Faculty['category']>('Senior Secondary');
  const [formFacultyDesc, setFormFacultyDesc] = useState('');
  const [formFacultyInitialSubjects, setFormFacultyInitialSubjects] = useState('');
  const [facultyFormError, setFacultyFormError] = useState<string | null>(null);

  // Class Modals state
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<AcademicClass | null>(null);
  const [deletingClass, setDeletingClass] = useState<AcademicClass | null>(null);

  // Form state for Class
  const [formClassName, setFormClassName] = useState('');
  const [formClassTier, setFormClassTier] = useState<AcademicClass['tier']>('Senior Secondary');
  const [formClassGrade, setFormClassGrade] = useState('SS 1');
  const [formClassArm, setFormClassArm] = useState('Science');
  const [classFormError, setClassFormError] = useState<string | null>(null);

  // Quick Inline Add Subject handler
  const handleInlineAddSubject = (facultyId: string) => {
    const val = (newSubjectInputs[facultyId] || '').trim();
    if (!val) return;
    onAddSubjectToFaculty(facultyId, val);
    setNewSubjectInputs((prev) => ({ ...prev, [facultyId]: '' }));
  };

  // Submit Add Faculty
  const handleSaveAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFacultyName.trim()) {
      setFacultyFormError('Faculty / Department Name is required.');
      return;
    }

    const parsedSubjects = formFacultyInitialSubjects
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newFaculty: Faculty = {
      id: `fac-${Date.now()}`,
      name: formFacultyName.trim(),
      category: formFacultyCategory,
      description: formFacultyDesc.trim(),
      subjects: parsedSubjects
    };

    onCreateFaculty(newFaculty);
    setIsAddFacultyModalOpen(false);
    setFormFacultyName('');
    setFormFacultyDesc('');
    setFormFacultyInitialSubjects('');
    setFacultyFormError(null);
  };

  // Submit Edit Faculty
  const handleSaveEditFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaculty) return;
    if (!formFacultyName.trim()) {
      setFacultyFormError('Faculty Name is required.');
      return;
    }

    const updated: Faculty = {
      ...editingFaculty,
      name: formFacultyName.trim(),
      category: formFacultyCategory,
      description: formFacultyDesc.trim()
    };

    onUpdateFaculty(updated);
    setEditingFaculty(null);
    setFacultyFormError(null);
  };

  // Open Edit Faculty Modal
  const handleOpenEditFaculty = (fac: Faculty) => {
    setEditingFaculty(fac);
    setFormFacultyName(fac.name);
    setFormFacultyCategory(fac.category);
    setFormFacultyDesc(fac.description || '');
    setFacultyFormError(null);
  };

  // Submit Add Class
  const handleSaveAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = formClassName.trim() || `${formClassGrade} ${formClassArm}`.trim();
    if (!finalName) {
      setClassFormError('Class Name is required.');
      return;
    }

    const newCls: AcademicClass = {
      id: `cls-${Date.now()}`,
      name: finalName,
      tier: formClassTier,
      gradeLevel: formClassGrade.trim(),
      arm: formClassArm.trim()
    };

    onCreateClass(newCls);
    setIsAddClassModalOpen(false);
    setFormClassName('');
    setClassFormError(null);
  };

  // Submit Edit Class
  const handleSaveEditClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    const finalName = formClassName.trim() || `${formClassGrade} ${formClassArm}`.trim();
    if (!finalName) {
      setClassFormError('Class Name is required.');
      return;
    }

    const updated: AcademicClass = {
      ...editingClass,
      name: finalName,
      tier: formClassTier,
      gradeLevel: formClassGrade.trim(),
      arm: formClassArm.trim()
    };

    onUpdateClass(updated);
    setEditingClass(null);
    setClassFormError(null);
  };

  // Open Edit Class Modal
  const handleOpenEditClass = (cls: AcademicClass) => {
    setEditingClass(cls);
    setFormClassName(cls.name);
    setFormClassTier(cls.tier);
    setFormClassGrade(cls.gradeLevel);
    setFormClassArm(cls.arm);
    setClassFormError(null);
  };

  // Filtered Faculties
  const filteredFaculties = faculties.filter((f) => {
    if (!facultySearch.trim()) return true;
    const q = facultySearch.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      (f.description || '').toLowerCase().includes(q) ||
      f.subjects.some((s) => s.toLowerCase().includes(q))
    );
  });

  // Filtered Classes
  const filteredClasses = academicClasses.filter((c) => {
    if (classTierFilter !== 'ALL' && c.tier !== classTierFilter) {
      return false;
    }
    if (!classSearch.trim()) return true;
    const q = classSearch.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.gradeLevel.toLowerCase().includes(q) ||
      c.arm.toLowerCase().includes(q)
    );
  });

  // Telemetry Calculations
  const totalSubjects = faculties.reduce((acc, f) => acc + f.subjects.length, 0);
  const secondaryFaculties = faculties.filter((f) => f.category === 'Senior Secondary').length;
  const basicEduFaculties = faculties.filter(
    (f) => f.category === 'Junior Secondary' || f.category === 'Primary School' || f.category === 'Nursery & Early Years'
  ).length;

  const sssClassesCount = academicClasses.filter((c) => c.tier === 'Senior Secondary').length;
  const jssClassesCount = academicClasses.filter((c) => c.tier === 'Junior Secondary').length;
  const primaryNurseryCount = academicClasses.filter(
    (c) => c.tier === 'Primary School' || c.tier === 'Nursery & Early Years'
  ).length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. HERO BANNER (Matching Image 2 Clean White Style) */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#e6e3dd] shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0B4F9C] border border-blue-200">
              <Sliders className="w-3.5 h-3.5" />
              Academic Governance &amp; Curricular Setup
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 font-brand-serif">
              Academic Structure Setup
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Configure academic faculties (Science, Art, Commercial, Basic Studies), curriculum subjects, and instructional classes across the Attwool school group. Dynamic setups immediately populate staff onboarding and teaching allocation forms.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'faculties' ? (
              <button
                type="button"
                onClick={() => {
                  setFormFacultyName('');
                  setFormFacultyDesc('');
                  setFormFacultyInitialSubjects('');
                  setFacultyFormError(null);
                  setIsAddFacultyModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e293b] hover:bg-[#0f172a] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Add New Faculty</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setFormClassName('');
                  setFormClassTier('Senior Secondary');
                  setFormClassGrade('SS 1');
                  setFormClassArm('Science');
                  setClassFormError(null);
                  setIsAddClassModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e293b] hover:bg-[#0f172a] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-purple-400" />
                <span>Add New Class</span>
              </button>
            )}
          </div>
        </div>

        {/* Major View Tabs */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('faculties')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'faculties'
                ? 'bg-blue-50 text-[#0B4F9C] border border-blue-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Faculty &amp; Subject Setup ({faculties.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('classes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'classes'
                ? 'bg-purple-50 text-purple-800 border border-purple-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. Class &amp; Arm Setup ({academicClasses.length})</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VIEW A: FACULTY & SUBJECT SETUP                                */}
      {/* ============================================================== */}
      {activeTab === 'faculties' && (
        <div className="space-y-6">
          {/* Telemetry Cards for Faculties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#e6e3dd] shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <span>Total Faculties</span>
                <School className="w-4 h-4 text-[#0B4F9C]" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-brand-serif">{faculties.length}</div>
              <div className="text-xs text-slate-500">Configured Academic Departments</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e6e3dd] shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <span>Curriculum Subjects</span>
                <BookOpen className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-brand-serif">{totalSubjects}</div>
              <div className="text-xs text-slate-500">Syllabus Subjects Available</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e6e3dd] shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <span>Senior Sec Faculties</span>
                <GraduationCap className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-brand-serif">{secondaryFaculties}</div>
              <div className="text-xs text-slate-500">Science, Arts, Commercial</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e6e3dd] shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <span>Basic Education</span>
                <Users className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-brand-serif">{basicEduFaculties}</div>
              <div className="text-xs text-slate-500">JSS, Primary, Nursery</div>
            </div>
          </div>

          {/* Search Bar for Faculties */}
          <div className="bg-white rounded-3xl border border-[#e6e3dd] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#e6e3dd] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-brand-serif">Faculties &amp; Subjects Directory</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage Science, Arts, Commercial, and Basic Education departments. Add or remove subjects directly.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={facultySearch}
                  onChange={(e) => setFacultySearch(e.target.value)}
                  placeholder="Search faculties or subjects..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#fbfaf8] border border-[#e6e3dd] rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]/20"
                />
              </div>
            </div>

            {/* Faculties List */}
            <div className="p-6 space-y-6">
              {filteredFaculties.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No faculties match your search query. Click <strong>+ Add New Faculty</strong> to create one.
                </div>
              ) : (
                filteredFaculties.map((faculty) => (
                  <div
                    key={faculty.id}
                    className="p-5 sm:p-6 rounded-2xl border border-[#e6e3dd] bg-[#fbfaf8] hover:bg-white hover:border-slate-300 transition-all space-y-4"
                  >
                    {/* Faculty Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 font-brand-serif">{faculty.name}</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0B4F9C] border border-blue-200">
                            {faculty.category}
                          </span>
                        </div>
                        {faculty.description && (
                          <p className="text-xs text-slate-500">{faculty.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => handleOpenEditFaculty(faculty)}
                          className="p-2 rounded-xl text-slate-500 hover:text-[#0B4F9C] hover:bg-slate-100 border border-[#e6e3dd] transition-colors cursor-pointer"
                          title="Edit Faculty Name & Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingFaculty(faculty)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-[#e6e3dd] transition-colors cursor-pointer"
                          title="Delete Faculty"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Subjects Container */}
                    <div className="space-y-2 pt-2 border-t border-slate-200/70">
                      <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                        <span>Subjects Taught Under {faculty.name} ({faculty.subjects.length}):</span>
                        <span className="text-[10px] text-slate-400">Click &times; to remove subject</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {faculty.subjects.map((sub) => (
                          <span
                            key={sub}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-white text-slate-800 border border-[#e6e3dd] shadow-2xs group"
                          >
                            <span>{sub}</span>
                            <button
                              type="button"
                              onClick={() => onRemoveSubjectFromFaculty(faculty.id, sub)}
                              className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors cursor-pointer"
                              title={`Remove ${sub} from ${faculty.name}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Quick Inline Add Subject */}
                      <div className="flex items-center gap-2 pt-2 max-w-md">
                        <input
                          type="text"
                          value={newSubjectInputs[faculty.id] || ''}
                          onChange={(e) =>
                            setNewSubjectInputs((prev) => ({ ...prev, [faculty.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleInlineAddSubject(faculty.id);
                            }
                          }}
                          placeholder={`Add subject to ${faculty.name} (e.g. Further Mathematics)...`}
                          className="flex-1 px-3 py-1.5 rounded-xl border border-[#e6e3dd] text-xs bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]/20"
                        />
                        <button
                          type="button"
                          onClick={() => handleInlineAddSubject(faculty.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW B: CLASS & ARM SETUP                                      */}
      {/* ============================================================== */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          {/* Telemetry Cards for Classes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#e6e3dd] shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <span>Total Classes</span>
                <Layers className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-brand-serif">{academicClasses.length}</div>
              <div className="text-xs text-slate-500">Active Classroom Arms</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e6e3dd] shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <span>Senior Secondary</span>
                <GraduationCap className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-brand-serif">{sssClassesCount}</div>
              <div className="text-xs text-slate-500">SS 1 to SS 3 Arms</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e6e3dd] shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <span>Junior Secondary</span>
                <BookOpen className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-brand-serif">{jssClassesCount}</div>
              <div className="text-xs text-slate-500">JSS 1 to JSS 3 Arms</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e6e3dd] shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <span>Primary &amp; Nursery</span>
                <Users className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-brand-serif">{primaryNurseryCount}</div>
              <div className="text-xs text-slate-500">Basic &amp; Early Years Arms</div>
            </div>
          </div>

          {/* Directory & Controls for Classes */}
          <div className="bg-white rounded-3xl border border-[#e6e3dd] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#e6e3dd] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-brand-serif">Academic Classes &amp; Arms Directory</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Classes configured here populate Form Tutor homerooms and teacher subject delivery allocations.
                </p>
              </div>

              {/* Division Tier Filter Pills */}
              <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold border border-slate-200">
                {(['ALL', 'Senior Secondary', 'Junior Secondary', 'Primary School', 'Nursery & Early Years'] as const).map(
                  (tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setClassTierFilter(tier)}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        classTierFilter === tier
                          ? 'bg-white text-slate-900 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tier === 'ALL' ? `All (${academicClasses.length})` : tier}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Search Input for Classes */}
            <div className="px-6 py-3.5 bg-[#fbfaf8] border-b border-[#e6e3dd] flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={classSearch}
                  onChange={(e) => setClassSearch(e.target.value)}
                  placeholder="Search by class name, grade (SS 1), or arm (Science)..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#e6e3dd] rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]/20"
                />
              </div>

              <span className="text-[11px] text-slate-400 font-semibold shrink-0">
                Showing {filteredClasses.length} of {academicClasses.length} class(es)
              </span>
            </div>

            {/* Classes Grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClasses.length === 0 ? (
                <div className="col-span-full p-8 text-center text-slate-500 text-xs">
                  No classes found matching criteria. Click <strong>+ Add New Class</strong> to create one.
                </div>
              ) : (
                filteredClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-5 rounded-2xl border border-[#e6e3dd] bg-white hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 font-brand-serif">{cls.name}</h3>
                        <span className="text-xs text-slate-500 font-medium">
                          Grade: <strong>{cls.gradeLevel}</strong> • Arm: <strong>{cls.arm}</strong>
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                        {cls.tier}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Available for teacher assignment</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditClass(cls)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#0B4F9C] hover:bg-slate-50 border border-[#e6e3dd] transition-colors cursor-pointer"
                          title="Edit Class Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingClass(cls)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-[#e6e3dd] transition-colors cursor-pointer"
                          title="Delete Class"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: ADD FACULTY MODAL                                     */}
      {/* ============================================================== */}
      {isAddFacultyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e6e3dd] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e6e3dd] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0B4F9C] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Academic Faculty / Department</h3>
                  <p className="text-xs text-slate-500">Define curriculum department &amp; initial subjects</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddFacultyModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddFaculty} className="p-6 space-y-4">
              {facultyFormError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {facultyFormError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Faculty / Department Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formFacultyName}
                  onChange={(e) => setFormFacultyName(e.target.value)}
                  placeholder="e.g. Science & Mathematics, Arts & Humanities, Commercial..."
                  className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Division Tier Category</label>
                <select
                  value={formFacultyCategory}
                  onChange={(e) => setFormFacultyCategory(e.target.value as Faculty['category'])}
                  className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs text-slate-900 bg-white"
                >
                  <option value="Senior Secondary">Senior Secondary (SSS)</option>
                  <option value="Junior Secondary">Junior Secondary (JSS)</option>
                  <option value="Primary School">Primary School</option>
                  <option value="Nursery & Early Years">Nursery &amp; Early Years</option>
                  <option value="Cross-Cutting">Cross-Cutting (Spans All Tiers)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Focus</label>
                <textarea
                  rows={2}
                  value={formFacultyDesc}
                  onChange={(e) => setFormFacultyDesc(e.target.value)}
                  placeholder="Brief curriculum description..."
                  className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initial Subjects (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formFacultyInitialSubjects}
                  onChange={(e) => setFormFacultyInitialSubjects(e.target.value)}
                  placeholder="e.g. Physics, Chemistry, Biology, Mathematics..."
                  className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]/20"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  You can also add or remove subjects individually after creation.
                </span>
              </div>

              <div className="pt-3 border-t border-[#e6e3dd] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddFacultyModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#e6e3dd] text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1e293b] text-white text-xs font-bold shadow-sm"
                >
                  Save Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: EDIT FACULTY MODAL                                    */}
      {/* ============================================================== */}
      {editingFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e6e3dd] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e6e3dd] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0B4F9C] flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Faculty Details</h3>
                  <p className="text-xs text-slate-500">Updating settings for {editingFaculty.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingFaculty(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditFaculty} className="p-6 space-y-4">
              {facultyFormError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {facultyFormError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Faculty Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formFacultyName}
                  onChange={(e) => setFormFacultyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Division Tier Category</label>
                <select
                  value={formFacultyCategory}
                  onChange={(e) => setFormFacultyCategory(e.target.value as Faculty['category'])}
                  className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs text-slate-900 bg-white"
                >
                  <option value="Senior Secondary">Senior Secondary (SSS)</option>
                  <option value="Junior Secondary">Junior Secondary (JSS)</option>
                  <option value="Primary School">Primary School</option>
                  <option value="Nursery & Early Years">Nursery &amp; Early Years</option>
                  <option value="Cross-Cutting">Cross-Cutting (Spans All Tiers)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formFacultyDesc}
                  onChange={(e) => setFormFacultyDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#e6e3dd] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingFaculty(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#e6e3dd] text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1e293b] text-white text-xs font-bold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: DELETE FACULTY CONFIRMATION                           */}
      {/* ============================================================== */}
      {deletingFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#e6e3dd] p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Faculty</h3>
                <p className="text-xs text-slate-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong>{deletingFaculty.name}</strong> along with its {deletingFaculty.subjects.length} registered subjects?
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingFaculty(null)}
                className="px-4 py-2 rounded-xl border border-[#e6e3dd] text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteFaculty(deletingFaculty.id);
                  setDeletingFaculty(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: ADD CLASS MODAL                                       */}
      {/* ============================================================== */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e6e3dd] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e6e3dd] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Academic Class / Arm</h3>
                  <p className="text-xs text-slate-500">Create instructional class arm for teacher allocation</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddClassModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddClass} className="p-6 space-y-4">
              {classFormError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {classFormError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Division Tier</label>
                <select
                  value={formClassTier}
                  onChange={(e) => setFormClassTier(e.target.value as AcademicClass['tier'])}
                  className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs text-slate-900 bg-white"
                >
                  <option value="Senior Secondary">Senior Secondary (SSS)</option>
                  <option value="Junior Secondary">Junior Secondary (JSS)</option>
                  <option value="Primary School">Primary School</option>
                  <option value="Nursery & Early Years">Nursery &amp; Early Years</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Grade Level</label>
                  <input
                    type="text"
                    required
                    value={formClassGrade}
                    onChange={(e) => setFormClassGrade(e.target.value)}
                    placeholder="e.g. SS 1, JSS 2, Primary 3"
                    className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Arm / Stream</label>
                  <input
                    type="text"
                    required
                    value={formClassArm}
                    onChange={(e) => setFormClassArm(e.target.value)}
                    placeholder="e.g. Science, Arts, Diamond"
                    className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Display Name (Auto-generated or custom)
                </label>
                <input
                  type="text"
                  value={formClassName || `${formClassGrade} ${formClassArm}`.trim()}
                  onChange={(e) => setFormClassName(e.target.value)}
                  placeholder="e.g. SS 1 Science"
                  className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs text-slate-900 bg-slate-50"
                />
              </div>

              <div className="pt-3 border-t border-[#e6e3dd] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddClassModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#e6e3dd] text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1e293b] text-white text-xs font-bold shadow-sm"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: EDIT CLASS MODAL                                      */}
      {/* ============================================================== */}
      {editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e6e3dd] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e6e3dd] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Class Details</h3>
                  <p className="text-xs text-slate-500">Updating settings for {editingClass.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingClass(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditClass} className="p-6 space-y-4">
              {classFormError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {classFormError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Division Tier</label>
                <select
                  value={formClassTier}
                  onChange={(e) => setFormClassTier(e.target.value as AcademicClass['tier'])}
                  className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs text-slate-900 bg-white"
                >
                  <option value="Senior Secondary">Senior Secondary (SSS)</option>
                  <option value="Junior Secondary">Junior Secondary (JSS)</option>
                  <option value="Primary School">Primary School</option>
                  <option value="Nursery & Early Years">Nursery &amp; Early Years</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Grade Level</label>
                  <input
                    type="text"
                    required
                    value={formClassGrade}
                    onChange={(e) => setFormClassGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Arm / Stream</label>
                  <input
                    type="text"
                    required
                    value={formClassArm}
                    onChange={(e) => setFormClassArm(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Display Name</label>
                <input
                  type="text"
                  required
                  value={formClassName}
                  onChange={(e) => setFormClassName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#e6e3dd] text-xs text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-[#e6e3dd] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#e6e3dd] text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1e293b] text-white text-xs font-bold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 6: DELETE CLASS CONFIRMATION                             */}
      {/* ============================================================== */}
      {deletingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#e6e3dd] p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Class</h3>
                <p className="text-xs text-slate-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete classroom arm <strong>{deletingClass.name}</strong> ({deletingClass.tier})?
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingClass(null)}
                className="px-4 py-2 rounded-xl border border-[#e6e3dd] text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteClass(deletingClass.id);
                  setDeletingClass(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
