import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../packages/api/src/router';

export const trpc = createTRPCReact<AppRouter>();

type HeaderFactory = () => Promise<Record<string, string>>;

export function getTRPCClient(getHeaders?: HeaderFactory) {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/trpc',
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
