import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@clerk/expo';
import * as SecureStore from 'expo-secure-store';
import { trpc, getTRPCClient } from './trpc';
import { isClerkConfigured } from './clerkConfig';

async function getAdminTokenWithTimeout(timeoutMs = 800) {
  let secureStoreToken: string | null = null;

  try {
    secureStoreToken = await Promise.race<string | null>([
      SecureStore.getItemAsync('hourly_admin_token'),
      new Promise(resolve => {
        setTimeout(() => resolve(null), timeoutMs);
      }),
    ]);
  } catch {
    secureStoreToken = null;
  }

  if (secureStoreToken) {
    return secureStoreToken;
  }

  if (typeof window !== 'undefined') {
    try {
      return window.localStorage.getItem('hourly_admin_token');
    } catch {
      return null;
    }
  }

  return null;
}

function TRPCWithClerk({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const demoUserId = process.env.EXPO_PUBLIC_DEMO_USER_ID ?? 'user-001';

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    getTRPCClient(async () => {
      const headers: Record<string, string> = {};

      if (isClerkConfigured()) {
        const token = await getToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      if (!headers.Authorization && demoUserId) {
        headers['x-demo-user-id'] = demoUserId;
      }

      const adminToken = await getAdminTokenWithTimeout();
      if (adminToken) {
        headers['x-admin-token'] = adminToken;
      }

      return headers;
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </trpc.Provider>
    </QueryClientProvider>
  );
}

/** tRPC without Clerk context - demo-user header only (live API optional). */
function TRPCDemoBare({ children }: { children: React.ReactNode }) {
  const demoUserId = process.env.EXPO_PUBLIC_DEMO_USER_ID ?? 'user-001';

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    getTRPCClient(async () => {
      const headers: Record<string, string> = {};
      if (demoUserId) {
        headers['x-demo-user-id'] = demoUserId;
      }
      const adminToken = await getAdminTokenWithTimeout();
      if (adminToken) {
        headers['x-admin-token'] = adminToken;
      }
      return headers;
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </trpc.Provider>
    </QueryClientProvider>
  );
}

export function TRPCProvider({
  children,
  variant,
}: {
  children: React.ReactNode;
  /** `clerk` when ClerkProvider wraps this tree; `demo-bare` when running without Clerk. */
  variant: 'clerk' | 'demo-bare';
}) {
  if (variant === 'demo-bare') {
    return <TRPCDemoBare>{children}</TRPCDemoBare>;
  }
  return <TRPCWithClerk>{children}</TRPCWithClerk>;
}
