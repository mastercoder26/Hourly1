// Org Profile - organization profile and settings
import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { PillBadge } from '../../components/ui/PillBadge';
import { PillButton } from '../../components/ui/PillButton';
import { ClerkSignOutButton } from '../../components/ClerkSignOutButton';
import { demoOrganizations } from '@hourly/shared';
import { isDemoMode } from '../../lib/dataMode';
import { isClerkConfigured } from '../../lib/clerkConfig';
import { useDemoAuth } from '../../context/DemoAuthContext';
import { useAuth } from '@clerk/expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tabBarScrollContentPadding, tabScreenContentTopPadding } from '../../constants/tabBar';

const ORG_MENU: { icon: string; label: string; slug: string }[] = [
  { icon: '📊', label: 'Impact reports', slug: 'impact' },
  { icon: '👥', label: 'Team members', slug: 'team' },
  { icon: '🔔', label: 'Notifications', slug: 'notifications' },
  { icon: '⚙️', label: 'Settings', slug: 'org-settings' },
];

type OrgProfileAuthState = { authLoaded: boolean; isSignedIn: boolean };

function OrgProfileScreenInner({ authLoaded, isSignedIn }: OrgProfileAuthState) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { enterDemo, exitDemo, demoSignedIn } = useDemoAuth();
  const org = demoOrganizations[0];
  const demoBare = isDemoMode() && !isClerkConfigured();
  const browsingAsGuest = Boolean(
    demoSignedIn && isClerkConfigured() && authLoaded && !isSignedIn,
  );
  const showLocalSessionControls = demoBare || browsingAsGuest;

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
      <Text style={styles.title}>Organization</Text>

      <Card style={styles.profileCard}>
        <View style={styles.logoLarge}>
          <Text style={styles.logoText}>{org.logoUrl}</Text>
        </View>
        <Text style={styles.orgName}>{org.name}</Text>
        <View style={styles.verifiedRow}>
          <PillBadge label="✓ Verified" color={Colors.purple} />
          <Text style={styles.rating}>
            ★ {org.rating} ({org.ratingCount})
          </Text>
        </View>
        <Text style={styles.mission}>{org.mission}</Text>
        <View style={styles.tags}>
          {org.causeTags.map(t => (
            <PillBadge key={t} label={t} causeTag={t} />
          ))}
        </View>
      </Card>

      <Card style={styles.menuCard}>
        {ORG_MENU.map((item, i, arr) => (
          <Pressable
            key={item.slug}
            onPress={() => router.push(`/settings/${item.slug}` as never)}
            style={[styles.menuItem, i < arr.length - 1 && styles.menuBorder]}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </Pressable>
        ))}
      </Card>

      <PillButton
        variant="default"
        fullWidth
        size="medium"
        onPress={() => {
          if (showLocalSessionControls) {
            enterDemo('student');
          }
          router.dismissTo('/(student-tabs)/feed');
        }}
      >
        Switch to student view
      </PillButton>
      {showLocalSessionControls ? (
        <PillButton
          variant="ghost"
          fullWidth
          size="medium"
          onPress={() => {
            exitDemo();
            router.dismissTo('/');
          }}
        >
          {browsingAsGuest ? 'Exit guest mode' : 'Sign out'}
        </PillButton>
      ) : (
        <ClerkSignOutButton />
      )}
    </ScrollView>
  );
}

function OrgProfileScreenWithClerk() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  return <OrgProfileScreenInner authLoaded={authLoaded} isSignedIn={Boolean(isSignedIn)} />;
}

export default function OrgProfileScreen() {
  if (isDemoMode() && !isClerkConfigured()) {
    return <OrgProfileScreenInner authLoaded={true} isSignedIn={false} />;
  }
  return <OrgProfileScreenWithClerk />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.base },
  content: { paddingHorizontal: 20, gap: 16 },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  profileCard: { alignItems: 'center', gap: 12, paddingVertical: 28 },
  logoLarge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoText: { fontSize: 36 },
  orgName: { fontSize: 22, fontWeight: '500', color: Colors.dark.textPrimary },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rating: { fontSize: 14, color: Colors.dark.textSecondary },
  mission: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  tags: { flexDirection: 'row', gap: 8 },
  menuCard: { padding: 0, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: Colors.dark.element },
  menuIcon: { fontSize: 18 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.dark.textPrimary },
  menuArrow: { fontSize: 20, color: Colors.dark.textTertiary },
});
