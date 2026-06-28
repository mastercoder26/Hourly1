// Welcome Screen - "Welcome to Hourly" landing page with refined animations
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import { Colors, Shadows } from '../constants/colors';
import { Typography } from '../constants/typography';
import { PillButton } from '../components/ui/PillButton';
import { useAuth, useUser } from '@clerk/expo';
import { enterRise, enterFade } from '../lib/motion';
import { Feather } from '@expo/vector-icons';
import { isDemoMode } from '../lib/dataMode';
import { isClerkConfigured } from '../lib/clerkConfig';
import { useDemoAuth } from '../context/DemoAuthContext';

const { width } = Dimensions.get('window');

function WelcomeChrome({
  bottomActions,
}: {
  bottomActions: React.ReactNode;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.bgDecoration}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />
      </View>

      <View style={styles.content}>
        <Animated.View style={styles.logoContainer} entering={enterRise(80)}>
          <View style={styles.brandCircle}>
            <Text style={styles.logoText}>H</Text>
          </View>
        </Animated.View>

        <Animated.View style={styles.titleContainer} entering={enterRise(160)}>
          <Text style={styles.title}>Hourly.</Text>
          <Text style={styles.subtitle}>
            Track your volunteer hours.{'\n'}Make an impact.
          </Text>
        </Animated.View>

        <Animated.View style={styles.features} entering={enterFade(280)}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Feather name="clock" size={18} color={Colors.accent} />
            </View>
            <Text style={styles.featureText}>Verified hour tracking</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Feather name="award" size={18} color={Colors.accent} />
            </View>
            <Text style={styles.featureText}>Earn badges & credits</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Feather name="map-pin" size={18} color={Colors.accent} />
            </View>
            <Text style={styles.featureText}>Find local opportunities</Text>
          </View>
        </Animated.View>
      </View>

      <Animated.View style={styles.bottomActions} entering={enterRise(360)}>
        {bottomActions}
      </Animated.View>
    </View>
  );
}

function WelcomeDemoBare() {
  const router = useRouter();
  const { enterDemo } = useDemoAuth();

  return (
    <WelcomeChrome
      bottomActions={
        <>
          <PillButton
            variant="primary"
            fullWidth
            size="large"
            onPress={() => {
              enterDemo('student');
              router.dismissTo('/(student-tabs)/feed');
            }}
          >
            Explore as student
          </PillButton>
          <PillButton
            variant="secondary"
            fullWidth
            size="large"
            onPress={() => {
              enterDemo('organizer');
              router.replace('/(org-tabs)/dashboard');
            }}
          >
            Explore as organizer
          </PillButton>
          <PillButton variant="ghost" fullWidth size="large" onPress={() => router.push('/role-selection')}>
            Get Started
          </PillButton>
          <PillButton
            variant="ghost"
            fullWidth
            size="medium"
            onPress={() => router.push('/demo-auth?mode=sign-up')}
          >
            Create account
          </PillButton>
          <PillButton
            variant="ghost"
            fullWidth
            size="medium"
            onPress={() => router.push('/demo-auth?mode=sign-in')}
          >
            Sign In
          </PillButton>
          <PillButton variant="ghost" fullWidth size="medium" onPress={() => router.push('/admin/login' as never)}>
            Admin Portal
          </PillButton>
        </>
      }
    />
  );
}

function WelcomeWithClerk() {
  const router = useRouter();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { exitDemo, enterDemo } = useDemoAuth();

  useEffect(() => {
    if (!authLoaded || !isSignedIn) {
      return;
    }

    exitDemo();

    const role =
      typeof user?.unsafeMetadata?.role === 'string' ? user.unsafeMetadata.role : null;

    if (role === 'organizer') {
      router.dismissTo('/(org-tabs)/dashboard');
      return;
    }

    router.dismissTo('/(student-tabs)/feed');
  }, [authLoaded, isSignedIn, exitDemo, router, user?.unsafeMetadata?.role]);

  return (
    <WelcomeChrome
      bottomActions={
        <>
          <PillButton variant="primary" fullWidth size="large" onPress={() => router.push('/role-selection')}>
            Get Started
          </PillButton>
          <PillButton
            variant="secondary"
            fullWidth
            size="large"
            onPress={() => {
              enterDemo('student', { preview: true });
              router.dismissTo('/(student-tabs)/feed');
            }}
          >
            Explore as student
          </PillButton>
          <PillButton
            variant="secondary"
            fullWidth
            size="large"
            onPress={() => {
              enterDemo('organizer', { preview: true });
              router.replace('/(org-tabs)/dashboard');
            }}
          >
            Explore as organizer
          </PillButton>
          <PillButton variant="secondary" fullWidth size="large" onPress={() => router.push('/(auth)/sign-up?role=student')}>
            Create Account
          </PillButton>
          <PillButton variant="secondary" fullWidth size="large" onPress={() => router.push('/(auth)/sign-in')}>
            Sign In
          </PillButton>
          <PillButton variant="ghost" fullWidth size="medium" onPress={() => router.push('/admin/login' as never)}>
            Admin Portal
          </PillButton>
        </>
      }
    />
  );
}

export default function WelcomeScreen() {
  if (isDemoMode() && !isClerkConfigured()) {
    return <WelcomeDemoBare />;
  }
  return <WelcomeWithClerk />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  bgDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.accentSoft,
    opacity: 0.3,
  },
  bgCircle2: {
    position: 'absolute',
    bottom: 200,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: Colors.dark.card,
    opacity: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 32,
  },
  brandCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.dark.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.card,
  },
  logoText: {
    fontSize: 44,
    fontWeight: '700',
    color: Colors.dark.base,
    letterSpacing: -1,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 52,
    fontWeight: '600',
    letterSpacing: -1.5,
    color: Colors.dark.textPrimary,
    marginBottom: 16,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  features: {
    gap: 16,
    alignItems: 'flex-start',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    ...Typography.label,
    color: Colors.dark.textPrimary,
  },
  bottomActions: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 12,
  },
});
