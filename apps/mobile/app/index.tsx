// Welcome Screen — "Welcome to Hourly" landing page
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { PillButton } from '../components/ui/PillButton';
import { useAuth, useUser } from '@clerk/expo';
import { enterRise } from '../lib/motion';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!authLoaded || !isSignedIn) {
      return;
    }

    const role =
      typeof user?.unsafeMetadata?.role === 'string'
        ? user.unsafeMetadata.role
        : null;

    if (role === 'organizer') {
      router.replace('/(org-tabs)/dashboard');
      return;
    }

    router.replace('/(student-tabs)/feed');
  }, [authLoaded, isSignedIn, router, user?.unsafeMetadata?.role]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={styles.logoContainer} entering={enterRise(120)}>
          <View style={styles.brandCircle}>
            <Text style={styles.logoText}>H</Text>
          </View>
        </Animated.View>

        <Animated.View style={styles.titleContainer} entering={enterRise(200)}>
          <Text style={styles.title}>Hourly.</Text>
          <Text style={styles.subtitle}>
            The new standard for volunteer tracking.
          </Text>
        </Animated.View>
      </View>

      <Animated.View style={styles.bottomActions} entering={enterRise(280)}>
        <PillButton
          variant="primary"
          fullWidth
          size="large"
          onPress={() => router.push('/role-selection')}
        >
          Sign Up
        </PillButton>
        <PillButton
          variant="secondary" // Slightly lighter black, or keep ghost
          fullWidth
          size="large"
          onPress={() => router.push('/(auth)/sign-in')}
        >
          Sign In
        </PillButton>
        <PillButton
          variant="ghost"
          fullWidth
          size="medium"
          onPress={() => router.push('/admin/login' as never)}
        >
          Admin Portal
        </PillButton>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  brandCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.dark.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.dark.textPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  logoText: {
    fontFamily: Typography.valueHuge.fontFamily,
    fontSize: 48,
    fontWeight: '700',
    color: Colors.dark.base,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: Typography.valueHuge.fontFamily,
    fontSize: 48,
    fontWeight: '600',
    letterSpacing: -1.5,
    color: Colors.dark.textPrimary,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: Typography.body.fontFamily,
    fontSize: 17,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomActions: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 16,
  },
});
