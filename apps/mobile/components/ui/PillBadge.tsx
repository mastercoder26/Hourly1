// Pill Badge — colored cause tag pills
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';;
import { Colors } from '../../constants/colors';
import { CauseTag } from '../../types';

interface PillBadgeProps {
  label: string;
  color?: string;
  causeTag?: CauseTag;
  size?: 'small' | 'medium';
  outlined?: boolean;
}

export function PillBadge({ label, color, causeTag, size = 'small', outlined = false }: PillBadgeProps) {
  const bgColor = color || (causeTag ? Colors.causeTags[causeTag] : Colors.dark.element);
  
  return (
    <View
      style={[
        styles.pill,
        size === 'medium' && styles.medium,
        outlined
          ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: bgColor }
          : { backgroundColor: bgColor + '22' },
      ]}
    >
      <Text
        style={[
          styles.text,
          size === 'medium' && styles.textMedium,
          { color: outlined ? bgColor : bgColor },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  medium: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
  textMedium: {
    fontSize: 14,
  },
});
