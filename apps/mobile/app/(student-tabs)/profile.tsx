// Profile Screen - student profile and settings
import React from 'react';
import { View, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { Card } from '../../components/ui/Card';
import { PillBadge } from '../../components/ui/PillBadge';
import { PillButton } from '../../components/ui/PillButton';
import { ClerkSignOutButton } from '../../components/ClerkSignOutButton';
import { trpc } from '../../lib/trpc';
import { isDemoMode } from '../../lib/dataMode';
import { shouldUseDemoData, shouldUseLiveApi } from '../../lib/dataSource';
import { isClerkConfigured } from '../../lib/clerkConfig';
import { useDemoAuth } from '../../context/DemoAuthContext';
import { useDemoStore } from '../../lib/demo/demoStore';
import { useAuth } from '@clerk/expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tabBarScrollContentPadding, tabScreenContentTopPadding } from '../../constants/tabBar';

const SETTINGS_ROUTE: Record<string, string> = {
  Notifications: 'notifications',
  Appearance: 'appearance',
  Privacy: 'privacy',
  'Help & support': 'help',
  'Terms of service': 'terms',
};

type ProfileAuthState = { authLoaded: boolean; isSignedIn: boolean };

function ProfileScreenInner({
  authLoaded,
  isSignedIn,
}: ProfileAuthState) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { switchRole, demoSignedIn, isPreview } = useDemoAuth();
  const browsingAsGuest = Boolean(
    demoSignedIn && isClerkConfigured() && authLoaded && !isSignedIn,
  );
  const preferLocalStudentProfile = shouldUseDemoData() || browsingAsGuest;
  const studentProfile = useDemoStore(s => s.studentProfile);
  const profileQuery = trpc.user.me.useQuery(undefined, {
    enabled: shouldUseLiveApi() && !preferLocalStudentProfile,
  });
  const statsQuery = trpc.user.getPortfolioStats.useQuery(undefined, {
    enabled: shouldUseLiveApi() && !preferLocalStudentProfile,
  });

  const profile = preferLocalStudentProfile ? studentProfile : profileQuery.data;
  const demoBare = isDemoMode() && !isClerkConfigured();
  const showLocalSessionControls = demoBare || browsingAsGuest || isPreview;
  const badgesEarned = preferLocalStudentProfile ? 3 : (statsQuery.data?.badgesEarned ?? 0);
  const orgsServed = preferLocalStudentProfile ? 5 : (statsQuery.data?.orgsServed ?? 0);
  const totalHours = preferLocalStudentProfile
    ? profile?.totalHours ?? 0
    : (statsQuery.data?.totalVerifiedHours ?? 0);

  if (shouldUseLiveApi() && !preferLocalStudentProfile && profileQuery.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.teal} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Unable to load profile.</Text>
      </View>
    );
  }

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
      <Text style={styles.title}>Profile</Text>

      {/* Profile card */}
      <Card style={styles.profileCard}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>
            {profile.firstName[0]}{profile.lastName[0]}
          </Text>
        </View>
        <Text style={styles.name}>{profile.firstName} {profile.lastName}</Text>
        <Text style={styles.school}>{profile.school} • Grade {profile.grade}</Text>
        <View style={styles.interests}>
          {profile.interests.map(tag => (
            <PillBadge key={tag} label={tag} />
          ))}
        </View>
        <PillButton
          variant="default"
          size="small"
          fullWidth
          onPress={() => router.push('/settings/edit' as never)}
        >
          Edit profile
        </PillButton>
      </Card>

      {/* Quick stats */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{totalHours}</Text>
          <Text style={styles.statLabel}>Total hours</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{badgesEarned}</Text>
          <Text style={styles.statLabel}>Badges earned</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{orgsServed}</Text>
          <Text style={styles.statLabel}>Orgs served</Text>
        </Card>
      </View>

      {/* Settings menu */}
      <Card style={styles.menuCard}>
        {[
          { icon: '🔔', label: 'Notifications' },
          { icon: '🎨', label: 'Appearance' },
          { icon: '🔒', label: 'Privacy' },
          { icon: '❓', label: 'Help & support' },
          { icon: '📋', label: 'Terms of service' },
        ].map((item, i, arr) => (
          <Pressable
            key={item.label}
            onPress={() => {
              const slug = SETTINGS_ROUTE[item.label];
              if (slug) {
                router.push(`/settings/${slug}` as never);
              }
            }}
            style={[styles.menuItem, i < arr.length - 1 && styles.menuItemBorder]}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </Pressable>
        ))}
      </Card>

      {/* Switch role & Sign out */}
      {showLocalSessionControls ? (
        <PillButton
          variant="default"
          fullWidth
          size="medium"
          onPress={() => {
            switchRole('organizer');
            router.dismissTo('/(org-tabs)/dashboard');
          }}
        >
          Switch to organizer view
        </PillButton>
      ) : (
        <ClerkSignOutButton />
      )}
    </ScrollView>
  );
}

function ProfileScreenWithClerk() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  return <ProfileScreenInner authLoaded={authLoaded} isSignedIn={Boolean(isSignedIn)} />;
}

export default function ProfileScreen() {
  if (isDemoMode() && !isClerkConfigured()) {
    return <ProfileScreenInner authLoaded={true} isSignedIn={false} />;
  }
  return <ProfileScreenWithClerk />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.dark.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  content: {
    paddingHorizontal: Spacing.screenHorizontal,
    gap: Spacing.lg,
  },
  title: {
    ...Typography.title,
    color: Colors.dark.textPrimary,
    marginBottom: Spacing.sm,
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
