// Root Layout — configures navigation and theme
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, Platform } from 'react-native';
import { Colors } from '@/constants/colors';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { TRPCProvider } from '@/lib/TRPCProvider';
import { ClerkProvider } from '@clerk/expo';
import * as SecureStore from 'expo-secure-store';

SplashScreen.preventAutoHideAsync();

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Ignore secure store write errors in demo/dev flows.
    }
  },
};

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

  const rawClerkPublishableKey =
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() ?? '';
  const clerkPublishableKey =
    rawClerkPublishableKey.length > 0
      ? rawClerkPublishableKey
      : 'pk_test_PLACEHOLDER_PUBLISHABLE_KEY';

  return (
    <GestureHandlerRootView style={styles.root}>
      <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
        <TRPCProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.dark.base },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)/sign-in" options={{ presentation: 'modal' }} />
            <Stack.Screen name="(auth)/sign-up" options={{ presentation: 'modal' }} />
            <Stack.Screen name="admin/login" options={{ presentation: 'modal' }} />
            <Stack.Screen name="admin/dashboard" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(student-tabs)" />
            <Stack.Screen name="(org-tabs)" />
            <Stack.Screen name="opportunity/[id]" />
            <Stack.Screen name="shift/checkin" options={{ presentation: 'modal' }} />
            <Stack.Screen name="shift/active" />
            <Stack.Screen name="org/create-role" options={{ presentation: 'modal' }} />
            <Stack.Screen name="org/scanner" options={{ presentation: 'modal' }} />
            <Stack.Screen name="org/applicants/[opportunityId]" />
            <Stack.Screen name="messages/[applicationId]" options={{ presentation: 'modal' }} />
          </Stack>
        </TRPCProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark.base,
  },
});
