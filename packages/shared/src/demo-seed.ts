/**
 * Canonical demo seed — single source for mobile demo store + Next.js public/counselor pages.
 */
import type {
  ApplicantPreview,
  AttendanceRecord,
  Application,
  Badge,
  CounselorStudent,
  Message,
  Opportunity,
  Organization,
  OrgStats,
  StudentProfile,
} from './types';

export const DEMO_STUDENT_ID = 'stu-001';
export const DEMO_ORG_PRIMARY_ID = 'org-001';

/** Public portfolio path segment (paired with EXPO_PUBLIC_WEB_BASE_URL / NEXT_PUBLIC_WEB_BASE_URL). */
export const DEMO_PORTFOLIO_SLUG = 'alex-r';

/** Org impact page slug for Green Earth Foundation demo. */
export const DEMO_ORG_SLUG = 'green-earth-foundation';

export const demoStudent: StudentProfile = {
  id: DEMO_STUDENT_ID,
  firstName: 'Alex',
  lastName: 'Rivera',
  email: 'alex.r@school.edu',
  school: 'Austin High School',
  grade: 11,
  interests: ['Environment', 'Education', 'Youth'],
  availability: {
    days: ['Sat', 'Sun'],
    shiftLengthHours: 3,
  },
  totalHours: 47.5,
  avatarUrl: undefined,
};

export const demoOrganizations: Organization[] = [
  {
    id: 'org-001',
    name: 'Green Earth Foundation',
    ein: '84-1234567',
    mission: "Protecting and restoring Austin's natural spaces through community-driven conservation.",
    logoUrl: '🌿',
    causeTags: ['Environment'],
    verified: true,
    rating: 4.8,
    ratingCount: 124,
    totalVolunteers: 456,
    totalHours: 3200,
  },
  {
    id: 'org-002',
    name: 'Austin Food Bank',
    ein: '74-2345678',
    mission:
      'Fighting hunger in Central Texas by distributing food and operating programs that nourish communities.',
    logoUrl: '🍎',
    causeTags: ['Food', 'Health'],
    verified: true,
    rating: 4.6,
    ratingCount: 89,
    totalVolunteers: 780,
    totalHours: 5600,
  },
  {
    id: 'org-003',
    name: 'Youth Mentorship Alliance',
    ein: '74-3456789',
    mission: 'Empowering youth through one-on-one mentorship and academic support.',
    logoUrl: '🎓',
    causeTags: ['Education', 'Youth'],
    verified: true,
    rating: 4.9,
    ratingCount: 67,
    totalVolunteers: 230,
    totalHours: 1890,
  },
  {
    id: 'org-004',
    name: 'Sunny Paws Rescue',
    ein: '82-1111111',
    mission: 'Rescue, rehabilitate, and rehome companion animals across Central Texas.',
    logoUrl: '🐾',
    causeTags: ['Animals'],
    verified: true,
    rating: 4.7,
    ratingCount: 52,
    totalVolunteers: 120,
    totalHours: 890,
  },
  {
    id: 'org-005',
    name: 'Sunrise Senior Center',
    ein: '82-2222222',
    mission: 'Compassionate care and community for older adults.',
    logoUrl: '☀️',
    causeTags: ['Seniors', 'Health'],
    verified: true,
    rating: 4.5,
    ratingCount: 40,
    totalVolunteers: 200,
    totalHours: 2100,
  },
  {
    id: 'org-006',
    name: 'Arts for All',
    ein: '82-3333333',
    mission: 'Creative programs that make the arts accessible to every neighborhood.',
    logoUrl: '🎨',
    causeTags: ['Arts', 'Youth'],
    verified: false,
    rating: 4.3,
    ratingCount: 28,
    totalVolunteers: 95,
    totalHours: 620,
  },
];

