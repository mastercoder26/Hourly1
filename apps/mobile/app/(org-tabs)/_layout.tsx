// Org Tabs Layout
import React from 'react';
import { Tabs, usePathname, Link, Redirect } from 'expo-router';
import { View, StyleSheet, Platform, useWindowDimensions, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { SlidingTabBar } from '../../components/navigation/SlidingTabBar';
import { useAuth, useUser } from '@clerk/expo';
import { isDemoMode } from '../../lib/dataMode';
import { isClerkConfigured } from '../../lib/clerkConfig';
import { useDemoAuth } from '../../context/DemoAuthContext';

// Types for our navigation items
type TabName = 'dashboard' | 'events' | 'applicants' | 'org-profile';
const ROUTES: { name: TabName; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { name: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { name: 'events', label: 'Events', icon: 'calendar' },
  { name: 'applicants', label: 'People', icon: 'users' },
  { name: 'org-profile', label: 'Profile', icon: 'briefcase' },
];

function SideNav() {
  const pathname = usePathname();
  
  return (
    <View style={styles.sideNav}>
      <Text style={styles.sideNavLogo}>Hourly.</Text>
      <View style={styles.sideNavLinks}>
        {ROUTES.map((route) => {
          const focused = pathname === `/${route.name}` || (pathname === '/' && route.name === 'dashboard');
          return (
            <Link href={`/(org-tabs)/${route.name}`} key={route.name} asChild>
              <Pressable style={StyleSheet.flatten([styles.sideNavItem, focused && styles.sideNavActive])}>
                <Feather 
                  name={route.icon} 
                  size={24} 
                  color={focused ? Colors.dark.textPrimary : Colors.dark.textSecondary} 
                />
                <Text style={StyleSheet.flatten([styles.sideNavLabel, focused && styles.sideNavLabelActive])}>
                  {route.label}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

function TabIcon({ focused, iconName }: { focused: boolean; iconName: keyof typeof Feather.glyphMap }) {
  return (
    <View style={styles.tabItem}>
      <Feather
        name={iconName}
        size={22}
        color={focused ? Colors.dark.textPrimary : Colors.dark.textTertiary}
        style={[styles.tabIcon, focused && styles.tabIconActive]}
      />
    </View>
  );
}

function OrgTabNavigator() {
  const { width } = useWindowDimensions();
  const isWebWide = Platform.OS === 'web' && width > 768;

  return (
    <Tabs
      tabBar={isWebWide ? () => null : (props: BottomTabBarProps) => <SlidingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        ...(isWebWide ? { tabBarStyle: { display: 'none' } } : {}),
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} iconName="grid" />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} iconName="calendar" />,
        }}
      />
      <Tabs.Screen
        name="applicants"
        options={{
          title: 'People',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} iconName="users" />,
        }}
      />
      <Tabs.Screen
        name="org-profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} iconName="briefcase" />,
        }}
      />
    </Tabs>
  );
}

function OrgTabsWebShell({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.webContainer}>
      <View style={styles.leftColumn}>
        <SideNav />
      </View>
      <View style={styles.centerColumn}>
        <View style={styles.centerContentWrapper}>{children}</View>
      </View>
      <View style={styles.rightColumn} />
    </View>
  );
}

function OrgTabsLayoutWithClerk() {
  const { width } = useWindowDimensions();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { demoSignedIn, demoRole, isPreview } = useDemoAuth();

  const previewGuest = demoSignedIn && isPreview;
  if (isClerkConfigured() && isLoaded && !isSignedIn && !demoSignedIn && !previewGuest) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const role =
    typeof user?.unsafeMetadata?.role === 'string' ? user.unsafeMetadata.role : null;

  if (
    isClerkConfigured() &&
    isLoaded &&
    isSignedIn &&
    role &&
    role !== 'organizer'
  ) {
    return <Redirect href="/(student-tabs)/feed" />;
  }

  if (
    isClerkConfigured() &&
    isLoaded &&
    !isSignedIn &&
    demoSignedIn &&
    demoRole &&
    demoRole !== 'organizer'
  ) {
    return <Redirect href="/(student-tabs)/feed" />;
  }

  const isWebWide = Platform.OS === 'web' && width > 768;
  const content = <OrgTabNavigator />;

  if (isWebWide) {
    return <OrgTabsWebShell>{content}</OrgTabsWebShell>;
  }

  return content;
}

function OrgTabsLayoutDemoBare() {
  const { width } = useWindowDimensions();
  const { demoSignedIn, demoRole } = useDemoAuth();

  if (!demoSignedIn) {
    return <Redirect href="/" />;
  }
  if (demoRole !== 'organizer') {
    return <Redirect href="/(student-tabs)/feed" />;
  }

  const isWebWide = Platform.OS === 'web' && width > 768;
  const content = <OrgTabNavigator />;

  if (isWebWide) {
    return <OrgTabsWebShell>{content}</OrgTabsWebShell>;
  }

  return content;
}

export default function OrgTabsLayout() {
  if (isDemoMode() && !isClerkConfigured()) {
    return <OrgTabsLayoutDemoBare />;
  }
  return <OrgTabsLayoutWithClerk />;
}

const styles = StyleSheet.create({
  // Web specific layout
  webContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.dark.base,
    justifyContent: 'center',
  },
  leftColumn: {
    width: 280,
    borderRightWidth: 1,
    borderColor: Colors.dark.divider,
    height: '100%',
  },
  centerColumn: {
    flex: 1,
    maxWidth: 700,
    height: '100%',
  },
  centerContentWrapper: {
    flex: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: Colors.dark.divider,
    overflow: 'hidden',
  },
  rightColumn: {
    flex: 1,
    maxWidth: 300,
    height: '100%',
  },
  // Side Nav styling
  sideNav: {
    padding: 24,
    paddingTop: 28,
    flex: 1,
  },
  sideNavLogo: {
    fontFamily: Typography.valueHuge.fontFamily,
    fontSize: Typography.title.fontSize,
    fontWeight: Typography.title.fontWeight,
    color: Colors.dark.textPrimary,
    marginBottom: 36,
    paddingLeft: 4,
  },
  sideNavLinks: {
    gap: 8,
  },
  sideNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 99,
    gap: 16,
  },
  sideNavActive: {
    backgroundColor: Colors.dark.card,
  },
  sideNavLabel: {
    fontFamily: Typography.body.fontFamily,
    fontSize: 20,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
  },
  sideNavLabelActive: {
    color: Colors.dark.textPrimary,
    fontWeight: '600',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: '100%',
    maxWidth: 96,
    paddingHorizontal: 2,
  },
  tabIcon: {
    opacity: 0.8,
  },
  tabIconActive: {
    opacity: 1,
  },
});
