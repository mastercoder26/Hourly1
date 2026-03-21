// Onboarding Complete — animated success screen
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { PillButton } from '../../components/ui/PillButton';

export default function OnboardingComplete() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const isOrg = role === 'organizer';
  const accentColor = isOrg ? Colors.purple : Colors.teal;

  const checkScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTransY = useSharedValue(20);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    checkScale.value = withDelay(200, withSequence(
      withSpring(1.3, { damping: 6, stiffness: 300 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    ));
    textOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    textTransY.value = withDelay(600, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));
    buttonOpacity.value = withDelay(1000, withTiming(1, { duration: 500 }));
  }, []);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTransY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const handleContinue = () => {
    if (isOrg) {
      router.replace('/(org-tabs)/dashboard');
    } else {
      router.replace('/(student-tabs)/feed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.checkCircle, { borderColor: accentColor }, checkStyle]}>
          <Text style={styles.checkmark}>✓</Text>
        </Animated.View>

        <Animated.View style={textStyle}>
          <Text style={styles.title}>You're all set!</Text>
          <Text style={styles.subtitle}>
            {isOrg
              ? 'Your dashboard is ready. Start posting volunteer opportunities.'
              : 'Let\'s find some amazing volunteer opportunities for you.'}
          </Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.footer, buttonStyle]}>
        <PillButton
          variant="primary"
          accent={isOrg ? 'purple' : 'teal'}
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
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  checkmark: {
    fontSize: 48,
    color: Colors.dark.textPrimary,
    fontWeight: '300',
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
});
