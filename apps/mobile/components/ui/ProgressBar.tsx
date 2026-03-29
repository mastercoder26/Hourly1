// ProgressBar — animated step progress indicator
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { MOTION } from '../../lib/motion';

interface ProgressBarProps {
  steps: number;
  currentStep: number;
  accent?: 'teal' | 'purple';
}

export function ProgressBar({ steps, currentStep, accent = 'teal' }: ProgressBarProps) {
  const accentColor = accent === 'teal' ? Colors.teal : Colors.purple;
  const safeStep = Math.max(0, Math.min(currentStep, steps - 1));

  return (
    <View style={styles.container}>
      {Array.from({ length: steps }).map((_, index) => (
        <ProgressSegment
          key={index}
          active={index < safeStep}
          current={index === safeStep}
          color={accentColor}
        />
      ))}
    </View>
  );
}

function ProgressSegment({ active, current, color }: { active: boolean; current: boolean; color: string }) {
  // Completed steps render as filled immediately; current step animates in.
  const width = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    const shouldFill = active || current;
    const duration = current ? MOTION.duration.screen : MOTION.duration.standard;

    width.value = withDelay(
      current ? 45 : 0,
      withTiming(shouldFill ? 1 : 0, {
        duration,
        easing: MOTION.easeOut,
      })
    );
  }, [active, current]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View style={styles.segmentBg}>
      <Animated.View
        style={[
          styles.segmentFill,
          { backgroundColor: active ? color : color + '60' },
          animatedStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 4,
  },
  segmentBg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.dark.element,
    overflow: 'hidden',
  },
  segmentFill: {
    height: '100%',
    borderRadius: 2,
  },
});
