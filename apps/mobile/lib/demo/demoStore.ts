import { create } from 'zustand';
import {
  demoApplicants,
  demoApplications,
  demoAttendance,
  demoBadges,
  demoMessages,
  demoOpportunities,
  DEMO_STUDENT_ID,
  type ApplicantPreview,
  type Application,
  type ApplicationStatus,
  type AttendanceRecord,
  type Badge,
  type Message,
  type Opportunity,
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

export interface DemoState {
  opportunities: Opportunity[];
  applications: Application[];
  attendance: AttendanceRecord[];
  badges: Badge[];
  messages: Message[];
  savedOpportunityIds: Record<string, boolean>;
  /** Per-opportunity applicant lists (defaults to shared seed when missing). */
  applicantsByOppId: Record<string, ApplicantPreview[]>;

  applyToOpportunity: (opportunityId: string) => Application | null;
  setSaved: (opportunityId: string, saved: boolean) => void;
  isSaved: (opportunityId: string) => boolean;
  getApplicants: (opportunityId: string) => ApplicantPreview[];
  setApplicantStatus: (
    opportunityId: string,
    applicantId: string,
    status: ApplicantPreview['status'],
  ) => void;
  appendMessage: (applicationId: string, text: string, senderRole: 'student' | 'organizer') => void;
  /** Organizer demo: mark logged hours as verified for school records. */
  verifyAttendance: (attendanceId: string) => void;
  reset: () => void;
}

const initialApplicantsMap: Record<string, ApplicantPreview[]> = {};

function buildInitial(): Omit<
  DemoState,
  | 'applyToOpportunity'
  | 'setSaved'
  | 'isSaved'
  | 'getApplicants'
  | 'setApplicantStatus'
  | 'appendMessage'
  | 'verifyAttendance'
  | 'reset'
> {
  return {
    opportunities: clone(demoOpportunities),
    applications: clone(demoApplications),
    attendance: clone(demoAttendance),
    badges: clone(demoBadges),
    messages: clone(demoMessages),
    savedOpportunityIds: {},
    applicantsByOppId: { ...initialApplicantsMap },
  };
}

export const useDemoStore = create<DemoState>((set, get) => ({
  ...buildInitial(),

  applyToOpportunity: opportunityId => {
    const opp = get().opportunities.find(o => o.id === opportunityId);
    if (!opp) {
      return null;
    }
    const existing = get().applications.find(
      a => a.opportunityId === opportunityId && a.studentId === DEMO_STUDENT_ID,
    );
    if (existing) {
      return existing;
    }

    const id = nextAppId();
    const application: Application = {
      id,
      studentId: DEMO_STUDENT_ID,
      opportunityId,
      status: 'PENDING',
      appliedAt: new Date().toISOString(),
      qrCodeData: `hourly:checkin:${id}:${DEMO_STUDENT_ID}:${opportunityId}`,
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

  getApplicants: opportunityId => {
    const custom = get().applicantsByOppId[opportunityId];
    if (custom && custom.length > 0) {
      return custom;
    }
    return clone(demoApplicants);
  },

  setApplicantStatus: (opportunityId, applicantId, status) =>
    set(state => {
      const existing = state.applicantsByOppId[opportunityId];
      const current =
        existing && existing.length > 0 ? existing : clone(demoApplicants);
      const nextList = current.map(a => (a.id === applicantId ? { ...a, status } : a));
      return {
        applicantsByOppId: {
          ...state.applicantsByOppId,
          [opportunityId]: nextList,
        },
      };
    }),

  appendMessage: (applicationId, text, senderRole) =>
    set(state => {
      const senderName = senderRole === 'student' ? 'Alex R.' : 'Coordinator';
      const msg: Message = {
        id: nextMsgId(),
        applicationId,
        senderId: senderRole === 'student' ? DEMO_STUDENT_ID : 'org-coord',
        senderName,
        senderRole,
        text,
        sentAt: new Date().toISOString(),
      };
      return { messages: [...state.messages, msg] };
    }),

  verifyAttendance: attendanceId =>
    set(state => ({
      attendance: state.attendance.map(a =>
        a.id === attendanceId && a.verificationStatus === 'PENDING'
          ? { ...a, verificationStatus: 'VERIFIED' as const }
          : a,
      ),
    })),

  reset: () => set(() => buildInitial()),
}));

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
