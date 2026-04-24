// StatCard - reusable stat display with label + value
import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Text } from '@/components/Themed';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors, CardStyle, Shadows } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { MOTION } from '../../lib/motion';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  animateValue?: boolean;
  delay?: number;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'compact' | 'large';
  accentColor?: string;
}

export function StatCard({
  label,
  value,
  subValue,
  trend,
  trendValue,
  animateValue = true,
  delay = 0,
  style,
  variant = 'default',
  accentColor,
}: StatCardProps) {
  const opacity = useSharedValue(animateValue ? 0 : 1);
  const translateY = useSharedValue(animateValue ? 10 : 0);

  React.useEffect(() => {
    if (animateValue) {
      opacity.value = withDelay(
        delay,
        withTiming(1, { duration: MOTION.duration.emphasized, easing: MOTION.easeOut })
      );
      translateY.value = withDelay(
        delay,
        withTiming(0, { duration: MOTION.duration.emphasized, easing: MOTION.easeOut })
      );
    }
  }, [opacity, translateY, animateValue, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const getTrendColor = () => {
    if (trend === 'up') return Colors.success;
    if (trend === 'down') return Colors.error;
    return Colors.dark.textSecondary;
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '';
  };

  return (
    <View
      style={[
        styles.card,
        variant === 'compact' && styles.cardCompact,
        variant === 'large' && styles.cardLarge,
        accentColor && { borderLeftWidth: 3, borderLeftColor: accentColor },
        style,
      ]}
    >
      <Text style={[styles.label, variant === 'large' && styles.labelLarge]}>
        {label}
      </Text>
      
      <Animated.View style={animatedStyle}>
        <Text
          style={[
            styles.value,
            variant === 'compact' && styles.valueCompact,
            variant === 'large' && styles.valueLarge,
          ]}
        >
          {value}
        </Text>
      </Animated.View>

      {(subValue || (trend && trendValue)) && (
        <View style={styles.footer}>
          {subValue && (
            <Text style={styles.subValue}>{subValue}</Text>
          )}
          {trend && trendValue && (
            <Text style={[styles.trend, { color: getTrendColor() }]}>
              {getTrendIcon()} {trendValue}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: CardStyle.borderRadiusSmall,
    padding: CardStyle.paddingSmall,
    ...Shadows.cardSubtle,
  },
  cardCompact: {
    padding: CardStyle.paddingTiny,
    borderRadius: CardStyle.borderRadiusTiny,
  },
  cardLarge: {
    padding: CardStyle.padding,
    borderRadius: CardStyle.borderRadius,
  },
  label: {
    ...Typography.header,
    marginBottom: 12,
  },
  labelLarge: {
    ...Typography.headerLarge,
    marginBottom: 16,
  },
  value: {
    ...Typography.valueLarge,
    color: Colors.dark.textPrimary,
  },
  valueCompact: {
    ...Typography.valueMedium,
  },
  valueLarge: {
    ...Typography.valueHuge,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  subValue: {
    ...Typography.caption,
  },
  trend: {
    fontSize: 13,
    fontWeight: '600',
  },
});
