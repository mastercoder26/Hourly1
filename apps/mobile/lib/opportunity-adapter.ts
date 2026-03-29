import { Opportunity, Review } from '../types';

export type ApiOpportunityLike = {
  id: string;
  orgId?: string;
  orgName?: string;
  orgVerified?: boolean;
  title: string;
  description: string;
  causeTags: string[];
  date: string | Date;
  startTime: string | Date;
  endTime: string | Date;
  durationHours: number | string;
  location?: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
  };
  lat?: number | string;
  lng?: number | string;
  address?: string;
  city?: string | null;
  state?: string | null;
  distance?: number;
  totalSpots: number;
  filledSpots: number;
  ageMinimum?: number | null;
  creditEligible: boolean;
  whatToBring?: string[];
  recurring: boolean;
  rating?: number;
  reviews?: Review[];
};

function toNumber(value: number | string | null | undefined, fallback = 0) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function toDateOnly(value: string | Date) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return parsed.toISOString().slice(0, 10);
}

function toHourMinute(value: string | Date) {
  if (value instanceof Date) {
    return value.toTimeString().slice(0, 5);
  }
  if (/^\d{2}:\d{2}$/.test(value)) {
    return value;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '00:00';
  }
  const hh = String(parsed.getHours()).padStart(2, '0');
  const mm = String(parsed.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function orgInitials(orgName?: string) {
  if (!orgName) return 'OR';
  const initials = orgName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
  return initials || 'OR';
}

export function toMobileOpportunity(raw: ApiOpportunityLike): Opportunity {
  const location = raw.location ?? {
    lat: toNumber(raw.lat, 0),
    lng: toNumber(raw.lng, 0),
    address: raw.address ?? 'TBD',
    city: raw.city ?? 'TBD',
    state: raw.state ?? 'TBD',
  };

  return {
    id: raw.id,
    orgId: raw.orgId ?? 'org-unknown',
    orgName: raw.orgName ?? 'Community Partner',
    orgLogo: orgInitials(raw.orgName),
    orgVerified: Boolean(raw.orgVerified),
    title: raw.title,
    description: raw.description,
    causeTags: raw.causeTags as Opportunity['causeTags'],
    date: toDateOnly(raw.date),
    startTime: toHourMinute(raw.startTime),
    endTime: toHourMinute(raw.endTime),
    durationHours: toNumber(raw.durationHours),
    location,
    distance: raw.distance,
    totalSpots: raw.totalSpots,
    filledSpots: raw.filledSpots,
    ageMinimum: raw.ageMinimum ?? 0,
    creditEligible: raw.creditEligible,
    whatToBring: raw.whatToBring ?? [],
    recurring: raw.recurring,
    rating: raw.rating ?? 4.5,
    reviews: raw.reviews ?? [],
  };
}
