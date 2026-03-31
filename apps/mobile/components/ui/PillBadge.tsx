// Pill Badge — colored cause tag pills
import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Text } from '@/components/Themed';
import { Colors } from '../../constants/colors';
import { CauseTag } from '../../types';

interface PillBadgeProps {
  label: string;
  color?: string;
  causeTag?: CauseTag;
  size?: 'tiny' | 'small' | 'medium';
  outlined?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function PillBadge({ 
  label, 
  color, 
  causeTag, 
  size = 'small', 
  outlined = false,
  style,
}: PillBadgeProps) {
  const textColor = color || (causeTag ? Colors.causeTags[causeTag] : Colors.dark.textSecondary);
  const bgColor = causeTag ? Colors.causeTagsSoft[causeTag] : (color ? `${color}18` : Colors.dark.element);
  
  return (
    <View
      style={[
        styles.pill,
        size === 'tiny' && styles.tiny,
        size === 'medium' && styles.medium,
        outlined
          ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: textColor }
          : { backgroundColor: bgColor },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          size === 'tiny' && styles.textTiny,
          size === 'medium' && styles.textMedium,
          { color: textColor },
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
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  tiny: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  medium: {
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  textTiny: {
    fontSize: 10,
  },
  textMedium: {
    fontSize: 14,
  },
});
