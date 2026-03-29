// Student Tabs Layout
import React from 'react';
import { Tabs, useRouter, usePathname, Link, Redirect } from 'expo-router';
import { View, StyleSheet, Platform, useWindowDimensions, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { useAuth } from '@clerk/expo';

// Types for our navigation items
type TabName = 'feed' | 'my-shifts' | 'portfolio' | 'profile';
const ROUTES: { name: TabName; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { name: 'feed', label: 'Explore', icon: 'search' },
  { name: 'my-shifts', label: 'My shifts', icon: 'clipboard' },
  { name: 'portfolio', label: 'Portfolio', icon: 'pie-chart' },
  { name: 'profile', label: 'Profile', icon: 'user' },
];

function SideNav() {
  const pathname = usePathname();
  
  return (
    <View style={styles.sideNav}>
      <Text style={styles.sideNavLogo}>Hourly.</Text>
      <View style={styles.sideNavLinks}>
        {ROUTES.map((route) => {
          const focused = pathname === `/${route.name}` || (pathname === '/' && route.name === 'feed');
          return (
            <Link href={`/(student-tabs)/${route.name}`} key={route.name} asChild>
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

function TabIcon({ name, focused, iconName }: { name: string; focused: boolean; iconName: keyof typeof Feather.glyphMap }) {
  return (
    <View style={styles.tabItem}>
      <Feather 
        name={iconName} 
        size={22} 
        color={focused ? Colors.dark.textPrimary : Colors.dark.textTertiary} 
        style={[styles.tabIcon, focused && styles.tabIconActive]}
      />
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{name}</Text>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

export default function StudentTabsLayout() {
  const { width } = useWindowDimensions();
  const { isLoaded, isSignedIn } = useAuth();

  const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
  const isClerkConfigured = clerkKey.length > 0 && !clerkKey.includes('PLACEHOLDER');

  if (isClerkConfigured && isLoaded && !isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // We trigger the premium desktop layout on screens wider than 768px
  const isWebWide = Platform.OS === 'web' && width > 768;

  const content = (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: isWebWide ? { display: 'none' } : styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => <TabIcon name="Explore" focused={focused} iconName="search" />,
        }}
      />
      <Tabs.Screen
        name="my-shifts"
        options={{
          title: 'My shifts',
          tabBarIcon: ({ focused }) => <TabIcon name="Shifts" focused={focused} iconName="clipboard" />,
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ focused }) => <TabIcon name="Portfolio" focused={focused} iconName="pie-chart" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} iconName="user" />,
        }}
      />
    </Tabs>
  );

  if (isWebWide) {
    return (
      <View style={styles.webContainer}>
        {/* Left Sidebar */}
        <View style={styles.leftColumn}>
          <SideNav />
        </View>

        {/* Center Feed (Fixed max width so contents don't stretch) */}
        <View style={styles.centerColumn}>
          <View style={styles.centerContentWrapper}>
            {content}
          </View>
        </View>

        {/* Right Rail (Empty breathing room for premium feel) */}
        <View style={styles.rightColumn} />
      </View>
    );
  }

  return content;
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
    borderColor: '#1C1C1E',
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
    borderColor: '#1C1C1E',
    overflow: 'hidden',
  },
  rightColumn: {
    flex: 1,
    maxWidth: 300,
    height: '100%',
  },
  // Side Nav styling
  sideNav: {
    padding: 32,
    flex: 1,
  },
  sideNavLogo: {
    fontFamily: Typography.valueHuge.fontFamily,
    fontSize: Typography.title.fontSize,
    fontWeight: Typography.title.fontWeight,
    color: Colors.dark.textPrimary,
    marginBottom: 48,
  },
  sideNavLinks: {
    gap: 16,
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
  // Native Bottom Tab styling
  tabBar: {
    backgroundColor: Colors.dark.base,
    borderTopWidth: 1,
    borderTopColor: '#1C1C1E',
    height: 85,
    paddingTop: 8,
    paddingBottom: 20,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 4,
  },
  tabIcon: {
    opacity: 0.8,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontFamily: Typography.caption.fontFamily,
    fontSize: Typography.caption.fontSize,
    fontWeight: '500',
    color: Colors.dark.textTertiary,
  },
  tabLabelActive: {
    color: Colors.dark.textPrimary,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.dark.textPrimary,
    marginTop: 2,
  },
});
