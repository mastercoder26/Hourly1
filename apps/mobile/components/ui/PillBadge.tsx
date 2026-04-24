// Pill Badge - colored cause tag pills with optional icons
import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Text } from '@/components/Themed';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { CauseIcons } from '../../constants/icons';
import { CauseTag } from '../../types';

interface PillBadgeProps {
  label: string;
  color?: string;
  causeTag?: CauseTag;
  size?: 'tiny' | 'small' | 'medium';
  outlined?: boolean;
  showIcon?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function PillBadge({ 
  label, 
  color, 
  causeTag, 
  size = 'small', 
  outlined = false,
  showIcon = false,
  style,
}: PillBadgeProps) {
  const textColor = color || (causeTag ? Colors.causeTags[causeTag] : Colors.dark.textSecondary);
  const bgColor = causeTag ? Colors.causeTagsSoft[causeTag] : (color ? `${color}18` : Colors.dark.element);
  const iconName = causeTag && CauseIcons[causeTag];
  const iconSize = size === 'tiny' ? 10 : size === 'small' ? 12 : 14;
  
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
      {showIcon && iconName && (
        <Feather name={iconName} size={iconSize} color={textColor} style={styles.icon} />
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
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
  icon: {
    marginRight: 4,
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
