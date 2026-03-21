// BadgeGrid — milestone badge display with unlock animation
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { Badge } from '../types';

interface BadgeGridProps {
  badges: Badge[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <View style={styles.grid}>
      {badges.map((badge, index) => (
        <BadgeItem key={badge.type} badge={badge} index={index} />
      ))}
    </View>
  );
}

function BadgeItem({ badge, index }: { badge: Badge; index: number }) {
  const scale = useSharedValue(badge.isNew ? 0 : 1);
  const earned = !!badge.earnedAt;

  useEffect(() => {
    if (badge.isNew) {
      scale.value = withDelay(
        index * 100,
        withSequence(
          withSpring(1.2, { damping: 8, stiffness: 300 }),
          withSpring(1, { damping: 10, stiffness: 200 })
        )
      );
    }
  }, [badge.isNew]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable style={[styles.badge, !earned && styles.badgeLocked]}>
        <Text style={[styles.icon, !earned && styles.iconLocked]}>{badge.icon}</Text>
        <Text style={[styles.label, !earned && styles.labelLocked]}>{badge.label}</Text>
        {badge.isNew && earned && (
          <View style={styles.newDot} />
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badge: {
    width: 90,
    height: 90,
    borderRadius: 20,
    backgroundColor: Colors.dark.element,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    position: 'relative',
  },
  badgeLocked: {
    opacity: 0.35,
  },
  icon: {
    fontSize: 28,
  },
  iconLocked: {
    opacity: 0.5,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    textAlign: 'center',
  },
  labelLocked: {
    color: Colors.dark.textTertiary,
  },
  newDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.teal,
  },
});
