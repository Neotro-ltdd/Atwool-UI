import type { WeeklyReport, UserSession, Campus, StaffMember, Faculty, AcademicClass } from '../types';

export const mockUsers: Record<string, UserSession> = {
  teacher: {
    id: 'a1111111-0000-0000-0000-000000000001',
    name: 'Mr. Babatunde Fashola',
    email: 'teacher.physics@attwoolcollege.com',
    role: 'Teacher',
    isFormTutor: true,
    campus: 'Attwool College, Awoyaya',
    campusId: '11111111-0000-0000-0000-000000000001',
    department: 'Sciences & Mathematics',
    authProvider: 'Google'
  },
  director: {
    id: 'a1111111-0000-0000-0000-000000000003',
    name: 'Dr. Folashade Adeyemi',
    email: 'director@attwoolcollege.com',
    role: 'Director',
    isFormTutor: false,
    campus: 'All Campuses (Attwool Schools Network)',
    campusId: 'network-all-campuses',
    department: 'Executive Directorship & Network Governance',
    authProvider: 'Local'
  },
  admin: {
    id: 'a1111111-0000-0000-0000-000000000004',
    name: 'Alhaji Ibrahim Danjuma',
    email: 'admin.governance@attwoolcollege.com',
    role: 'SuperAdmin',
    isFormTutor: false,
    campus: 'Attwool College, Awoyaya',
    campusId: '11111111-0000-0000-0000-000000000001',
    department: 'School Administration & Staff On-boarding',
    authProvider: 'Local'
  },
  admin_official: {
    id: 'a1111111-0000-0000-0000-000000000010',
    name: 'Attwool Administrator',
    email: 'Attwoolcollege1@gmail.com',
    role: 'SuperAdmin',
    isFormTutor: false,
    campus: 'Attwool College, Awoyaya',
    campusId: '11111111-0000-0000-0000-000000000001',
    department: 'School Administration & Governance',
    authProvider: 'Local'
  },
  director_official: {
    id: 'a1111111-0000-0000-0000-000000000011',
    name: 'Taiwo Adetunji (Director of Schools)',
    email: 'Adetunjitaiwo3@gmail.com',
    role: 'Director',
    isFormTutor: false,
    campus: 'All Campuses (Attwool Schools Network)',
    campusId: 'network-all-campuses',
    department: 'Executive Directorship & Network Governance',
    authProvider: 'Local'
  },
  teacher_official: {
    id: 'a1111111-0000-0000-0000-000000000012',
    name: 'Neotro Instructor',
    email: 'neotroltd@gmail.com',
    role: 'Teacher',
    isFormTutor: true,
    campus: 'Attwool College, Awoyaya',
    campusId: '11111111-0000-0000-0000-000000000001',
    department: 'Sciences & Technology',
    authProvider: 'Local'
  }
};

