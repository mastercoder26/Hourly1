import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../packages/api/src/router';

export const trpc = createTRPCReact<AppRouter>();

type HeaderFactory = () => Promise<Record<string, string>>;

// Hosted backend (Render). Used as the default when EXPO_PUBLIC_API_URL is not
// provided at build time so the deployed web build reaches the live API instead
// of localhost.
const PRODUCTION_API_URL = 'https://hourly1-api.onrender.com/trpc';
const LOCAL_API_URL = 'http://localhost:3001/trpc';

// Resolved at runtime (not build time) so it survives bundler dead-code
// elimination: a deployed web host points at the live API, while local dev and
// simulators keep using localhost.
function resolveApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv) {
    return fromEnv;
  }

  if (typeof window !== 'undefined' && window.location?.hostname) {
    const host = window.location.hostname;
    const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
    return isLocalHost ? LOCAL_API_URL : PRODUCTION_API_URL;
  }

  return LOCAL_API_URL;
}

export function getTRPCClient(getHeaders?: HeaderFactory) {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: resolveApiUrl(),
        async headers() {
          if (!getHeaders) {
            return {};
          }
          return getHeaders();
        },
      }),
    ],
  });
}
