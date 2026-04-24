// Pill Button - rounded action buttons with premium animations
import React from 'react';
import { Pressable, StyleSheet, ViewStyle, TextStyle, StyleProp, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Text } from '@/components/Themed';
import { Colors } from '@/constants/colors';
import { MOTION, PRESS_FEEDBACK, haptic, microSpring } from '@/lib/motion';

interface PillButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'accent';
  size?: 'small' | 'medium' | 'large';
  accent?: 'teal' | 'purple';
  fullWidth?: boolean;
  disabled?: boolean;
  hapticFeedback?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function PillButton({
  children,
  onPress,
  variant = 'default',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  hapticFeedback = true,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}: PillButtonProps) {
  const pressed = useSharedValue(0);
  const hovered = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      pressed.value,
      [0, 1],
      [1, PRESS_FEEDBACK.scale],
      Extrapolation.CLAMP
    );
    
    const opacity = interpolate(
      pressed.value,
      [0, 1],
      [1, PRESS_FEEDBACK.opacity],
      Extrapolation.CLAMP
    );

    // Subtle shadow reduction on press for depth effect
    const shadowOpacity = interpolate(
      pressed.value,
      [0, 1],
      [0.1, 0.05],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
      shadowOpacity,
    };
  });

  // Web hover effect
  const hoverStyle = useAnimatedStyle(() => {
    if (Platform.OS !== 'web') return {};
    
    return {
      backgroundColor: interpolate(
        hovered.value,
        [0, 1],
        [0, 0.05],
        Extrapolation.CLAMP
      ) > 0 ? Colors.dark.elementHover : undefined,
    };
  });

  const handlePressIn = () => {
    pressed.value = withSpring(1, microSpring.press);
    if (hapticFeedback && !disabled) {
      haptic.light();
    }
  };

  const handlePressOut = () => {
    pressed.value = withSpring(0, microSpring.release);
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  const handleHoverIn = () => {
    if (Platform.OS === 'web') {
      hovered.value = withTiming(1, { duration: MOTION.duration.quick });
    }
  };

  const handleHoverOut = () => {
    if (Platform.OS === 'web') {
      hovered.value = withTiming(0, { duration: MOTION.duration.quick });
    }
  };

  const content = (
    <>
      {icon && iconPosition === 'left' && icon}
      <Text
        style={[
          styles.text,
          styles[`${size}Text`],
          variant === 'default' && styles.defaultText,
          variant === 'primary' && styles.primaryText,
          variant === 'secondary' && styles.secondaryText,
          variant === 'ghost' && styles.ghostText,
          variant === 'accent' && styles.accentText,
          disabled && styles.disabledText,
          icon && iconPosition === 'left' ? { marginLeft: 8 } : undefined,
          icon && iconPosition === 'right' ? { marginRight: 8 } : undefined,
          textStyle,
        ]}
      >
        {children}
      </Text>
      {icon && iconPosition === 'right' && icon}
    </>
  );

  return (
    <Animated.View style={[animatedStyle, fullWidth && styles.fullWidth, style]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        // @ts-ignore - web only props
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        disabled={disabled}
        style={({ pressed: isPressed }) => [
          styles.base,
          styles[size],
          variant === 'default' && styles.default,
          variant === 'primary' && styles.primary,
          variant === 'secondary' && styles.secondary,
          variant === 'ghost' && styles.ghost,
          variant === 'accent' && styles.accent,
          disabled && styles.disabled,
          Platform.OS === 'web' && styles.webCursor,
        ]}
      >
        {content}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  small: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  large: {
    paddingHorizontal: 28,
    paddingVertical: 16,
  },
  default: {
    backgroundColor: Colors.dark.element,
  },
  primary: {
    backgroundColor: Colors.dark.textPrimary,
  },
  secondary: {
    backgroundColor: Colors.dark.element,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  accent: {
    backgroundColor: Colors.accent,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.4,
  },
  webCursor: {
    // @ts-ignore - web only
    cursor: 'pointer',
  },
  text: {
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  smallText: {
    fontSize: 13,
  },
  mediumText: {
    fontSize: 15,
  },
  largeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  defaultText: {
    color: Colors.dark.textSecondary,
  },
  primaryText: {
    color: Colors.dark.base,
    fontWeight: '600',
  },
  secondaryText: {
    color: Colors.dark.textPrimary,
  },
  ghostText: {
    color: Colors.dark.textSecondary,
  },
  accentText: {
    color: Colors.dark.base,
    fontWeight: '600',
  },
  disabledText: {
    color: Colors.dark.textTertiary,
  },
});