export const initialDraftReport: WeeklyReport = {
  id: 'rep-0001-2026-w01',
  referenceNo: 'ATT-2026-T1-W01-8F3A',
  teacherId: 'a1111111-0000-0000-0000-000000000001',
  teacherName: 'Mr. Babatunde Fashola',
  teacherEmail: 'teacher.physics@attwoolcollege.com',
  campusId: '11111111-0000-0000-0000-000000000001',
  campusName: 'Attwool College, Awoyaya',
  termId: '33333333-0000-0000-0000-000000000001',
  termName: 'First Term 2026/2027',
  termWeekNumber: 1,
  weekStart: '2026-09-07',
  weekEnd: '2026-09-11',
  status: 'DRAFT',
  isLate: false,
  version: 1,
  general: {
    classesTaught: 'SS 1 Science, SS 2 Arts',
    subjectsTaught: 'Physics',
    isFormTutor: true,
    formTutorClassId: 'cls-ss1-sci',
    formTutorClassName: 'SS 1 Science',
    studentCount: 22
  },
  teaching: {
    topicsCovered: 'PARTIALLY',
    notCoveredReason: 'Laboratory power disruption delayed practical experiment for optics.',
    notCoveredTopics: 'Refraction through glass prisms and verification of Snell’s Law.',
    methodsUsed: 'Interactive whiteboard demonstrations, peer group inquiry, and guided textbook exercises.',
    lessonNotesPrepared: 'YES'
  },
  learning: {
    assessmentsConducted: 'Diagnostic weekly quiz on rectilinear propagation of light (20 questions).',
    understanding: 'WELL',
    difficulties: 'Four students struggled with calculating angles of refraction in dense optical media.',
    markingStatus: 'YES',
    supportNeededStudents: 'Tobi Alabi and Zainab Musa require remedial lunch clinic sessions.'
  },
  attendance: {
    hasAbsences: true,
    absenceDetails: 'David Adeleke was absent on Tuesday and Wednesday due to malaria fever.',
    followUpEfforts: 'Parent contacted via telephone; authentic doctor’s excuse note received on Thursday.',
    feedbackReceived: 'Parent confirmed student has fully recovered and resumed normal classes.',
    hasSupportNeeds: false,
    supportProvided: '',
    hasWelfareConcern: true,
    welfareDetails: 'Student expressed acute anxiety regarding upcoming mid-term physics examinations.',
    welfareAction: 'Referred to campus guidance counsellor Mrs. Peters for stress management coaching.'
  },
  classroom: {
    hasChallenges: true,
    challengeDetails: 'Minor transition noise during movement from physics lecture room to the main lab.',
    recordsUpdated: 'YES',
    dutiesCompleted: 'YES',
    outstandingTasks: ''
  },
  reflection: {
    majorAchievement: 'Over 85% of SS 1 students achieved grade B and above in the optics theory quiz.',
    wentWell: 'High student enthusiasm and active engagement during ray box optical demonstrations.',
    challenges: 'Insufficient optical ray kits in the laboratory necessitated larger student clusters.',
    supportNeeded: 'Requisition for 4 additional optical ray boxes submitted to Science HOD.',
    improveNextWeek: 'Provide differentiated scaffolding worksheets for struggling quantitative students.',
    goal1: 'Complete practical assessments on critical angle and total internal reflection.',
    goal2: 'Conduct 30-minute remedial tutorial for the 4 borderline physics students.'
  },
  selfAssessment: {
    preparationRating: 4,
    effectivenessRating: 4,
    assessmentRating: 5,
    managementRating: 4,
    recordsRating: 5,
    conductRating: 5,
    evidence: 'Submitted verified lesson notes on Monday 8:00 AM; graded all 22 quiz scripts within 24 hours.',
    improvementArea: 'Allocate more time for plenary summary discussions at the end of each double period.',
    additionalNotes: 'Ready for scheduled HOD termly lesson observation in Week 4.'
  },
  attachments: [
    {
      id: 'att-01',
      fileName: 'Physics_SS1_Optics_Quiz_Gradesheet.pdf',
      contentType: 'application/pdf',
      sizeBytes: 245760,
      storagePath: 'reports/2026/attachments/Physics_SS1_Optics_Quiz_Gradesheet.pdf'
    }
  ]
};