export const demoOpportunities: Opportunity[] = [
  {
    id: 'opp-001',
    orgId: 'org-001',
    orgName: 'Green Earth Foundation',
    orgLogo: 'GE',
    orgVerified: true,
    title: 'Park cleanup & tree planting',
    description:
      "Join us for a morning of park cleanup and tree planting at Riverside Park. We'll provide all tools and supplies. Great experience for students interested in environmental conservation.",
    causeTags: ['Environment'],
    date: '2026-04-05',
    startTime: '09:00',
    endTime: '12:00',
    durationHours: 3,
    location: {
      lat: 30.2672,
      lng: -97.7431,
      address: '1234 Riverside Dr',
      city: 'Austin',
      state: 'TX',
    },
    distance: 2.3,
    totalSpots: 20,
    filledSpots: 14,
    ageMinimum: 14,
    creditEligible: true,
    whatToBring: ['Water bottle', 'Sunscreen', 'Closed-toe shoes', 'Gardening gloves (optional)'],
    recurring: false,
    rating: 4.8,
    reviews: [
      {
        id: 'r1',
        authorName: 'Sarah M.',
        rating: 5,
        text: 'Amazing experience! The coordinators were so organized and friendly.',
        date: '2026-03-15',
      },
      {
        id: 'r2',
        authorName: 'James K.',
        rating: 5,
        text: 'Really fulfilling work. Got to plant 12 trees!',
        date: '2026-03-10',
      },
      {
        id: 'r3',
        authorName: 'Aisha L.',
        rating: 4,
        text: 'Great cause, learned a lot about local ecology.',
        date: '2026-03-01',
      },
    ],
  },
  {
    id: 'opp-002',
    orgId: 'org-002',
    orgName: 'Austin Food Bank',
    orgLogo: 'AF',
    orgVerified: true,
    title: 'Food sorting & distribution',
    description:
      'Help sort and distribute food packages to families in need. We serve 500+ families per week and need all the help we can get. No experience necessary.',
    causeTags: ['Food'],
    date: '2026-04-08',
    startTime: '10:00',
    endTime: '14:00',
    durationHours: 4,
    location: {
      lat: 30.25,
      lng: -97.75,
      address: '8201 S Congress Ave',
      city: 'Austin',
      state: 'TX',
    },
    distance: 4.1,
    totalSpots: 30,
    filledSpots: 12,
    ageMinimum: 16,
    creditEligible: true,
    whatToBring: ['Comfortable shoes', 'Water bottle'],
    recurring: true,
    rating: 4.6,
    reviews: [
      {
        id: 'r4',
        authorName: 'Emily T.',
        rating: 5,
        text: 'So rewarding to help feed families. Will definitely come back.',
        date: '2026-03-12',
      },
      {
        id: 'r5',
        authorName: 'Carlos R.',
        rating: 4,
        text: "Well organized, but it's physically demanding standing for 4 hours.",
        date: '2026-03-05',
      },
    ],
  },
  {
    id: 'opp-003',
    orgId: 'org-003',
    orgName: 'Youth Mentorship Alliance',
    orgLogo: 'YM',
    orgVerified: true,
    title: 'After-school tutoring',
    description:
      'Mentor and tutor elementary students in math and reading. 1-on-1 sessions with kids who need extra support. Training provided for new tutors.',
    causeTags: ['Education', 'Youth'],
    date: '2026-04-10',
    startTime: '15:30',
    endTime: '17:30',
    durationHours: 2,
    location: {
      lat: 30.2849,
      lng: -97.7341,
      address: '1600 E 7th St',
      city: 'Austin',
      state: 'TX',
    },
    distance: 1.5,
    totalSpots: 10,
    filledSpots: 7,
    ageMinimum: 16,
    creditEligible: true,
    whatToBring: ['Laptop (optional)', 'Patience and enthusiasm'],
    recurring: true,
    rating: 4.9,
    reviews: [
      {
        id: 'r6',
        authorName: 'Maria G.',
        rating: 5,
        text: 'The kids are wonderful. You truly make a difference.',
        date: '2026-03-20',
      },
      {
        id: 'r7',
        authorName: 'David H.',
        rating: 5,
        text: "Best volunteer experience I've had. Great support from staff.",
        date: '2026-03-14',
      },
      {
        id: 'r8',
        authorName: 'Taylor B.',
        rating: 5,
        text: 'Love watching the kids improve over time!',
        date: '2026-03-08',
      },
    ],
  },
  {
    id: 'opp-004',
    orgId: 'org-004',
    orgName: 'Sunny Paws Rescue',
    orgLogo: 'SP',
    orgVerified: true,
    title: 'Animal shelter walkathon',
    description:
      'Walk and socialize rescue dogs to help them get adopted faster. Each dog gets 30 minutes — enjoy some fresh air while helping animals find forever homes.',
    causeTags: ['Animals'],
    date: '2026-04-12',
    startTime: '08:00',
    endTime: '11:00',
    durationHours: 3,
    location: {
      lat: 30.3074,
      lng: -97.756,
      address: '7201 Levander Loop',
      city: 'Austin',
      state: 'TX',
    },
    distance: 3.2,
    totalSpots: 15,
    filledSpots: 13,
    ageMinimum: 14,
    creditEligible: false,
    whatToBring: ['Dog-friendly clothes', 'Running shoes', 'Water bottle'],
    recurring: false,
    rating: 4.7,
    reviews: [
      {
        id: 'r9',
        authorName: 'Mia C.',
        rating: 5,
        text: 'Got to walk the cutest dogs! Such a fun morning.',
        date: '2026-03-18',
      },
    ],
  },
  {
    id: 'opp-005',
    orgId: 'org-005',
    orgName: 'Sunrise Senior Center',
    orgLogo: 'SS',
    orgVerified: true,
    title: 'Senior companion visits',
    description:
      "Visit and spend quality time with elderly residents — play board games, read together, or just have a conversation. Many residents rarely have visitors.",
    causeTags: ['Seniors', 'Health'],
    date: '2026-04-14',
    startTime: '14:00',
    endTime: '16:00',
    durationHours: 2,
    location: {
      lat: 30.23,
      lng: -97.78,
      address: '3000 S Lamar Blvd',
      city: 'Austin',
      state: 'TX',
    },
    distance: 5.7,
    totalSpots: 8,
    filledSpots: 3,
    ageMinimum: 16,
    creditEligible: true,
    whatToBring: ['Friendly attitude', 'Board games (optional)'],
    recurring: true,
    rating: 4.5,
    reviews: [
      {
        id: 'r10',
        authorName: 'Noah W.',
        rating: 5,
        text: 'The residents are so grateful for company. Very meaningful.',
        date: '2026-03-16',
      },
      {
        id: 'r11',
        authorName: 'Sophie K.',
        rating: 4,
        text: 'Lovely experience. Wish the shifts were longer!',
        date: '2026-03-09',
      },
    ],
  },
  {
    id: 'opp-006',
    orgId: 'org-001',
    orgName: 'Green Earth Foundation',
    orgLogo: 'GE',
    orgVerified: true,
    title: 'Community garden build',
    description:
      'Help build raised garden beds for a community garden in East Austin. Perfect for anyone interested in sustainability and hands-on building projects.',
    causeTags: ['Environment', 'Food'],
    date: '2026-04-19',
    startTime: '08:00',
    endTime: '13:00',
    durationHours: 5,
    location: {
      lat: 30.27,
      lng: -97.72,
      address: '2100 E Cesar Chavez St',
      city: 'Austin',
      state: 'TX',
    },
    distance: 1.8,
    totalSpots: 25,
    filledSpots: 24,
    ageMinimum: 14,
    creditEligible: true,
    whatToBring: ['Work gloves', 'Sunscreen', 'Water bottle', 'Closed-toe shoes'],
    recurring: false,
    rating: 4.8,
    reviews: [],
  },
  {
    id: 'opp-007',
    orgId: 'org-006',
    orgName: 'Arts for All',
    orgLogo: 'AA',
    orgVerified: false,
    title: 'Mural painting on 6th street',
    description:
      "Join local artists in creating a community mural. No painting experience needed — we'll guide you. This is a unique chance to leave your mark on the neighborhood.",
    causeTags: ['Arts', 'Youth'],
    date: '2026-04-20',
    startTime: '10:00',
    endTime: '15:00',
    durationHours: 5,
    location: {
      lat: 30.2676,
      lng: -97.7405,
      address: '400 E 6th St',
      city: 'Austin',
      state: 'TX',
    },
    distance: 0.8,
    totalSpots: 12,
    filledSpots: 5,
    ageMinimum: 14,
    creditEligible: false,
    whatToBring: ["Clothes you don't mind getting paint on", 'Snacks'],
    recurring: false,
    rating: 4.3,
    reviews: [
      {
        id: 'r12',
        authorName: 'Ethan P.',
        rating: 4,
        text: 'Really creative project. The artists were super patient and helpful.',
        date: '2026-03-11',
      },
    ],
  },
  {
    id: 'opp-008',
    orgId: 'org-002',
    orgName: 'Austin Food Bank',
    orgLogo: 'AF',
    orgVerified: true,
    title: 'Mobile pantry setup',
    description:
      "Help set up and run a mobile food pantry in an underserved neighborhood. We deliver fresh produce and pantry staples directly to families who can't easily reach our main location.",
    causeTags: ['Food', 'Health'],
    date: '2026-04-22',
    startTime: '07:00',
    endTime: '12:00',
    durationHours: 5,
    location: {
      lat: 30.22,
      lng: -97.76,
      address: '1106 Clayton Ln',
      city: 'Austin',
      state: 'TX',
    },
    distance: 6.3,
    totalSpots: 20,
    filledSpots: 19,
    ageMinimum: 16,
    creditEligible: true,
    whatToBring: ['Closed-toe shoes', 'Water bottle', 'Physical ability to lift 30lbs'],
    recurring: true,
    rating: 4.7,
    reviews: [
      {
        id: 'r13',
        authorName: 'Lily V.',
        rating: 5,
        text: 'Incredible to see the impact firsthand. The families are so appreciative.',
        date: '2026-03-19',
      },
    ],
  },
];

