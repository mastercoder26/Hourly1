import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type DemoRole = 'student' | 'organizer';

type DemoAuthValue = {
  demoSignedIn: boolean;
  demoRole: DemoRole | null;
  enterDemo: (role: DemoRole) => void;
  exitDemo: () => void;
};

const DemoAuthContext = createContext<DemoAuthValue | null>(null);

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const [demoSignedIn, setDemoSignedIn] = useState(false);
  const [demoRole, setDemoRole] = useState<DemoRole | null>(null);

  const enterDemo = useCallback((role: DemoRole) => {
    setDemoRole(role);
    setDemoSignedIn(true);
  }, []);

  const exitDemo = useCallback(() => {
    setDemoRole(null);
    setDemoSignedIn(false);
  }, []);

  const value = useMemo(
    () => ({
      demoSignedIn,
      demoRole,
      enterDemo,
      exitDemo,
    }),
    [demoSignedIn, demoRole, enterDemo, exitDemo],
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
