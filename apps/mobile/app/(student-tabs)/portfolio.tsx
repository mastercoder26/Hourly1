// Portfolio - hours tracker with animated counter, badge grid, past shifts
import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator, Share, Platform } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors, CardStyle, Shadows } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Card } from '../../components/ui/Card';
import { PillBadge } from '../../components/ui/PillBadge';
import { StatusPill } from '../../components/ui/StatusPill';
import { PillButton } from '../../components/ui/PillButton';
import { HoursChart } from '../../components/HoursChart';
import { BadgeGrid } from '../../components/BadgeGrid';
import { trpc } from '../../lib/trpc';
import { useShouldUseDemoData, useShouldUseLiveApi } from '../../lib/dataSource';
import { useDemoStore } from '../../lib/demo/demoStore';
import { Badge } from '../../types';
import type { AttendanceRecord } from '../../types';
import { enterRise, enterFade, stagger, MOTION } from '../../lib/motion';
import { Feather } from '@expo/vector-icons';
import { exportVolunteerCertificate } from '../../lib/certificateExport';
import { getDemoPortfolioShareUrl, getPortfolioShareUrlForSlug } from '../../lib/publicUrls';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tabBarScrollContentPadding, tabScreenContentTopPadding } from '../../constants/tabBar';

// Animated number component
function AnimatedCounter({ 
  value, 
  delay = 0,
  duration = 1200,
}: { 
  value: number; 
  delay?: number;
  duration?: number;
}) {
  const animatedValue = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    animatedValue.value = withDelay(
      delay,
      withTiming(value, { 
        duration,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [value, delay, duration, animatedValue]);

  // Update display value on each frame
  useEffect(() => {
    const interval = setInterval(() => {
      const currentValue = Math.round(animatedValue.value);
      setDisplayValue(currentValue);
    }, 16);
    return () => clearInterval(interval);
  }, [animatedValue]);

  return (
    <Text style={styles.hoursValue}>{displayValue}</Text>
  );
}

export default function PortfolioScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const demo = useShouldUseDemoData();
  const live = useShouldUseLiveApi();
  const demoAttendance = useDemoStore(s => s.attendance);
  const demoBadges = useDemoStore(s => s.badges);
  const demoOpportunities = useDemoStore(s => s.opportunities);
  const demoStudentProfile = useDemoStore(s => s.studentProfile);

  const attendanceQuery = trpc.user.getAttendance.useQuery(undefined, { enabled: live });
  const badgesQuery = trpc.user.getBadges.useQuery(undefined, { enabled: live });
  const statsQuery = trpc.user.getPortfolioStats.useQuery(undefined, { enabled: live });
  const meQuery = trpc.user.me.useQuery(undefined, { enabled: live });

  const isLoadingRemote =
    live &&
    (attendanceQuery.isLoading || badgesQuery.isLoading || statsQuery.isLoading);

  const attendance: AttendanceRecord[] = demo
    ? demoAttendance
    : ((attendanceQuery.data ?? []) as AttendanceRecord[]);
  const badges: Badge[] = demo ? demoBadges : ((badgesQuery.data ?? []) as Badge[]);

  const totalVerified = useMemo(() => {
    if (demo) {
      return demoAttendance
        .filter(a => a.verificationStatus === 'VERIFIED')
        .reduce((sum, a) => sum + a.hoursLogged, 0);
    }
    return statsQuery.data?.totalVerifiedHours ?? 0;
  }, [demo, demoAttendance, statsQuery.data]);

  const uniqueShifts = useMemo(() => {
    if (demo) {
      return new Set(demoAttendance.map(a => a.opportunityId)).size;
    }
    return statsQuery.data?.totalShifts ?? 0;
  }, [demo, demoAttendance, statsQuery.data]);

  const handleSharePortfolio = async () => {
    const slug = statsQuery.data?.publicSlug;
    const url = demo || !slug ? getDemoPortfolioShareUrl() : getPortfolioShareUrlForSlug(slug);
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        Alert.alert('Link copied', 'Your portfolio link was copied to the clipboard.');
        return;
      }

      await Share.share(
        Platform.select({
          ios: { url },
          default: { message: url },
        }) ?? { message: url },
      );
    } catch {
      Alert.alert('Share portfolio', url);
    }
  };

  const handleDownloadCertificate = async () => {
    const realName = [meQuery.data?.firstName, meQuery.data?.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();
    const name = demo
      ? `${demoStudentProfile.firstName} ${demoStudentProfile.lastName}`
      : realName || 'Volunteer';

    await exportVolunteerCertificate({
      name,
      hours: totalVerified,
      shifts: uniqueShifts,
      issuedDate: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    });
  };

  if (isLoadingRemote) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: tabScreenContentTopPadding(insets),
          paddingBottom: tabBarScrollContentPadding(insets),
        },
      ]}
    >
      {/* Header */}
      <Animated.View entering={enterFade(40)} style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>YOUR IMPACT</Text>
          <Text style={styles.title}>Portfolio</Text>
        </View>
      </Animated.View>

      {/* Hero hours card */}
      <Animated.View entering={enterRise(100)}>
        <View style={styles.hoursCard}>
          <View style={styles.hoursCardContent}>
            <Text style={styles.hoursLabel}>VERIFIED HOURS</Text>
            <AnimatedCounter value={totalVerified} delay={200} />
            <Text style={styles.hoursSubtext}>across {uniqueShifts} volunteer shifts</Text>
          </View>
          
          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{badges.filter(b => b.earnedAt).length}</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{uniqueShifts}</Text>
              <Text style={styles.statLabel}>Shifts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.round(totalVerified / Math.max(uniqueShifts, 1))}</Text>
              <Text style={styles.statLabel}>Avg/shift</Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.hoursActions}>
            <PillButton
              variant="primary"
              size="medium"
              style={styles.actionButton}
              onPress={handleSharePortfolio}
            >
              <View style={styles.buttonContent}>
                <Feather name="share-2" size={16} color={Colors.dark.base} />
                <Text style={styles.primaryButtonText}>Share</Text>
              </View>
            </PillButton>
            <PillButton
              variant="secondary"
              size="medium"
              style={styles.actionButton}
              onPress={handleDownloadCertificate}
            >
              <View style={styles.buttonContent}>
                <Feather name="download" size={16} color={Colors.dark.textPrimary} />
                <Text style={styles.secondaryButtonText}>Certificate</Text>
              </View>
            </PillButton>
          </View>
        </View>
      </Animated.View>

      {/* Hours by cause */}
      <Animated.View entering={enterRise(200)}>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>HOURS BY CAUSE</Text>
          <HoursChart attendance={attendance} opportunities={demoOpportunities} />
        </Card>
      </Animated.View>

      {/* Badges/Milestones */}
      <Animated.View entering={enterRise(280)}>
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>MILESTONES</Text>
            <Text style={styles.sectionCount}>{badges.filter(b => b.earnedAt).length}/{badges.length}</Text>
          </View>
          <BadgeGrid badges={badges} />
        </Card>
      </Animated.View>

      {/* Past shifts */}
      <Animated.View entering={enterRise(360)}>
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>RECENT SHIFTS</Text>
            <Text style={styles.sectionCount}>{attendance.length} total</Text>
          </View>
          {attendance.slice(0, 5).map((record, index) => {
            const opp = demo
              ? demoOpportunities.find(o => o.id === record.opportunityId)
              : null;
            const title = (record as { opportunityTitle?: string }).opportunityTitle ?? opp?.title ?? 'Shift';
            const orgLogo = (record as { orgLogo?: string }).orgLogo ?? '📋';
            const isVerified = record.verificationStatus === 'VERIFIED';
            
            return (
              <Animated.View 
                key={record.id} 
                style={[styles.shiftRow, index === 0 && styles.shiftRowFirst]}
                entering={enterFade(stagger(index, 400, 50))}
              >
                <View style={styles.shiftInfo}>
                  <View style={styles.shiftLogo}>
                    <Text style={styles.shiftEmoji}>{orgLogo}</Text>
                  </View>
                  <View style={styles.shiftDetails}>
                    <Text style={styles.shiftTitle} numberOfLines={1}>{title}</Text>
                    <Text style={styles.shiftDate}>
                      {new Date(record.checkinTime).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                </View>
                <View style={styles.shiftRight}>
                  <View style={styles.shiftHoursContainer}>
                    <Text style={styles.shiftHours}>{record.hoursLogged}</Text>
                    <Text style={styles.shiftHoursUnit}>hrs</Text>
                  </View>
                  <StatusPill 
                    status={isVerified ? 'verified' : 'pending'}
                    size="small"
                  />
                </View>
              </Animated.View>
            );
          })}
          {attendance.length > 5 && (
            <PillButton
              variant="ghost"
              style={styles.viewAllButton}
              onPress={() => router.push('/(student-tabs)/my-shifts')}
            >
              View all shifts →
            </PillButton>
          )}
        </Card>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.dark.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLabel: {
    ...Typography.header,
    marginBottom: 4,
  },
  title: {
    ...Typography.title,
    color: Colors.dark.textPrimary,
  },
  hoursCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: CardStyle.borderRadius,
    padding: 32,
    marginBottom: 20,
    ...Shadows.card,
  },
  hoursCardContent: {
    alignItems: 'center',
    marginBottom: 28,
  },
  hoursLabel: {
    ...Typography.header,
    marginBottom: 12,
  },
  hoursValue: {
    fontSize: 80,
    fontWeight: '300',
    color: Colors.dark.textPrimary,
    letterSpacing: -3,
    lineHeight: 88,
  },
  hoursSubtext: {
    ...Typography.bodySmall,
    color: Colors.dark.textSecondary,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.divider,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.dark.divider,
  },
  statValue: {
    ...Typography.valueMedium,
    color: Colors.dark.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    ...Typography.caption,
  },
  hoursActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.dark.base,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.dark.textPrimary,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    ...Typography.header,
  },
  sectionCount: {
    ...Typography.caption,
  },
  shiftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.divider,
  },
  shiftRowFirst: {
    borderTopWidth: 0,
    paddingTop: 0,
  },
  shiftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  shiftLogo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.dark.element,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shiftEmoji: {
    fontSize: 20,
  },
  shiftDetails: {
    flex: 1,
  },
  shiftTitle: {
    ...Typography.label,
    color: Colors.dark.textPrimary,
    marginBottom: 2,
  },
  shiftDate: {
    ...Typography.caption,
  },
  shiftRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  shiftHoursContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  shiftHours: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.accent,
  },
  shiftHoursUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.accent,
    marginLeft: 2,
    opacity: 0.7,
  },
  viewAllButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
});
