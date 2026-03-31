// HoursChart — bar chart showing hours by cause with refined styling
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withDelay, 
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { CauseTag, AttendanceRecord } from '../types';
import { mockOpportunities } from '../mocks/opportunities';
import { MOTION } from '../lib/motion';

interface HoursChartProps {
  attendance: AttendanceRecord[];
}

function AnimatedBar({ 
  percentage, 
  color, 
  delay 
}: { 
  percentage: number; 
  color: string; 
  delay: number;
}) {
  const width = useSharedValue(0);
  
  React.useEffect(() => {
    width.value = withDelay(
      delay,
      withTiming(percentage, { 
        duration: 800,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [percentage, delay, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
    backgroundColor: color,
  }));

  return (
    <Animated.View style={[styles.bar, animatedStyle]} />
  );
}

export function HoursChart({ attendance }: HoursChartProps) {
  // Calculate hours by cause
  const hoursByCause: Record<string, number> = {};
  
  attendance.forEach(record => {
    if (record.verificationStatus === 'VERIFIED') {
      const opp = mockOpportunities.find(o => o.id === record.opportunityId);
      if (opp) {
        opp.causeTags.forEach(tag => {
          hoursByCause[tag] = (hoursByCause[tag] || 0) + record.hoursLogged;
        });
      }
    }
  });

  const entries = Object.entries(hoursByCause).sort((a, b) => b[1] - a[1]);
  const maxHours = Math.max(...entries.map(([, h]) => h), 1);

  if (entries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>📊</Text>
        </View>
        <Text style={styles.emptyText}>No verified hours yet</Text>
        <Text style={styles.emptySubtext}>Complete shifts to see your impact breakdown</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {entries.map(([cause, hours], index) => {
        const percentage = (hours / maxHours) * 100;
        const color = Colors.causeTags[cause] || Colors.accent;
        
        return (
          <View key={cause} style={styles.row}>
            <View style={styles.labelContainer}>
              <View style={[styles.causeDot, { backgroundColor: color }]} />
              <Text style={styles.causeLabel}>{cause}</Text>
            </View>
            <View style={styles.barContainer}>
              <AnimatedBar 
                percentage={percentage} 
                color={color} 
                delay={index * 80}
              />
            </View>
            <Text style={styles.hoursLabel}>{hours}h</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  labelContainer: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  causeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  causeLabel: {
    ...Typography.caption,
    color: Colors.dark.textPrimary,
    fontWeight: '500',
  },
  barContainer: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.dark.element,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 6,
  },
  hoursLabel: {
    ...Typography.label,
    color: Colors.dark.textPrimary,
    width: 40,
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.element,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIconText: {
    fontSize: 24,
  },
  emptyText: {
    ...Typography.label,
    color: Colors.dark.textPrimary,
    marginBottom: 4,
  },
  emptySubtext: {
    ...Typography.caption,
    textAlign: 'center',
  },
});
