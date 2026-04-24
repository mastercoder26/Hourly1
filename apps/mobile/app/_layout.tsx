// Root Layout - configures navigation and theme
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { TRPCProvider } from '@/lib/TRPCProvider';
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { DemoAuthProvider } from '@/context/DemoAuthContext';
import { isDemoMode, isLiveMode } from '@/lib/dataMode';
import { isClerkConfigured, getClerkPublishableKey } from '@/lib/clerkConfig';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter: Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const clerkKey = getClerkPublishableKey();
  const clerkOk = isClerkConfigured();
  const demo = isDemoMode();

  if (isLiveMode() && !clerkOk) {
    throw new Error(
      'Live mode requires EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Set EXPO_PUBLIC_DATA_MODE=demo for offline demo.',
    );
  }

  const stackScreens = (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.dark.base },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" options={{ presentation: 'modal' }} />
      <Stack.Screen name="admin/login" options={{ presentation: 'modal' }} />
      <Stack.Screen name="admin/dashboard" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen
        name="(student-tabs)"
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="(org-tabs)"
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="opportunity/[id]" />
      <Stack.Screen name="shift/checkin" options={{ presentation: 'modal' }} />
      <Stack.Screen name="shift/active" />
      <Stack.Screen name="org/create-role" options={{ presentation: 'modal' }} />
      <Stack.Screen name="org/scanner" options={{ presentation: 'modal' }} />
      <Stack.Screen name="org/applicants/[opportunityId]" />
      <Stack.Screen name="org/verify-hours" />
      <Stack.Screen name="messages/[applicationId]" options={{ presentation: 'modal' }} />
      <Stack.Screen name="settings/[screen]" options={{ presentation: 'modal' }} />
    </Stack>
  );

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <DemoAuthProvider>
          {demo && !clerkOk ? (
            <TRPCProvider variant="demo-bare">
              <StatusBar style="light" />
              {stackScreens}
            </TRPCProvider>
          ) : (
            <ClerkProvider publishableKey={clerkKey!} tokenCache={tokenCache}>
              <TRPCProvider variant="clerk">
                <StatusBar style="light" />
                {stackScreens}
              </TRPCProvider>
            </ClerkProvider>
          )}
        </DemoAuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark.base,
  },
});
