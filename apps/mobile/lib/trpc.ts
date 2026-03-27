import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../packages/api/src/router';

export const trpc = createTRPCReact<AppRouter>();

export function getTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/trpc',
      }),
    ],
  });
}
