import type { Router } from 'expo-router';

/** Close auth / demo-auth modals and return to the welcome screen. */
export function exitToWelcome(router: Router): void {
  router.dismissTo('/');
}
