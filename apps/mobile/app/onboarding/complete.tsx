// Onboarding Complete - animated success screen
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { PillButton } from '../../components/ui/PillButton';
import { enterRise, MOTION } from '../../lib/motion';

export default function OnboardingComplete() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const isOrg = role === 'organizer';
  const accentColor = Colors.dark.textPrimary; // Premium black and white

  const checkScale = useSharedValue(0.92);
  const textOpacity = useSharedValue(0);
  const textTransY = useSharedValue(24);
  
  useEffect(() => {
    checkScale.value = withDelay(
      120,
      withSpring(1, {
        damping: MOTION.spring.damping,
        stiffness: MOTION.spring.stiffness,
        mass: MOTION.spring.mass,
      }),
    );
    textOpacity.value = withDelay(
      200,
      withTiming(1, { duration: MOTION.duration.screen, easing: MOTION.easeOut }),
    );
    textTransY.value = withDelay(
      200,
      withSpring(0, {
        damping: MOTION.spring.damping,
        stiffness: MOTION.spring.stiffness,
        mass: MOTION.spring.mass,
      }),
    );
  }, []);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTransY.value }],
  }));

  const handleContinue = () => {
    if (isOrg) {
      router.dismissTo('/(org-tabs)/dashboard');
    } else {
      router.dismissTo('/(student-tabs)/feed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.checkCircle, { borderColor: accentColor }, checkStyle]}>
          <Text style={styles.checkmark}>✓</Text>
        </Animated.View>

        <Animated.View style={textStyle}>
          <Text style={styles.title}>You're all set</Text>
          <Text style={styles.subtitle}>
            {isOrg
              ? 'Your dashboard is ready. Start posting volunteer opportunities.'
              : 'Let\'s find some amazing volunteer opportunities for you.'}
          </Text>
        </Animated.View>
      </View>

      <Animated.View style={styles.footer} entering={enterRise(260)}>
        <PillButton
          variant="primary"
          fullWidth
          size="large"
          onPress={handleContinue}
        >
          {isOrg ? 'Go to dashboard' : 'Explore opportunities'}
        </PillButton>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2, // slightly thinner for premium look
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    backgroundColor: Colors.dark.card,
  },
  checkmark: {
    fontSize: 48,
    color: Colors.dark.textPrimary,
    fontWeight: '300', // Lightweight look
  },
  title: {
    fontFamily: Typography.valueHuge.fontFamily,
    fontSize: Typography.title.fontSize,
    fontWeight: Typography.valueHuge.fontWeight,
    color: Colors.dark.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
});
