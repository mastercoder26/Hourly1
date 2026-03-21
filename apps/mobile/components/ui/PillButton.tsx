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
  accent = 'teal',
  fullWidth = false,
  disabled = false,
  style,
  textStyle,
}: PillButtonProps) {
  const accentColor = accent === 'teal' ? Colors.teal : Colors.purple;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        variant === 'default' && styles.default,
        variant === 'primary' && { backgroundColor: accentColor },
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
          variant === 'secondary' && { color: accentColor },
          variant === 'ghost' && { color: Colors.dark.textSecondary },
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
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  large: {
    paddingHorizontal: 28,
    paddingVertical: 18,
  },
  default: {
    backgroundColor: Colors.dark.element,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.dark.element,
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
    fontSize: 17,
  },
  defaultText: {
    color: Colors.dark.textSecondary,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  disabledText: {
    color: Colors.dark.textTertiary,
  },
});