export const demoAttendance: AttendanceRecord[] = [
  {
    id: 'att-001',
    studentId: DEMO_STUDENT_ID,
    opportunityId: 'opp-001',
    checkinTime: '2026-03-01T09:02:00Z',
    checkoutTime: '2026-03-01T12:05:00Z',
    hoursLogged: 3,
    verificationStatus: 'VERIFIED',
    checkInMethod: 'qr_scan',
    checkInDetail: 'QR at Park South gate (organizer tablet)',
  },
  {
    id: 'att-002',
    studentId: DEMO_STUDENT_ID,
    opportunityId: 'opp-002',
    checkinTime: '2026-03-08T10:00:00Z',
    checkoutTime: '2026-03-08T14:10:00Z',
    hoursLogged: 4,
    verificationStatus: 'VERIFIED',
    checkInMethod: 'self_checkin_app',
    checkInDetail: 'Start shift in Hourly app (Food Bank lobby)',
  },
  {
    id: 'att-003',
    studentId: DEMO_STUDENT_ID,
    opportunityId: 'opp-003',
    checkinTime: '2026-03-10T15:30:00Z',
    checkoutTime: '2026-03-10T17:35:00Z',
    hoursLogged: 2,
    verificationStatus: 'VERIFIED',
    checkInMethod: 'self_checkin_app',
  },
  {
    id: 'att-004',
    studentId: DEMO_STUDENT_ID,
    opportunityId: 'opp-004',
    checkinTime: '2026-03-12T08:00:00Z',
    checkoutTime: '2026-03-12T11:00:00Z',
    hoursLogged: 3,
    verificationStatus: 'VERIFIED',
    checkInMethod: 'qr_scan',
    checkInDetail: 'Volunteer check-in at shelter desk',
  },
  {
    id: 'att-005',
    studentId: DEMO_STUDENT_ID,
    opportunityId: 'opp-005',
    checkinTime: '2026-03-14T14:00:00Z',
    checkoutTime: '2026-03-14T16:00:00Z',
    hoursLogged: 2,
    verificationStatus: 'VERIFIED',
    checkInMethod: 'manual_entry',
    checkInDetail: 'Reconciled from front-desk sign-in sheet',
  },
  {
    id: 'att-006',
    studentId: DEMO_STUDENT_ID,
    opportunityId: 'opp-006',
    checkinTime: '2026-03-19T08:00:00Z',
    checkoutTime: '2026-03-19T13:00:00Z',
    hoursLogged: 5,
    verificationStatus: 'PENDING',
    checkInMethod: 'qr_scan',
    checkInDetail: 'Scanned at Community garden build, Gate B (session matched to approved app)',
  },
  {
    id: 'att-007',
    studentId: 'stu-002',
    opportunityId: 'opp-001',
    checkinTime: '2026-03-18T09:00:00Z',
    checkoutTime: '2026-03-18T12:00:00Z',
    hoursLogged: 3,
    verificationStatus: 'PENDING',
    checkInMethod: 'self_checkin_app',
    checkInDetail: 'Tapped Check in in Hourly within event geofence (Mueller Park)',
  },
  {
    id: 'att-008',
    studentId: 'stu-003',
    opportunityId: 'opp-001',
    checkinTime: '2026-03-20T10:00:00Z',
    checkoutTime: '2026-03-20T12:00:00Z',
    hoursLogged: 2,
    verificationStatus: 'PENDING',
    checkInMethod: 'coordinator_override',
    checkInDetail: 'Hours entered by on-site lead (volunteer forgot phone); clock times confirmed',
  },
];

