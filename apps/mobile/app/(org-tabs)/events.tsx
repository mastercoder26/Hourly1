// Events tab - org's list of posted events
import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { Card } from '../../components/ui/Card';
import { PillBadge } from '../../components/ui/PillBadge';
import { PillButton } from '../../components/ui/PillButton';
import { trpc } from '../../lib/trpc';
import { ApiOpportunityLike, toMobileOpportunity } from '../../lib/opportunity-adapter';
import { shouldUseDemoData, shouldUseLiveApi } from '../../lib/dataSource';
import { useDemoStore } from '../../lib/demo/demoStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tabBarScrollContentPadding, tabScreenContentTopPadding } from '../../constants/tabBar';

export default function EventsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const demoOpportunities = useDemoStore(s => s.opportunities);

  const opportunitiesQuery = trpc.org.listOpportunities.useQuery(undefined, { enabled: shouldUseLiveApi() });

  const orgOpps = useMemo(() => {
    if (shouldUseDemoData()) {
      return demoOpportunities.filter(o => o.orgId === 'org-001');
    }
    return (opportunitiesQuery.data ?? []).map(item =>
      toMobileOpportunity(item as ApiOpportunityLike),
    );
  }, [demoOpportunities, opportunitiesQuery.data]);

  if (shouldUseLiveApi() && opportunitiesQuery.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.purple} />
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
      <Text style={styles.title}>Events</Text>
      <PillButton variant="primary" accent="purple" fullWidth size="large" onPress={() => router.push('/org/create-role')}>
        + Post a new event
      </PillButton>

      <Text style={styles.sectionTitle}>Active</Text>
      {orgOpps.map(opp => (
        <Card key={opp.id} style={styles.eventCard}>
          <Text style={styles.eventTitle}>{opp.title}</Text>
          <Text style={styles.eventDate}>
            {new Date(opp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {opp.startTime}–{opp.endTime}
          </Text>
          <View style={styles.eventFooter}>
            <PillBadge label={`${opp.filledSpots}/${opp.totalSpots} spots`} color={Colors.purple} />
            {opp.creditEligible && <PillBadge label="Credit" color={Colors.teal} />}
          </View>
        </Card>
      ))}

      <Text style={styles.sectionTitle}>Past events</Text>
      <Card style={styles.eventCard}>
        <Text style={styles.eventTitle}>Trail restoration weekend</Text>
        <Text style={styles.eventDate}>Feb 15 • 8:00–13:00 • Completed</Text>
        <View style={styles.eventFooter}>
          <PillBadge label="18 volunteers" color={Colors.dark.textSecondary} />
          <PillBadge label="90 hours" color={Colors.dark.textSecondary} />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.base },
  loadingContainer: { flex: 1, backgroundColor: Colors.dark.base, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: Spacing.screenHorizontal, gap: Spacing.lg },
  title: { ...Typography.title, color: Colors.dark.textPrimary },
  sectionTitle: { ...Typography.header, marginTop: Spacing.sm },
  eventCard: { padding: 20, borderRadius: 20, gap: 8 },
  eventTitle: { fontSize: 16, fontWeight: '500', color: Colors.dark.textPrimary },
  eventDate: { fontSize: 13, color: Colors.dark.textSecondary },
  eventFooter: { flexDirection: 'row', gap: 8, marginTop: 4 },
});
