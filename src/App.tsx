import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { TopBar } from './components/TopBar/TopBar';
import { LandingPage } from './components/LandingPage';
import { LoginModal } from './components/LoginModal';
import { TeacherDashboard } from './components/TeacherDashboard/TeacherDashboard';
import { ReportWizard } from './components/ReportWizard/ReportWizard';
import { CampusHeadSignoff } from './components/CampusHead/CampusHeadSignoff';
import { DirectorDashboard } from './components/DirectorDashboard/DirectorDashboard';
import { CampusManagement } from './components/CampusManagement/CampusManagement';
import { StaffOnboarding } from './components/StaffOnboarding/StaffOnboarding';
import { AcademicSetup } from './components/Setup/AcademicSetup';
import { ComplianceDashboard } from './components/Compliance/ComplianceDashboard';
import { PdfPreviewModal } from './components/PdfPreviewModal';
import { ProfileModal } from './components/ProfileModal';
import {
  mockQueueReports,
  initialDraftReport,
  defaultCampuses,
  defaultStaffRoster,
  defaultFaculties,
  defaultAcademicClasses
} from './data/mockData';
import type { WeeklyReport, UserSession, Campus, StaffMember, Faculty, AcademicClass } from './types';
import { CheckCircle2 } from 'lucide-react';

type AppView =
  | 'landing'
  | 'director-dashboard'
  | 'teacher-dashboard'
  | 'report-wizard'
  | 'principal-signoff'
  | 'campus-mgt'
  | 'setup'
  | 'staff-onboarding'
  | 'compliance';

export function getDefaultDashboardForRole(role?: string): AppView {
  switch (role) {
    case 'Director':
    case 'CampusHead':
      return 'director-dashboard';
    case 'SuperAdmin':
      return 'campus-mgt';
    case 'Teacher':
    case 'FormTutor':
    default:
      return 'teacher-dashboard';
  }
}

export function getDashboardLabelForRole(role?: string): string {
  switch (role) {
    case 'Director':
    case 'CampusHead':
      return 'Director Executive Academic Dashboard';
    case 'SuperAdmin':
      return 'Campus Management & Administration';
    case 'Teacher':
    case 'FormTutor':
    default:
      return 'Teacher Reporting Workspace';
  }
}

