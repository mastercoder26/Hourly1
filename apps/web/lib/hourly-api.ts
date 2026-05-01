import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../packages/api/src/router';

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

let client: ReturnType<typeof createTRPCProxyClient<AppRouter>> | null = null;

export function getHourlyApi() {
  if (!client) {
    client = createTRPCProxyClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${baseUrl.replace(/\/$/, '')}/trpc`,
        }),
      ],
    });
  }
  return client;
}
