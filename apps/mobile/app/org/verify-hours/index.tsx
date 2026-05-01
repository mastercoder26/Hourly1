// Pending hour verifications — demo store or live `org.listPendingAttendance`.
import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import {
  demoApplicants,
  demoStudent,
  DEMO_ORG_PRIMARY_ID,
  DEMO_STUDENT_ID,
} from '@hourly/shared';
import { Colors, CardStyle, Shadows } from '../../../constants/colors';
import { Typography } from '../../../constants/typography';
import { Card } from '../../../components/ui/Card';
import { PillButton } from '../../../components/ui/PillButton';
import { useDemoStore } from '../../../lib/demo/demoStore';
import { isDemoMode, isLiveMode } from '../../../lib/dataMode';
import { trpc } from '../../../lib/trpc';

function volunteerName(studentId: string): string {
  if (studentId === DEMO_STUDENT_ID) {
    return `${demoStudent.firstName} ${demoStudent.lastName}`;
  }
  const row = demoApplicants.find(a => a.id === studentId);
  return row ? `${row.firstName} ${row.lastName}` : studentId;
}

function formatShort(iso: string | null | undefined) {
  if (!iso) return 'N/A';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function VerifyHoursListScreen() {
  const router = useRouter();
  const opportunities = useDemoStore(s => s.opportunities);
  const attendance = useDemoStore(s => s.attendance);

  const livePendingQuery = trpc.org.listPendingAttendance.useQuery(undefined, {
    enabled: isLiveMode(),
  });

  const orgOppIds = useMemo(() => {
    return new Set(
      opportunities.filter(o => o.orgId === DEMO_ORG_PRIMARY_ID).map(o => o.id),
    );
  }, [opportunities]);

  const demoPendingRows = useMemo(() => {
    return attendance
      .filter(a => orgOppIds.has(a.opportunityId) && a.verificationStatus === 'PENDING')
      .map(a => {
        const opp = opportunities.find(o => o.id === a.opportunityId);
        return {
          id: a.id,
          name: volunteerName(a.studentId),
          opportunityTitle: opp?.title ?? 'Event',
          hoursLogged: a.hoursLogged,
          checkinTime: a.checkinTime,
        };
      });
  }, [attendance, opportunities, orgOppIds]);

  const liveRows = useMemo(() => {
    if (!livePendingQuery.data) return [];
    return livePendingQuery.data.map(r => ({
      id: r.id,
      name: r.studentName,
      opportunityTitle: r.opportunityTitle,
      hoursLogged: r.hoursLogged,
      checkinTime: r.checkinTime,
    }));
  }, [livePendingQuery.data]);

  const rows = isLiveMode() ? liveRows : demoPendingRows;
  const loading = isLiveMode() && livePendingQuery.isLoading;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
        <Feather name="chevron-left" size={24} color={Colors.dark.textPrimary} />
        <Text style={styles.backText}>Dashboard</Text>
      </Pressable>

      <Text style={styles.kicker}>ORGANIZER</Text>
      <Text style={styles.title}>Pending hours</Text>
      <Text style={styles.subtitle}>
        Tap a volunteer to review check-in method, times, and approve or leave pending.
      </Text>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading pending verifications…</Text>
        </View>
      ) : null}

      {!loading && rows.length === 0 && (
        <Card style={styles.emptyCard}>
          <Feather name="check-circle" size={40} color={Colors.accent} />
          <Text style={styles.emptyTitle}>All caught up</Text>
          <Text style={styles.emptyBody}>
            There are no volunteer hours waiting for verification right now.
          </Text>
        </Card>
      )}

      {!loading &&
        rows.map(row => {
          const inTime = formatShort(row.checkinTime);
          return (
            <Pressable
              key={row.id}
              onPress={() => router.push(`/org/verify-hours/${row.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`Open details for ${row.name}, ${row.opportunityTitle}`}
            >
              <Card style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {row.name
                        .split(' ')
                        .map(p => p[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.reviewHeadlines}>
                    <Text style={styles.volunteerName}>{row.name}</Text>
                    <Text style={styles.eventTitle}>{row.opportunityTitle}</Text>
                    <Text style={styles.tapHint}>Tap for check-in details and approve</Text>
                  </View>
                  <Feather name="chevron-right" size={22} color={Colors.dark.textTertiary} />
                </View>
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Hours logged</Text>
                    <Text style={styles.metaValue}>{row.hoursLogged}h</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Check-in</Text>
                    <Text style={styles.metaValue}>{inTime}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Status</Text>
                    <Text style={[styles.metaValue, { color: Colors.warning }]}>Pending</Text>
                  </View>
                </View>
              </Card>
            </Pressable>
          );
        })}

      {isDemoMode() && (
        <Card style={styles.hintCard}>
          <Text style={styles.hintTitle}>Need to approve a new volunteer?</Text>
          <Text style={styles.hintBody}>
            Open a listing on the dashboard or go to the People tab to review applications and role fit.
          </Text>
          <PillButton variant="secondary" onPress={() => router.push('/(org-tabs)/applicants' as never)}>
            Go to People
          </PillButton>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingWrap: { paddingVertical: 24, alignItems: 'center', gap: 12 },
  loadingText: { ...Typography.caption, color: Colors.dark.textSecondary },
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
  },
  content: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 20,
  },
  backText: {
    ...Typography.body,
    color: Colors.dark.textPrimary,
  },
  kicker: {
    ...Typography.header,
    marginBottom: 6,
  },
  title: {
    ...Typography.title,
    color: Colors.dark.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 20,
  },
  emptyTitle: {
    ...Typography.subtitle,
    color: Colors.dark.textPrimary,
    marginTop: 12,
  },
  emptyBody: {
    ...Typography.caption,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  reviewCard: {
    marginBottom: 12,
    padding: CardStyle.paddingSmall,
    ...Shadows.card,
  },
  reviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.accent,
  },
  reviewHeadlines: {
    flex: 1,
  },
  volunteerName: {
    ...Typography.label,
    color: Colors.dark.textPrimary,
  },
  eventTitle: {
    ...Typography.caption,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  tapHint: {
    ...Typography.tiny,
    color: Colors.accent,
    marginTop: 6,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.divider,
    paddingTop: 12,
  },
  metaItem: {
    minWidth: '30%',
  },
  metaLabel: {
    ...Typography.tiny,
    color: Colors.dark.textTertiary,
    marginBottom: 4,
  },
  metaValue: {
    ...Typography.body,
    color: Colors.dark.textPrimary,
    fontWeight: '600',
  },
  hintCard: {
    marginTop: 8,
    gap: 10,
  },
  hintTitle: {
    ...Typography.subtitle,
    color: Colors.dark.textPrimary,
  },
  hintBody: {
    ...Typography.caption,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
  },
});
