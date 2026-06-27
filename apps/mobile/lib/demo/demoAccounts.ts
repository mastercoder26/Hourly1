import type { DemoRole } from '@/context/DemoAuthContext';

export interface DemoAccountRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  role: DemoRole;
}

export const PRESET_STUDENT_ACCOUNT: DemoAccountRecord = {
  id: 'preset-student',
  name: 'Alex Rivera',
  email: 'alex@demo.hourly',
  password: 'demo123',
  role: 'student',
};

export const PRESET_ORGANIZER_ACCOUNT: DemoAccountRecord = {
  id: 'preset-organizer',
  name: 'Green Earth Foundation',
  email: 'org@demo.hourly',
  password: 'demo123',
  role: 'organizer',
};

export const PRESET_DEMO_ACCOUNTS: DemoAccountRecord[] = [
  PRESET_STUDENT_ACCOUNT,
  PRESET_ORGANIZER_ACCOUNT,
];

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
