// System Domain Types for Attwool Schools Weekly Reporting Portal

export type ReportStatus = 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'RETURNED' | 'REVIEWED' | 'ACKNOWLEDGED';

export type YesNo = 'YES' | 'NO';
export type Coverage = 'YES' | 'PARTIALLY' | 'NO';
export type Prepared = 'YES' | 'PARTIALLY' | 'NO';
export type Understanding = 'VERY_WELL' | 'WELL' | 'FAIRLY' | 'POORLY';
export type MarkingStatus = 'YES' | 'PARTIALLY' | 'NO' | 'NOT_APPLICABLE';
export type RecordsUpdated = 'YES' | 'PARTIALLY' | 'NO';
export type DutiesCompleted = 'YES' | 'PARTIALLY' | 'NO' | 'NOT_APPLICABLE';

export interface GeneralSection {
  classesTaught: string;
  subjectsTaught: string;
  isFormTutor: boolean;
  formTutorClassId?: string;
  formTutorClassName?: string;
  studentCount?: number;
}

export interface TeachingSection {
  topicsCovered: Coverage;
  notCoveredReason?: string;
  notCoveredTopics?: string;
  methodsUsed: string;
  lessonNotesPrepared: Prepared;
}

export interface LearningSection {
  assessmentsConducted: string;
  understanding: Understanding;
  difficulties?: string;
  markingStatus: MarkingStatus;
  supportNeededStudents?: string;
}

export interface AttendanceSection {
  hasAbsences: boolean;
  absenceDetails?: string;
  followUpEfforts?: string;
  feedbackReceived?: string;
  hasSupportNeeds: boolean;
  supportProvided?: string;
  hasWelfareConcern: boolean;
  welfareDetails?: string;
  welfareAction?: string;
}

export interface ClassroomSection {
  hasChallenges: boolean;
  challengeDetails?: string;
  recordsUpdated: RecordsUpdated;
  dutiesCompleted: DutiesCompleted;
  outstandingTasks?: string;
}

export interface ReflectionSection {
  majorAchievement: string;
  wentWell: string;
  challenges: string;
  supportNeeded: string;
  improveNextWeek: string;
  goal1: string;
  goal2: string;
}

export interface SelfAssessmentSection {
  preparationRating: number;
  effectivenessRating: number;
  assessmentRating: number;
  managementRating: number;
  recordsRating: number;
  conductRating: number;
  evidence: string;
  improvementArea: string;
  additionalNotes?: string;
}

export interface ReviewComment {
  id?: string;
  section: string;
  comment: string;
}

export interface ReviewData {
  id: string;
  reviewerId: string;
  reviewerName: string;
  status: ReportStatus;
  overallComment?: string;
  preparationRating: number;
  effectivenessRating: number;
  assessmentRating: number;
  managementRating: number;
  recordsRating: number;
  conductRating: number;
  reviewedAt: string;
  comments: ReviewComment[];
}

export interface AcknowledgementData {
  id: string;
  evaluatorId: string;
  evaluatorName: string;
  acknowledgedAt: string;
}

export interface AttachmentItem {
  id: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  storagePath: string;
}

export interface WeeklyReport {
  id: string;
  referenceNo: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  campusId: string;
  campusName: string;
  termId: string;
  termName: string;
  termWeekNumber: number;
  weekStart: string;
  weekEnd: string;
  status: ReportStatus;
  isLate: boolean;
  version: number;
  submittedAt?: string;
  reviewedAt?: string;
  acknowledgedAt?: string;
  general: GeneralSection;
  teaching: TeachingSection;
  learning: LearningSection;
  attendance: AttendanceSection;
  classroom: ClassroomSection;
  reflection: ReflectionSection;
  selfAssessment: SelfAssessmentSection;
  review?: ReviewData;
  acknowledgement?: AcknowledgementData;
  attachments: AttachmentItem[];
}

export type SystemRole = 'Teacher' | 'FormTutor' | 'Director' | 'CampusHead' | 'SuperAdmin';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: SystemRole;
  isFormTutor: boolean;
  campus: string;
  campusId: string;
  department?: string;
  authProvider: 'Google' | 'Local';
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface Campus {
  id: string;
  name: string;
  type: string;
  divisions?: string[];
  isCombined?: boolean;
  location: string;
  principalName?: string;
  contactEmail?: string;
  contactPhone?: string;
  studentCount?: number;
  staffCount?: number;
  isActive?: boolean;
}

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: SystemRole;
  campusId: string;
  campusName: string;
  department: string;
  subjects: string[];
  classes: string[];
  isFormTutor: boolean;
  formTutorClass?: string;
  status: 'ACTIVE' | 'PENDING_ACTIVATION';
  invitedAt?: string;
  activatedAt?: string;
  tempOtp?: string;
}

export interface Faculty {
  id: string;
  name: string;
  category: 'Senior Secondary' | 'Junior Secondary' | 'Primary School' | 'Nursery & Early Years' | 'Cross-Cutting';
  description?: string;
  subjects: string[];
}

export interface AcademicClass {
  id: string;
  name: string;
  tier: 'Senior Secondary' | 'Junior Secondary' | 'Primary School' | 'Nursery & Early Years';
  gradeLevel: string;
  arm: string;
  campusId?: string;
  campusName?: string;
}
