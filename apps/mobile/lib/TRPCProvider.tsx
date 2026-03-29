import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, getTRPCClient } from './trpc';
import { useAuth } from '@clerk/expo';
import * as SecureStore from 'expo-secure-store';

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

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
  const isClerkConfigured = clerkKey.length > 0 && !clerkKey.includes('PLACEHOLDER');
  const demoUserId = process.env.EXPO_PUBLIC_DEMO_USER_ID ?? 'user-001';

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    getTRPCClient(async () => {
      const headers: Record<string, string> = {};

      if (isClerkConfigured) {
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
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
