/** Shared domain types — mirror API shapes for mobile + web. */

export type UserRole = 'student' | 'organizer';

export type CauseTag =
  | 'Environment'
  | 'Education'
  | 'Food'
  | 'Animals'
  | 'Seniors'
  | 'Youth'
  | 'Health'
  | 'Arts';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'WAITLISTED';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'DISPUTED';
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
}

export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  grade: number;
  interests: CauseTag[];
  availability: {
    days: DayOfWeek[];
    shiftLengthHours: number;
  };
  totalHours: number;
  avatarUrl?: string;
}

export interface Organization {
  id: string;
  name: string;
  ein: string;
  mission: string;
  logoUrl: string;
  causeTags: CauseTag[];
  verified: boolean;
  rating: number;
  ratingCount: number;
  totalVolunteers: number;
  totalHours: number;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  date: string;
}

export interface Opportunity {
  id: string;
  orgId: string;
  orgName: string;
  orgLogo: string;
  orgVerified: boolean;
  title: string;
  description: string;
  causeTags: CauseTag[];
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  location: Location;
  distance?: number;
  totalSpots: number;
  filledSpots: number;
  ageMinimum: number;
  creditEligible: boolean;
  whatToBring: string[];
  recurring: boolean;
  rating: number;
  reviews: Review[];
}

export interface Application {
  id: string;
  studentId: string;
  student?: StudentProfile;
  opportunityId: string;
  opportunity?: Opportunity;
  status: ApplicationStatus;
  appliedAt: string;
  qrCodeData: string;
}

export type CheckInMethod =
  | 'qr_scan'
  | 'self_checkin_app'
  | 'coordinator_override'
  | 'manual_entry';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  opportunityId: string;
  opportunity?: Opportunity;
  checkinTime: string;
  checkoutTime?: string;
  hoursLogged: number;
  verificationStatus: VerificationStatus;
  /** How check-in was recorded (organizer review / audit). */
  checkInMethod?: CheckInMethod;
  /** One-line detail shown to organizers (e.g. kiosk, gate). */
  checkInDetail?: string;
}

export type BadgeType =
  | 'first-shift'
  | '10-hours'
  | '25-hours'
  | '50-hours'
  | '100-hours'
  | '5-orgs'
  | '1-year-streak';

export interface Badge {
  type: BadgeType;
  label: string;
  description: string;
  icon: string;
  earnedAt?: string;
  isNew?: boolean;
}

export interface Message {
  id: string;
  applicationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  sentAt: string;
}

export interface OrgStats {
  volunteersThisMonth: number;
  totalHours: number;
  retentionRate: number;
  avgRating: number;
  activeListings: number;
}

export type ApplicantRowStatus = 'PENDING' | 'APPROVED' | 'WAITLISTED' | 'DECLINED';

export interface ApplicantPreview {
  id: string;
  firstName: string;
  lastName: string;
  grade: number;
  totalHours: number;
  rating: number;
  status: ApplicantRowStatus;
}

/** Counselor dashboard row (may include full name for internal view). */
export interface CounselorStudent {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  grade: number;
  totalVerifiedHours: number;
  hoursThisSemester: number;
  lastActivity: string;
  orgsServed: number;
  primaryCauses: CauseTag[];
}
