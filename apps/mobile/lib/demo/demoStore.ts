import { create } from 'zustand';
import {
  demoApplicants,
  demoApplications,
  demoAttendance,
  demoBadges,
  demoMessages,
  demoOpportunities,
  demoOrganizations,
  demoStudent,
  DEMO_ORG_PRIMARY_ID,
  DEMO_STUDENT_ID,
  type ApplicantPreview,
  type Application,
  type ApplicationStatus,
  type AttendanceRecord,
  type Badge,
  type Message,
  type Opportunity,
  type Organization,
  type StudentProfile,
  type CauseTag,
} from '@hourly/shared';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function nextAppId(): string {
  return `app-${Date.now()}`;
}

function nextMsgId(): string {
  return `msg-${Date.now()}`;
}

function nextAttId(): string {
  return `att-${Date.now()}`;
}

function nextOppId(): string {
  return `opp-${Date.now()}`;
}

export interface DemoTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface DemoNotificationPrefs {
  pushApps: boolean;
  pushReminders: boolean;
}

export interface DemoAppearancePrefs {
  darkMode: boolean;
}

export interface CreateOpportunityInput {
  title: string;
  description: string;
  causeTags: CauseTag[];
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  totalSpots: number;
  ageMinimum?: number;
  creditEligible: boolean;
  whatToBring: string[];
  recurring: boolean;
}

export interface DemoState {
  opportunities: Opportunity[];
  applications: Application[];
  attendance: AttendanceRecord[];
  badges: Badge[];
  messages: Message[];
  savedOpportunityIds: Record<string, boolean>;
  studentProfile: StudentProfile;
  orgProfile: Organization;
  teamMembers: DemoTeamMember[];
  notificationPrefs: DemoNotificationPrefs;
  appearancePrefs: DemoAppearancePrefs;
  activeAttendanceId: string | null;

  applyToOpportunity: (opportunityId: string, studentId?: string) => Application | null;
  setSaved: (opportunityId: string, saved: boolean) => void;
  isSaved: (opportunityId: string) => boolean;
  getApplicantsForOpportunity: (opportunityId: string) => ApplicantPreview[];
  getAllApplicantsForOrg: (orgId: string) => ApplicantPreview[];
  getPendingCountForOpportunity: (opportunityId: string) => number;
  setApplicationStatus: (applicationId: string, status: ApplicationStatus) => void;
  appendMessage: (applicationId: string, text: string, senderRole: 'student' | 'organizer') => void;
  verifyAttendance: (attendanceId: string) => void;
  startStudentCheckIn: (applicationId: string) => AttendanceRecord | null;
  completeStudentCheckOut: (attendanceId: string, hoursLogged: number) => void;
  checkInByQrPayload: (raw: string, opportunityId?: string) => AttendanceRecord | null;
  createOpportunity: (input: CreateOpportunityInput) => Opportunity;
  updateStudentProfile: (patch: Partial<StudentProfile>) => void;
  updateOrgProfile: (patch: Partial<Organization>) => void;
  addTeamMember: (member: Omit<DemoTeamMember, 'id'>) => void;
  removeTeamMember: (memberId: string) => void;
  setNotificationPrefs: (patch: Partial<DemoNotificationPrefs>) => void;
  setAppearancePrefs: (patch: Partial<DemoAppearancePrefs>) => void;
  reset: () => void;
}

function studentInfoForId(studentId: string): Pick<ApplicantPreview, 'firstName' | 'lastName' | 'grade' | 'totalHours' | 'rating'> {
  if (studentId === DEMO_STUDENT_ID) {
    return {
      firstName: demoStudent.firstName,
      lastName: demoStudent.lastName.charAt(0) + '.',
      grade: demoStudent.grade,
      totalHours: demoStudent.totalHours,
      rating: 4.9,
    };
  }
  const seed = demoApplicants.find(a => a.id === studentId);
  if (seed) {
    return {
      firstName: seed.firstName,
      lastName: seed.lastName,
      grade: seed.grade,
      totalHours: seed.totalHours,
      rating: seed.rating,
    };
  }
  return {
    firstName: 'Volunteer',
    lastName: 'Student',
    grade: 10,
    totalHours: 0,
    rating: 0,
  };
}