export const mockQueueReports: WeeklyReport[] = [
  initialDraftReport,
  {
    ...initialDraftReport,
    id: 'rep-0002-2026-w01',
    referenceNo: 'ATT-2026-T1-W01-9C4B',
    teacherName: 'Mrs. Amina Yusuf',
    teacherEmail: 'amina.yusuf@attwoolcollege.com',
    status: 'SUBMITTED',
    isLate: true,
    submittedAt: '2026-09-11T17:42:00Z',
    general: {
      classesTaught: 'JSS 2 Diamond',
      subjectsTaught: 'Mathematics',
      isFormTutor: false,
      studentCount: 26
    },
    teaching: {
      topicsCovered: 'YES',
      methodsUsed: 'Problem-based learning with geometry instruments.',
      lessonNotesPrepared: 'YES'
    },
    learning: {
      assessmentsConducted: 'Mid-week class exercise on algebraic factoring.',
      understanding: 'VERY_WELL',
      markingStatus: 'YES'
    },
    attendance: {
      hasAbsences: false,
      hasSupportNeeds: false,
      hasWelfareConcern: false
    },
    classroom: {
      hasChallenges: false,
      recordsUpdated: 'YES',
      dutiesCompleted: 'YES'
    },
    reflection: {
      majorAchievement: 'All students demonstrated mastery of quadratic factorization methods.',
      wentWell: 'Rapid peer problem solving on the board.',
      challenges: 'None recorded this week.',
      supportNeeded: 'None at this time.',
      improveNextWeek: 'Introduce real-life word problems applying quadratic equations.',
      goal1: 'Review algebraic fractions with JSS 2 Diamond.',
      goal2: 'Prepare standardized termly assessment rubric.'
    },
    selfAssessment: {
      preparationRating: 5,
      effectivenessRating: 5,
      assessmentRating: 4,
      managementRating: 5,
      recordsRating: 5,
      conductRating: 5,
      evidence: 'Lesson plan stamped by HOD on Monday morning.',
      improvementArea: 'Expand stretch questions for exceptionally gifted students.'
    }
  },
  {
    ...initialDraftReport,
    id: 'rep-0003-2026-w01',
    referenceNo: 'ATT-2026-T1-W01-1D7E',
    teacherName: 'Mr. Emmanuel Chukwu',
    teacherEmail: 'emmanuel.c@attwoolcollege.com',
    status: 'REVIEWED',
    isLate: false,
    submittedAt: '2026-09-11T14:15:00Z',
    reviewedAt: '2026-09-12T10:30:00Z',
    general: {
      classesTaught: 'SS 2 Science',
      subjectsTaught: 'Chemistry',
      isFormTutor: true,
      formTutorClassId: 'cls-ss2-sci',
      formTutorClassName: 'SS 2 Science',
      studentCount: 24
    },
    review: {
      id: 'rev-003',
      reviewerId: 'a1111111-0000-0000-0000-000000000002',
      reviewerName: 'Mrs. Chinedu Okonkwo',
      status: 'REVIEWED',
      overallComment: 'Thorough, exemplary lab records and highly proactive student attendance follow-up.',
      preparationRating: 5,
      effectivenessRating: 5,
      assessmentRating: 4,
      managementRating: 5,
      recordsRating: 5,
      conductRating: 5,
      reviewedAt: '2026-09-12T10:30:00Z',
      comments: [
        { section: 'teaching', comment: 'Safe laboratory handling observed during acid titration experiments.' },
        { section: 'attendance', comment: 'Prompt communication with parents regarding absent students.' }
      ]
    }
  },
  {
    ...initialDraftReport,
    id: 'rep-0004-2026-w01',
    referenceNo: 'ATT-2026-T1-W01-3A2F',
    teacherName: 'Mr. Kelechi Okafor',
    teacherEmail: 'kelechi.o@attwoolcollege.com',
    status: 'ACKNOWLEDGED',
    isLate: false,
    submittedAt: '2026-09-11T15:20:00Z',
    reviewedAt: '2026-09-12T11:00:00Z',
    acknowledgedAt: '2026-09-12T16:00:00Z',
    general: {
      classesTaught: 'SS 3 Science',
      subjectsTaught: 'Biology',
      isFormTutor: false,
      studentCount: 20
    },
    review: {
      id: 'rev-004',
      reviewerId: 'a1111111-0000-0000-0000-000000000002',
      reviewerName: 'Mrs. Chinedu Okonkwo',
      status: 'REVIEWED',
      overallComment: 'Consistent WAEC/NECO syllabus pacing with rigorous continuous assessment testing.',
      preparationRating: 5,
      effectivenessRating: 5,
      assessmentRating: 5,
      managementRating: 5,
      recordsRating: 5,
      conductRating: 5,
      reviewedAt: '2026-09-12T11:00:00Z',
      comments: []
    },
    acknowledgement: {
      id: 'ack-004',
      evaluatorId: 'a1111111-0000-0000-0000-000000000003',
      evaluatorName: 'Dr. Folashade Adeyemi',
      acknowledgedAt: '2026-09-12T16:00:00Z'
    }
  }
];

