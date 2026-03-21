// Welcome Screen — "Welcome to Hourly" landing page
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { Card } from '../components/ui/Card';
import { PillButton } from '../components/ui/PillButton';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const titleOpacity = useSharedValue(0);
  const titleTransY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const cardsOpacity = useSharedValue(0);
  const cardsTransY = useSharedValue(40);
  const bottomOpacity = useSharedValue(0);

  useEffect(() => {
    // Staggered entrance animation
    titleOpacity.value = withDelay(200, withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }));
    titleTransY.value = withDelay(200, withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) }));
    subtitleOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    cardsOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
    cardsTransY.value = withDelay(800, withSpring(0, { damping: 15, stiffness: 100 }));
    bottomOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTransY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const cardsStyle = useAnimatedStyle(() => ({
    opacity: cardsOpacity.value,
    transform: [{ translateY: cardsTransY.value }],
  }));

  const bottomStyle = useAnimatedStyle(() => ({
    opacity: bottomOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Decorative gradient circles */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <View style={styles.content}>
        {/* Logo + Title */}
        <Animated.View style={[styles.titleContainer, titleStyle]}>
          <Text style={styles.logo}>⏱</Text>
          <Text style={styles.title}>Welcome to{'\n'}Hourly</Text>
        </Animated.View>

        <Animated.View style={subtitleStyle}>
          <Text style={styles.subtitle}>
            Choose your own student organizer
          </Text>
        </Animated.View>

        {/* Role selection cards */}
        <Animated.View style={[styles.cards, cardsStyle]}>
          <Pressable
            onPress={() => router.push('/onboarding?role=student')}
            style={({ pressed }) => [pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }]}
          >
            <Card style={styles.roleCard}>
              <View style={styles.roleIcon}>
                <Text style={styles.roleEmoji}>🎓</Text>
              </View>
              <View style={styles.roleInfo}>
                <Text style={styles.roleTitle}>I'm a student</Text>
                <Text style={styles.roleDescription}>
                  Find volunteer opportunities, track hours, and build your portfolio
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </Card>
          </Pressable>

          <Pressable
            onPress={() => router.push('/onboarding?role=organizer')}
            style={({ pressed }) => [pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }]}
          >
            <Card style={[styles.roleCard, styles.roleCardPurple]}>
              <View style={[styles.roleIcon, styles.roleIconPurple]}>
                <Text style={styles.roleEmoji}>🏢</Text>
              </View>
              <View style={styles.roleInfo}>
                <Text style={styles.roleTitle}>I'm an organizer</Text>
                <Text style={styles.roleDescription}>
                  Post events, manage volunteers, and track your impact
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </Card>
          </Pressable>
        </Animated.View>

        {/* Sign in / Sign up buttons */}
        <Animated.View style={[styles.bottomActions, bottomStyle]}>
          <PillButton
            variant="primary"
            accent="teal"
            fullWidth
            size="large"
            onPress={() => router.push('/(auth)/sign-up')}
          >
            Get started
          </PillButton>
          <PillButton
            variant="ghost"
            fullWidth
            size="medium"
            onPress={() => router.push('/(auth)/sign-in')}
          >
            Already have an account? Sign in
          </PillButton>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.teal,
    opacity: 0.06,
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -50,
    left: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.purple,
    opacity: 0.05,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  titleContainer: {
    marginBottom: 16,
  },
  logo: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 44,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    letterSpacing: -1.5,
    lineHeight: 50,
  },
  subtitle: {
    fontSize: 17,
    color: Colors.dark.textSecondary,
    marginBottom: 40,
    lineHeight: 24,
  },
  cards: {
    gap: 14,
    marginBottom: 40,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 24,
  },
  roleCardPurple: {},
  roleIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIconPurple: {
    backgroundColor: Colors.purpleSoft,
  },
  roleEmoji: {
    fontSize: 26,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    lineHeight: 18,
  },
  arrow: {
    fontSize: 20,
    color: Colors.dark.textTertiary,
  },
  bottomActions: {
    gap: 12,
  },
});
