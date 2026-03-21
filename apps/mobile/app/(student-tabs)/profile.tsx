// Profile Screen — student profile and settings
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { PillBadge } from '../../components/ui/PillBadge';
import { PillButton } from '../../components/ui/PillButton';
import { mockStudent } from '../../mocks/data';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>

      {/* Profile card */}
      <Card style={styles.profileCard}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>
            {mockStudent.firstName[0]}{mockStudent.lastName[0]}
          </Text>
        </View>
        <Text style={styles.name}>{mockStudent.firstName} {mockStudent.lastName}</Text>
        <Text style={styles.school}>{mockStudent.school} • Grade {mockStudent.grade}</Text>
        <View style={styles.interests}>
          {mockStudent.interests.map(tag => (
            <PillBadge key={tag} label={tag} causeTag={tag} />
          ))}
        </View>
        <PillButton variant="default" size="small" fullWidth>
          Edit profile
        </PillButton>
      </Card>

      {/* Quick stats */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{mockStudent.totalHours}</Text>
          <Text style={styles.statLabel}>Total hours</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Badges earned</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Orgs served</Text>
        </Card>
      </View>

      {/* Settings menu */}
      <Card style={styles.menuCard}>
        {[
          { icon: '🔔', label: 'Notifications', action: () => {} },
          { icon: '🎨', label: 'Appearance', action: () => {} },
          { icon: '🔒', label: 'Privacy', action: () => {} },
          { icon: '❓', label: 'Help & support', action: () => {} },
          { icon: '📋', label: 'Terms of service', action: () => {} },
        ].map((item, i, arr) => (
          <Pressable
            key={item.label}
            onPress={item.action}
            style={[styles.menuItem, i < arr.length - 1 && styles.menuItemBorder]}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </Pressable>
        ))}
      </Card>

      {/* Switch role & Sign out */}
      <PillButton
        variant="default"
        fullWidth
        size="medium"
        onPress={() => router.replace('/(org-tabs)/dashboard')}
      >
        Switch to organizer view
      </PillButton>
      <PillButton variant="ghost" fullWidth size="medium" onPress={() => router.replace('/')}>
        Sign out
      </PillButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  profileCard: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 28,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.teal,
  },
  name: {
    fontSize: 22,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
  },
  school: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.element,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
  },
  menuArrow: {
    fontSize: 20,
    color: Colors.dark.textTertiary,
  },
});
