import type { AdminSession } from '../mock-data';

/** Drop expired admin sessions in-place (mock store is process-local). */
export function purgeExpiredAdminSessions(sessions: AdminSession[]): void {
  const now = Date.now();
  for (let i = sessions.length - 1; i >= 0; i -= 1) {
    if (new Date(sessions[i].expiresAt).getTime() <= now) {
      sessions.splice(i, 1);
    }
  }
}