export const defaultCampuses: Campus[] = [
  {
    id: '11111111-0000-0000-0000-000000000001',
    name: 'Attwool College, Awoyaya',
    type: 'Secondary College',
    divisions: ['Junior Secondary (JSS 1-3)', 'Senior Secondary (SSS 1-3)', 'Sixth Form & Cambridge (A-Levels)'],
    location: 'Km 34 Lekki-Epe Expressway, Awoyaya, Lagos',
    principalName: 'Dr. Folashade Adeyemi',
    contactEmail: 'principal.awoyaya@attwoolcollege.com',
    contactPhone: '+234 803 123 4567',
    studentCount: 450,
    staffCount: 38,
    isActive: true
  },
  {
    id: '11111111-0000-0000-0000-000000000002',
    name: 'Attwool College, Agungi',
    type: 'Secondary College',
    divisions: ['Junior Secondary (JSS 1-3)', 'Senior Secondary (SSS 1-3)'],
    location: 'Agungi Road, off Lekki Expressway, Lekki, Lagos',
    principalName: 'Mrs. Funke Balogun',
    contactEmail: 'principal.agungi@attwoolcollege.com',
    contactPhone: '+234 802 987 6543',
    studentCount: 380,
    staffCount: 32,
    isActive: true
  },
  {
    id: '11111111-0000-0000-0000-000000000003',
    name: 'Attwool Sunflower, Awoyaya',
    type: 'Primary & Nursery',
    divisions: ['Crèche & Early Years', 'Nursery & Kindergarten', 'Primary School (Basic 1-6)'],
    location: 'Awoyaya Annex, Ibeju-Lekki, Lagos',
    principalName: 'Mrs. Ngozi Eze',
    contactEmail: 'head.sunflower.awoyaya@attwoolcollege.com',
    contactPhone: '+234 814 555 7890',
    studentCount: 290,
    staffCount: 24,
    isActive: true
  },
  {
    id: '11111111-0000-0000-0000-000000000004',
    name: 'Attwool Sunflower, Agungi',
    type: 'Primary & Nursery',
    divisions: ['Nursery & Kindergarten', 'Primary School (Basic 1-6)'],
    location: 'Agungi Main Campus, Lekki, Lagos',
    principalName: 'Mr. David Adeleke',
    contactEmail: 'head.sunflower.agungi@attwoolcollege.com',
    contactPhone: '+234 809 333 1122',
    studentCount: 310,
    staffCount: 26,
    isActive: true
  }
];

