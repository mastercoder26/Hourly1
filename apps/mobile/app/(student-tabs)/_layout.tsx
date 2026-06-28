// Student Tabs Layout
import React from 'react';
import { Tabs, usePathname, Link, Redirect } from 'expo-router';
import { View, StyleSheet, Platform, useWindowDimensions, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  interpolateColor,
  Extrapolation,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { NavIcons } from '../../constants/icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { SlidingTabBar } from '../../components/navigation/SlidingTabBar';
import { MOTION, microSpring } from '../../lib/motion';
import { useAuth } from '@clerk/expo';
import { isDemoMode } from '../../lib/dataMode';
import { isClerkConfigured } from '../../lib/clerkConfig';
import { useDemoAuth } from '../../context/DemoAuthContext';

// Types for our navigation items
type TabName = 'feed' | 'my-shifts' | 'portfolio' | 'profile';
const ROUTES: { name: TabName; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { name: 'feed', label: 'Explore', icon: NavIcons.explore },
  { name: 'my-shifts', label: 'My shifts', icon: NavIcons.shifts },
  { name: 'portfolio', label: 'Portfolio', icon: NavIcons.portfolio },
  { name: 'profile', label: 'Profile', icon: NavIcons.profile },
];

// Animated sidebar nav item for web
function SideNavItem({ route, focused }: { route: typeof ROUTES[0]; focused: boolean }) {
  const scale = useSharedValue(1);
  const hovered = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(
      hovered.value,
      [0, 1],
      [focused ? Colors.dark.card : 'transparent', Colors.dark.card],
    ),
  }));

  return (
    <Link href={`/(student-tabs)/${route.name}`} asChild>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.97, microSpring.press); }}
        onPressOut={() => { scale.value = withSpring(1, microSpring.release); }}
        // @ts-ignore - web props
        onHoverIn={() => { hovered.value = withTiming(1, { duration: MOTION.duration.quick }); }}
        onHoverOut={() => { hovered.value = withTiming(0, { duration: MOTION.duration.quick }); }}
      >
        <Animated.View style={[styles.sideNavItem, animatedStyle]}>
          <Feather 
            name={route.icon} 
            size={24} 
            color={focused ? Colors.dark.textPrimary : Colors.dark.textSecondary} 
          />
          <Text style={[styles.sideNavLabel, focused && styles.sideNavLabelActive]}>
            {route.label}
          </Text>
        </Animated.View>
      </Pressable>
    </Link>
  );
}

function SideNav() {
  const pathname = usePathname();
  
  return (
    <View style={styles.sideNav}>
      <Text style={styles.sideNavLogo}>Hourly.</Text>
      <View style={styles.sideNavLinks}>
        {ROUTES.map((route) => {
          const focused = pathname === `/${route.name}` || (pathname === '/' && route.name === 'feed');
          return <SideNavItem key={route.name} route={route} focused={focused} />;
        })}
      </View>
    </View>
  );
}

// Animated tab icon with selection effect
function TabIcon({ focused, iconName }: { focused: boolean; iconName: keyof typeof Feather.glyphMap }) {
  const focusAnim = useSharedValue(focused ? 1 : 0);
  
  React.useEffect(() => {
    focusAnim.value = withSpring(focused ? 1 : 0, MOTION.springSnappy);
  }, [focused]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(focusAnim.value, [0, 1], [1, 1.04], Extrapolation.CLAMP) },
    ],
    opacity: interpolate(focusAnim.value, [0, 1], [0.55, 1], Extrapolation.CLAMP),
  }));

  return (
    <View style={styles.tabItem}>
      <Animated.View style={iconStyle}>
        <Feather
          name={iconName}
          size={22}
          color={focused ? Colors.dark.textPrimary : Colors.dark.textTertiary}
        />
      </Animated.View>
    </View>
  );
}

function StudentTabNavigator() {
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
        name="feed"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} iconName={NavIcons.explore} />,
        }}
      />
      <Tabs.Screen
        name="my-shifts"
        options={{
          title: 'My shifts',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} iconName={NavIcons.shifts} />,
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} iconName={NavIcons.portfolio} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} iconName={NavIcons.profile} />,
        }}
      />
    </Tabs>
  );
}

function StudentTabsWebShell({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isWebDesktop = Platform.OS === 'web' && width > 1024;

  return (
    <View style={styles.webContainer}>
      <View style={[styles.leftColumn, isWebDesktop && styles.leftColumnWide]}>
        <SideNav />
      </View>
      <View style={[styles.centerColumn, isWebDesktop && styles.centerColumnWide]}>
        <View style={styles.centerContentWrapper}>{children}</View>
      </View>
      {isWebDesktop && <View style={styles.rightColumn} />}
    </View>
  );
}

function StudentTabsLayoutWithClerk() {
  const { width } = useWindowDimensions();
  const { isLoaded, isSignedIn } = useAuth();
  const { demoSignedIn, isPreview } = useDemoAuth();

  const previewGuest = demoSignedIn && isPreview;
  if (isClerkConfigured() && isLoaded && !isSignedIn && !demoSignedIn && !previewGuest) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const isWebWide = Platform.OS === 'web' && width > 768;
  const content = <StudentTabNavigator />;

  if (isWebWide) {
    return <StudentTabsWebShell>{content}</StudentTabsWebShell>;
  }

  return content;
}

function StudentTabsLayoutDemoBare() {
  const { width } = useWindowDimensions();
  const { demoSignedIn, demoRole } = useDemoAuth();

  if (!demoSignedIn) {
    return <Redirect href="/" />;
  }
  if (demoRole === 'organizer') {
    return <Redirect href="/(org-tabs)/dashboard" />;
  }

  const isWebWide = Platform.OS === 'web' && width > 768;
  const content = <StudentTabNavigator />;

  if (isWebWide) {
    return <StudentTabsWebShell>{content}</StudentTabsWebShell>;
  }

  return content;
}

export default function StudentTabsLayout() {
  if (isDemoMode() && !isClerkConfigured()) {
    return <StudentTabsLayoutDemoBare />;
  }
  return <StudentTabsLayoutWithClerk />;
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
    width: 240,
    borderRightWidth: 1,
    borderColor: Colors.dark.divider,
    height: '100%',
  },
  leftColumnWide: {
    width: 280,
  },
  centerColumn: {
    flex: 1,
    maxWidth: 600,
    height: '100%',
  },
  centerColumnWide: {
    maxWidth: 700,
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
    maxWidth: 280,
    height: '100%',
  },
  // Side Nav styling
  sideNav: {
    padding: 24,
    paddingTop: 32,
    flex: 1,
  },
  sideNavLogo: {
    fontFamily: Typography.valueHuge.fontFamily,
    fontSize: Typography.title.fontSize,
    fontWeight: Typography.title.fontWeight,
    color: Colors.dark.textPrimary,
    marginBottom: 40,
    paddingLeft: 8,
  },
  sideNavLinks: {
    gap: 8,
  },
  sideNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    gap: 16,
  },
  sideNavLabel: {
    fontFamily: Typography.body.fontFamily,
    fontSize: 18,
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
    width: '100%',
    maxWidth: 96,
    paddingHorizontal: 2,
  },
});
