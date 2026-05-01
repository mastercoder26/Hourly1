import { describe, expect, it } from 'vitest';
import { haversineDistanceMeters } from '../lib/geo';

describe('haversineDistanceMeters', () => {
  it('returns ~0 for identical points', () => {
    expect(haversineDistanceMeters(30.2672, -97.7431, 30.2672, -97.7431)).toBeLessThan(1);
  });

  it('returns a small distance for nearby Austin coordinates', () => {
    const d = haversineDistanceMeters(30.2672, -97.7431, 30.27, -97.74);
    expect(d).toBeGreaterThan(100);
    expect(d).toBeLessThan(5000);
  });
});
