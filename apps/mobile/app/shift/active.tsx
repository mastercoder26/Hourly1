// Active Shift — timer and progress during shift
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text } from '@/components/Themed';;
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { PillButton } from '../../components/ui/PillButton';
import { mockOpportunities } from '../../mocks/opportunities';

export default function ActiveShiftScreen() {
  const router = useRouter();
  const opp = mockOpportunities[0]; // Mock
  const [elapsed, setElapsed] = useState(4980); // Mock: 1h 23m in seconds
  const totalDuration = opp.durationHours * 3600;
  const progress = useSharedValue(elapsed / totalDuration);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        progress.value = withTiming(next / totalDuration, { duration: 900 });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${Math.min(progress.value * 100, 100)}%`,
  }));

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCheckOut = () => {
    Alert.alert(
      'Check out early?',
      'Your hours will be logged up to this point.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Check out', style: 'destructive', onPress: () => router.replace('/(student-tabs)/portfolio') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>Shift in progress</Text>
      </View>

      {/* Shift info */}
      <Card style={styles.shiftCard}>
        <View style={styles.orgRow}>
          <View style={styles.orgLogo}>
            <Text style={styles.orgEmoji}>{opp.orgLogo}</Text>
          </View>
          <View>
            <Text style={styles.shiftTitle}>{opp.title}</Text>
            <Text style={styles.shiftOrg}>{opp.orgName}</Text>
          </View>
        </View>
      </Card>

      {/* Timer */}
      <View style={styles.timerSection}>
        <Text style={styles.timerLabel}>Elapsed</Text>
        <Text style={styles.timer}>{formatTime(elapsed)}</Text>
        <Text style={styles.timerTotal}>of {opp.durationHours}h 00m total</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>Check in</Text>
          <Text style={styles.progressLabel}>{opp.endTime}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <PillButton variant="default" fullWidth size="large" onPress={handleCheckOut}>
          Check out early
        </PillButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 32,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.success,
  },
  liveText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  shiftCard: {
    marginBottom: 48,
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  orgLogo: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.dark.element,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgEmoji: {
    fontSize: 24,
  },
  shiftTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
  },
  shiftOrg: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  timerLabel: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  timer: {
    fontSize: 56,
    fontWeight: '300',
    color: Colors.dark.textPrimary,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  timerTotal: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginTop: 8,
  },
  progressContainer: {
    marginBottom: 48,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.element,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: Colors.teal,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.dark.textTertiary,
  },
  actions: {
    gap: 14,
  },
});