export const demoApplications: Application[] = [
  {
    id: 'app-001',
    studentId: DEMO_STUDENT_ID,
    opportunityId: 'opp-001',
    status: 'APPROVED',
    appliedAt: '2026-02-28T10:00:00Z',
    qrCodeData: 'hourly:checkin:app-001:stu-001:opp-001',
  },
  {
    id: 'app-002',
    studentId: DEMO_STUDENT_ID,
    opportunityId: 'opp-007',
    status: 'PENDING',
    appliedAt: '2026-03-18T14:00:00Z',
    qrCodeData: 'hourly:checkin:app-002:stu-001:opp-007',
  },
];

export const demoBadges: Badge[] = [
  {
    type: 'first-shift',
    label: 'First shift',
    description: 'Completed your very first volunteer shift',
    icon: '🌟',
    earnedAt: '2026-03-01',
    isNew: false,
  },
  {
    type: '10-hours',
    label: '10 hours',
    description: 'Logged 10 verified volunteer hours',
    icon: '⏱️',
    earnedAt: '2026-03-10',
    isNew: false,
  },
  {
    type: '25-hours',
    label: '25 hours',
    description: 'Logged 25 verified volunteer hours',
    icon: '🔥',
    earnedAt: '2026-03-14',
    isNew: true,
  },
  {
    type: '50-hours',
    label: '50 hours',
    description: 'Logged 50 verified volunteer hours',
    icon: '🏆',
    earnedAt: undefined,
    isNew: false,
  },
  {
    type: '100-hours',
    label: '100 hours',
    description: 'Logged 100 verified volunteer hours',
    icon: '💎',
    earnedAt: undefined,
    isNew: false,
  },
  {
    type: '5-orgs',
    label: '5 organizations',
    description: 'Volunteered with 5 different organizations',
    icon: '🤝',
    earnedAt: undefined,
    isNew: false,
  },
  {
    type: '1-year-streak',
    label: '1 year streak',
    description: 'Volunteered at least once every month for a year',
    icon: '👑',
    earnedAt: undefined,
    isNew: false,
  },
];

