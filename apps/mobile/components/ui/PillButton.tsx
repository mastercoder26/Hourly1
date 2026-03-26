// Pill Button — rounded action buttons matching React App.js style
import React from 'react';
import { Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text } from '@/components/Themed';;
import { Colors } from '@/constants/colors';

interface PillButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  accent?: 'teal' | 'purple';
  fullWidth?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function PillButton({
  children,
  onPress,
  variant = 'default',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  style,
  textStyle,
}: PillButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        variant === 'default' && styles.default,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        fullWidth && styles.fullWidth,
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          styles[`${size}Text`],
          variant === 'default' && styles.defaultText,
          variant === 'primary' && styles.primaryText,
          variant === 'secondary' && styles.secondaryText,
          variant === 'ghost' && styles.ghostText,
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {children}
      </Text>
    </Pressable>
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
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 18,
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
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontWeight: '500',
  },
  smallText: {
    fontSize: 13,
  },
  mediumText: {
    fontSize: 15,
  },
  largeText: {
    fontSize: 16,
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
  disabledText: {
    color: Colors.dark.textTertiary,
  },
});
