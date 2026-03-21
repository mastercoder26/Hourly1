// Mock Students, Organizations, Attendance — Phase 1 static data
import { StudentProfile, Organization, AttendanceRecord, Application, Badge, Message, OrgStats } from '../types';

export const mockStudent: StudentProfile = {
  id: 'stu-001',
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

export const mockOrganizations: Organization[] = [
  {
    id: 'org-001',
    name: 'Green Earth Foundation',
    ein: '84-1234567',
    mission: 'Protecting and restoring Austin\'s natural spaces through community-driven conservation.',
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
    mission: 'Fighting hunger in Central Texas by distributing food and operating programs that nourish communities.',
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
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: 'att-001',
    studentId: 'stu-001',
    opportunityId: 'opp-001',
    checkinTime: '2026-03-01T09:02:00Z',
    checkoutTime: '2026-03-01T12:05:00Z',
    hoursLogged: 3,
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'att-002',
    studentId: 'stu-001',
    opportunityId: 'opp-002',
    checkinTime: '2026-03-08T10:00:00Z',
    checkoutTime: '2026-03-08T14:10:00Z',
    hoursLogged: 4,
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'att-003',
    studentId: 'stu-001',
    opportunityId: 'opp-003',
    checkinTime: '2026-03-10T15:30:00Z',
    checkoutTime: '2026-03-10T17:35:00Z',
    hoursLogged: 2,
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'att-004',
    studentId: 'stu-001',
    opportunityId: 'opp-004',
    checkinTime: '2026-03-12T08:00:00Z',
    checkoutTime: '2026-03-12T11:00:00Z',
    hoursLogged: 3,
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'att-005',
    studentId: 'stu-001',
    opportunityId: 'opp-005',
    checkinTime: '2026-03-14T14:00:00Z',
    checkoutTime: '2026-03-14T16:00:00Z',
    hoursLogged: 2,
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'att-006',
    studentId: 'stu-001',
    opportunityId: 'opp-006',
    checkinTime: '2026-03-19T08:00:00Z',
    checkoutTime: '2026-03-19T13:00:00Z',
    hoursLogged: 5,
    verificationStatus: 'PENDING',
  },
];

export const mockApplications: Application[] = [
  {
    id: 'app-001',
    studentId: 'stu-001',
    opportunityId: 'opp-001',
    status: 'APPROVED',
    appliedAt: '2026-02-28T10:00:00Z',
    qrCodeData: 'hourly:checkin:app-001:stu-001:opp-001',
  },
  {
    id: 'app-002',
    studentId: 'stu-001',
    opportunityId: 'opp-007',
    status: 'PENDING',
    appliedAt: '2026-03-18T14:00:00Z',
    qrCodeData: 'hourly:checkin:app-002:stu-001:opp-007',
  },
];

export const mockBadges: Badge[] = [
  { type: 'first-shift', label: 'First shift', description: 'Completed your very first volunteer shift', icon: '🌟', earnedAt: '2026-03-01', isNew: false },
  { type: '10-hours', label: '10 hours', description: 'Logged 10 verified volunteer hours', icon: '⏱️', earnedAt: '2026-03-10', isNew: false },
  { type: '25-hours', label: '25 hours', description: 'Logged 25 verified volunteer hours', icon: '🔥', earnedAt: '2026-03-14', isNew: true },
  { type: '50-hours', label: '50 hours', description: 'Logged 50 verified volunteer hours', icon: '🏆', earnedAt: undefined, isNew: false },
  { type: '100-hours', label: '100 hours', description: 'Logged 100 verified volunteer hours', icon: '💎', earnedAt: undefined, isNew: false },
  { type: '5-orgs', label: '5 organizations', description: 'Volunteered with 5 different organizations', icon: '🤝', earnedAt: undefined, isNew: false },
  { type: '1-year-streak', label: '1 year streak', description: 'Volunteered at least once every month for a year', icon: '👑', earnedAt: undefined, isNew: false },
];

export const mockMessages: Message[] = [
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
    senderId: 'stu-001',
    senderName: 'Alex R.',
    senderRole: 'student',
    text: 'Sounds great! I\'ll be there. Should I bring my own gloves?',
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

export const mockOrgStats: OrgStats = {
  volunteersThisMonth: 34,
  totalHours: 3200,
  retentionRate: 0.72,
  avgRating: 4.8,
  activeListings: 3,
};

// Mock applicants for org view
export const mockApplicants = [
  { id: 'stu-001', firstName: 'Alex', lastName: 'R.', grade: 11, totalHours: 47.5, rating: 4.9, status: 'APPROVED' as const },
  { id: 'stu-002', firstName: 'Jordan', lastName: 'T.', grade: 10, totalHours: 23, rating: 4.5, status: 'APPROVED' as const },
  { id: 'stu-003', firstName: 'Mia', lastName: 'C.', grade: 12, totalHours: 89, rating: 5.0, status: 'PENDING' as const },
  { id: 'stu-004', firstName: 'Ethan', lastName: 'P.', grade: 11, totalHours: 15, rating: 4.2, status: 'PENDING' as const },
  { id: 'stu-005', firstName: 'Sophia', lastName: 'K.', grade: 9, totalHours: 8, rating: 0, status: 'WAITLISTED' as const },
  { id: 'stu-006', firstName: 'Liam', lastName: 'W.', grade: 10, totalHours: 31, rating: 4.7, status: 'DECLINED' as const },
];
