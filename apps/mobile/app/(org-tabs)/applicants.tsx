// Applicants tab — overview of all applicants across org events
import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/Themed';;
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { PillBadge } from '../../components/ui/PillBadge';
import { mockApplicants } from '../../mocks/data';

export default function ApplicantsTab() {
  const router = useRouter();
  const pending = mockApplicants.filter(a => a.status === 'PENDING');
  const approved = mockApplicants.filter(a => a.status === 'APPROVED');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>People</Text>

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
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40, gap: 12 },
  title: { fontSize: 28, fontWeight: '500', color: Colors.dark.textPrimary, letterSpacing: -0.3, marginBottom: 8 },
  section: { fontSize: 13, fontWeight: '500', color: Colors.dark.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8 },
  personCard: { padding: 16, borderRadius: 20 },
  personRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 15, fontWeight: '600', color: Colors.purple },
  personName: { fontSize: 15, fontWeight: '500', color: Colors.dark.textPrimary },
  personSub: { fontSize: 12, color: Colors.dark.textSecondary, marginTop: 2 },
});