export const defaultStaffRoster: StaffMember[] = [
  {
    id: 'staff-official-admin',
    firstName: 'Attwool',
    lastName: 'Admin',
    name: 'Attwool Administrator',
    email: 'Attwoolcollege1@gmail.com',
    phoneNumber: '+234 802 000 0001',
    role: 'SuperAdmin',
    campusId: '11111111-0000-0000-0000-000000000001',
    campusName: 'Attwool College, Awoyaya',
    department: 'School Administration & Governance',
    subjects: ['Governance & Compliance'],
    classes: ['All Divisions'],
    isFormTutor: false,
    status: 'ACTIVE',
    activatedAt: '2026-09-01T08:00:00Z',
    tempOtp: '849201'
  },
  {
    id: 'staff-official-director',
    firstName: 'Taiwo',
    lastName: 'Adetunji',
    name: 'Taiwo Adetunji (Director of Schools)',
    email: 'Adetunjitaiwo3@gmail.com',
    phoneNumber: '+234 802 000 0002',
    role: 'Director',
    campusId: 'network-all-campuses',
    campusName: 'All Campuses (Attwool Schools Network)',
    department: 'Executive Directorship & Network Governance',
    subjects: ['Educational Leadership & Governance'],
    classes: ['All Network Divisions'],
    isFormTutor: false,
    status: 'ACTIVE',
    activatedAt: '2026-09-01T08:00:00Z',
    tempOtp: '849201'
  },
  {
    id: 'staff-official-teacher',
    firstName: 'Neotro',
    lastName: 'Instructor',
    name: 'Neotro Instructor',
    email: 'neotroltd@gmail.com',
    phoneNumber: '+234 802 000 0003',
    role: 'Teacher',
    campusId: '11111111-0000-0000-0000-000000000001',
    campusName: 'Attwool College, Awoyaya',
    department: 'Sciences & Technology',
    subjects: ['Computer Science', 'Physics'],
    classes: ['SS 1 Science', 'SS 2 Science'],
    isFormTutor: true,
    formTutorClass: 'SS 1 Science',
    status: 'ACTIVE',
    activatedAt: '2026-09-01T08:00:00Z',
    tempOtp: '849201'
  },
  {
    id: 'staff-001',
    firstName: 'Babatunde',
    lastName: 'Fashola',
    name: 'Mr. Babatunde Fashola',
    email: 'teacher.physics@attwoolcollege.com',
    phoneNumber: '+234 803 234 5678',
    role: 'Teacher',
    campusId: '11111111-0000-0000-0000-000000000001',
    campusName: 'Attwool College, Awoyaya',
    department: 'Sciences & Mathematics',
    subjects: ['Physics', 'Basic Science'],
    classes: ['SS 1 Science', 'SS 2 Science'],
    isFormTutor: true,
    formTutorClass: 'SS 1 Science',
    status: 'ACTIVE',
    activatedAt: '2026-09-01T08:00:00Z',
    tempOtp: '849201'
  },
  {
    id: 'staff-002',
    firstName: 'Amina',
    lastName: 'Yusuf',
    name: 'Mrs. Amina Yusuf',
    email: 'amina.yusuf@attwoolcollege.com',
    phoneNumber: '+234 802 345 6789',
    role: 'Teacher',
    campusId: '11111111-0000-0000-0000-000000000001',
    campusName: 'Attwool College, Awoyaya',
    department: 'Languages & Humanities',
    subjects: ['English Language (SSS)', 'English Language (JSS)', 'Literature-in-English'],
    classes: ['SS 1 Science', 'SS 2 Arts', 'JSS 3 Gold'],
    isFormTutor: false,
    status: 'ACTIVE',
    activatedAt: '2026-09-02T09:30:00Z',
    tempOtp: '849201'
  },
  {
    id: 'staff-003',
    firstName: 'Ngozi',
    lastName: 'Eze',
    name: 'Mrs. Ngozi Eze',
    email: 'ngozi.eze@attwoolcollege.com',
    phoneNumber: '+234 814 555 7890',
    role: 'Teacher',
    campusId: '11111111-0000-0000-0000-000000000003',
    campusName: 'Attwool Sunflower, Awoyaya',
    department: 'Primary Education & Basic Studies',
    subjects: ['English Studies & Grammar', 'Primary Mathematics', 'Basic Science & Technology (Primary)', 'Phonics & Diction'],
    classes: ['Primary 3 Sapphire'],
    isFormTutor: true,
    formTutorClass: 'Primary 3 Sapphire',
    status: 'ACTIVE',
    activatedAt: '2026-09-01T10:15:00Z',
    tempOtp: '849201'
  },
  {
    id: 'staff-004',
    firstName: 'Funke',
    lastName: 'Balogun',
    name: 'Mrs. Funke Balogun',
    email: 'funke.balogun@attwoolcollege.com',
    phoneNumber: '+234 802 987 6543',
    role: 'Teacher',
    campusId: '11111111-0000-0000-0000-000000000004',
    campusName: 'Attwool Sunflower, Agungi',
    department: 'Early Childhood Care & Education',
    subjects: ['Early Literacy & Letter Sounds', 'Numeracy & Number Work', 'Rhymes & Phonics', 'Creative Arts & Coloring'],
    classes: ['Nursery 2 Gold'],
    isFormTutor: true,
    formTutorClass: 'Nursery 2 Gold',
    status: 'ACTIVE',
    activatedAt: '2026-09-03T11:00:00Z',
    tempOtp: '849201'
  },
  {
    id: 'staff-005',
    firstName: 'Folashade',
    lastName: 'Adeyemi',
    name: 'Dr. Folashade Adeyemi',
    email: 'director@attwoolcollege.com',
    phoneNumber: '+234 803 123 4567',
    role: 'Director',
    campusId: 'network-all-campuses',
    campusName: 'All Campuses (Attwool Schools Network)',
    department: 'Executive Directorship & Network Governance',
    subjects: ['Educational Leadership & Governance'],
    classes: ['All Network Divisions'],
    isFormTutor: false,
    status: 'ACTIVE',
    activatedAt: '2026-08-15T08:00:00Z',
    tempOtp: '849201'
  },
  {
    id: 'staff-006',
    firstName: 'Ibrahim',
    lastName: 'Danjuma',
    name: 'Alhaji Ibrahim Danjuma',
    email: 'admin.governance@attwoolcollege.com',
    phoneNumber: '+234 802 111 2233',
    role: 'SuperAdmin',
    campusId: '11111111-0000-0000-0000-000000000001',
    campusName: 'Attwool College, Awoyaya',
    department: 'School Administration & Staff On-boarding',
    subjects: ['Governance & Compliance'],
    classes: ['All Divisions'],
    isFormTutor: false,
    status: 'ACTIVE',
    activatedAt: '2026-08-01T08:00:00Z',
    tempOtp: '849201'
  },
  {
    id: 'staff-007',
    firstName: 'Segun',
    lastName: 'Adeleke',
    name: 'Mr. Segun Adeleke',
    email: 'segun.adeleke@attwoolcollege.com',
    phoneNumber: '+234 813 678 9012',
    role: 'Teacher',
    campusId: '11111111-0000-0000-0000-000000000001',
    campusName: 'Attwool College, Awoyaya',
    department: 'Sciences & Mathematics',
    subjects: ['Physics', 'Further Mathematics'],
    classes: ['SS 3 Science'],
    isFormTutor: false,
    status: 'PENDING_ACTIVATION',
    invitedAt: '2026-11-03T14:00:00Z',
    tempOtp: '849201'
  }
];

