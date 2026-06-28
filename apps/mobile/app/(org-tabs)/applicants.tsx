// Applicants tab - overview of all applicants across org events
import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { Card } from '../../components/ui/Card';
import { PillBadge } from '../../components/ui/PillBadge';
import { trpc } from '../../lib/trpc';
import { DEMO_ORG_PRIMARY_ID } from '@hourly/shared';
import { shouldUseDemoData, shouldUseLiveApi } from '../../lib/dataSource';
import { useDemoStore } from '../../lib/demo/demoStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tabBarScrollContentPadding, tabScreenContentTopPadding } from '../../constants/tabBar';

export default function ApplicantsTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const applicantsQuery = trpc.org.listAllApplicants.useQuery(undefined, { enabled: shouldUseLiveApi() });
  const demoApplicants = useDemoStore(s => s.getAllApplicantsForOrg(DEMO_ORG_PRIMARY_ID));
  const applications = useDemoStore(s => s.applications);

  const allApplicants = useMemo(
    () => (shouldUseDemoData() ? demoApplicants : (applicantsQuery.data ?? [])),
    [applications, applicantsQuery.data, demoApplicants],
  );

  const pending = allApplicants.filter(a => a.status === 'PENDING');
  const approved = allApplicants.filter(a => a.status === 'APPROVED');

  if (shouldUseLiveApi() && applicantsQuery.isLoading) {
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
        <Pressable key={a.id} onPress={() => router.push(`/messages/${a.id}` as never)}>
          <Card style={styles.personCard}>
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
        </Pressable>
      ))}

      <Text style={styles.section}>Approved ({approved.length})</Text>
      {approved.map(a => (
        <Pressable key={a.id} onPress={() => router.push(`/messages/${a.id}` as never)}>
          <Card style={styles.personCard}>
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
        </Pressable>
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
  content: { paddingHorizontal: Spacing.screenHorizontal, gap: Spacing.md },
  title: {
    ...Typography.title,
    color: Colors.dark.textPrimary,
    marginBottom: Spacing.sm,
  },
  section: {
    ...Typography.header,
    marginTop: Spacing.sm,
  },
  personCard: { padding: Spacing.lg, borderRadius: 20 },
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
