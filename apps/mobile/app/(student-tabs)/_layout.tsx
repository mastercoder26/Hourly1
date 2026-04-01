// Student Tabs Layout
import React from 'react';
import { Tabs, useRouter, usePathname, Link, Redirect } from 'expo-router';
import { View, StyleSheet, Platform, useWindowDimensions, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { NavIcons } from '../../constants/icons';
import { MOTION, haptic, microSpring } from '../../lib/motion';
import { useAuth } from '@clerk/expo';

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
    backgroundColor: interpolate(
      hovered.value,
      [0, 1],
      [focused ? 1 : 0, 1],
      Extrapolation.CLAMP
    ) > 0.5 ? Colors.dark.card : 'transparent',
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
function TabIcon({ name, focused, iconName }: { name: string; focused: boolean; iconName: keyof typeof Feather.glyphMap }) {
  const focusAnim = useSharedValue(focused ? 1 : 0);
  
  React.useEffect(() => {
    focusAnim.value = withSpring(focused ? 1 : 0, MOTION.springSnappy);
    if (focused) {
      haptic.selection();
    }
  }, [focused]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(focusAnim.value, [0, 1], [1, 1.1], Extrapolation.CLAMP) },
      { translateY: interpolate(focusAnim.value, [0, 1], [0, -2], Extrapolation.CLAMP) },
    ],
    opacity: interpolate(focusAnim.value, [0, 1], [0.6, 1], Extrapolation.CLAMP),
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: focusAnim.value },
    ],
    opacity: focusAnim.value,
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
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{name}</Text>
      <Animated.View style={[styles.activeDot, dotStyle]} />
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

  // Breakpoints for responsive layout
  const isWebWide = Platform.OS === 'web' && width > 768;
  const isWebDesktop = Platform.OS === 'web' && width > 1024;

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
          tabBarIcon: ({ focused }) => <TabIcon name="Explore" focused={focused} iconName={NavIcons.explore} />,
        }}
      />
      <Tabs.Screen
        name="my-shifts"
        options={{
          title: 'My shifts',
          tabBarIcon: ({ focused }) => <TabIcon name="Shifts" focused={focused} iconName={NavIcons.shifts} />,
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ focused }) => <TabIcon name="Portfolio" focused={focused} iconName={NavIcons.portfolio} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} iconName={NavIcons.profile} />,
        }}
      />
    </Tabs>
  );

  if (isWebWide) {
    return (
      <View style={styles.webContainer}>
        {/* Left Sidebar */}
        <View style={[styles.leftColumn, isWebDesktop && styles.leftColumnWide]}>
          <SideNav />
        </View>

        {/* Center Feed (Fixed max width so contents don't stretch) */}
        <View style={[styles.centerColumn, isWebDesktop && styles.centerColumnWide]}>
          <View style={styles.centerContentWrapper}>
            {content}
          </View>
        </View>

        {/* Right Rail (Empty breathing room for premium feel - only on desktop) */}
        {isWebDesktop && <View style={styles.rightColumn} />}
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
  // Native Bottom Tab styling
  tabBar: {
    backgroundColor: Colors.dark.base,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.divider,
    height: 88,
    paddingTop: 8,
    paddingBottom: 24,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 4,
    minHeight: 48,
  },
  tabLabel: {
    fontFamily: Typography.caption.fontFamily,
    fontSize: 11,
    fontWeight: '500',
    color: Colors.dark.textTertiary,
    marginTop: 2,
  },
  tabLabelActive: {
    color: Colors.dark.textPrimary,
    fontWeight: '600',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accent,
    marginTop: 4,
  },
});
