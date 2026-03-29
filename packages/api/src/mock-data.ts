export type Opportunity = {
  id: string;
  orgId: string;
  orgName: string;
  orgVerified: boolean;
  title: string;
  description: string;
  causeTags: string[];
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  location: { lat: number; lng: number; address: string; city: string; state: string };
  distance?: number;
  totalSpots: number;
  filledSpots: number;
  ageMinimum?: number;
  creditEligible: boolean;
  whatToBring?: string[];
  recurring: boolean;
  rating?: number;
  postStatus?: 'VISIBLE' | 'REMOVED';
  removedReason?: string;
  moderatedAt?: string;
};

export type Application = {
  id: string;
  userId: string;
  opportunityId: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'WAITLISTED';
  appliedAt: string;
  qrCodeData: string;
};

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  grade: number;
  interests: string[];
  totalHours: number;
};

export type OrganizationModerationStatus = 'PENDING' | 'APPROVED' | 'DENIED' | 'APPEALED';
export type AppealStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type AppealRecord = {
  id: string;
  message: string;
  submittedAt: string;
  status: AppealStatus;
  resolutionNote?: string;
  resolvedAt?: string;
};

export type OrganizationRecord = {
  id: string;
  name: string;
  contactEmail: string;
  causeTags: string[];
  description: string;
  status: OrganizationModerationStatus;
  denialReason?: string;
  appeal?: AppealRecord;
  createdAt: string;
  updatedAt: string;
};

export type AdminSession = {
  token: string;
  email: string;
  createdAt: string;
  expiresAt: string;
};

export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp-001',
    orgId: 'org-001',
    orgName: 'Green Earth Foundation',
    orgVerified: true,
    title: 'Park cleanup & tree planting',
    description:
      "Join us for a morning of park cleanup and tree planting at Riverside Park. We'll provide all tools and supplies. Great experience for students interested in environmental conservation.",
    causeTags: ['Environment'],
    date: '2026-04-05',
    startTime: '09:00',
    endTime: '12:00',
    durationHours: 3,
    location: { lat: 30.2672, lng: -97.7431, address: '1234 Riverside Dr', city: 'Austin', state: 'TX' },
    distance: 2.3,
    totalSpots: 20,
    filledSpots: 14,
    ageMinimum: 14,
    creditEligible: true,
    whatToBring: ['Water bottle', 'Sunscreen', 'Closed-toe shoes', 'Gardening gloves (optional)'],
    recurring: false,
    rating: 4.8,
  },
  {
    id: 'opp-002',
    orgId: 'org-002',
    orgName: 'Austin Food Bank',
    orgVerified: true,
    title: 'Food sorting & distribution',
    description:
      'Help sort and distribute food packages to families in need. We serve 500+ families per week and need all the help we can get. No experience necessary.',
    causeTags: ['Food'],
    date: '2026-04-08',
    startTime: '10:00',
    endTime: '14:00',
    durationHours: 4,
    location: { lat: 30.25, lng: -97.75, address: '8201 S Congress Ave', city: 'Austin', state: 'TX' },
    distance: 4.1,
    totalSpots: 30,
    filledSpots: 12,
    ageMinimum: 16,
    creditEligible: true,
    whatToBring: ['Comfortable shoes', 'Water bottle'],
    recurring: true,
    rating: 4.6,
  },
  {
    id: 'opp-003',
    orgId: 'org-003',
    orgName: 'Youth Mentorship Alliance',
    orgVerified: true,
    title: 'After-school tutoring',
    description:
      'Mentor and tutor elementary students in math and reading. 1-on-1 sessions with kids who need extra support. Training provided for new tutors.',
    causeTags: ['Education', 'Youth'],
    date: '2026-04-10',
    startTime: '15:30',
    endTime: '17:30',
    durationHours: 2,
    location: { lat: 30.2849, lng: -97.7341, address: '1600 E 7th St', city: 'Austin', state: 'TX' },
    distance: 1.5,
    totalSpots: 10,
    filledSpots: 7,
    ageMinimum: 16,
    creditEligible: true,
    whatToBring: ['Laptop (optional)', 'Patience and enthusiasm'],
    recurring: true,
    rating: 4.9,
  },
  {
    id: 'opp-004',
    orgId: 'org-004',
    orgName: 'Sunny Paws Rescue',
    orgVerified: true,
    title: 'Animal shelter walkathon',
    description:
      'Walk and socialize rescue dogs to help them get adopted faster. Each dog gets 30 minutes — enjoy some fresh air while helping animals find forever homes.',
    causeTags: ['Animals'],
    date: '2026-04-12',
    startTime: '08:00',
    endTime: '11:00',
    durationHours: 3,
    location: { lat: 30.3074, lng: -97.756, address: '7201 Levander Loop', city: 'Austin', state: 'TX' },
    distance: 3.2,
    totalSpots: 15,
    filledSpots: 13,
    ageMinimum: 14,
    creditEligible: false,
    whatToBring: ['Dog-friendly clothes', 'Running shoes', 'Water bottle'],
    recurring: false,
    rating: 4.7,
  },
  {
    id: 'opp-005',
    orgId: 'org-005',
    orgName: 'Sunrise Senior Center',
    orgVerified: true,
    title: 'Senior companion visits',
    description:
      'Visit and spend quality time with elderly residents — play board games, read together, or just have a conversation. Many residents rarely have visitors.',
    causeTags: ['Seniors', 'Health'],
    date: '2026-04-14',
    startTime: '14:00',
    endTime: '16:00',
    durationHours: 2,
    location: { lat: 30.23, lng: -97.78, address: '3000 S Lamar Blvd', city: 'Austin', state: 'TX' },
    distance: 5.7,
    totalSpots: 8,
    filledSpots: 3,
    ageMinimum: 16,
    creditEligible: true,
    whatToBring: ['Friendly attitude', 'Board games (optional)'],
    recurring: true,
    rating: 4.5,
  },
  {
    id: 'opp-006',
    orgId: 'org-001',
    orgName: 'Green Earth Foundation',
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
  },
  {
    id: 'opp-007',
    orgId: 'org-006',
    orgName: 'Arts for All',
    orgVerified: false,
    title: 'Mural painting on 6th street',
    description:
      "Join local artists in creating a community mural. No painting experience needed — we'll guide you. This is a unique chance to leave your mark on the neighborhood.",
    causeTags: ['Arts', 'Youth'],
    date: '2026-04-20',
    startTime: '10:00',
    endTime: '15:00',
    durationHours: 5,
    location: { lat: 30.2676, lng: -97.7405, address: '400 E 6th St', city: 'Austin', state: 'TX' },
    distance: 0.8,
    totalSpots: 12,
    filledSpots: 5,
    ageMinimum: 14,
    creditEligible: false,
    whatToBring: ["Clothes you don't mind getting paint on", 'Snacks'],
    recurring: false,
    rating: 4.3,
  },
  {
    id: 'opp-008',
    orgId: 'org-002',
    orgName: 'Austin Food Bank',
    orgVerified: true,
    title: 'Mobile pantry setup',
    description:
      "Help set up and run a mobile food pantry in an underserved neighborhood. We deliver fresh produce and pantry staples directly to families who can't easily reach our main location.",
    causeTags: ['Food', 'Health'],
    date: '2026-04-22',
    startTime: '07:00',
    endTime: '12:00',
    durationHours: 5,
    location: { lat: 30.22, lng: -97.76, address: '1106 Clayton Ln', city: 'Austin', state: 'TX' },
    distance: 6.3,
    totalSpots: 20,
    filledSpots: 19,
    ageMinimum: 16,
    creditEligible: true,
    whatToBring: ['Closed-toe shoes', 'Water bottle', 'Physical ability to lift 30lbs'],
    recurring: true,
    rating: 4.7,
    postStatus: 'REMOVED',
    removedReason: 'Duplicate posting detected',
    moderatedAt: '2026-03-26T09:30:00.000Z',
  },
];

