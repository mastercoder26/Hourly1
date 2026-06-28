export type OnboardingGrade = number | 'college';

export type SchoolSearchResult = {
  id: string;
  ncesId?: string | null;
  name: string;
  districtName?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
};

type OnboardingState = {
  grade: OnboardingGrade | null;
  schoolQuery: string;
  schoolId: string | null;
  school: SchoolSearchResult | null;
  interests: string[];
  availabilityDays: string[];
  orgName: string;
  orgEin: string;
  orgMission: string;
};

const defaultState = (): OnboardingState => ({
  grade: null,
  schoolQuery: '',
  schoolId: null,
  school: null,
  interests: [],
  availabilityDays: [],
  orgName: '',
  orgEin: '',
  orgMission: '',
});

let state: OnboardingState = defaultState();

function next(patch: Partial<OnboardingState>): OnboardingState {
  state = { ...state, ...patch };
  return state;
}

export function getOnboardingState(): OnboardingState {
  return { ...state };
}

export function resetOnboardingState(): void {
  state = defaultState();
}

export function setOnboardingGrade(grade: OnboardingGrade | null): void {
  next({ grade });
}

export function setSchoolQuery(query: string): void {
  next({ schoolQuery: query });
}

export function setSelectedSchool(school: SchoolSearchResult | null): void {
  next({
    school,
    schoolId: school?.id ?? null,
    schoolQuery: school?.name ?? state.schoolQuery,
  });
}

export function setOnboardingInterests(interests: string[]): void {
  next({ interests });
}

export function setOnboardingAvailability(days: string[]): void {
  next({ availabilityDays: days });
}

export function setOrgOnboardingDetails(details: {
  orgName?: string;
  orgEin?: string;
  orgMission?: string;
}): void {
  next({
    ...(details.orgName !== undefined ? { orgName: details.orgName } : {}),
    ...(details.orgEin !== undefined ? { orgEin: details.orgEin } : {}),
    ...(details.orgMission !== undefined ? { orgMission: details.orgMission } : {}),
  });
}

export function gradeToApiValue(grade: OnboardingGrade | null): number | undefined {
  if (grade === null) {
    return undefined;
  }
  if (grade === 'college') {
    return 13;
  }
  return grade;
}