export const defaultFaculties: Faculty[] = [
  {
    id: 'fac-science',
    name: 'Science & Mathematics',
    category: 'Senior Secondary',
    description: 'Natural and physical sciences, quantitative reasoning, and STEM disciplines.',
    subjects: [
      'Physics',
      'Chemistry',
      'Biology',
      'Mathematics',
      'Further Mathematics',
      'Agricultural Science',
      'Technical Drawing',
      'Computer Studies & ICT'
    ]
  },
  {
    id: 'fac-arts',
    name: 'Arts & Humanities',
    category: 'Senior Secondary',
    description: 'Literature, linguistic studies, history, civic culture, and creative arts.',
    subjects: [
      'English Language (SSS)',
      'Literature-in-English',
      'Government',
      'History',
      'Christian Religious Studies',
      'Islamic Religious Studies',
      'Visual Arts',
      'Music',
      'French',
      'Civic Education (SSS)'
    ]
  },
  {
    id: 'fac-commercial',
    name: 'Commercial & Business Studies',
    category: 'Senior Secondary',
    description: 'Accounting, economic analysis, commercial transactions, and entrepreneurship.',
    subjects: [
      'Financial Accounting',
      'Commerce',
      'Economics',
      'Book Keeping',
      'Store Management',
      'Marketing',
      'Office Practice',
      'Insurance'
    ]
  },
  {
    id: 'fac-jss',
    name: 'Junior Secondary Studies',
    category: 'Junior Secondary',
    description: 'Foundational secondary curriculum preparing learners for BECE examinations.',
    subjects: [
      'English Language (JSS)',
      'General Mathematics (JSS)',
      'Basic Science',
      'Basic Technology',
      'Civic Education (JSS)',
      'Business Studies',
      'Social Studies',
      'Home Economics',
      'Agricultural Science (JSS)',
      'Physical & Health Education'
    ]
  },
  {
    id: 'fac-primary',
    name: 'Primary Education & Basic Studies',
    category: 'Primary School',
    description: 'Core literacy, primary numeracy, foundational sciences, and reasoning.',
    subjects: [
      'English Studies & Grammar',
      'Primary Mathematics',
      'Basic Science & Technology (Primary)',
      'Phonics & Diction',
      'Social Studies (Primary)',
      'Verbal Reasoning',
      'Quantitative Reasoning',
      'Cultural & Creative Arts',
      'Christian Religious Studies (Primary)'
    ]
  },
  {
    id: 'fac-eyfs',
    name: 'Early Childhood Care & Education',
    category: 'Nursery & Early Years',
    description: 'Early Years Foundation Stage (EYFS), motor development, and phonics readiness.',
    subjects: [
      'Early Literacy & Letter Sounds',
      'Numeracy & Number Work',
      'Sensory Exploration',
      'Rhymes & Phonics',
      'Creative Arts & Coloring',
      'Social & Emotional Habits',
      'Physical & Motor Development'
    ]
  }
];