export const demoMessages: Message[] = [
  {
    id: 'msg-001',
    applicationId: 'app-001',
    senderId: 'org-001',
    senderName: 'Green Earth Foundation',
    senderRole: 'organizer',
    text: 'Hi Alex! Thanks for signing up. Please arrive 10 minutes early for orientation.',
    sentAt: '2026-02-28T12:00:00Z',
  },
  {
    id: 'msg-002',
    applicationId: 'app-001',
    senderId: DEMO_STUDENT_ID,
    senderName: 'Alex R.',
    senderRole: 'student',
    text: "Sounds great! I'll be there. Should I bring my own gloves?",
    sentAt: '2026-02-28T12:30:00Z',
  },
  {
    id: 'msg-003',
    applicationId: 'app-001',
    senderId: 'org-001',
    senderName: 'Green Earth Foundation',
    senderRole: 'organizer',
    text: 'We have gloves available, but feel free to bring your own if you prefer. See you Saturday!',
    sentAt: '2026-02-28T13:00:00Z',
  },
];

export const demoOrgStats: OrgStats = {
  volunteersThisMonth: 34,
  totalHours: 3200,
  retentionRate: 0.72,
  avgRating: 4.8,
  activeListings: 3,
};

export const demoApplicants: ApplicantPreview[] = [
  { id: 'stu-001', firstName: 'Alex', lastName: 'R.', grade: 11, totalHours: 47.5, rating: 4.9, status: 'APPROVED' },
  { id: 'stu-002', firstName: 'Jordan', lastName: 'T.', grade: 10, totalHours: 23, rating: 4.5, status: 'APPROVED' },
  { id: 'stu-003', firstName: 'Mia', lastName: 'C.', grade: 12, totalHours: 89, rating: 5.0, status: 'PENDING' },
  { id: 'stu-004', firstName: 'Ethan', lastName: 'P.', grade: 11, totalHours: 15, rating: 4.2, status: 'PENDING' },
  { id: 'stu-005', firstName: 'Sophia', lastName: 'K.', grade: 9, totalHours: 8, rating: 0, status: 'WAITLISTED' },
  { id: 'stu-006', firstName: 'Liam', lastName: 'W.', grade: 10, totalHours: 31, rating: 4.7, status: 'DECLINED' },
];

