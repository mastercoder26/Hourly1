import React from 'react';
import { useRouter } from 'expo-router';
import { useClerk } from '@clerk/expo';
import { PillButton } from './ui/PillButton';
import { useDemoAuth } from '../context/DemoAuthContext';

export function ClerkSignOutButton() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { exitDemo } = useDemoAuth();

  return (
    <PillButton
      variant="ghost"
      fullWidth
      size="medium"
      onPress={async () => {
        await signOut();
        exitDemo();
        router.dismissTo('/');
      }}
    >
      Sign out
    </PillButton>
  );
}
