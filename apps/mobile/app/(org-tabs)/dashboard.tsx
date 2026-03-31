// Org Dashboard — main organizer home screen
import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { PillButton } from '../../components/ui/PillButton';
import { PillBadge } from '../../components/ui/PillBadge';
import { trpc } from '../../lib/trpc';
import { mockOrgStats } from '../../mocks/data';
import { mockOpportunities } from '../../mocks/opportunities';
import { enterRise } from '../../lib/motion';

export default function OrgDashboard() {
  const router = useRouter();
  const [useFallback, setUseFallback] = useState(false);

  const statsQuery = trpc.org.getStats.useQuery();
  const opportunitiesQuery = trpc.org.listOpportunities.useQuery();

  const isLoadingRemote = statsQuery.isLoading || opportunitiesQuery.isLoading;
  const shouldUseFallback =
    useFallback ||
    Boolean(statsQuery.error) ||
    Boolean(opportunitiesQuery.error);

  useEffect(() => {
    if (!isLoadingRemote) {
      return;
    }

    const timer = setTimeout(() => {
      setUseFallback(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isLoadingRemote]);

  useEffect(() => {
    if (statsQuery.error || opportunitiesQuery.error) {
      setUseFallback(true);
    }
  }, [statsQuery.error, opportunitiesQuery.error]);

  useEffect(() => {
    if (statsQuery.isSuccess && opportunitiesQuery.isSuccess) {
      setUseFallback(false);
    }
  }, [statsQuery.isSuccess, opportunitiesQuery.isSuccess]);

  const stats = shouldUseFallback ? mockOrgStats : (statsQuery.data ?? mockOrgStats);
  const orgOpps = shouldUseFallback
    ? mockOpportunities.filter(o => o.orgId === 'org-001')
    : (opportunitiesQuery.data ?? []);

  if (isLoadingRemote && !shouldUseFallback) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.purple} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Green Earth Foundation</Text>
          <Text style={styles.title}>Dashboard</Text>
          {shouldUseFallback && (
            <Text style={styles.fallbackNote}>Demo mode: showing local data</Text>
          )}
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🌿</Text>
        </View>
      </View>

      {/* Quick stats */}
      <Animated.View entering={enterRise(80)} style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.volunteersThisMonth}</Text>
          <Text style={styles.statLabel}>Volunteers this month</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalHours.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total hours</Text>
        </Card>
      </Animated.View>

      <Animated.View entering={enterRise(140)} style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{Math.round(stats.retentionRate * 100)}%</Text>
          <Text style={styles.statLabel}>Retention rate</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>★ {stats.avgRating}</Text>
          <Text style={styles.statLabel}>Avg rating</Text>
        </Card>
      </Animated.View>

      {/* Post a role CTA */}
      <Animated.View entering={enterRise(200)}>
        <PillButton
          variant="primary"
          accent="purple"
          fullWidth
          size="large"
          onPress={() => router.push('/org/create-role')}
        >
          + Post a new role
        </PillButton>
      </Animated.View>

      {/* Active listings */}
      <Animated.View entering={enterRise(260)}>
        <Text style={styles.sectionTitle}>Active listings</Text>
        {orgOpps.map(opp => {
          const spotsLeft = opp.totalSpots - opp.filledSpots;
          return (
            <Pressable
              key={opp.id}
              onPress={() => router.push(`/org/applicants/${opp.id}`)}
              style={({ pressed }) => [pressed && styles.listingPressed]}
            >
              <Card style={styles.listingCard}>
                <View style={styles.listingHeader}>
                  <Text style={styles.listingTitle}>{opp.title}</Text>
                  <PillBadge
                    label={`${opp.filledSpots}/${opp.totalSpots}`}
                    color={spotsLeft <= 3 ? Colors.urgencyOrange : Colors.purple}
                  />
                </View>
                <Text style={styles.listingDate}>
                  {new Date(opp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {opp.startTime} – {opp.endTime}
                </Text>
                <View style={styles.listingProgress}>
                  <View style={[styles.listingBar, { width: `${(opp.filledSpots / opp.totalSpots) * 100}%` }]} />
                </View>
                <Text style={styles.listingApplicants}>
                  {(opp as { pendingApplicants?: number }).pendingApplicants ?? 0} pending applicants →
                </Text>
              </Card>
            </Pressable>
          );
        })}
      </Animated.View>

      {/* Upcoming shifts */}
      <Animated.View entering={enterRise(320)}>
        <Text style={styles.sectionTitle}>Upcoming shifts (next 7 days)</Text>
        <Card style={styles.upcomingCard}>
          <View style={styles.upcomingRow}>
            <Text style={styles.upcomingDate}>Sat, Apr 5</Text>
            <Text style={styles.upcomingTitle}>Park cleanup & tree planting</Text>
            <Text style={styles.upcomingVolunteers}>14 volunteers</Text>
          </View>
          <View style={styles.upcomingDivider} />
          <View style={styles.upcomingRow}>
            <Text style={styles.upcomingDate}>Sat, Apr 19</Text>
            <Text style={styles.upcomingTitle}>Community garden build</Text>
            <Text style={styles.upcomingVolunteers}>24 volunteers</Text>
          </View>
        </Card>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.base },
  loadingContainer: { flex: 1, backgroundColor: Colors.dark.base, alignItems: 'center', justifyContent: 'center' },
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40, gap: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 14, color: Colors.dark.textSecondary, marginBottom: 4 },
  title: { fontSize: 28, fontWeight: '500', color: Colors.dark.textPrimary, letterSpacing: -0.3 },
  fallbackNote: { fontSize: 12, color: Colors.purple, fontWeight: '600', marginTop: 4 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, alignItems: 'center', padding: 20, borderRadius: 20 },
  statValue: { fontSize: 28, fontWeight: '500', color: Colors.dark.textPrimary, marginBottom: 6 },
  statLabel: { fontSize: 11, color: Colors.dark.textSecondary, textTransform: 'uppercase', letterSpacing: 0.3, textAlign: 'center' },
  sectionTitle: { fontSize: 13, fontWeight: '500', color: Colors.dark.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8 },
  listingCard: { marginTop: 12, padding: 20, borderRadius: 20, gap: 10 },
  listingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listingTitle: { fontSize: 16, fontWeight: '500', color: Colors.dark.textPrimary, flex: 1, marginRight: 12 },
  listingDate: { fontSize: 13, color: Colors.dark.textSecondary },
  listingProgress: { height: 4, borderRadius: 2, backgroundColor: Colors.dark.element, overflow: 'hidden' },
  listingBar: { height: '100%', borderRadius: 2, backgroundColor: Colors.purple },
  listingApplicants: { fontSize: 13, color: Colors.purple, fontWeight: '500' },
  listingPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  upcomingCard: { marginTop: 12, padding: 0 },
  upcomingRow: { padding: 18, gap: 4 },
  upcomingDate: { fontSize: 12, color: Colors.dark.textSecondary, textTransform: 'uppercase', letterSpacing: 0.3 },
  upcomingTitle: { fontSize: 15, fontWeight: '500', color: Colors.dark.textPrimary },
  upcomingVolunteers: { fontSize: 13, color: Colors.purple },
  upcomingDivider: { height: 1, backgroundColor: Colors.dark.element },
});