export const mockApplications: Application[] = [];

export const mockUsers: UserProfile[] = [
  {
    id: 'user-001',
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'alex.rivera@school.edu',
    school: 'Austin High School',
    grade: 11,
    interests: ['Environment', 'Education'],
    totalHours: 24,
  },
];

export const mockOrganizations: OrganizationRecord[] = [
  {
    id: 'org-001',
    name: 'Green Earth Foundation',
    contactEmail: 'contact@greenearth.org',
    causeTags: ['Environment', 'Food'],
    description: 'Community environmental stewardship and neighborhood sustainability.',
    status: 'APPROVED',
    createdAt: '2026-01-12T08:00:00.000Z',
    updatedAt: '2026-03-20T10:00:00.000Z',
  },
  {
    id: 'org-002',
    name: 'Austin Food Bank',
    contactEmail: 'volunteer@austinfoodbank.org',
    causeTags: ['Food', 'Health'],
    description: 'Food sorting and distribution programs across Austin neighborhoods.',
    status: 'APPROVED',
    createdAt: '2026-01-20T09:15:00.000Z',
    updatedAt: '2026-03-18T14:22:00.000Z',
  },
  {
    id: 'org-003',
    name: 'Youth Mentorship Alliance',
    contactEmail: 'team@youthmentorship.org',
    causeTags: ['Education', 'Youth'],
    description: 'Academic mentorship and after-school support for local students.',
    status: 'APPROVED',
    createdAt: '2026-02-02T12:40:00.000Z',
    updatedAt: '2026-03-19T09:12:00.000Z',
  },
  {
    id: 'org-004',
    name: 'Sunny Paws Rescue',
    contactEmail: 'hello@sunnypaws.org',
    causeTags: ['Animals'],
    description: 'Rescue shelter and pet adoption support services.',
    status: 'APPROVED',
    createdAt: '2026-02-08T10:10:00.000Z',
    updatedAt: '2026-03-17T15:42:00.000Z',
  },
  {
    id: 'org-005',
    name: 'Sunrise Senior Center',
    contactEmail: 'coordinator@sunrisesenior.org',
    causeTags: ['Seniors', 'Health'],
    description: 'Senior care companionship and enrichment activities.',
    status: 'APPROVED',
    createdAt: '2026-02-12T11:00:00.000Z',
    updatedAt: '2026-03-15T10:18:00.000Z',
  },
  {
    id: 'org-006',
    name: 'Arts for All',
    contactEmail: 'admin@artsforall.org',
    causeTags: ['Arts', 'Youth'],
    description: 'Public art initiatives and youth mural workshops.',
    status: 'DENIED',
    denialReason: 'Missing nonprofit verification documents.',
    createdAt: '2026-02-20T16:15:00.000Z',
    updatedAt: '2026-03-21T08:45:00.000Z',
  },
  {
    id: 'org-007',
    name: 'Community Coding Club',
    contactEmail: 'board@communitycoding.club',
    causeTags: ['Education', 'Youth'],
    description: 'Coding mentorship and weekend project labs for teens.',
    status: 'PENDING',
    createdAt: '2026-03-24T13:20:00.000Z',
    updatedAt: '2026-03-24T13:20:00.000Z',
  },
];

export const adminSessions: AdminSession[] = [];
