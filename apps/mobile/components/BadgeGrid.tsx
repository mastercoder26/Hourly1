// BadgeGrid — milestone badge display with unlock animation
import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Colors, CardStyle, Shadows } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Badge } from '../types';
import { MOTION, PRESS_FEEDBACK } from '../lib/motion';

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
  const scale = useSharedValue(badge.isNew ? 0.9 : 1);
  const opacity = useSharedValue(badge.isNew ? 0 : 1);
  const pressScale = useSharedValue(1);
  const earned = !!badge.earnedAt;

  useEffect(() => {
    if (badge.isNew) {
      // Staggered entrance animation
      opacity.value = withDelay(
        index * 60,
        withTiming(1, { duration: MOTION.duration.emphasized })
      );
      scale.value = withDelay(
        index * 60,
        withSequence(
          withSpring(1.1, MOTION.springSnappy),
          withSpring(1, MOTION.spring)
        )
      );
    }
  }, [badge.isNew, index, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pressScale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    pressScale.value = withTiming(PRESS_FEEDBACK.scale, { duration: MOTION.duration.instant });
  };

  const handlePressOut = () => {
    pressScale.value = withTiming(1, { duration: MOTION.duration.quick });
  };

  const handlePress = () => {
    if (earned) {
      Alert.alert(badge.label, badge.description);
      return;
    }

    Alert.alert('Badge locked', `Complete ${badge.label.toLowerCase()} to unlock this badge.`);
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.badge,
          !earned && styles.badgeLocked,
        ]}
      >
        <View style={[styles.iconContainer, earned && styles.iconContainerEarned]}>
          <Text style={[styles.icon, !earned && styles.iconLocked]}>{badge.icon}</Text>
        </View>
        <Text style={[styles.label, !earned && styles.labelLocked]} numberOfLines={2}>
          {badge.label}
        </Text>
        {badge.isNew && earned && (
          <View style={styles.newIndicator}>
            <View style={styles.newDot} />
          </View>
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
    width: 100,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: CardStyle.borderRadiusTiny,
    backgroundColor: Colors.dark.element,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    position: 'relative',
  },
  badgeLocked: {
    opacity: 0.4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerEarned: {
    backgroundColor: Colors.accentSoft,
  },
  icon: {
    fontSize: 24,
  },
  iconLocked: {
    opacity: 0.5,
  },
  label: {
    ...Typography.tiny,
    color: Colors.dark.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
  },
  labelLocked: {
    color: Colors.dark.textTertiary,
  },
  newIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  newDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
    ...Shadows.button,
  },
});
