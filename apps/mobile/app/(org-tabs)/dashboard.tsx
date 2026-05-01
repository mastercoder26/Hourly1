// Org Dashboard - main organizer home screen with refined stats grid
import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import { Colors, CardStyle, Shadows } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { StatusPill } from '../../components/ui/StatusPill';
import { PillButton } from '../../components/ui/PillButton';
import { PillBadge } from '../../components/ui/PillBadge';
import { trpc } from '../../lib/trpc';
import { ApiOpportunityLike, toMobileOpportunity } from '../../lib/opportunity-adapter';
import { demoOrgStats } from '@hourly/shared';
import { enterRise, enterRiseSnappy, enterFade, stagger } from '../../lib/motion';
import { Feather } from '@expo/vector-icons';
import { isDemoMode, isLiveMode } from '../../lib/dataMode';
import { useDemoStore } from '../../lib/demo/demoStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tabBarScrollContentPadding, tabScreenContentTopPadding } from '../../constants/tabBar';

export default function OrgDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const demoOpportunities = useDemoStore(s => s.opportunities);
  const demoAttendance = useDemoStore(s => s.attendance);

  const statsQuery = trpc.org.getStats.useQuery(undefined, { enabled: isLiveMode() });
  const opportunitiesQuery = trpc.org.listOpportunities.useQuery(undefined, { enabled: isLiveMode() });
  const pendingLiveQuery = trpc.org.listPendingAttendance.useQuery(undefined, { enabled: isLiveMode() });

  const isLoadingRemote =
    isLiveMode() && (statsQuery.isLoading || opportunitiesQuery.isLoading || pendingLiveQuery.isLoading);

  const stats = isDemoMode() ? demoOrgStats : (statsQuery.data ?? demoOrgStats);
  const orgOpps = useMemo(() => {
    if (isDemoMode()) {
      return demoOpportunities.filter(o => o.orgId === 'org-001');
    }
    return (opportunitiesQuery.data ?? []).map(item =>
      toMobileOpportunity(item as ApiOpportunityLike),
    );
  }, [demoOpportunities, opportunitiesQuery.data]);

  const pendingHoursVerification = useMemo(() => {
    if (isLiveMode()) {
      return pendingLiveQuery.data?.length ?? 0;
    }
    const orgOppIds = new Set(orgOpps.map(o => o.id));
    return demoAttendance.filter(
      a => orgOppIds.has(a.opportunityId) && a.verificationStatus === 'PENDING',
    ).length;
  }, [demoAttendance, isLiveMode, orgOpps, pendingLiveQuery.data?.length]);

  if (isLoadingRemote) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
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
      <Animated.View style={styles.header} entering={enterFade(40)}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>GREEN EARTH FOUNDATION</Text>
          <Text style={styles.title}>Dashboard</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🌿</Text>
        </View>
      </Animated.View>

      {/* Stats grid */}
      <Animated.View style={styles.statsGrid} entering={enterRise(100)}>
        <StatCard
          label="Volunteers"
          value={stats.volunteersThisMonth}
          subValue="this month"
          delay={100}
          style={styles.statCard}
        />
        <StatCard
          label="Total Hours"
          value={stats.totalHours.toLocaleString()}
          subValue="all time"
          delay={150}
          style={styles.statCard}
        />
        <StatCard
          label="Retention"
          value={`${Math.round(stats.retentionRate * 100)}%`}
          trend={stats.retentionRate > 0.7 ? 'up' : 'down'}
          delay={200}
          style={styles.statCard}
        />
        <StatCard
          label="Rating"
          value={`★ ${stats.avgRating}`}
          subValue="avg score"
          delay={250}
          style={styles.statCard}
        />
      </Animated.View>

      {(isDemoMode() || isLiveMode()) && (
        <Animated.View entering={enterRiseSnappy(240)}>
          <Pressable
            style={styles.verifyHoursCard}
            onPress={() => router.push('/org/verify-hours')}
          >
            <View style={styles.verifyHoursIconWrap}>
              <Feather name="check-square" size={22} color={Colors.accent} />
            </View>
            <View style={styles.verifyHoursText}>
              <Text style={styles.verifyHoursTitle}>Pending hours verification</Text>
              <Text style={styles.verifyHoursSub}>
                {pendingHoursVerification === 0
                  ? 'All shifts reviewed. Open to see history and tips.'
                  : `${pendingHoursVerification} shift${pendingHoursVerification === 1 ? '' : 's'} waiting for sign-off`}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={Colors.dark.textTertiary} />
          </Pressable>
        </Animated.View>
      )}

      {/* Post a role CTA */}
      <Animated.View entering={enterRiseSnappy(280)}>
        <Pressable
          style={styles.ctaCard}
          onPress={() => router.push('/org/create-role')}
        >
          <View style={styles.ctaContent}>
            <View style={styles.ctaIcon}>
              <Feather name="plus" size={24} color={Colors.dark.base} />
            </View>
            <View style={styles.ctaText}>
              <Text style={styles.ctaTitle}>Post a new role</Text>
              <Text style={styles.ctaSubtitle}>Create a volunteer opportunity</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={Colors.dark.base} />
        </Pressable>
      </Animated.View>

      {/* Active listings */}
      <Animated.View entering={enterRise(340)}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ACTIVE LISTINGS</Text>
          <Text style={styles.sectionCount}>{orgOpps.length} total</Text>
        </View>

        {orgOpps.map((opp, index) => {
          const spotsLeft = opp.totalSpots - opp.filledSpots;
          const fillPercentage = (opp.filledSpots / opp.totalSpots) * 100;
          const pendingApplicants = (opp as { pendingApplicants?: number }).pendingApplicants ?? 0;
          
          return (
            <Animated.View 
              key={opp.id}
              entering={enterFade(stagger(index, 380, 50))}
            >
              <Card
                style={styles.listingCard}
                onPress={() => router.push(`/org/applicants/${opp.id}`)}
              >
                <View style={styles.listingHeader}>
                  <Text style={styles.listingTitle} numberOfLines={1}>{opp.title}</Text>
                  <PillBadge
                    label={`${opp.filledSpots}/${opp.totalSpots}`}
                    color={spotsLeft <= 3 ? Colors.urgencyOrange : Colors.accent}
                    size="tiny"
                  />
                </View>
                
                <Text style={styles.listingDate}>
                  {new Date(opp.date).toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric' 
                  })} • {opp.startTime} – {opp.endTime}
                </Text>
                
                <View style={styles.listingProgress}>
                  <View style={[styles.listingBar, { width: `${fillPercentage}%` }]} />
                </View>
                
                <View style={styles.listingFooter}>
                  <View style={styles.applicantsInfo}>
                    <Feather name="users" size={14} color={Colors.accent} />
                    <Text style={styles.applicantsText}>
                      {pendingApplicants} pending applicant{pendingApplicants !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  {isLiveMode() ? (
                    <Pressable
                      onPress={() => {
                        router.push(`/org/scanner?opportunityId=${opp.id}` as never);
                      }}
                      style={styles.scanLink}
                    >
                      <Feather name="maximize" size={16} color={Colors.purple} />
                      <Text style={styles.scanLinkText}>Scan</Text>
                    </Pressable>
                  ) : null}
                  <Feather name="chevron-right" size={18} color={Colors.dark.textTertiary} />
                </View>
              </Card>
            </Animated.View>
          );
        })}
      </Animated.View>

      {/* Upcoming shifts */}
      <Animated.View entering={enterRise(480)}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>UPCOMING SHIFTS</Text>
          <Text style={styles.sectionCount}>Next 7 days</Text>
        </View>

        <Card style={styles.upcomingCard}>
          <View style={styles.upcomingRow}>
            <View style={styles.upcomingDate}>
              <Text style={styles.upcomingDay}>SAT</Text>
              <Text style={styles.upcomingDateNum}>5</Text>
            </View>
            <View style={styles.upcomingDetails}>
              <Text style={styles.upcomingTitle}>Park cleanup & tree planting</Text>
              <View style={styles.upcomingMeta}>
                <Feather name="users" size={12} color={Colors.dark.textSecondary} />
                <Text style={styles.upcomingMetaText}>14 volunteers confirmed</Text>
              </View>
            </View>
            <StatusPill status="completed" label="Ready" size="small" />
          </View>
          
          <View style={styles.upcomingDivider} />
          
          <View style={styles.upcomingRow}>
            <View style={styles.upcomingDate}>
              <Text style={styles.upcomingDay}>SAT</Text>
              <Text style={styles.upcomingDateNum}>19</Text>
            </View>
            <View style={styles.upcomingDetails}>
              <Text style={styles.upcomingTitle}>Community garden build</Text>
              <View style={styles.upcomingMeta}>
                <Feather name="users" size={12} color={Colors.dark.textSecondary} />
                <Text style={styles.upcomingMetaText}>24 volunteers confirmed</Text>
              </View>
            </View>
            <StatusPill status="pending" label="6 spots" size="small" />
          </View>
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
    gap: 16,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
  },
  content: {
    paddingHorizontal: 20,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: { 
    ...Typography.header,
    marginBottom: 4,
  },
  title: { 
    ...Typography.title,
    color: Colors.dark.textPrimary,
  },
  avatar: { 
    width: 52, 
    height: 52, 
    borderRadius: 26, 
    backgroundColor: Colors.accentSoft, 
    alignItems: 'center', 
    justifyContent: 'center',
    ...Shadows.button,
  },
  avatarText: { 
    fontSize: 24,
  },
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: { 
    width: '48%',
  },
  verifyHoursCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.dark.card,
    borderRadius: CardStyle.borderRadius,
    borderWidth: 1,
    borderColor: Colors.accent + '55',
    padding: 18,
    marginBottom: 16,
    ...Shadows.card,
  },
  verifyHoursIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyHoursText: {
    flex: 1,
    gap: 4,
  },
  verifyHoursTitle: {
    ...Typography.label,
    color: Colors.dark.textPrimary,
  },
  verifyHoursSub: {
    ...Typography.caption,
    color: Colors.dark.textSecondary,
  },
  ctaCard: {
    backgroundColor: Colors.dark.textPrimary,
    borderRadius: CardStyle.borderRadius,
    padding: 20,
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.card,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ctaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    gap: 2,
  },
  ctaTitle: {
    ...Typography.subtitle,
    color: Colors.dark.base,
  },
  ctaSubtitle: {
    ...Typography.caption,
    color: Colors.dark.textTertiary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { 
    ...Typography.header,
  },
  sectionCount: {
    ...Typography.caption,
  },
  listingCard: { 
    marginBottom: 12, 
    padding: CardStyle.paddingSmall,
  },
  listingHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 8,
  },
  listingTitle: { 
    ...Typography.label,
    color: Colors.dark.textPrimary, 
    flex: 1, 
    marginRight: 12,
  },
  listingDate: { 
    ...Typography.caption,
    marginBottom: 12,
  },
  listingProgress: { 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: Colors.dark.element, 
    overflow: 'hidden',
    marginBottom: 14,
  },
  listingBar: { 
    height: '100%', 
    borderRadius: 3, 
    backgroundColor: Colors.accent,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applicantsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  applicantsText: { 
    fontSize: 13, 
    color: Colors.accent, 
    fontWeight: '500',
  },
  scanLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.purpleSoft,
  },
  scanLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.purple,
  },
  upcomingCard: { 
    padding: 0,
    marginBottom: 20,
  },
  upcomingRow: { 
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  upcomingDate: {
    width: 48,
    height: 56,
    backgroundColor: Colors.dark.element,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingDay: { 
    ...Typography.tiny,
    color: Colors.dark.textSecondary,
    marginBottom: 2,
  },
  upcomingDateNum: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.dark.textPrimary,
  },
  upcomingDetails: {
    flex: 1,
  },
  upcomingTitle: { 
    ...Typography.label,
    color: Colors.dark.textPrimary,
    marginBottom: 4,
  },
  upcomingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  upcomingMetaText: { 
    ...Typography.caption,
  },
  upcomingDivider: { 
    height: 1, 
    backgroundColor: Colors.dark.divider,
    marginHorizontal: 20,
  },
});
