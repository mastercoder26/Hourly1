import { Stack, useRouter, useSegments } from 'expo-router';
import { View } from 'react-native';

export default function OnboardingLayout() {
  const segments = useSegments();
  
  // Calculate progress based on current route segment
  let progress = 0;
  const route = segments[segments.length - 1];
  
  if (route === 'index') progress = 0.25;
  if (route === 'school') progress = 0.5;
  if (route === 'interests') progress = 0.75;
  if (route === 'availability') progress = 1.0;

  return (
    <View className="flex-1 bg-offWhite dark:bg-black">
      <View className="h-2 w-full bg-grayBorder mt-12">
        <View 
          className="h-full bg-teal" 
          style={{ width: `${progress * 100}%` }} 
        />
      </View>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="school" />
        <Stack.Screen name="interests" />
        <Stack.Screen name="availability" />
      </Stack>
    </View>
  );
}
