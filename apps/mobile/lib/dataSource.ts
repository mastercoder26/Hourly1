import { isDemoMode } from './dataMode';
import { getIsPreview, setIsPreview, usePreviewStore } from './previewStore';

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
 * Synchronous guest-tab guard for layouts. Reads the preview store directly so
 * navigation right after `enterDemo` is not blocked by batched React state.
 */
export function hasGuestTabAccess(demoSignedIn: boolean, isPreview: boolean): boolean {
  return demoSignedIn || isPreview || getIsPreview();
}

/**
 * Reactive variant for screens/hooks — subscribes to the preview store so tRPC
 * `enabled` flags and loading states update when guest preview toggles.
 */
export function useShouldUseDemoData(): boolean {
  const isPreview = usePreviewStore(s => s.isPreview);
  return isDemoMode() || isPreview;
}

export function useShouldUseLiveApi(): boolean {
  return !useShouldUseDemoData();
}

/**
 * Toggle the guest/preview flag. Called by the DemoAuth provider so that the
 * hook-friendly helpers above can resolve synchronously during render.
 */
export function setPreviewActive(value: boolean): void {
  setIsPreview(value);
}
