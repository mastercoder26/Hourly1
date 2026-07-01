const PRODUCTION_API_ORIGIN = 'https://hourly1-api.onrender.com';
const LOCAL_API_ORIGIN = 'http://localhost:3001';

export type ApiHealth = {
  status: string;
  version?: string;
  adminConfigured?: boolean;
  gitCommit?: string | null;
};

function resolveApiOrigin(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/trpc\/?$/, '');
  }

  if (typeof window !== 'undefined' && window.location?.hostname) {
    const host = window.location.hostname;
    const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
    return isLocalHost ? LOCAL_API_ORIGIN : PRODUCTION_API_ORIGIN;
  }

  return LOCAL_API_ORIGIN;
}

export async function fetchApiHealth(): Promise<ApiHealth | null> {
  try {
    const response = await fetch(`${resolveApiOrigin()}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as ApiHealth;
  } catch {
    return null;
  }
}

/** Latest API build identifier — compare against GET /health `version`. */
export const EXPECTED_API_VERSION = '2026-06-27-live';

export function isApiVersionCurrent(health: ApiHealth | null | undefined): boolean {
  if (!health?.version) {
    return false;
  }

  return health.version === EXPECTED_API_VERSION;
}