export const demoCounselorStudents: CounselorStudent[] = [
  {
    id: 'stu-001',
    slug: DEMO_PORTFOLIO_SLUG,
    firstName: 'Alex',
    lastName: 'Rivera',
    grade: 11,
    totalVerifiedHours: 42.5,
    hoursThisSemester: 28,
    lastActivity: '2026-03-19',
    orgsServed: 5,
    primaryCauses: ['Environment', 'Education'],
  },
  {
    id: 'stu-007',
    slug: 'jordan-t',
    firstName: 'Jordan',
    lastName: 'Taylor',
    grade: 10,
    totalVerifiedHours: 23,
    hoursThisSemester: 12,
    lastActivity: '2026-03-15',
    orgsServed: 3,
    primaryCauses: ['Food', 'Youth'],
  },
  {
    id: 'stu-008',
    slug: 'mia-c',
    firstName: 'Mia',
    lastName: 'Chen',
    grade: 12,
    totalVerifiedHours: 89,
    hoursThisSemester: 40,
    lastActivity: '2026-03-20',
    orgsServed: 8,
    primaryCauses: ['Education', 'Arts'],
  },
  {
    id: 'stu-009',
    slug: 'ethan-p',
    firstName: 'Ethan',
    lastName: 'Patel',
    grade: 11,
    totalVerifiedHours: 15,
    hoursThisSemester: 8,
    lastActivity: '2026-02-28',
    orgsServed: 2,
    primaryCauses: ['Animals'],
  },
];

export function getOpportunityById(id: string): Opportunity | undefined {
  return demoOpportunities.find(o => o.id === id);
}

export function getOpportunitiesByOrg(orgId: string): Opportunity[] {
  return demoOpportunities.filter(o => o.orgId === orgId);
}

export function getOrganizationById(id: string): Organization | undefined {
  return demoOrganizations.find(o => o.id === id);
}

export function getOrganizationBySlug(slug: string): Organization | undefined {
  if (slug === DEMO_ORG_SLUG) {
    return demoOrganizations.find(o => o.id === DEMO_ORG_PRIMARY_ID);
  }
  return undefined;
}

export function getCounselorStudentBySlug(slug: string): CounselorStudent | undefined {
  return demoCounselorStudents.find(s => s.slug === slug);
}

/** Public-facing label (first name + last initial), e.g. "Alex R." */
export function counselorPublicLabel(student: CounselorStudent): string {
  const initial = student.lastName.trim().charAt(0);
  return initial ? `${student.firstName} ${initial}.` : student.firstName;
}

/** Portfolio public view uses first name + last initial only. */
export function getPublicPortfolioBySlug(slug: string): CounselorStudent | undefined {
  return getCounselorStudentBySlug(slug);
}

export function portfolioPublicUrl(baseUrl: string, slug: string): string {
  const trimmed = baseUrl.replace(/\/$/, '');
  return `${trimmed}/p/${slug}`;
}

export function orgPublicUrl(baseUrl: string, slug: string): string {
  const trimmed = baseUrl.replace(/\/$/, '');
  return `${trimmed}/org/${slug}`;
}
