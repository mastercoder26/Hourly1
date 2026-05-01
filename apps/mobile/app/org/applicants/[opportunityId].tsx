// Applicant Management — per-opportunity list (demo store or live `org.getApplicants` / `org.reviewApplication`).
import React, { useMemo, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../../constants/colors';
import { Card } from '../../../components/ui/Card';
import { PillBadge } from '../../../components/ui/PillBadge';
import { PillButton } from '../../../components/ui/PillButton';
import { getOpportunityById, demoApplicants } from '@hourly/shared';
import { useDemoStore } from '../../../lib/demo/demoStore';
import { isDemoMode, isLiveMode } from '../../../lib/dataMode';
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

  const applicantOverride = useDemoStore(s => (oppId ? s.applicantsByOppId[oppId] : undefined));
  const setApplicantStatus = useDemoStore(s => s.setApplicantStatus);

  const liveApplicantsQuery = trpc.org.getApplicants.useQuery(
    { opportunityId: oppId ?? '' },
    { enabled: isLiveMode() && Boolean(oppId) },
  );

  const reviewMutation = trpc.org.reviewApplication.useMutation({
    onSuccess: async () => {
      await liveApplicantsQuery.refetch();
    },
  });

  const applicants: ApplicantRow[] = useMemo(() => {
    if (isLiveMode() && liveApplicantsQuery.data) {
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
    if (applicantOverride && applicantOverride.length > 0) {
      return applicantOverride;
    }
    return demoApplicants;
  }, [applicantOverride, liveApplicantsQuery.data]);

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
      const applicant = applicants.find(a => a.id === applicationId);
      if (!applicant) {
        return;
      }

      if (isDemoMode()) {
        setApplicantStatus(oppId, applicationId, decision === 'DECLINED' ? 'DECLINED' : decision);
        const decisionVerb = decision === 'APPROVED' ? 'approved' : 'declined';
        Alert.alert(
          `Applicant ${decisionVerb}`,
          `${applicant.firstName} ${applicant.lastName} has been ${decisionVerb}.`,
        );
        return;
      }

      if (isLiveMode()) {
        reviewMutation.mutate(
          { applicationId, decision: decision === 'DECLINED' ? 'DECLINED' : decision },
          {
            onSuccess: () => {
              const verb =
                decision === 'APPROVED' ? 'approved' : decision === 'DECLINED' ? 'declined' : 'updated';
              Alert.alert('Updated', `${applicant.firstName} ${applicant.lastName} has been ${verb}.`);
            },
            onError: err => {
              Alert.alert('Update failed', err.message);
            },
          },
        );
        return;
      }

      const decisionVerb = decision === 'APPROVED' ? 'approved' : 'declined';
      Alert.alert(
        `Applicant ${decisionVerb}`,
        `${applicant.firstName} ${applicant.lastName} has been ${decisionVerb}.`,
      );
    },
    [applicants, oppId, reviewMutation, setApplicantStatus],
  );

  const statusColors = {
    PENDING: Colors.warning,
    APPROVED: Colors.success,
    WAITLISTED: Colors.purple,
    DECLINED: Colors.error,
  };

  if (isLiveMode() && liveApplicantsQuery.isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.purple} />
        <Text style={styles.loadingText}>Loading applicants…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>
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
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40, gap: 12 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingRight: 16 },
  backText: { fontSize: 16, color: Colors.purple, fontWeight: '500' },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: { fontSize: 14, color: Colors.dark.textSecondary },
  section: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 12,
  },
  applicantCard: { padding: 16, borderRadius: 20, gap: 14, marginTop: 8 },
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
  actions: { flexDirection: 'row', gap: 8 },
});
