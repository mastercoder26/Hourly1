import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { isDemoMode } from '@/lib/dataMode';
import { isClerkConfigured } from '@/lib/clerkConfig';
import { Colors } from '@/constants/colors';

function AuthRoutesWithClerk() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
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

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.base,
  },
});
