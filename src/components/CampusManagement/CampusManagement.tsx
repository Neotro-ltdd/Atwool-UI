import React, { useState } from 'react';
import type { Campus, UserSession } from '../../types';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  User,
  Mail,
  Phone,
  Users,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  School,
  Sparkles,
  Layers,
  Check
} from 'lucide-react';

interface CampusManagementProps {
  campuses: Campus[];
  selectedCampus?: string;
  onSelectCampus?: (campusName: string) => void;
  onCreateCampus: (newCampus: Campus) => void;
  onUpdateCampus: (updatedCampus: Campus) => void;
  onDeleteCampus: (campusId: string) => void;
  currentUser?: UserSession;
}

export const PRESET_DIVISIONS = [
  'Crèche & Early Years',
  'Nursery & Kindergarten',
  'Primary School (Basic 1-6)',
  'Junior Secondary (JSS 1-3)',
  'Senior Secondary (SSS 1-3)',
  'Sixth Form & Cambridge (A-Levels)'
];

export interface ClassificationOption {
  label: string;
  value: string;
  category: 'Single Division' | 'Multi-Division Combination' | 'Custom';
  defaultDivisions: string[];
}

export const CLASSIFICATION_OPTIONS: ClassificationOption[] = [
  // Single Divisions
  {
    label: 'Secondary College',
    value: 'Secondary College',
    category: 'Single Division',
    defaultDivisions: ['Junior Secondary (JSS 1-3)', 'Senior Secondary (SSS 1-3)']
  },
  {
    label: 'Primary & Nursery',
    value: 'Primary & Nursery',
    category: 'Single Division',
    defaultDivisions: ['Nursery & Kindergarten', 'Primary School (Basic 1-6)']
  },
  {
    label: 'Sixth Form & Cambridge',
    value: 'Sixth Form & Cambridge',
    category: 'Single Division',
    defaultDivisions: ['Sixth Form & Cambridge (A-Levels)']
  },
  {
    label: 'Sunflower Annex (Early Years)',
    value: 'Sunflower Annex',
    category: 'Single Division',
    defaultDivisions: ['Crèche & Early Years', 'Nursery & Kindergarten']
  },
  
  // Combinations
  {
    label: 'Combined (Primary & Secondary)',
    value: 'Combined (Primary & Secondary)',
    category: 'Multi-Division Combination',
    defaultDivisions: ['Primary School (Basic 1-6)', 'Junior Secondary (JSS 1-3)', 'Senior Secondary (SSS 1-3)']
  },
  {
    label: 'All-Through School (Nursery to Secondary)',
    value: 'All-Through School (Nursery, Primary & Secondary)',
    category: 'Multi-Division Combination',
    defaultDivisions: ['Nursery & Kindergarten', 'Primary School (Basic 1-6)', 'Junior Secondary (JSS 1-3)', 'Senior Secondary (SSS 1-3)']
  },
  {
    label: 'Combined (Secondary & Sixth Form)',
    value: 'Combined (Secondary & Sixth Form)',
    category: 'Multi-Division Combination',
    defaultDivisions: ['Junior Secondary (JSS 1-3)', 'Senior Secondary (SSS 1-3)', 'Sixth Form & Cambridge (A-Levels)']
  },
  {
    label: 'Combined (Crèche, Nursery & Primary)',
    value: 'Combined (Crèche, Nursery & Primary)',
    category: 'Multi-Division Combination',
    defaultDivisions: ['Crèche & Early Years', 'Nursery & Kindergarten', 'Primary School (Basic 1-6)']
  },
  {
    label: 'Full Spectrum (Crèche to Sixth Form)',
    value: 'All-Through Campus (Crèche to Sixth Form)',
    category: 'Multi-Division Combination',
    defaultDivisions: [
      'Crèche & Early Years',
      'Nursery & Kindergarten',
      'Primary School (Basic 1-6)',
      'Junior Secondary (JSS 1-3)',
      'Senior Secondary (SSS 1-3)',
      'Sixth Form & Cambridge (A-Levels)'
    ]
  },
  {
    label: 'Custom Combination / Other...',
    value: 'CUSTOM',
    category: 'Custom',
    defaultDivisions: []
  }
];

