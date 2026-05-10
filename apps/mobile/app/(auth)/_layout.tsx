import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';
import { isDemoMode } from '@/lib/dataMode';
import { isClerkConfigured } from '@/lib/clerkConfig';

function AuthRoutesWithClerk() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function AuthRoutesLayout() {
  if (isDemoMode() && !isClerkConfigured()) {
    return <Redirect href="/role-selection" />;
  }
  return <AuthRoutesWithClerk />;
}
