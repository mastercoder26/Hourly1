import { describe, expect, it } from 'vitest';
import { parseHourlyCheckInQr } from '../lib/qr-parse';

describe('parseHourlyCheckInQr', () => {
  it('parses hourly check-in URLs', () => {
    expect(parseHourlyCheckInQr('hourly://checkin/opp123/user456')).toEqual({
      opportunityId: 'opp123',
      studentId: 'user456',
    });
  });

  it('returns null for invalid payloads', () => {
    expect(parseHourlyCheckInQr('https://example.com')).toBeNull();
    expect(parseHourlyCheckInQr('')).toBeNull();
  });
});
