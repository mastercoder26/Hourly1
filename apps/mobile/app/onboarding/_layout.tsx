// Onboarding Layout - wraps onboarding steps
import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../constants/colors';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.dark.base },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="school" />
      <Stack.Screen name="interests" />
      <Stack.Screen name="availability" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
