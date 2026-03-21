// Events tab — org's list of posted events
import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/Themed';;
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { PillBadge } from '../../components/ui/PillBadge';
import { PillButton } from '../../components/ui/PillButton';
import { mockOpportunities } from '../../mocks/opportunities';

export default function EventsScreen() {
  const router = useRouter();
  const orgOpps = mockOpportunities.filter(o => o.orgId === 'org-001');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  title: { fontSize: 28, fontWeight: '500', color: Colors.dark.textPrimary, letterSpacing: -0.3 },
  sectionTitle: { fontSize: 13, fontWeight: '500', color: Colors.dark.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8 },
  eventCard: { padding: 20, borderRadius: 20, gap: 8 },
  eventTitle: { fontSize: 16, fontWeight: '500', color: Colors.dark.textPrimary },
  eventDate: { fontSize: 13, color: Colors.dark.textSecondary },
  eventFooter: { flexDirection: 'row', gap: 8, marginTop: 4 },
});
