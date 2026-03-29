// Applicant Management — per-opportunity applicant list
import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { Text } from '@/components/Themed';;
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../../constants/colors';
import { Card } from '../../../components/ui/Card';
import { PillBadge } from '../../../components/ui/PillBadge';
import { PillButton } from '../../../components/ui/PillButton';
import { mockApplicants } from '../../../mocks/data';
import { getOpportunityById } from '../../../mocks/opportunities';

export default function ApplicantManagement() {
  const { opportunityId } = useLocalSearchParams<{ opportunityId: string }>();
  const router = useRouter();
  const opp = getOpportunityById(opportunityId || '');
  const [applicants, setApplicants] = useState(mockApplicants);

  const statusGroups = useMemo(
    () => ({
      PENDING: applicants.filter(a => a.status === 'PENDING'),
      APPROVED: applicants.filter(a => a.status === 'APPROVED'),
      WAITLISTED: applicants.filter(a => a.status === 'WAITLISTED'),
      DECLINED: applicants.filter(a => a.status === 'DECLINED'),
    }),
    [applicants],
  );

  const handleDecision = (applicantId: string, decision: 'APPROVED' | 'DECLINED') => {
    const applicant = applicants.find(a => a.id === applicantId);
    if (!applicant) {
      return;
    }

    setApplicants(prev =>
      prev.map(item =>
        item.id === applicantId
          ? {
              ...item,
              status: decision,
            }
          : item,
      ),
    );

    const decisionVerb = decision === 'APPROVED' ? 'approved' : 'declined';
    Alert.alert(
      `Applicant ${decisionVerb}`,
      `${applicant.firstName} ${applicant.lastName} has been ${decisionVerb}.`,
    );
  };

  const handleMessageApplicant = (applicantId: string) => {
    router.push(`/messages/${applicantId}` as never);
  };

  const statusColors = { PENDING: Colors.warning, APPROVED: Colors.success, WAITLISTED: Colors.purple, DECLINED: Colors.error };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>
      <Text style={styles.title}>{opp?.title || 'Applicants'}</Text>
      <Text style={styles.subtitle}>{applicants.length} applicants total</Text>

      {Object.entries(statusGroups).map(([status, applicants]) => {
        if (applicants.length === 0) return null;
        return (
          <View key={status}>
            <Text style={styles.section}>{status} ({applicants.length})</Text>
            {applicants.map(a => (
              <Card key={a.id} style={styles.applicantCard}>
                <View style={styles.row}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{a.firstName[0]}{a.lastName[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{a.firstName} {a.lastName}</Text>
                    <Text style={styles.details}>Grade {a.grade} • {a.totalHours}h total{a.rating ? ` • ★ ${a.rating}` : ''}</Text>
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
                    >
                      Approve
                    </PillButton>
                    <PillButton
                      variant="default"
                      size="small"
                      style={{ flex: 1 }}
                      onPress={() => handleDecision(a.id, 'DECLINED')}
                    >
                      Decline
                    </PillButton>
                    <PillButton variant="ghost" size="small" onPress={() => handleMessageApplicant(a.id)}>
                      💬
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
  container: { flex: 1, backgroundColor: Colors.dark.base },
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40, gap: 12 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingRight: 16 },
  backText: { fontSize: 16, color: Colors.purple, fontWeight: '500' },
  title: { fontSize: 24, fontWeight: '500', color: Colors.dark.textPrimary, letterSpacing: -0.3 },
  subtitle: { fontSize: 14, color: Colors.dark.textSecondary },
  section: { fontSize: 13, fontWeight: '500', color: Colors.dark.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 12 },
  applicantCard: { padding: 16, borderRadius: 20, gap: 14, marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 15, fontWeight: '600', color: Colors.purple },
  name: { fontSize: 15, fontWeight: '500', color: Colors.dark.textPrimary },
  details: { fontSize: 12, color: Colors.dark.textSecondary, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8 },
});
