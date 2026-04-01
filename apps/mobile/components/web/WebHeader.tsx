// Web-specific header with navigation
import React from 'react';
import { View, StyleSheet, Pressable, Platform, ViewStyle } from 'react-native';
import { Text } from '@/components/Themed';
import { Link, usePathname } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { NavIcons, ActionIcons } from '../../constants/icons';
import { MOTION } from '../../lib/motion';

interface WebHeaderProps {
  title?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  rightContent?: React.ReactNode;
}

// Web cursor helper that works with TS
const webCursorStyle = Platform.OS === 'web' ? { cursor: 'pointer' as const } : {};

// Animated nav link
function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  const hovered = useSharedValue(0);

  const linkStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      hovered.value,
      [0, 1],
      [isActive ? 1 : 0.7, 1],
      Extrapolation.CLAMP
    ),
  }));

  const underlineStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleX: interpolate(
        hovered.value + (isActive ? 1 : 0),
        [0, 1, 2],
        [0, 0.5, 1],
        Extrapolation.CLAMP
      )},
    ],
    opacity: interpolate(
      hovered.value + (isActive ? 1 : 0),
      [0, 1, 2],
      [0, 0.5, 1],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <Link href={href as any} asChild>
      <Pressable
        // @ts-ignore - web only hover events
        onHoverIn={() => { hovered.value = withTiming(1, { duration: MOTION.duration.quick }); }}
        onHoverOut={() => { hovered.value = withTiming(0, { duration: MOTION.duration.quick }); }}
        style={webCursorStyle as ViewStyle}
      >
        <Animated.View style={[styles.navLink, linkStyle]}>
          <Text style={[styles.navLinkText, isActive && styles.navLinkTextActive]}>
            {label}
          </Text>
          <Animated.View style={[styles.navUnderline, underlineStyle]} />
        </Animated.View>
      </Pressable>
    </Link>
  );
}

// Animated icon button
function IconButton({ icon, onPress, badge }: { icon: keyof typeof Feather.glyphMap; onPress?: () => void; badge?: number }) {
  const hovered = useSharedValue(0);
  const pressed = useSharedValue(0);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(pressed.value, [0, 1], [1, 0.9], Extrapolation.CLAMP) },
    ],
    backgroundColor: interpolate(
      hovered.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ) > 0.5 ? Colors.dark.element : 'transparent',
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { pressed.value = withTiming(1, { duration: MOTION.duration.instant }); }}
      onPressOut={() => { pressed.value = withTiming(0, { duration: MOTION.duration.quick }); }}
      // @ts-ignore - web only hover events
      onHoverIn={() => { hovered.value = withTiming(1, { duration: MOTION.duration.quick }); }}
      onHoverOut={() => { hovered.value = withTiming(0, { duration: MOTION.duration.quick }); }}
      style={webCursorStyle as ViewStyle}
    >
      <Animated.View style={[styles.iconButton, buttonStyle]}>
        <Feather name={icon} size={20} color={Colors.dark.textSecondary} />
        {badge && badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

export function WebHeader({
  title = 'Hourly',
  showSearch = true,
  showNotifications = true,
  showProfile = true,
  rightContent,
}: WebHeaderProps) {
  const pathname = usePathname();

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {/* Logo */}
        <Link href="/" asChild>
          <Pressable style={webCursorStyle as ViewStyle}>
            <Text style={styles.logo}>Hourly.</Text>
          </Pressable>
        </Link>

        {/* Nav links */}
        <View style={styles.nav}>
          <NavLink 
            href="/(student-tabs)/feed" 
            label="Explore" 
            isActive={pathname.includes('feed') || pathname === '/'} 
          />
          <NavLink 
            href="/(student-tabs)/my-shifts" 
            label="My Shifts" 
            isActive={pathname.includes('shifts')} 
          />
          <NavLink 
            href="/(student-tabs)/portfolio" 
            label="Portfolio" 
            isActive={pathname.includes('portfolio')} 
          />
        </View>
      </View>

      <View style={styles.right}>
        {showSearch && (
          <View style={styles.searchContainer}>
            <Feather name={ActionIcons.search} size={16} color={Colors.dark.textTertiary} />
            <Text style={styles.searchPlaceholder}>Search opportunities...</Text>
          </View>
        )}

        {rightContent}

        {showNotifications && (
          <IconButton icon={NavIcons.notifications} badge={3} />
        )}

        {showProfile && (
          <Link href="/(student-tabs)/profile" asChild>
            <Pressable style={webCursorStyle as ViewStyle}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>AR</Text>
              </View>
            </Pressable>
          </Link>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: Colors.dark.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.divider,
    // @ts-ignore
    position: Platform.OS === 'web' ? 'sticky' : 'relative',
    top: 0,
    zIndex: 100,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 48,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
    letterSpacing: -0.5,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  navLink: {
    paddingVertical: 8,
  },
  navLinkText: {
    ...Typography.label,
    color: Colors.dark.textSecondary,
  },
  navLinkTextActive: {
    color: Colors.dark.textPrimary,
    fontWeight: '600',
  },
  navUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.accent,
    borderRadius: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.dark.element,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 240,
  },
  searchPlaceholder: {
    ...Typography.body,
    color: Colors.dark.textTertiary,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.error,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent,
  },
});

export default WebHeader;
