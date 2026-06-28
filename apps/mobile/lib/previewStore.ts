import { create } from 'zustand';

/**
 * Guest/preview flag, set when a live-build visitor taps "Explore as ...".
 * Kept in a tiny store so non-React helpers (e.g. `shouldUseDemoData`) can read
 * it synchronously while React screens can still subscribe for re-renders.
 */
interface PreviewState {
  isPreview: boolean;
  setPreview: (value: boolean) => void;
}

export const usePreviewStore = create<PreviewState>(set => ({
  isPreview: false,
  setPreview: (value: boolean) => set({ isPreview: value }),
}));

/** Synchronous read for helpers that run outside of React render. */
export function getIsPreview(): boolean {
  return usePreviewStore.getState().isPreview;
}

/** Imperative setter usable from providers/effects. */
export function setIsPreview(value: boolean): void {
  usePreviewStore.getState().setPreview(value);
}
