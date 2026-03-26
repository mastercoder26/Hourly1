// Welcome Screen — "Welcome to Hourly" landing page
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn, ZoomIn } from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { PillButton } from '../components/ui/PillButton';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Cool Logo Animation */}
        <Animated.View style={styles.logoContainer} entering={ZoomIn.springify().damping(12).mass(1).delay(200)}>
          <View style={styles.brandCircle}>
            <Text style={styles.logoText}>H</Text>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View style={styles.titleContainer} entering={FadeInDown.springify().damping(18).mass(0.8).delay(400)}>
          <Text style={styles.title}>Hourly.</Text>
          <Text style={styles.subtitle}>
            The new standard for volunteer tracking.
          </Text>
        </Animated.View>
      </View>

      {/* Buttons */}
      <Animated.View style={styles.bottomActions} entering={FadeInDown.springify().damping(18).mass(0.8).delay(600)}>
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
