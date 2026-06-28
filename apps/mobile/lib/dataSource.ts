import { isDemoMode } from './dataMode';
import { getIsPreview, setIsPreview } from './previewStore';

/**
 * Single source of truth for "should this screen read the local demo store?".
 * True when the build is in demo mode, OR when a live-build visitor entered a
 * guest preview ("Explore as student/organizer"). Real Clerk-signed-in users
 * fall through to live tRPC/Neon data.
 */
export function shouldUseDemoData(): boolean {
  return isDemoMode() || getIsPreview();
}

/** Convenience inverse for tRPC `enabled` flags (real API reads). */
export function shouldUseLiveApi(): boolean {
  return !shouldUseDemoData();
}

/**
 * Toggle the guest/preview flag. Called by the DemoAuth provider so that the
 * hook-friendly helpers above can resolve synchronously during render.
 */
export function setPreviewActive(value: boolean): void {
  setIsPreview(value);
}