export function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState('Attwool College, Awoyaya');
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [reports, setReports] = useState<WeeklyReport[]>(mockQueueReports);
  const [activeReportForWizard, setActiveReportForWizard] = useState<WeeklyReport>(initialDraftReport);
  const [pdfPreviewReport, setPdfPreviewReport] = useState<WeeklyReport | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [directorSelectedReportId, setDirectorSelectedReportId] = useState<string | undefined>(undefined);

  // Campuses List Management (Persistent in LocalStorage)
  const [campuses, setCampuses] = useState<Campus[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('attwool_campuses_v1');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return defaultCampuses;
  });

  // Staff Roster Management (Persistent in LocalStorage)
  const [staffRoster, setStaffRoster] = useState<StaffMember[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('attwool_staff_roster_v1');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return defaultStaffRoster;
  });

  // Academic Faculties & Subject Setup Management (Persistent in LocalStorage)
  const [faculties, setFaculties] = useState<Faculty[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('attwool_faculties_v1');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return defaultFaculties;
  });

  // Academic Classes & Arms Management (Persistent in LocalStorage)
  const [academicClasses, setAcademicClasses] = useState<AcademicClass[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('attwool_classes_v1');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return defaultAcademicClasses;
  });

  // Guard: Admin does not need to see Report
  useEffect(() => {
    if (currentUser?.role === 'SuperAdmin' && (currentView === 'teacher-dashboard' || currentView === 'principal-signoff' || currentView === 'report-wizard')) {
      setCurrentView('campus-mgt');
    }
  }, [currentUser, currentView]);

  // Theme Management (Day / Night Mode) - Default strictly to clean institutional White Theme like Image 2
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('attwool-theme');
      if (stored === 'light') {
        return 'light';
      }
      if (stored === 'dark') {
        localStorage.setItem('attwool-theme', 'light');
        return 'light';
      }
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('attwool-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4500);
  };

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginSuccess = (user: UserSession) => {
    let resolvedUser = user;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`attwool_profile_${user.email.toLowerCase().trim()}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          resolvedUser = { ...user, ...parsed };
        } catch {}
      }
    }
    setCurrentUser(resolvedUser);
    const targetDashboard = getDefaultDashboardForRole(resolvedUser.role);
    setCurrentView(targetDashboard);
    showToast(`Welcome back, ${resolvedUser.name}! Directing to ${getDashboardLabelForRole(resolvedUser.role)}.`);
  };

  const handleSaveProfile = (updated: { firstName: string; lastName: string; phoneNumber: string; name: string }) => {
    if (!currentUser) return;
    const updatedUser: UserSession = {
      ...currentUser,
      ...updated
    };
    setCurrentUser(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`attwool_profile_${currentUser.email.toLowerCase().trim()}`, JSON.stringify(updated));
    }
    showToast(`Staff profile updated successfully! Identity synced for ${updated.name}.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
    showToast('Signed out of Attwool Schools Academic Governance Portal.');
  };

  // Campus Management actions
  const handleCreateCampus = (newCampus: Campus) => {
    setCampuses((prev) => {
      const updated = [newCampus, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('attwool_campuses_v1', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Campus "${newCampus.name}" created successfully!`);
  };

  const handleUpdateCampus = (updatedCampus: Campus) => {
    setCampuses((prev) => {
      const updated = prev.map((c) => (c.id === updatedCampus.id ? updatedCampus : c));
      if (typeof window !== 'undefined') {
        localStorage.setItem('attwool_campuses_v1', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Campus "${updatedCampus.name}" updated successfully!`);
  };

  const handleDeleteCampus = (campusId: string) => {
    const campusToDelete = campuses.find((c) => c.id === campusId);
    setCampuses((prev) => {
      const updated = prev.filter((c) => c.id !== campusId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('attwool_campuses_v1', JSON.stringify(updated));
      }
      return updated;
    });
    if (campusToDelete && selectedCampus === campusToDelete.name && campuses.length > 1) {
      const fallback = campuses.find((c) => c.id !== campusId)?.name || 'Attwool College, Awoyaya';
      setSelectedCampus(fallback);
    }
    showToast(`Campus deleted successfully.`);
  };

  // Staff Onboarding & Allocations actions
  const handleOnboardStaff = (newStaff: StaffMember) => {
    setStaffRoster((prev) => {
      const updated = [newStaff, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('attwool_staff_roster_v1', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Faculty member "${newStaff.name}" provisioned with activation credentials.`);
  };

  const handleUpdateStaff = (updatedStaff: StaffMember) => {
    setStaffRoster((prev) => {
      const updated = prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s));
      if (typeof window !== 'undefined') {
        localStorage.setItem('attwool_staff_roster_v1', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Allocations updated for "${updatedStaff.name}".`);
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaffRoster((prev) => {
      const updated = prev.filter((s) => s.id !== staffId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('attwool_staff_roster_v1', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Faculty member removed from Attwool roster.`);
  };

  // Academic Structure Setup Actions (Faculty & Subjects)
  const handleCreateFaculty = (newFaculty: Faculty) => {
    setFaculties((prev) => {
      const updated = [newFaculty, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('attwool_faculties_v1', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Faculty "${newFaculty.name}" added to academic structure.`);
  };

  const handleUpdateFaculty = (updatedFaculty: Faculty) => {
    setFaculties((prev) => {
      const updated = prev.map((f) => (f.id === updatedFaculty.id ? updatedFaculty : f));
      if (typeof window !== 'undefined') {
        localStorage.setItem('attwool_faculties_v1', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Faculty "${updatedFaculty.name}" updated successfully.`);
  };

  const handleDeleteFaculty = (facultyId: string) => {
    setFaculties((prev) => {
      const updated = prev.filter((f) => f.id !== facultyId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('attwool_faculties_v1', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Faculty removed from curriculum setup.`);
  };

  const handleAddSubjectToFaculty = (facultyId: string, subjectName: string) => {
    setFaculties((prev) => {
      const updated = prev.map((f) => {
        if (f.id === facultyId) {
          if (f.subjects.includes(subjectName)) return f;
          return { ...f, subjects: [...f.subjects, subjectName] };
        }
        return f;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('attwool_faculties_v1', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Subject "${subjectName}" added.`);
  };

  const handleRemoveSubjectFromFaculty = (facultyId: string, subjectName: string) => {
    setFaculties((prev) => {
      const updated = prev.map((f) => {
        if (f.id === facultyId) {
          return { ...f, subjects: f.subjects.filter((s) => s !== subjectName) };
        }
        return f;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('attwool_faculties_v1', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Subject "${subjectName}" removed.`);
  };

  // Academic Structure Setup Actions (Classes & Arms)
  const handleCreateClass = (newClass: AcademicClass) => {
    setAcademicClasses((prev) => {
      const updated = [newClass, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('attwool_classes_v1', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Class "${newClass.name}" registered in academic structure.`);
  };

  const handleUpdateClass = (updatedClass: AcademicClass) => {
    setAcademicClasses((prev) => {
      const updated = prev.map((c) => (c.id === updatedClass.id ? updatedClass : c));
      if (typeof window !== 'undefined') {
        localStorage.setItem('attwool_classes_v1', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Class "${updatedClass.name}" updated successfully.`);
  };

  const handleDeleteClass = (classId: string) => {
    setAcademicClasses((prev) => {
      const updated = prev.filter((c) => c.id !== classId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('attwool_classes_v1', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Class removed from academic structure.`);
  };

  // Report Wizard actions
  const handleStartNewReport = () => {
    const newReport: WeeklyReport = {
      ...initialDraftReport,
      id: `rep-${Date.now()}`,
      referenceNo: `ATT-2026-T1-W01-${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}`,
      teacherId: currentUser?.id || initialDraftReport.teacherId,
      teacherName: currentUser?.name || initialDraftReport.teacherName,
      teacherEmail: currentUser?.email || initialDraftReport.teacherEmail,
      status: 'DRAFT',
      version: 1
    };
    setActiveReportForWizard(newReport);
    setCurrentView('report-wizard');
  };

  const handleOpenReportInWizard = (rep: WeeklyReport) => {
    setActiveReportForWizard(rep);
    setCurrentView('report-wizard');
  };

  const handleSaveWizardReport = (updated: WeeklyReport) => {
    setReports((prev) => {
      const idx = prev.findIndex((r) => r.id === updated.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [updated, ...prev];
    });
    showToast(`Draft for Week ${updated.termWeekNumber} saved (Version ${updated.version}).`);
  };

  const handleSubmitWizardReport = (submitted: WeeklyReport) => {
    setReports((prev) => {
      const idx = prev.findIndex((r) => r.id === submitted.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = submitted;
        return copy;
      }
      return [submitted, ...prev];
    });
    showToast(`Report ${submitted.referenceNo} successfully submitted directly to Director for review!`);
    setCurrentView('teacher-dashboard');
  };

  // Director Signoff & Review actions
  const handleAcknowledgeReport = (acknowledgedReport: WeeklyReport) => {
    setReports((prev) =>
      prev.map((r) => (r.id === acknowledgedReport.id ? acknowledgedReport : r))
    );
    showToast(`Official Director's Institutional Seal applied to report ${acknowledgedReport.referenceNo}.`);
  };

  const handlePrincipalReturnReport = (returnedReport: WeeklyReport, reason: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === returnedReport.id ? returnedReport : r))
    );
    showToast(`Report ${returnedReport.referenceNo} returned to ${returnedReport.teacherName} with Director recommendations: "${reason}"`);
  };

  // Helper for TopBar title
  const getCurrentViewTitle = () => {
    switch (currentView) {
      case 'director-dashboard':
        return 'Director Executive Academic Dashboard';
      case 'campus-mgt':
        return 'Campus Management & Facilities';
      case 'setup':
        return 'Academic Structure & Curriculum Setup';
      case 'staff-onboarding':
        return 'Staff Onboarding & Faculty Provisioning';
      case 'compliance':
        return 'Executive Compliance Telemetry';
      case 'report-wizard':
        return 'Weekly Curriculum Wizard';
      case 'principal-signoff':
        return 'Director Academic Governance & Staff Review';
      case 'teacher-dashboard':
      default:
        return 'Weekly Reports & Curriculum Submissions';
    }
  };

  return (
    <div className={`min-h-screen font-brand-sans selection:bg-rose-100 selection:text-rose-900 transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#0d1118] text-[#f1f3f7]' : 'bg-[#fbfaf8] text-[#0f172a]'
    }`}>
      {/* Global Notification Toast */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{notificationToast}</span>
        </div>
      )}

      {/* 1. PUBLIC LANDING VIEW */}
      {currentView === 'landing' ? (
        <LandingPage
          onOpenLogin={handleOpenLogin}
          selectedCampus={selectedCampus}
          currentUser={currentUser}
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigateDashboard={() => {
            setCurrentView(getDefaultDashboardForRole(currentUser?.role));
          }}
        />
      ) : (
        /* 2. AUTHENTICATED DASHBOARD WORKSPACE LAYOUT (MATCHING IMAGE 2) */
        <div className="flex min-h-screen">
          {/* Permanent Docked Left Sidebar matching Image 2 */}
          {currentUser && (
            <Sidebar
              currentView={currentView}
              onNavigateView={(view) => setCurrentView(view as AppView)}
              user={currentUser}
              selectedCampus={selectedCampus}
              onLogout={handleLogout}
            />
          )}

          {/* Right Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Minimal Top Bar matching Image 2 */}
            {currentUser && (
              <TopBar
                user={currentUser}
                selectedCampus={selectedCampus}
                campuses={campuses}
                onSelectCampus={setSelectedCampus}
                theme={theme}
                onToggleTheme={toggleTheme}
                onOpenProfile={() => setIsProfileModalOpen(true)}
                currentViewTitle={getCurrentViewTitle()}
              />
            )}

            {/* Dynamic View Canvas */}
            <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
              {/* Campus Management View: Where campuses are created, edited, and deleted */}
              {currentView === 'campus-mgt' && currentUser && (
                <CampusManagement
                  campuses={campuses}
                  selectedCampus={selectedCampus}
                  onSelectCampus={setSelectedCampus}
                  onCreateCampus={handleCreateCampus}
                  onUpdateCampus={handleUpdateCampus}
                  onDeleteCampus={handleDeleteCampus}
                  currentUser={currentUser}
                />
              )}

              {/* Academic Setup View: Faculty, Subject & Class Arm Setup */}
              {currentView === 'setup' && currentUser && (
                <AcademicSetup
                  faculties={faculties}
                  academicClasses={academicClasses}
                  onCreateFaculty={handleCreateFaculty}
                  onUpdateFaculty={handleUpdateFaculty}
                  onDeleteFaculty={handleDeleteFaculty}
                  onAddSubjectToFaculty={handleAddSubjectToFaculty}
                  onRemoveSubjectFromFaculty={handleRemoveSubjectFromFaculty}
                  onCreateClass={handleCreateClass}
                  onUpdateClass={handleUpdateClass}
                  onDeleteClass={handleDeleteClass}
                />
              )}

              {/* Staff Onboarding View: Where staff/teachers are invited, provisioned and allocated */}
              {currentView === 'staff-onboarding' && currentUser && (
                <StaffOnboarding
                  staffList={staffRoster}
                  campuses={campuses}
                  currentUser={currentUser}
                  onOnboardStaff={handleOnboardStaff}
                  onUpdateStaff={handleUpdateStaff}
                  onDeleteStaff={handleDeleteStaff}
                  faculties={faculties}
                  academicClasses={academicClasses}
                />
              )}

              {/* Reports View: Where teachers or staff report are seen and can be reviewed */}
              {currentView === 'teacher-dashboard' && currentUser && (
                <TeacherDashboard
                  user={currentUser}
                  reports={reports.filter(
                    (r) =>
                      r.teacherId === currentUser.id ||
                      r.teacherEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
                      currentUser.role !== 'Teacher'
                  )}
                  onOpenReport={handleOpenReportInWizard}
                  onStartNewReport={handleStartNewReport}
                  onPreviewPdf={(rep) => setPdfPreviewReport(rep)}
                />
              )}

              {/* Director Executive Academic Dashboard: First view when Director logs in */}
              {currentView === 'director-dashboard' && currentUser && (
                <DirectorDashboard
                  user={currentUser}
                  campuses={campuses}
                  staffList={staffRoster}
                  reports={reports}
                  onNavigateToReports={() => {
                    setDirectorSelectedReportId(undefined);
                    setCurrentView('principal-signoff');
                  }}
                  onNavigateToReviewReport={(reportId) => {
                    setDirectorSelectedReportId(reportId);
                    setCurrentView('principal-signoff');
                  }}
                />
              )}

              {currentView === 'principal-signoff' && currentUser && (
                <CampusHeadSignoff
                  user={currentUser}
                  reports={reports}
                  selectedReportIdProp={directorSelectedReportId}
                  onAcknowledgeReport={handleAcknowledgeReport}
                  onReturnReport={handlePrincipalReturnReport}
                  onPreviewPdf={(rep) => setPdfPreviewReport(rep)}
                />
              )}

              {currentView === 'report-wizard' && (
                <ReportWizard
                  initialReport={activeReportForWizard}
                  onSaveReport={handleSaveWizardReport}
                  onSubmitReport={handleSubmitWizardReport}
                  onBackToDashboard={() =>
                    setCurrentView(currentUser?.role === 'Teacher' ? 'teacher-dashboard' : 'principal-signoff')
                  }
                />
              )}

              {currentView === 'compliance' && (
                <ComplianceDashboard
                  reports={reports}
                  selectedCampus={selectedCampus}
                  onSelectCampus={setSelectedCampus}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Google SSO / Staff Credentials Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLogin}
        onLoginSuccess={handleLoginSuccess}
        selectedCampus={selectedCampus}
      />

      {/* QuestPDF Preview Modal */}
      {pdfPreviewReport && (
        <PdfPreviewModal
          isOpen={!!pdfPreviewReport}
          onClose={() => setPdfPreviewReport(null)}
          report={pdfPreviewReport}
        />
      )}

      {/* Staff Profile Modal */}
      {currentUser && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={currentUser}
          onSaveProfile={handleSaveProfile}
        />
      )}
    </div>
  );
}

export default App;
