/**
 * Parses `hourly://checkin/{opportunityId}/{studentUserId}` payloads from QR codes.
 */
export function parseHourlyCheckInQr(raw: string): { opportunityId: string; studentId: string } | null {
  const trimmed = raw.trim();
  const m = /^hourly:\/\/checkin\/([^/]+)\/([^/?#]+)/i.exec(trimmed);
  if (!m) {
    return null;
  }
  return { opportunityId: m[1], studentId: m[2] };
}
