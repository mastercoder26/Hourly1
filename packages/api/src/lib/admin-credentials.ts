/**
 * Admin dashboard login uses a single email/password pair from env.
 * In production both must be set. Local dev can rely on documented defaults
 * so the demo UI works without extra setup.
 */
const DEV_EMAIL = 'admin@hourly.app';
const DEV_PASSWORD = 'HourlyAdmin!2026';

export function getResolvedAdminCredentials(): { email: string; password: string } {
  const email = process.env.ADMIN_DASHBOARD_EMAIL?.trim();
  const password = process.env.ADMIN_DASHBOARD_PASSWORD;

  const isProd = process.env.NODE_ENV === 'production';
  if (isProd && (!email || !password)) {
    throw new Error(
      'Set ADMIN_DASHBOARD_EMAIL and ADMIN_DASHBOARD_PASSWORD in production.'
    );
  }

  return {
    email: email && email.length > 0 ? email : DEV_EMAIL,
    password: password && password.length > 0 ? password : DEV_PASSWORD,
  };
}
