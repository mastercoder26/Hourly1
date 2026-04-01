// Web-optimized Card component with CSS transitions and hover effects
import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Platform, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Colors, CardStyle, Shadows } from '../../constants/colors';
import { MOTION } from '../../lib/motion';

interface WebCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: StyleProp<ViewStyle>;
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'none';
}

export function WebCard({
  children,
  onPress,
  variant = 'default',
  padding = 'medium',
  style,
  hoverEffect = 'lift',
}: WebCardProps) {
  const hovered = useSharedValue(0);
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    if (Platform.OS !== 'web') {
      return {};
    }

    const translateY = interpolate(
      hovered.value - pressed.value * 0.5,
      [-0.5, 0, 1],
      [1, 0, -3],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      pressed.value,
      [0, 1],
      [1, 0.99],
      Extrapolation.CLAMP
    );

    const shadowOpacity = interpolate(
      hovered.value,
      [0, 1],
      [0.2, 0.35],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateY },
        { scale },
      ],
      shadowOpacity,
    };
  });

  const handleHoverIn = () => {
    if (Platform.OS === 'web' && onPress) {
      hovered.value = withTiming(1, { duration: MOTION.duration.standard });
    }
  };

  const handleHoverOut = () => {
    if (Platform.OS === 'web') {
      hovered.value = withTiming(0, { duration: MOTION.duration.standard });
    }
  };

  const handlePressIn = () => {
    if (onPress) {
      pressed.value = withTiming(1, { duration: MOTION.duration.instant });
    }
  };

  const handlePressOut = () => {
    pressed.value = withTiming(0, { duration: MOTION.duration.quick });
  };

  const content = (
    <Animated.View
      style={[
        styles.card,
        variant === 'default' && styles.default,
        variant === 'elevated' && styles.elevated,
        variant === 'outlined' && styles.outlined,
        variant === 'ghost' && styles.ghost,
        padding === 'none' && styles.paddingNone,
        padding === 'small' && styles.paddingSmall,
        padding === 'medium' && styles.paddingMedium,
        padding === 'large' && styles.paddingLarge,
        animatedStyle,
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
        // @ts-ignore - web props
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        style={Platform.OS === 'web' ? webPressableStyle : undefined}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const webPressableStyle = {
  cursor: 'pointer',
} as const;

const styles = StyleSheet.create({
  card: {
    borderRadius: CardStyle.borderRadius,
    overflow: 'hidden',
    ...Shadows.card,
  },
  default: {
    backgroundColor: Colors.dark.card,
  },
  elevated: {
    backgroundColor: Colors.dark.cardElevated,
    ...Shadows.card,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.dark.divider,
  },
  ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: CardStyle.paddingSmall,
  },
  paddingMedium: {
    padding: CardStyle.padding,
  },
  paddingLarge: {
    padding: 40,
  },
});

export default WebCard;
