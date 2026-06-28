import { DEMO_PORTFOLIO_SLUG, portfolioPublicUrl } from '@hourly/shared';

export function getWebBaseUrl(): string {
  const raw = process.env.EXPO_PUBLIC_WEB_BASE_URL?.trim();
  if (raw) {
    return raw.replace(/\/$/, '');
  }
  return 'http://localhost:3000';
}

export function getDemoPortfolioShareUrl(): string {
  return portfolioPublicUrl(getWebBaseUrl(), DEMO_PORTFOLIO_SLUG);
}

/** Build a public portfolio URL for a specific user slug (live mode). */
export function getPortfolioShareUrlForSlug(slug: string): string {
  return portfolioPublicUrl(getWebBaseUrl(), slug);
}
