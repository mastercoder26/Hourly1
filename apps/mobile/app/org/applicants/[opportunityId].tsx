// Applicant Management — per-opportunity list (demo store or live `org.getApplicants` / `org.reviewApplication`).
import React, { useMemo, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/typography';
import { Spacing } from '../../../constants/spacing';
import { Card } from '../../../components/ui/Card';
import { PillBadge } from '../../../components/ui/PillBadge';
import { PillButton } from '../../../components/ui/PillButton';
import { ScreenHeader } from '../../../components/ui/ScreenHeader';
import { getOpportunityById } from '@hourly/shared';
import { useDemoStore } from '../../../lib/demo/demoStore';
import { shouldUseDemoData, shouldUseLiveApi } from '../../../lib/dataSource';
import { trpc } from '../../../lib/trpc';

type ApplicantRow = {
  id: string;
  firstName: string;
  lastName: string;
  grade: number;
  totalHours: number;
  rating: number;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'WAITLISTED';
};

export default function ApplicantManagement() {
  const { opportunityId } = useLocalSearchParams<{ opportunityId: string }>();
  const router = useRouter();
  const oppId = Array.isArray(opportunityId) ? opportunityId[0] : opportunityId;

  const opportunityFromStore = useDemoStore(s =>
    oppId ? s.opportunities.find(o => o.id === oppId) : undefined,
  );
  const opp = opportunityFromStore ?? (oppId ? getOpportunityById(oppId) : undefined);
  const applications = useDemoStore(s => s.applications);
  const getApplicantsForOpportunity = useDemoStore(s => s.getApplicantsForOpportunity);
  const setApplicationStatus = useDemoStore(s => s.setApplicationStatus);

  const liveApplicantsQuery = trpc.org.getApplicants.useQuery(
    { opportunityId: oppId ?? '' },
    { enabled: shouldUseLiveApi() && Boolean(oppId) },
  );

  const reviewMutation = trpc.org.reviewApplication.useMutation({
    onSuccess: async () => {
      await liveApplicantsQuery.refetch();
    },
  });

  const applicants: ApplicantRow[] = useMemo(() => {
    if (shouldUseLiveApi() && liveApplicantsQuery.data) {
      return liveApplicantsQuery.data.map(a => {
        const parts = a.studentName.split(' ');
        return {
          id: a.id,
          firstName: parts[0] ?? 'Volunteer',
          lastName: parts.slice(1).join(' ') ?? '',
          grade: a.studentGrade,
          totalHours: a.studentHours,
          rating: 0,
          status: a.status,
        };
      });
    }
    return oppId ? getApplicantsForOpportunity(oppId) : [];
  }, [applications, getApplicantsForOpportunity, liveApplicantsQuery.data, oppId]);

  const statusGroups = useMemo(
    () => ({
      PENDING: applicants.filter(a => a.status === 'PENDING'),
      APPROVED: applicants.filter(a => a.status === 'APPROVED'),
      WAITLISTED: applicants.filter(a => a.status === 'WAITLISTED'),
      DECLINED: applicants.filter(a => a.status === 'DECLINED'),
    }),
    [applicants],
  );

  const handleDecision = useCallback(
    (applicationId: string, decision: 'APPROVED' | 'DECLINED' | 'WAITLISTED') => {
      if (!oppId) return;

      if (shouldUseDemoData()) {
        setApplicationStatus(applicationId, decision === 'DECLINED' ? 'DECLINED' : decision);
        return;
      }

      if (shouldUseLiveApi()) {
        reviewMutation.mutate({ applicationId, decision: decision === 'DECLINED' ? 'DECLINED' : decision });
      }
    },
    [oppId, reviewMutation, setApplicationStatus],
  );

  const statusColors = {
    PENDING: Colors.warning,
    APPROVED: Colors.success,
    WAITLISTED: Colors.purple,
    DECLINED: Colors.error,
  };

  if (shouldUseLiveApi() && liveApplicantsQuery.isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.purple} />
        <Text style={styles.loadingText}>Loading applicants…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader variant="back" accent="purple" onPress={() => router.back()} />
      <Text style={styles.title}>{opp?.title || 'Applicants'}</Text>
      <Text style={styles.subtitle}>{applicants.length} applicants total</Text>

      {Object.entries(statusGroups).map(([status, group]) => {
        if (group.length === 0) return null;
        return (
          <View key={status}>
            <Text style={styles.section}>
              {status} ({group.length})
            </Text>
            {group.map(a => (
              <Card key={a.id} style={styles.applicantCard}>
                <Pressable onPress={() => router.push(`/messages/${a.id}` as never)}>
                  <View style={styles.row}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {a.firstName[0]}
                        {(a.lastName[0] ?? a.firstName[1] ?? '?').toString()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name}>
                        {a.firstName} {a.lastName}
                      </Text>
                      <Text style={styles.details}>
                        Grade {a.grade} • {a.totalHours}h total
                        {a.rating ? ` • ★ ${a.rating}` : ''}
                      </Text>
                    </View>
                    <PillBadge label={status} color={statusColors[status as keyof typeof statusColors]} />
                  </View>
                </Pressable>
                {status === 'PENDING' && (
                  <View style={styles.actions}>
                    <PillButton
                      variant="primary"
                      accent="purple"
                      size="small"
                      style={{ flex: 1 }}
                      onPress={() => handleDecision(a.id, 'APPROVED')}
                      disabled={reviewMutation.isPending}
                    >
                      Approve
                    </PillButton>
                    <PillButton
                      variant="default"
                      size="small"
                      style={{ flex: 1 }}
                      onPress={() => handleDecision(a.id, 'DECLINED')}
                      disabled={reviewMutation.isPending}
                    >
                      Decline
                    </PillButton>
                    <PillButton
                      variant="ghost"
                      size="small"
                      onPress={() => router.push(`/messages/${a.id}` as never)}
                    >
                      Message
                    </PillButton>
                  </View>
                )}
              </Card>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center', paddingTop: 120 },
  loadingText: { marginTop: 12, color: Colors.dark.textSecondary },
  container: { flex: 1, backgroundColor: Colors.dark.base },
  content: { paddingTop: 60, paddingHorizontal: Spacing.screenHorizontal, paddingBottom: 40, gap: Spacing.md },
  title: {
    ...Typography.titleSmall,
    color: Colors.dark.textPrimary,
  },
  subtitle: { ...Typography.bodySmall, color: Colors.dark.textSecondary },
  section: {
    ...Typography.header,
    marginTop: Spacing.md,
  },
  applicantCard: { padding: Spacing.lg, borderRadius: 20, gap: 14, marginTop: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '600', color: Colors.purple },
  name: { fontSize: 15, fontWeight: '500', color: Colors.dark.textPrimary },
  details: { fontSize: 12, color: Colors.dark.textSecondary, marginTop: 2 },
  actions: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
});
