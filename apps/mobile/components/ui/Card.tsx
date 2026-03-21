// Card component — floating dark card inspired by React App.js
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, CardStyle } from '../../constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'compact' | 'transparent';
  accent?: 'teal' | 'purple';
}

export function Card({ children, style, variant = 'default', accent }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        variant === 'compact' && styles.compact,
        variant === 'transparent' && styles.transparent,
        accent === 'teal' && styles.accentTeal,
        accent === 'purple' && styles.accentPurple,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: CardStyle.borderRadius,
    padding: CardStyle.padding,
    // Shadow for floating effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  compact: {
    padding: CardStyle.paddingSmall,
    borderRadius: 20,
  },
  transparent: {
    backgroundColor: 'transparent',
    padding: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  accentTeal: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.teal,
  },
  accentPurple: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.purple,
  },
});
