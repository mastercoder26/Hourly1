// My Shifts - upcoming and past shifts for student
import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { Card } from '../../components/ui/Card';
import { PillBadge } from '../../components/ui/PillBadge';
import { PillButton } from '../../components/ui/PillButton';
import { trpc } from '../../lib/trpc';
import { ApiOpportunityLike, toMobileOpportunity } from '../../lib/opportunity-adapter';
import { enterRise } from '../../lib/motion';
import { isDemoMode, isLiveMode } from '../../lib/dataMode';
import { useDemoStore } from '../../lib/demo/demoStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tabBarScrollContentPadding, tabScreenContentTopPadding } from '../../constants/tabBar';

export default function MyShiftsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const demo = isDemoMode();
  const demoApplications = useDemoStore(s => s.applications);
  const demoOpportunities = useDemoStore(s => s.opportunities);

  const applicationsQuery = trpc.application.listMine.useQuery(undefined, { enabled: isLiveMode() });
  const opportunitiesQuery = trpc.opportunity.list.useQuery({}, { enabled: isLiveMode() });

  const isLoadingRemote =
    isLiveMode() && (applicationsQuery.isLoading || opportunitiesQuery.isLoading);

  const applications = demo ? demoApplications : (applicationsQuery.data ?? []);

  const opportunitiesById = useMemo(() => {
    if (demo) {
      return new Map(demoOpportunities.map(item => [item.id, item] as const));
    }
    const entries = (opportunitiesQuery.data ?? []).map(item => {
      const mapped = toMobileOpportunity(item as ApiOpportunityLike);
      return [mapped.id, mapped] as const;
    });
    return new Map(entries);
  }, [demo, demoOpportunities, opportunitiesQuery.data]);

  const upcomingApps = applications.filter(a => a.status === 'APPROVED');
  const pendingApps = applications.filter(a => a.status === 'PENDING');
  const activeOpportunity = upcomingApps[0] ? opportunitiesById.get(upcomingApps[0].opportunityId) : null;

  if (isLoadingRemote) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.teal} />
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
      <Animated.View entering={enterRise(60)}>
        <Text style={styles.title}>My shifts</Text>
      </Animated.View>

      {activeOpportunity && (
        <Animated.View entering={enterRise(120)}>
          <Card style={styles.activeCard}>
            <View style={styles.activeHeader}>
              <View style={styles.liveDot} />
              <Text style={styles.activeLabel}>Active shift</Text>
            </View>
            <Text style={styles.activeTitle}>{activeOpportunity.title}</Text>
            <Text style={styles.activeOrg}>{activeOpportunity.orgName}</Text>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>Ready</Text>
              <Text style={styles.timerSub}>to check in</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '20%' }]} />
            </View>
            <PillButton
              variant="primary"
              accent="teal"
              fullWidth
              size="medium"
              onPress={() => router.push('/shift/active')}
            >
              View shift
            </PillButton>
          </Card>
        </Animated.View>
      )}

      <Animated.View entering={enterRise(180)}>
        <Text style={styles.sectionTitle}>Upcoming</Text>
      </Animated.View>
      {upcomingApps.length === 0 && (
        <Animated.View entering={enterRise(220)}>
          <Card style={styles.shiftCard}>
            <Text style={styles.emptyStateText}>No approved shifts yet.</Text>
          </Card>
        </Animated.View>
      )}
      {upcomingApps.map((app, index) => {
        const opp = opportunitiesById.get(app.opportunityId);
        if (!opp) return null;
        return (
          <Animated.View key={app.id} entering={enterRise(220 + index * 40)}>
            <Pressable
              onPress={() => router.push('/shift/checkin')}
              style={({ pressed }) => [pressed && styles.shiftPressed]}
            >
              <Card style={styles.shiftCard}>
                <View style={styles.shiftHeader}>
                  <View style={styles.shiftOrgLogo}>
                    <Text style={styles.shiftOrgEmoji}>{opp.orgLogo}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.shiftTitle}>{opp.title}</Text>
                    <Text style={styles.shiftOrg}>{opp.orgName}</Text>
                  </View>
                  <PillBadge label="Approved" color={Colors.success} />
                </View>
                <View style={styles.shiftDetails}>
                  <Text style={styles.shiftDetail}>
                    📅{' '}
                    {new Date(opp.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                  <Text style={styles.shiftDetail}>
                    🕐 {opp.startTime} – {opp.endTime}
                  </Text>
                  <Text style={styles.shiftDetail}>📍 {opp.distance?.toFixed(1)} mi</Text>
                </View>
              </Card>
            </Pressable>
          </Animated.View>
        );
      })}

      {pendingApps.length > 0 && (
        <>
          <Animated.View entering={enterRise(280)}>
            <Text style={styles.sectionTitle}>Pending</Text>
          </Animated.View>
          {pendingApps.map((app, index) => {
            const opp = opportunitiesById.get(app.opportunityId);
            if (!opp) return null;
            return (
              <Animated.View key={app.id} entering={enterRise(320 + index * 40)}>
                <Card style={styles.shiftCard}>
                  <View style={styles.shiftHeader}>
                    <View style={styles.shiftOrgLogo}>
                      <Text style={styles.shiftOrgEmoji}>{opp.orgLogo}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.shiftTitle}>{opp.title}</Text>
                      <Text style={styles.shiftOrg}>{opp.orgName}</Text>
                    </View>
                    <PillBadge label="Pending" color={Colors.warning} />
                  </View>
                  {demo ? (
                    <PillButton
                      variant="default"
                      size="small"
                      fullWidth
                      onPress={() => router.push(`/messages/${app.id}` as never)}
                      style={{ marginTop: 12 }}
                    >
                      Message organizer
                    </PillButton>
                  ) : null}
                </Card>
              </Animated.View>
            );
          })}
        </>
      )}
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
    paddingHorizontal: Spacing.screenHorizontal,
  },
  title: {
    ...Typography.title,
    color: Colors.dark.textPrimary,
    marginBottom: Spacing.xxl,
  },
  activeCard: {
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.teal + '40',
  },
  activeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  activeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    marginBottom: 4,
  },
  activeOrg: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 16,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 10,
  },
  timerText: {
    fontSize: 32,
    fontWeight: '400',
    color: Colors.dark.textPrimary,
    letterSpacing: -0.5,
  },
  timerSub: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.dark.element,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.teal,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  shiftCard: {
    marginBottom: 14,
    padding: 20,
  },
  shiftPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  shiftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shiftOrgLogo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.dark.element,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shiftOrgEmoji: {
    fontSize: 18,
  },
  shiftTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
  },
  shiftOrg: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  shiftDetails: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.element,
  },
  shiftDetail: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
});