export const CampusManagement: React.FC<CampusManagementProps> = ({
  campuses,
  onCreateCampus,
  onUpdateCampus,
  onDeleteCampus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'Secondary' | 'Primary' | 'Combined'>('ALL');
  const [selectedCampusFilter, setSelectedCampusFilter] = useState('ALL');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCampus, setEditingCampus] = useState<Campus | null>(null);
  const [deletingCampus, setDeletingCampus] = useState<Campus | null>(null);

  // Form State for Create / Edit
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('Secondary College');
  const [formDivisions, setFormDivisions] = useState<string[]>([
    'Junior Secondary (JSS 1-3)',
    'Senior Secondary (SSS 1-3)'
  ]);
  const [customTypeInput, setCustomTypeInput] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formPrincipal, setFormPrincipal] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStudents, setFormStudents] = useState<number>(350);
  const [formStaff, setFormStaff] = useState<number>(30);
  const [formError, setFormError] = useState<string | null>(null);

  const handleTypeSelectChange = (newVal: string) => {
    setFormType(newVal);
    const matched = CLASSIFICATION_OPTIONS.find((c) => c.value === newVal);
    if (matched && matched.defaultDivisions.length > 0) {
      setFormDivisions(matched.defaultDivisions);
    }
  };

  const handleToggleDivision = (divName: string) => {
    setFormDivisions((prev) => {
      const exists = prev.includes(divName);
      const updated = exists ? prev.filter((d) => d !== divName) : [...prev, divName];
      
      const hasPrimary = updated.some((d) => d.includes('Primary') || d.includes('Nursery') || d.includes('Crèche'));
      const hasSecondary = updated.some((d) => d.includes('Secondary'));
      const hasSixthForm = updated.some((d) => d.includes('Sixth Form'));
      
      if (formType !== 'CUSTOM') {
        if (hasPrimary && hasSecondary && hasSixthForm) {
          setFormType('All-Through Campus (Crèche to Sixth Form)');
        } else if (hasPrimary && hasSecondary) {
          setFormType('Combined (Primary & Secondary)');
        } else if (hasSecondary && hasSixthForm) {
          setFormType('Combined (Secondary & Sixth Form)');
        } else if (hasPrimary && !hasSecondary) {
          setFormType('Primary & Nursery');
        } else if (hasSecondary && !hasPrimary) {
          setFormType('Secondary College');
        }
      }
      return updated;
    });
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormName('');
    setFormType('Secondary College');
    setFormDivisions(['Junior Secondary (JSS 1-3)', 'Senior Secondary (SSS 1-3)']);
    setCustomTypeInput('');
    setFormLocation('');
    setFormPrincipal('');
    setFormEmail('');
    setFormPhone('');
    setFormStudents(350);
    setFormStaff(30);
    setFormError(null);
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (campus: Campus) => {
    setEditingCampus(campus);
    setFormName(campus.name);
    
    const isKnown = CLASSIFICATION_OPTIONS.some((opt) => opt.value === campus.type);
    if (isKnown) {
      setFormType(campus.type);
      setCustomTypeInput('');
    } else {
      setFormType('CUSTOM');
      setCustomTypeInput(campus.type);
    }

    if (campus.divisions && campus.divisions.length > 0) {
      setFormDivisions([...campus.divisions]);
    } else {
      const isSec = campus.type.toLowerCase().includes('secondary') || campus.type.toLowerCase().includes('college');
      setFormDivisions(isSec 
        ? ['Junior Secondary (JSS 1-3)', 'Senior Secondary (SSS 1-3)'] 
        : ['Nursery & Kindergarten', 'Primary School (Basic 1-6)']);
    }

    setFormLocation(campus.location);
    setFormPrincipal(campus.principalName || '');
    setFormEmail(campus.contactEmail || '');
    setFormPhone(campus.contactPhone || '');
    setFormStudents(campus.studentCount || 350);
    setFormStaff(campus.staffCount || 30);
    setFormError(null);
  };

  // Submit Create
  const handleSaveNewCampus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formLocation.trim()) {
      setFormError('Campus Name and Physical Location are required.');
      return;
    }

    const resolvedType = formType === 'CUSTOM' ? (customTypeInput.trim() || 'Combined Campus') : formType;
    const isCombined =
      formDivisions.length > 1 ||
      resolvedType.toLowerCase().includes('combined') ||
      resolvedType.toLowerCase().includes('all-through');

    const newCampus: Campus = {
      id: `camp-${Date.now()}`,
      name: formName.trim(),
      type: resolvedType,
      divisions: formDivisions.length > 0 ? formDivisions : ['Junior Secondary (JSS 1-3)'],
      isCombined,
      location: formLocation.trim(),
      principalName: formPrincipal.trim() || 'Principal Designate',
      contactEmail: formEmail.trim() || `info@attwoolcollege.com`,
      contactPhone: formPhone.trim() || '+234 803 000 0000',
      studentCount: Number(formStudents) || 0,
      staffCount: Number(formStaff) || 0,
      isActive: true
    };

    onCreateCampus(newCampus);
    setIsCreateModalOpen(false);
  };

  // Submit Edit
  const handleSaveEditCampus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampus) return;
    if (!formName.trim() || !formLocation.trim()) {
      setFormError('Campus Name and Physical Location are required.');
      return;
    }

    const resolvedType = formType === 'CUSTOM' ? (customTypeInput.trim() || 'Combined Campus') : formType;
    const isCombined =
      formDivisions.length > 1 ||
      resolvedType.toLowerCase().includes('combined') ||
      resolvedType.toLowerCase().includes('all-through');

    const updated: Campus = {
      ...editingCampus,
      name: formName.trim(),
      type: resolvedType,
      divisions: formDivisions.length > 0 ? formDivisions : editingCampus.divisions,
      isCombined,
      location: formLocation.trim(),
      principalName: formPrincipal.trim(),
      contactEmail: formEmail.trim(),
      contactPhone: formPhone.trim(),
      studentCount: Number(formStudents) || 0,
      staffCount: Number(formStaff) || 0
    };

    onUpdateCampus(updated);
    setEditingCampus(null);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deletingCampus) return;
    onDeleteCampus(deletingCampus.id);
    setDeletingCampus(null);
  };

  // Filtering
  const filteredCampuses = campuses.filter((c) => {
    // Campus Filter
    if (selectedCampusFilter !== 'ALL' && c.id !== selectedCampusFilter && c.name !== selectedCampusFilter) {
      return false;
    }

    const isCombinedCampus = 
      c.isCombined || 
      c.type.toLowerCase().includes('combined') || 
      c.type.toLowerCase().includes('all-through') ||
      (c.divisions && (
        c.divisions.some(d => d.includes('Primary') || d.includes('Nursery')) &&
        c.divisions.some(d => d.includes('Secondary'))
      ));

    if (typeFilter === 'Combined' && !isCombinedCampus) return false;
    
    if (typeFilter === 'Secondary') {
      const hasSecondary = 
        c.type.toLowerCase().includes('secondary') || 
        c.type.toLowerCase().includes('college') ||
        (c.divisions && c.divisions.some(d => d.includes('Secondary')));
      if (!hasSecondary) return false;
    }
    
    if (typeFilter === 'Primary') {
      const hasPrimary = 
        c.type.toLowerCase().includes('primary') || 
        c.type.toLowerCase().includes('nursery') || 
        c.type.toLowerCase().includes('sunflower') ||
        (c.divisions && c.divisions.some(d => d.includes('Primary') || d.includes('Nursery') || d.includes('Crèche')));
      if (!hasPrimary) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        (c.divisions && c.divisions.some(d => d.toLowerCase().includes(q))) ||
        (c.principalName || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalStudents = campuses.reduce((acc, c) => acc + (c.studentCount || 0), 0);
  const totalStaff = campuses.reduce((acc, c) => acc + (c.staffCount || 0), 0);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. GREETING / HERO BANNER (Matching Image 2 Clean White Style) */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#e6e3dd] shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0B4F9C] border border-blue-200">
              <Building2 className="w-3.5 h-3.5" />
              Institutional Network Governance
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 font-brand-serif">
              Campus Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Create, configure, edit and monitor academic campuses across Attwool Schools Network.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#a50b24] text-white font-bold text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Campus</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SUMMARY METRIC TELEMETRY CARDS (Clean 3-Card Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Total Campuses */}
        <div className="p-5 rounded-2xl bg-white border border-[#e6e3dd] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Network Campuses
            </span>
            <Building2 className="w-4 h-4 text-[#0B4F9C]" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-brand-serif">
              {campuses.length}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Active Academic Facilities</div>
          </div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>100% Operational In-Session</span>
          </div>
        </div>

        {/* Card 2: Student Population */}
        <div className="p-5 rounded-2xl bg-white border border-[#e6e3dd] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Pupils
            </span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-brand-serif">
              {totalStudents.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Across All {campuses.length} Institutions</div>
          </div>
          <div className="text-[11px] text-purple-700 flex items-center gap-1 font-semibold">
            <span>Secondary &amp; Primary Divisions</span>
          </div>
        </div>

        {/* Card 3: Academic Staff */}
        <div className="p-5 rounded-2xl bg-white border border-[#e6e3dd] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Teaching Faculty
            </span>
            <School className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-brand-serif">
              {totalStaff.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Licensed Academic Staff</div>
          </div>
          <div className="text-[11px] text-amber-700 flex items-center gap-1 font-semibold">
            <span>Direct Reporting Active</span>
          </div>
        </div>
      </div>

      {/* 3. CAMPUS DIRECTORY & CONTROLS */}
      <div className="bg-white rounded-3xl border border-[#e6e3dd] shadow-sm overflow-hidden">
        {/* Header & Search */}
        <div className="p-6 border-b border-[#e6e3dd] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-brand-serif">
              Campus Directory &amp; Locations
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review campus locations, assign branch principals, and manage educational facilities across the network directed by the School Director.
            </p>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold border border-slate-200">
            <button
              type="button"
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                typeFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({campuses.length})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('Secondary')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                typeFilter === 'Secondary'
                  ? 'bg-white text-[#0B4F9C] shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Secondary Colleges
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('Primary')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                typeFilter === 'Primary'
                  ? 'bg-white text-purple-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Primary &amp; Nursery
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('Combined')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                typeFilter === 'Combined'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Combined / All-Through</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-6 py-3.5 bg-[#fbfaf8] border-b border-[#e6e3dd] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by campus name, location, or principal..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#e6e3dd] rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]/20 focus:border-[#0B4F9C]"
              />
            </div>

            {/* Campus Dropdown Filter */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold shrink-0">
                <Building2 className="w-3.5 h-3.5 text-[#0B4F9C]" />
                <span className="hidden sm:inline">Filter by Campus:</span>
              </div>
              <select
                value={selectedCampusFilter}
                onChange={(e) => setSelectedCampusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#e6e3dd] text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]/20 cursor-pointer shadow-2xs"
              >
                <option value="ALL">All Campuses ({campuses.length})</option>
                {campuses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-[11px] text-slate-400 font-semibold shrink-0">
              Showing {filteredCampuses.length} of {campuses.length} campus(es)
            </span>
            {(selectedCampusFilter !== 'ALL' || typeFilter !== 'ALL' || searchQuery.trim()) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCampusFilter('ALL');
                  setTypeFilter('ALL');
                  setSearchQuery('');
                }}
                className="text-[11px] font-bold text-[#0B4F9C] hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Campuses Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredCampuses.map((campus) => {
            return (
              <div
                key={campus.id}
                className="p-6 rounded-2xl border transition-all space-y-4 bg-white border-[#e6e3dd] hover:border-slate-300 shadow-2xs hover:shadow-xs"
              >
                {/* Card Header: Title & Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 font-brand-serif">
                        {campus.name}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{campus.type}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {(campus.isCombined || campus.type.toLowerCase().includes('combined') || campus.type.toLowerCase().includes('all-through')) && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        <Layers className="w-3 h-3 text-purple-600" />
                        Combined
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Operational
                    </span>
                  </div>
                </div>

                {/* Division badges */}
                {campus.divisions && campus.divisions.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {campus.divisions.map((div) => (
                      <span
                        key={div}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200"
                      >
                        {div.replace(' (Basic 1-6)', '').replace(' (JSS 1-3)', '').replace(' (SSS 1-3)', '').replace(' (A-Levels)', '')}
                      </span>
                    ))}
                  </div>
                )}

                {/* Details list */}
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{campus.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      Head / Principal: <strong className="text-slate-800">{campus.principalName || 'Unassigned'}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{campus.contactEmail || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{campus.contactPhone || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Capacity: <strong className="text-slate-800">{campus.studentCount || 0} Students</strong></span>
                    <span>Staff: <strong className="text-slate-800">{campus.staffCount || 0} Teachers</strong></span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(campus)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white hover:bg-slate-50 text-slate-700 hover:text-[#0B4F9C] border border-[#e6e3dd]"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#0B4F9C]" />
                    <span>Edit Campus Details</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(campus)}
                      className="p-2 rounded-xl text-slate-500 hover:text-[#0B4F9C] hover:bg-slate-100 transition-colors cursor-pointer border border-[#e6e3dd]"
                      title="Edit Campus Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingCampus(campus)}
                      disabled={campuses.length <= 1}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border border-[#e6e3dd] disabled:opacity-30 disabled:cursor-not-allowed"
                      title={campuses.length <= 1 ? 'Cannot delete only remaining campus' : 'Delete Campus'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. CREATE / EDIT CAMPUS MODAL */}
      {(isCreateModalOpen || editingCampus) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-brand-serif">
                  {editingCampus ? 'Edit Campus Details' : 'Create New Academic Campus'}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingCampus ? 'Update campus specifications and allocated leadership.' : 'Register a new institutional location into the Attwool network.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingCampus(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingCampus ? handleSaveEditCampus : handleSaveNewCampus} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Campus Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Campus Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Attwool College, Lekki Phase 1"
                  className="w-full px-3 py-2 text-xs bg-[#fbfaf8] border border-[#e6e3dd] rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
                />
              </div>

              {/* Campus Classification & Principal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Campus Classification
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => handleTypeSelectChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#fbfaf8] border border-[#e6e3dd] rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
                  >
                    <optgroup label="Single Divisions">
                      {CLASSIFICATION_OPTIONS.filter((o) => o.category === 'Single Division').map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Multi-Division Combinations">
                      {CLASSIFICATION_OPTIONS.filter((o) => o.category === 'Multi-Division Combination').map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Custom / Other">
                      {CLASSIFICATION_OPTIONS.filter((o) => o.category === 'Custom').map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Branch Principal / Campus Head *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPrincipal}
                    onChange={(e) => setFormPrincipal(e.target.value)}
                    placeholder="e.g. Mrs. Funke Balogun"
                    className="w-full px-3 py-2 text-xs bg-[#fbfaf8] border border-[#e6e3dd] rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
                  />
                </div>
              </div>

              {/* Custom combination input if custom is selected */}
              {formType === 'CUSTOM' && (
                <div className="animate-in fade-in">
                  <label className="block text-xs font-bold text-purple-800 mb-1">
                    Custom Combination Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={customTypeInput}
                    onChange={(e) => setCustomTypeInput(e.target.value)}
                    placeholder="e.g. Creche, Nursery, Primary & Junior Secondary"
                    className="w-full px-3 py-2 text-xs bg-white border border-purple-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              {/* Hosted Academic Divisions Multi-Select Pills */}
              <div className="p-3.5 rounded-2xl bg-[#fbfaf8] border border-[#e6e3dd] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Hosted Academic Divisions / Levels
                  </label>
                  <span className="text-[10px] font-semibold text-slate-500">
                    Select all levels operating on this campus
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {PRESET_DIVISIONS.map((divName) => {
                    const isSelected = formDivisions.includes(divName);
                    return (
                      <button
                        key={divName}
                        type="button"
                        onClick={() => handleToggleDivision(divName)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1e293b] text-white shadow-2xs font-semibold'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-[#e6e3dd]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                        <span>{divName}</span>
                      </button>
                    );
                  })}
                </div>

                {(formDivisions.length > 1 || formType.toLowerCase().includes('combined') || formType.toLowerCase().includes('all-through')) && (
                  <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-semibold flex items-center gap-1.5 animate-in fade-in">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>
                      Multi-Tier Combination Campus Active: Accommodates faculty and pupils across multiple education tiers under unified School Director oversight.
                    </span>
                  </div>
                )}
              </div>

              {/* Physical Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Physical Address / Location *
                </label>
                <input
                  type="text"
                  required
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Km 34 Lekki-Epe Expressway, Lagos"
                  className="w-full px-3 py-2 text-xs bg-[#fbfaf8] border border-[#e6e3dd] rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
                />
              </div>

              {/* Contact Email & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="principal@attwoolcollege.com"
                    className="w-full px-3 py-2 text-xs bg-[#fbfaf8] border border-[#e6e3dd] rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Telephone
                  </label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+234 803 123 4567"
                    className="w-full px-3 py-2 text-xs bg-[#fbfaf8] border border-[#e6e3dd] rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
                  />
                </div>
              </div>

              {/* Student & Staff Capacity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formStudents}
                    onChange={(e) => setFormStudents(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs bg-[#fbfaf8] border border-[#e6e3dd] rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Academic Staff Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formStaff}
                    onChange={(e) => setFormStaff(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs bg-[#fbfaf8] border border-[#e6e3dd] rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B4F9C]"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingCampus(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B4F9C] hover:bg-[#07356B] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  {editingCampus ? 'Save Changes' : 'Create Campus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. DELETE CONFIRMATION MODAL */}
      {deletingCampus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 font-brand-serif">
                Delete Academic Campus?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete <strong className="text-slate-800">{deletingCampus.name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Yes, Delete Campus
              </button>
              <button
                type="button"
                onClick={() => setDeletingCampus(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