function enrichApplicationsFromSeedApplicants(apps: Application[]): Application[] {
  const next = clone(apps);
  const oppId = 'opp-001';
  const existing = new Set(
    next.filter(a => a.opportunityId === oppId).map(a => a.studentId),
  );

  for (const applicant of demoApplicants) {
    if (existing.has(applicant.id)) {
      continue;
    }
    next.push({
      id: `app-seed-${applicant.id}`,
      studentId: applicant.id,
      opportunityId: oppId,
      status: applicant.status,
      appliedAt: '2026-03-01T10:00:00Z',
      qrCodeData: `hourly:checkin:app-seed-${applicant.id}:${applicant.id}:${oppId}`,
    });
  }

  return next;
}

function applicationToApplicant(app: Application): ApplicantPreview {
  const info = studentInfoForId(app.studentId);
  return {
    id: app.id,
    ...info,
    status: app.status,
  };
}

function buildInitial(): Omit<
  DemoState,
  | 'applyToOpportunity'
  | 'setSaved'
  | 'isSaved'
  | 'getApplicantsForOpportunity'
  | 'getAllApplicantsForOrg'
  | 'getPendingCountForOpportunity'
  | 'setApplicationStatus'
  | 'appendMessage'
  | 'verifyAttendance'
  | 'startStudentCheckIn'
  | 'completeStudentCheckOut'
  | 'checkInByQrPayload'
  | 'createOpportunity'
  | 'updateStudentProfile'
  | 'updateOrgProfile'
  | 'addTeamMember'
  | 'removeTeamMember'
  | 'setNotificationPrefs'
  | 'setAppearancePrefs'
  | 'reset'
> {
  const org = demoOrganizations.find(o => o.id === DEMO_ORG_PRIMARY_ID) ?? demoOrganizations[0]!;

  return {
    opportunities: clone(demoOpportunities),
    applications: enrichApplicationsFromSeedApplicants(demoApplications),
    attendance: clone(demoAttendance),
    badges: clone(demoBadges),
    messages: clone(demoMessages),
    savedOpportunityIds: {},
    studentProfile: clone(demoStudent),
    orgProfile: clone(org),
    teamMembers: [
      { id: 'team-1', name: 'Jordan Lee', email: 'jordan@greenearth.org', role: 'Coordinator' },
      { id: 'team-2', name: 'Sam Patel', email: 'sam@greenearth.org', role: 'Event manager' },
    ],
    notificationPrefs: { pushApps: true, pushReminders: true },
    appearancePrefs: { darkMode: true },
    activeAttendanceId: null,
  };
}

function parseQrPayload(raw: string): { applicationId: string; studentId: string; opportunityId: string } | null {
  const trimmed = raw.trim();
  const parts = trimmed.split(':');
  if (parts.length >= 5 && parts[0] === 'hourly' && parts[1] === 'checkin') {
    return {
      applicationId: parts[2] ?? '',
      studentId: parts[3] ?? '',
      opportunityId: parts[4] ?? '',
    };
  }
  return null;
}

