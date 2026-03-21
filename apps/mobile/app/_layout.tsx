// Root Layout — configures navigation and theme
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

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

  return (
    <GestureHandlerRootView style={styles.root}>
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
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark.base,
  },
});
