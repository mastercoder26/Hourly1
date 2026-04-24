/**
 * `demo` (default): local demo store only, no API - for presentations and offline dev.
 * `live`: real tRPC + Clerk; requires backend and env configuration.
 */
export type DataMode = 'demo' | 'live';

export function getDataMode(): DataMode {
  const raw = process.env.EXPO_PUBLIC_DATA_MODE?.trim().toLowerCase();
  if (raw === 'live') {
    return 'live';
  }
  return 'demo';
}

export function isDemoMode(): boolean {
  return getDataMode() === 'demo';
}

export function isLiveMode(): boolean {
  return getDataMode() === 'live';
}
