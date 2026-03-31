// Applicants tab — overview of all applicants across org events
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { PillBadge } from '../../components/ui/PillBadge';
import { trpc } from '../../lib/trpc';
import { mockApplicants } from '../../mocks/data';

export default function ApplicantsTab() {
  const router = useRouter();
  const [useFallback, setUseFallback] = useState(false);

  const applicantsQuery = trpc.org.listAllApplicants.useQuery();

  useEffect(() => {
    if (!applicantsQuery.isLoading) {
      return;
    }

    const timer = setTimeout(() => {
      setUseFallback(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [applicantsQuery.isLoading]);

  useEffect(() => {
    if (applicantsQuery.error) {
      setUseFallback(true);
    }
  }, [applicantsQuery.error]);

  useEffect(() => {
    if (applicantsQuery.isSuccess) {
      setUseFallback(false);
    }
  }, [applicantsQuery.isSuccess]);

  const shouldUseFallback = useFallback || Boolean(applicantsQuery.error);
  const allApplicants = shouldUseFallback ? mockApplicants : (applicantsQuery.data ?? []);

  const pending = allApplicants.filter(a => a.status === 'PENDING');
  const approved = allApplicants.filter(a => a.status === 'APPROVED');

  if (applicantsQuery.isLoading && !shouldUseFallback) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.purple} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>People</Text>
      {shouldUseFallback && (
        <Text style={styles.fallbackNote}>Demo mode: showing local data</Text>
      )}

      <Text style={styles.section}>Pending review ({pending.length})</Text>
      {pending.map(a => (
        <Card key={a.id} style={styles.personCard}>
          <View style={styles.personRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{a.firstName[0]}{a.lastName[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.personName}>{a.firstName} {a.lastName}</Text>
              <Text style={styles.personSub}>Grade {a.grade} • {a.totalHours}h total</Text>
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
              <Text style={styles.avatarText}>{a.firstName[0]}{a.lastName[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.personName}>{a.firstName} {a.lastName}</Text>
              <Text style={styles.personSub}>Grade {a.grade} • {a.totalHours}h total • ★ {a.rating}</Text>
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
  loadingContainer: { flex: 1, backgroundColor: Colors.dark.base, alignItems: 'center', justifyContent: 'center' },
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40, gap: 12 },
  title: { fontSize: 28, fontWeight: '500', color: Colors.dark.textPrimary, letterSpacing: -0.3, marginBottom: 8 },
  fallbackNote: { fontSize: 12, color: Colors.purple, fontWeight: '600', marginTop: -6 },
  section: { fontSize: 13, fontWeight: '500', color: Colors.dark.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8 },
  personCard: { padding: 16, borderRadius: 20 },
  personRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 15, fontWeight: '600', color: Colors.purple },
  personName: { fontSize: 15, fontWeight: '500', color: Colors.dark.textPrimary },
  personSub: { fontSize: 12, color: Colors.dark.textSecondary, marginTop: 2 },
});
