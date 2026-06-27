import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';

type ScreenHeaderVariant = 'back' | 'close';

interface ScreenHeaderProps {
  title?: string;
  onPress: () => void;
  variant?: ScreenHeaderVariant;
  accent?: 'teal' | 'purple' | 'default';
  rightSlot?: React.ReactNode;
}

const accentColors = {
  teal: Colors.teal,
  purple: Colors.purple,
  default: Colors.dark.textPrimary,
} as const;

export function ScreenHeader({
  title,
  onPress,
  variant = 'back',
  accent = 'default',
  rightSlot,
}: ScreenHeaderProps) {
  const accentColor = accentColors[accent];

  return (
    <View style={styles.row}>
      <Pressable onPress={onPress} style={styles.button} accessibilityRole="button">
        {variant === 'close' ? (
          <Text style={styles.closeText}>✕</Text>
        ) : (
          <>
            <Feather name="chevron-left" size={22} color={accentColor} />
            {title ? null : <Text style={[styles.backLabel, { color: accentColor }]}>Back</Text>}
          </>
        )}
      </Pressable>
      {title ? <Text style={styles.title}>{title}</Text> : <View style={styles.flex} />}
      {rightSlot ?? <View style={styles.spacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: Spacing.md,
  },
  button: {
    minWidth: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.element,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 2,
    paddingHorizontal: Spacing.sm,
  },
  closeText: {
    fontSize: 16,
    color: Colors.dark.textPrimary,
  },
  backLabel: {
    ...Typography.label,
    marginLeft: -2,
  },
  title: {
    ...Typography.subtitle,
    color: Colors.dark.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  flex: {
    flex: 1,
  },
  spacer: {
    width: 40,
  },
});
