// Org Profile — organization profile and settings
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { PillBadge } from '../../components/ui/PillBadge';
import { PillButton } from '../../components/ui/PillButton';
import { mockOrganizations } from '../../mocks/data';

export default function OrgProfileScreen() {
  const router = useRouter();
  const org = mockOrganizations[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Organization</Text>

      <Card style={styles.profileCard}>
        <View style={styles.logoLarge}>
          <Text style={styles.logoText}>{org.logoUrl}</Text>
        </View>
        <Text style={styles.orgName}>{org.name}</Text>
        <View style={styles.verifiedRow}>
          <PillBadge label="✓ Verified" color={Colors.purple} />
          <Text style={styles.rating}>★ {org.rating} ({org.ratingCount})</Text>
        </View>
        <Text style={styles.mission}>{org.mission}</Text>
        <View style={styles.tags}>
          {org.causeTags.map(t => <PillBadge key={t} label={t} causeTag={t} />)}
        </View>
      </Card>

      <Card style={styles.menuCard}>
        {[
          { icon: '📊', label: 'Impact reports' },
          { icon: '👥', label: 'Team members' },
          { icon: '🔔', label: 'Notifications' },
          { icon: '⚙️', label: 'Settings' },
        ].map((item, i, arr) => (
          <Pressable key={item.label} style={[styles.menuItem, i < arr.length - 1 && styles.menuBorder]}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </Pressable>
        ))}
      </Card>

      <PillButton variant="default" fullWidth size="medium" onPress={() => router.replace('/(student-tabs)/feed')}>
        Switch to student view
      </PillButton>
      <PillButton variant="ghost" fullWidth size="medium" onPress={() => router.replace('/')}>
        Sign out
      </PillButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.base },
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  title: { fontSize: 28, fontWeight: '500', color: Colors.dark.textPrimary, letterSpacing: -0.3, marginBottom: 8 },
  profileCard: { alignItems: 'center', gap: 12, paddingVertical: 28 },
  logoLarge: { width: 80, height: 80, borderRadius: 24, backgroundColor: Colors.purpleSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  logoText: { fontSize: 36 },
  orgName: { fontSize: 22, fontWeight: '500', color: Colors.dark.textPrimary },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rating: { fontSize: 14, color: Colors.dark.textSecondary },
  mission: { fontSize: 14, color: Colors.dark.textSecondary, textAlign: 'center', lineHeight: 20, paddingHorizontal: 10 },
  tags: { flexDirection: 'row', gap: 8 },
  menuCard: { padding: 0, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: Colors.dark.element },
  menuIcon: { fontSize: 18 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.dark.textPrimary },
  menuArrow: { fontSize: 20, color: Colors.dark.textTertiary },
});
