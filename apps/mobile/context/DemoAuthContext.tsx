import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useDemoStore } from '@/lib/demo/demoStore';
import { setPreviewActive } from '@/lib/dataSource';
import {
  normalizeEmail,
  PRESET_DEMO_ACCOUNTS,
  type DemoAccountRecord,
} from '@/lib/demo/demoAccounts';

export type DemoRole = 'student' | 'organizer';

export type DemoAccountIdentity = {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
};

type DemoAuthValue = {
  demoSignedIn: boolean;
  isPreview: boolean;
  demoRole: DemoRole | null;
  currentAccount: DemoAccountIdentity | null;
  enterDemo: (role: DemoRole, options?: { preview?: boolean }) => void;
  signIn: (email: string, password: string) => { ok: true; role: DemoRole } | { ok: false; error: string };
  signUp: (
    name: string,
    email: string,
    password: string,
    role: DemoRole,
  ) => { ok: true } | { ok: false; error: string };
  signInPreset: (accountId: string) => void;
  switchRole: (role: DemoRole) => void;
  exitDemo: () => void;
};

const DemoAuthContext = createContext<DemoAuthValue | null>(null);

function toIdentity(account: DemoAccountRecord): DemoAccountIdentity {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
  };
}

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const resetStore = useDemoStore(s => s.reset);
  const [demoSignedIn, setDemoSignedIn] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [demoRole, setDemoRole] = useState<DemoRole | null>(null);
  const [currentAccount, setCurrentAccount] = useState<DemoAccountIdentity | null>(null);
  const [accountRegistry, setAccountRegistry] = useState<DemoAccountRecord[]>(() => [
    ...PRESET_DEMO_ACCOUNTS,
  ]);

  const beginSession = useCallback(
    (account: DemoAccountRecord, resetData: boolean) => {
      if (resetData) {
        resetStore();
      }
      setCurrentAccount(toIdentity(account));
      setDemoRole(account.role);
      setDemoSignedIn(true);
      setIsPreview(false);
      setPreviewActive(false);
    },
    [resetStore],
  );

  const enterDemo = useCallback(
    (role: DemoRole, options?: { preview?: boolean }) => {
      const preview = options?.preview ?? false;
      if (preview) {
        setIsPreview(true);
        setPreviewActive(true);
        setDemoRole(role);
        setDemoSignedIn(true);
        const preset =
          role === 'student'
            ? PRESET_DEMO_ACCOUNTS.find(a => a.role === 'student')
            : PRESET_DEMO_ACCOUNTS.find(a => a.role === 'organizer');
        if (preset) {
          setCurrentAccount(toIdentity(preset));
        }
        return;
      }
      const preset =
        role === 'student'
          ? PRESET_DEMO_ACCOUNTS.find(a => a.role === 'student')
          : PRESET_DEMO_ACCOUNTS.find(a => a.role === 'organizer');
      if (preset) {
        beginSession(preset, false);
        return;
      }
      setDemoRole(role);
      setDemoSignedIn(true);
      setIsPreview(false);
      setPreviewActive(false);
    },
    [beginSession],
  );

  const signIn = useCallback(
    (email: string, password: string) => {
      const normalized = normalizeEmail(email);
      const match = accountRegistry.find(
        a => normalizeEmail(a.email) === normalized && a.password === password,
      );
      if (!match) {
        return { ok: false as const, error: 'Invalid email or password.' };
      }
      beginSession(match, true);
      return { ok: true as const, role: match.role };
    },
    [accountRegistry, beginSession],
  );

  const signUp = useCallback(
    (name: string, email: string, password: string, role: DemoRole) => {
      const trimmedName = name.trim();
      const normalized = normalizeEmail(email);
      if (!trimmedName) {
        return { ok: false as const, error: 'Name is required.' };
      }
      if (!normalized) {
        return { ok: false as const, error: 'Email is required.' };
      }
      if (accountRegistry.some(a => normalizeEmail(a.email) === normalized)) {
        return { ok: false as const, error: 'An account with this email already exists.' };
      }
      const account: DemoAccountRecord = {
        id: `acct-${Date.now()}`,
        name: trimmedName,
        email: normalized,
        password,
        role,
      };
      setAccountRegistry(prev => [...prev, account]);
      beginSession(account, true);
      return { ok: true as const };
    },
    [accountRegistry, beginSession],
  );

  const signInPreset = useCallback(
    (accountId: string) => {
      const preset = PRESET_DEMO_ACCOUNTS.find(a => a.id === accountId);
      if (!preset) {
        return;
      }
      beginSession(preset, true);
    },
    [beginSession],
  );

  const switchRole = useCallback((role: DemoRole) => {
    setDemoRole(role);
    setCurrentAccount(prev => (prev ? { ...prev, role } : prev));
  }, []);

  const exitDemo = useCallback(() => {
    resetStore();
    setDemoRole(null);
    setDemoSignedIn(false);
    setCurrentAccount(null);
    setIsPreview(false);
    setPreviewActive(false);
  }, [resetStore]);

  const value = useMemo(
    () => ({
      demoSignedIn,
      isPreview,
      demoRole,
      currentAccount,
      enterDemo,
      signIn,
      signUp,
      signInPreset,
      switchRole,
      exitDemo,
    }),
    [
      demoSignedIn,
      isPreview,
      demoRole,
      currentAccount,
      enterDemo,
      signIn,
      signUp,
      signInPreset,
      switchRole,
      exitDemo,
    ],
  );

  return <DemoAuthContext.Provider value={value}>{children}</DemoAuthContext.Provider>;
}

export function useDemoAuth(): DemoAuthValue {
  const ctx = useContext(DemoAuthContext);
  if (!ctx) {
    throw new Error('useDemoAuth must be used within DemoAuthProvider');
  }
  return ctx;
}

/** Safe outside DemoAuthProvider (e.g. live + Clerk tree). */
export function useDemoAuthOptional(): DemoAuthValue | null {
  return useContext(DemoAuthContext);
}