export const useDemoStore = create<DemoState>((set, get) => ({
  ...buildInitial(),

  applyToOpportunity: (opportunityId, studentId = DEMO_STUDENT_ID) => {
    const opp = get().opportunities.find(o => o.id === opportunityId);
    if (!opp) {
      return null;
    }
    const existing = get().applications.find(
      a => a.opportunityId === opportunityId && a.studentId === studentId,
    );
    if (existing) {
      return existing;
    }

    const id = nextAppId();
    const application: Application = {
      id,
      studentId,
      opportunityId,
      status: 'PENDING',
      appliedAt: new Date().toISOString(),
      qrCodeData: `hourly:checkin:${id}:${studentId}:${opportunityId}`,
    };

    set(state => ({
      applications: [...state.applications, application],
      opportunities: state.opportunities.map(o =>
        o.id === opportunityId
          ? { ...o, filledSpots: Math.min(o.totalSpots, o.filledSpots + 1) }
          : o,
      ),
    }));

    return application;
  },

  setSaved: (opportunityId, saved) =>
    set(state => {
      const next = { ...state.savedOpportunityIds };
      if (saved) {
        next[opportunityId] = true;
      } else {
        delete next[opportunityId];
      }
      return { savedOpportunityIds: next };
    }),

  isSaved: opportunityId => Boolean(get().savedOpportunityIds[opportunityId]),

  getApplicantsForOpportunity: opportunityId =>
    get()
      .applications.filter(a => a.opportunityId === opportunityId)
      .map(applicationToApplicant),

  getAllApplicantsForOrg: orgId => {
    const oppIds = new Set(get().opportunities.filter(o => o.orgId === orgId).map(o => o.id));
    return get()
      .applications.filter(a => oppIds.has(a.opportunityId))
      .map(applicationToApplicant);
  },

  getPendingCountForOpportunity: opportunityId =>
    get().applications.filter(a => a.opportunityId === opportunityId && a.status === 'PENDING').length,

  setApplicationStatus: (applicationId, status) =>
    set(state => ({
      applications: state.applications.map(app =>
        app.id === applicationId ? { ...app, status } : app,
      ),
    })),

  appendMessage: (applicationId, text, senderRole) =>
    set(state => {
      const app = state.applications.find(a => a.id === applicationId);
      const student = studentInfoForId(app?.studentId ?? DEMO_STUDENT_ID);
      const senderName =
        senderRole === 'student' ? `${student.firstName} ${student.lastName}` : 'Coordinator';
      const msg: Message = {
        id: nextMsgId(),
        applicationId,
        senderId: senderRole === 'student' ? (app?.studentId ?? DEMO_STUDENT_ID) : 'org-coord',
        senderName,
        senderRole,
        text,
        sentAt: new Date().toISOString(),
      };
      return { messages: [...state.messages, msg] };
    }),

  verifyAttendance: attendanceId =>
    set(state => {
      const verified = state.attendance.map(a =>
        a.id === attendanceId && a.verificationStatus === 'PENDING'
          ? { ...a, verificationStatus: 'VERIFIED' as const }
          : a,
      );
      const verifiedHours = verified
        .filter(a => a.verificationStatus === 'VERIFIED' && a.studentId === DEMO_STUDENT_ID)
        .reduce((sum, a) => sum + a.hoursLogged, 0);

      return {
        attendance: verified,
        studentProfile: {
          ...state.studentProfile,
          totalHours: verifiedHours,
        },
      };
    }),

  startStudentCheckIn: applicationId => {
    const app = get().applications.find(a => a.id === applicationId);
    if (!app || app.status !== 'APPROVED') {
      return null;
    }
    const existing = get().attendance.find(
      a =>
        a.studentId === app.studentId &&
        a.opportunityId === app.opportunityId &&
        !a.checkoutTime,
    );
    if (existing) {
      set({ activeAttendanceId: existing.id });
      return existing;
    }

    const record: AttendanceRecord = {
      id: nextAttId(),
      studentId: app.studentId,
      opportunityId: app.opportunityId,
      checkinTime: new Date().toISOString(),
      checkoutTime: undefined,
      hoursLogged: 0,
      verificationStatus: 'PENDING',
      checkInMethod: 'self_checkin_app',
      checkInDetail: 'Checked in via Hourly demo app',
    };

    set(state => ({
      attendance: [...state.attendance, record],
      activeAttendanceId: record.id,
    }));

    return record;
  },

  completeStudentCheckOut: (attendanceId, hoursLogged) =>
    set(state => ({
      attendance: state.attendance.map(a =>
        a.id === attendanceId
          ? {
              ...a,
              checkoutTime: new Date().toISOString(),
              hoursLogged,
              verificationStatus: 'PENDING' as const,
            }
          : a,
      ),
      activeAttendanceId: null,
    })),

  checkInByQrPayload: (raw, opportunityId) => {
    const parsed = parseQrPayload(raw);
    if (!parsed) {
      return null;
    }

    const app =
      get().applications.find(a => a.id === parsed.applicationId) ??
      get().applications.find(
        a => a.studentId === parsed.studentId && a.opportunityId === parsed.opportunityId,
      );

    const oppId = opportunityId ?? parsed.opportunityId ?? app?.opportunityId;
    if (!oppId) {
      return null;
    }

    const studentId = app?.studentId ?? parsed.studentId;
    const duplicate = get().attendance.find(
      a =>
        a.studentId === studentId &&
        a.opportunityId === oppId &&
        a.verificationStatus === 'PENDING' &&
        !a.checkoutTime,
    );
    if (duplicate) {
      return duplicate;
    }

    const record: AttendanceRecord = {
      id: nextAttId(),
      studentId,
      opportunityId: oppId,
      checkinTime: new Date().toISOString(),
      checkoutTime: new Date().toISOString(),
      hoursLogged: get().opportunities.find(o => o.id === oppId)?.durationHours ?? 3,
      verificationStatus: 'PENDING',
      checkInMethod: 'qr_scan',
      checkInDetail: 'Scanned at organizer desk (demo)',
    };

    set(state => ({
      attendance: [...state.attendance, record],
    }));

    return record;
  },

  createOpportunity: input => {
    const org = get().orgProfile;
    const id = nextOppId();
    const opportunity: Opportunity = {
      id,
      orgId: org.id,
      orgName: org.name,
      orgLogo: typeof org.logoUrl === 'string' && org.logoUrl.length <= 3 ? org.logoUrl : 'GE',
      orgVerified: org.verified,
      title: input.title,
      description: input.description,
      causeTags: input.causeTags,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      durationHours: input.durationHours,
      location: {
        lat: input.lat,
        lng: input.lng,
        address: input.address,
        city: input.city,
        state: input.state,
      },
      distance: 1.2,
      totalSpots: input.totalSpots,
      filledSpots: 0,
      ageMinimum: input.ageMinimum ?? 14,
      creditEligible: input.creditEligible,
      whatToBring: input.whatToBring,
      recurring: input.recurring,
      rating: 0,
      reviews: [],
    };

    set(state => ({
      opportunities: [...state.opportunities, opportunity],
    }));

    return opportunity;
  },

  updateStudentProfile: patch =>
    set(state => ({
      studentProfile: { ...state.studentProfile, ...patch },
    })),

  updateOrgProfile: patch =>
    set(state => ({
      orgProfile: { ...state.orgProfile, ...patch },
    })),

  addTeamMember: member =>
    set(state => ({
      teamMembers: [...state.teamMembers, { ...member, id: `team-${Date.now()}` }],
    })),

  removeTeamMember: memberId =>
    set(state => ({
      teamMembers: state.teamMembers.filter(m => m.id !== memberId),
    })),

  setNotificationPrefs: patch =>
    set(state => ({
      notificationPrefs: { ...state.notificationPrefs, ...patch },
    })),

  setAppearancePrefs: patch =>
    set(state => ({
      appearancePrefs: { ...state.appearancePrefs, ...patch },
    })),

  reset: () => set(() => buildInitial()),
}));

/** @deprecated Use getApplicantsForOpportunity */
export function filterDemoOpportunities(
  opportunities: Opportunity[],
  filters?: { causes?: string[]; creditEligible?: boolean; maxDistance?: number },
): Opportunity[] {
  let results = opportunities;

  if (filters?.creditEligible) {
    results = results.filter(item => item.creditEligible);
  }

  if (filters?.causes && filters.causes.length > 0) {
    results = results.filter(item => item.causeTags.some(tag => filters.causes!.includes(tag)));
  }

  if (filters?.maxDistance !== undefined) {
    results = results.filter(
      item => item.distance === undefined || item.distance <= filters.maxDistance!,
    );
  }

  return results;
}

export function applicationForStudentOnOpportunity(
  applications: Application[],
  opportunityId: string,
  studentId: string = DEMO_STUDENT_ID,
): Application | undefined {
  return applications.find(a => a.opportunityId === opportunityId && a.studentId === studentId);
}

export type { ApplicationStatus };