export const defaultAcademicClasses: AcademicClass[] = [
  // Senior Secondary
  { id: 'cls-ss1-sci', name: 'SS 1 Science', tier: 'Senior Secondary', gradeLevel: 'SS 1', arm: 'Science' },
  { id: 'cls-ss1-art', name: 'SS 1 Arts', tier: 'Senior Secondary', gradeLevel: 'SS 1', arm: 'Arts' },
  { id: 'cls-ss1-com', name: 'SS 1 Commercial', tier: 'Senior Secondary', gradeLevel: 'SS 1', arm: 'Commercial' },
  { id: 'cls-ss2-sci', name: 'SS 2 Science', tier: 'Senior Secondary', gradeLevel: 'SS 2', arm: 'Science' },
  { id: 'cls-ss2-art', name: 'SS 2 Arts', tier: 'Senior Secondary', gradeLevel: 'SS 2', arm: 'Arts' },
  { id: 'cls-ss2-com', name: 'SS 2 Commercial', tier: 'Senior Secondary', gradeLevel: 'SS 2', arm: 'Commercial' },
  { id: 'cls-ss3-sci', name: 'SS 3 Science', tier: 'Senior Secondary', gradeLevel: 'SS 3', arm: 'Science' },
  { id: 'cls-ss3-art', name: 'SS 3 Arts', tier: 'Senior Secondary', gradeLevel: 'SS 3', arm: 'Arts' },
  { id: 'cls-ss3-com', name: 'SS 3 Commercial', tier: 'Senior Secondary', gradeLevel: 'SS 3', arm: 'Commercial' },

  // Junior Secondary
  { id: 'cls-jss1-dia', name: 'JSS 1 Diamond', tier: 'Junior Secondary', gradeLevel: 'JSS 1', arm: 'Diamond' },
  { id: 'cls-jss1-gld', name: 'JSS 1 Gold', tier: 'Junior Secondary', gradeLevel: 'JSS 1', arm: 'Gold' },
  { id: 'cls-jss2-dia', name: 'JSS 2 Diamond', tier: 'Junior Secondary', gradeLevel: 'JSS 2', arm: 'Diamond' },
  { id: 'cls-jss2-gld', name: 'JSS 2 Gold', tier: 'Junior Secondary', gradeLevel: 'JSS 2', arm: 'Gold' },
  { id: 'cls-jss3-dia', name: 'JSS 3 Diamond', tier: 'Junior Secondary', gradeLevel: 'JSS 3', arm: 'Diamond' },
  { id: 'cls-jss3-gld', name: 'JSS 3 Gold', tier: 'Junior Secondary', gradeLevel: 'JSS 3', arm: 'Gold' },

  // Primary School
  { id: 'cls-pri1-eme', name: 'Primary 1 Emerald', tier: 'Primary School', gradeLevel: 'Primary 1', arm: 'Emerald' },
  { id: 'cls-pri2-rub', name: 'Primary 2 Ruby', tier: 'Primary School', gradeLevel: 'Primary 2', arm: 'Ruby' },
  { id: 'cls-pri3-sap', name: 'Primary 3 Sapphire', tier: 'Primary School', gradeLevel: 'Primary 3', arm: 'Sapphire' },
  { id: 'cls-pri4-top', name: 'Primary 4 Topaz', tier: 'Primary School', gradeLevel: 'Primary 4', arm: 'Topaz' },
  { id: 'cls-pri5-pea', name: 'Primary 5 Pearl', tier: 'Primary School', gradeLevel: 'Primary 5', arm: 'Pearl' },
  { id: 'cls-pri6-dia', name: 'Primary 6 Diamond', tier: 'Primary School', gradeLevel: 'Primary 6', arm: 'Diamond' },

  // Nursery & Early Years
  { id: 'cls-creche', name: 'Crèche / Playgroup', tier: 'Nursery & Early Years', gradeLevel: 'Crèche', arm: 'Playgroup' },
  { id: 'cls-nur1-sil', name: 'Nursery 1 Silver', tier: 'Nursery & Early Years', gradeLevel: 'Nursery 1', arm: 'Silver' },
  { id: 'cls-nur2-gld', name: 'Nursery 2 Gold', tier: 'Nursery & Early Years', gradeLevel: 'Nursery 2', arm: 'Gold' },
  { id: 'cls-rec-kg', name: 'Reception / Kindergarten', tier: 'Nursery & Early Years', gradeLevel: 'Reception', arm: 'KG' }
];

