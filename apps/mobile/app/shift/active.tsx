// Active Shift - timer and progress during shift
import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { PillButton } from '../../components/ui/PillButton';
import { useDemoStore } from '../../lib/demo/demoStore';
import { DEMO_STUDENT_ID } from '@hourly/shared';
import { enterFade, enterRise, MOTION } from '../../lib/motion';
import { shouldUseDemoData, shouldUseLiveApi } from '../../lib/dataSource';
import { trpc } from '../../lib/trpc';
import { ApiOpportunityLike, toMobileOpportunity } from '../../lib/opportunity-adapter';

export default function ActiveShiftScreen() {
  const router = useRouter();
  const { opportunityId: opportunityIdParam } = useLocalSearchParams<{ opportunityId?: string }>();
  const opportunityId = Array.isArray(opportunityIdParam) ? opportunityIdParam[0] : opportunityIdParam;
  const useDemo = shouldUseDemoData();

  const applications = useDemoStore(s => s.applications);
  const opportunities = useDemoStore(s => s.opportunities);
  const demoAttendance = useDemoStore(s => s.attendance);
  const activeAttendanceId = useDemoStore(s => s.activeAttendanceId);
  const completeStudentCheckOut = useDemoStore(s => s.completeStudentCheckOut);

  const attendanceQuery = trpc.user.getAttendance.useQuery(undefined, { enabled: shouldUseLiveApi() });
  const checkOutMutation = trpc.attendance.checkOut.useMutation();
  const utils = trpc.useUtils();

  const liveRecord = useMemo(() => {
    if (useDemo) {
      if (activeAttendanceId) {
        return demoAttendance.find(a => a.id === activeAttendanceId) ?? null;
      }
      return null;
    }
    const records = attendanceQuery.data ?? [];
    if (opportunityId) {
      return records.find(r => r.opportunityId === opportunityId && r.checkinTime && !r.checkoutTime) ?? null;
    }
    return records.find(r => r.checkinTime && !r.checkoutTime) ?? null;
  }, [useDemo, activeAttendanceId, demoAttendance, attendanceQuery.data, opportunityId]);

  const liveOppQuery = trpc.opportunity.getById.useQuery(
    { id: liveRecord?.opportunityId ?? opportunityId ?? '' },
    { enabled: shouldUseLiveApi() && Boolean(liveRecord?.opportunityId ?? opportunityId) },
  );

  const demoApp =
    applications.find(a => a.status === 'APPROVED' && a.studentId === DEMO_STUDENT_ID) ?? applications[0];
  const resolvedOppId = liveRecord?.opportunityId ?? opportunityId ?? demoApp?.opportunityId;

  const opp = useMemo(() => {
    if (useDemo) {
      return opportunities.find(o => o.id === resolvedOppId) ?? opportunities[0] ?? null;
    }
    if (liveOppQuery.data) {
      return toMobileOpportunity(liveOppQuery.data as ApiOpportunityLike);
    }
    return null;
  }, [useDemo, opportunities, resolvedOppId, liveOppQuery.data]);

  const checkinMs = liveRecord?.checkinTime ? new Date(liveRecord.checkinTime).getTime() : Date.now();
  const totalDuration = Math.max(opp?.durationHours ?? 1, 0.25) * 3600;
  const [elapsed, setElapsed] = useState(() =>
    Math.max(0, Math.floor((Date.now() - checkinMs) / 1000)),
  );
  const progress = useSharedValue(elapsed / totalDuration);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(() => {
        const next = Math.max(0, Math.floor((Date.now() - checkinMs) / 1000));
        progress.value = withTiming(next / totalDuration, {
          duration: 850,
          easing: MOTION.easeInOut,
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [progress, totalDuration, checkinMs]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${Math.min(progress.value * 100, 100)}%`,
  }));

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCheckOut = async () => {
    if (!opp) {
      return;
    }
    setCheckingOut(true);
    try {
      if (useDemo) {
        const hoursLogged = Math.max(0.5, Math.round((elapsed / 3600) * 10) / 10);
        if (activeAttendanceId) {
          completeStudentCheckOut(activeAttendanceId, hoursLogged);
        }
      } else if (liveRecord?.id) {
        await checkOutMutation.mutateAsync({ attendanceRecordId: liveRecord.id });
        await utils.user.getAttendance.invalidate();
        await utils.user.getPortfolioStats.invalidate();
      }
      router.replace('/(student-tabs)/portfolio');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as Error).message)
          : 'Check-out failed';
      Alert.alert('Check-out failed', message);
    } finally {
      setCheckingOut(false);
    }
  };

  if (shouldUseLiveApi() && (attendanceQuery.isLoading || liveOppQuery.isLoading)) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.teal} />
      </View>
    );
  }

  if (!opp) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.missing}>No active shift found.</Text>
        <PillButton variant="primary" accent="teal" onPress={() => router.back()}>
          Go back
        </PillButton>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={styles.header} entering={enterFade(40)}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>Shift in progress</Text>
      </Animated.View>

      <Animated.View entering={enterRise(100)}>
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
      </Animated.View>

      <Animated.View style={styles.timerSection} entering={enterRise(160)}>
        <Text style={styles.timerLabel}>Elapsed</Text>
        <Text style={styles.timer}>{formatTime(elapsed)}</Text>
        <Text style={styles.timerTotal}>of {opp.durationHours}h 00m total</Text>
      </Animated.View>

      <Animated.View style={styles.progressContainer} entering={enterRise(220)}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>Check in</Text>
          <Text style={styles.progressLabel}>{opp.endTime}</Text>
        </View>
      </Animated.View>

      <Animated.View style={styles.actions} entering={enterRise(280)}>
        <PillButton
          variant="default"
          fullWidth
          size="large"
          onPress={handleCheckOut}
          disabled={checkingOut || checkOutMutation.isPending}
        >
          {checkingOut || checkOutMutation.isPending ? 'Checking out…' : 'Check out early'}
        </PillButton>
      </Animated.View>
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
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  missing: {
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
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
