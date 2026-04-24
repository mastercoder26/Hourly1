// Card component - floating dark card with press feedback
import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors, CardStyle, Shadows } from '@/constants/colors';
import { MOTION, PRESS_FEEDBACK } from '@/lib/motion';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'compact' | 'elevated' | 'transparent' | 'outlined';
  accent?: 'teal' | 'success' | 'warning' | 'error';
  onPress?: () => void;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Card({ 
  children, 
  style, 
  variant = 'default', 
  accent,
  onPress,
  disabled = false,
}: CardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (!onPress) return;
    scale.value = withTiming(PRESS_FEEDBACK.scale, { duration: MOTION.duration.instant });
    opacity.value = withTiming(PRESS_FEEDBACK.opacity, { duration: MOTION.duration.instant });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: MOTION.duration.quick });
    opacity.value = withTiming(1, { duration: MOTION.duration.quick });
  };

  const content = (
    <Animated.View
      style={[
        styles.card,
        variant === 'compact' && styles.compact,
        variant === 'elevated' && styles.elevated,
        variant === 'transparent' && styles.transparent,
        variant === 'outlined' && styles.outlined,
        accent === 'teal' && styles.accentTeal,
        accent === 'success' && styles.accentSuccess,
        accent === 'warning' && styles.accentWarning,
        accent === 'error' && styles.accentError,
        onPress && pressStyle,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: CardStyle.borderRadius,
    padding: CardStyle.padding,
    ...Shadows.card,
  },
  compact: {
    padding: CardStyle.paddingSmall,
    borderRadius: CardStyle.borderRadiusSmall,
  },
  elevated: {
    backgroundColor: Colors.dark.cardElevated,
    ...Shadows.card,
  },
  transparent: {
    backgroundColor: 'transparent',
    padding: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.dark.divider,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  accentTeal: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.teal,
  },
  accentSuccess: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.success,
  },
  accentWarning: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  accentError: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
});
