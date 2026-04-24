// Applicants tab - overview of all applicants across org events
import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Themed';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { PillBadge } from '../../components/ui/PillBadge';
import { trpc } from '../../lib/trpc';
import { demoApplicants } from '@hourly/shared';
import { isDemoMode, isLiveMode } from '../../lib/dataMode';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tabBarScrollContentPadding, tabScreenContentTopPadding } from '../../constants/tabBar';

export default function ApplicantsTab() {
  const insets = useSafeAreaInsets();
  const applicantsQuery = trpc.org.listAllApplicants.useQuery(undefined, { enabled: isLiveMode() });

  const allApplicants = useMemo(
    () => (isDemoMode() ? demoApplicants : (applicantsQuery.data ?? [])),
    [applicantsQuery.data],
  );

  const pending = allApplicants.filter(a => a.status === 'PENDING');
  const approved = allApplicants.filter(a => a.status === 'APPROVED');

  if (isLiveMode() && applicantsQuery.isLoading) {
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
      <Text style={styles.title}>People</Text>

      <Text style={styles.section}>Pending review ({pending.length})</Text>
      {pending.map(a => (
        <Card key={a.id} style={styles.personCard}>
          <View style={styles.personRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {a.firstName[0]}
                {a.lastName[0]}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.personName}>
                {a.firstName} {a.lastName}
              </Text>
              <Text style={styles.personSub}>
                Grade {a.grade} • {a.totalHours}h total
              </Text>
            </View>
            <PillBadge label="Pending" color={Colors.warning} />
          </View>
        </Card>
      ))}

      <Text style={styles.section}>Approved ({approved.length})</Text>
      {approved.map(a => (
        <Card key={a.id} style={styles.personCard}>
          <View style={styles.personRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {a.firstName[0]}
                {a.lastName[0]}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.personName}>
                {a.firstName} {a.lastName}
              </Text>
              <Text style={styles.personSub}>
                Grade {a.grade} • {a.totalHours}h total • ★ {a.rating}
              </Text>
            </View>
            <PillBadge label="Approved" color={Colors.success} />
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.base },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.dark.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingHorizontal: 20, gap: 12 },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  section: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  personCard: { padding: 16, borderRadius: 20 },
  personRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '600', color: Colors.purple },
  personName: { fontSize: 15, fontWeight: '500', color: Colors.dark.textPrimary },
  personSub: { fontSize: 12, color: Colors.dark.textSecondary, marginTop: 2 },
});
