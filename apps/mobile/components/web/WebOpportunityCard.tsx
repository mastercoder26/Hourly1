// Web-optimized opportunity card for grid layout
import React from 'react';
import { View, StyleSheet, Platform, Pressable, ViewStyle } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Opportunity } from '../../types';
import { Colors, CardStyle, Shadows } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { PillBadge } from '../ui/PillBadge';
import { Feather } from '@expo/vector-icons';
import { DetailIcons, StatusIcons } from '../../constants/icons';
import { MOTION, microSpring } from '../../lib/motion';

interface WebOpportunityCardProps {
  opportunity: Opportunity;
  layout?: 'card' | 'row' | 'compact';
}

// Web cursor style helper
const webCursorStyle = Platform.OS === 'web' ? { cursor: 'pointer' as const } : {};

export function WebOpportunityCard({ opportunity, layout = 'card' }: WebOpportunityCardProps) {
  const router = useRouter();
  const hovered = useSharedValue(0);
  const pressed = useSharedValue(0);

  const spotsLeft = opportunity.totalSpots - opportunity.filledSpots;
  const isUrgent = spotsLeft <= 5;
  const isCritical = spotsLeft <= 1;
  const fillPercentage = (opportunity.filledSpots / opportunity.totalSpots) * 100;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const cardStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      hovered.value,
      [0, 1],
      [0, -4],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      pressed.value,
      [0, 1],
      [1, 0.98],
      Extrapolation.CLAMP
    );

    const shadowOpacity = interpolate(
      hovered.value,
      [0, 1],
      [0.2, 0.4],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateY },
        { scale },
      ],
      shadowOpacity,
    };
  });

  // Animated progress bar fill
  const progressStyle = useAnimatedStyle(() => {
    const width = interpolate(
      hovered.value,
      [0, 1],
      [fillPercentage, Math.min(fillPercentage + 5, 100)],
      Extrapolation.CLAMP
    );
    return { width: `${width}%` };
  });

  const getUrgencyColor = () => {
    if (isCritical) return Colors.urgencyRed;
    if (isUrgent) return Colors.urgencyOrange;
    return Colors.accent;
  };

  const handlePress = () => {
    router.push(`/opportunity/${opportunity.id}`);
  };

  if (layout === 'row') {
    return (
      <Pressable
        onPress={handlePress}
        onPressIn={() => { pressed.value = withSpring(1, microSpring.press); }}
        onPressOut={() => { pressed.value = withSpring(0, microSpring.release); }}
        // @ts-ignore - web only hover events
        onHoverIn={() => { hovered.value = withTiming(1, { duration: MOTION.duration.standard }); }}
        onHoverOut={() => { hovered.value = withTiming(0, { duration: MOTION.duration.standard }); }}
        style={webCursorStyle as ViewStyle}
      >
        <Animated.View style={[styles.rowCard, cardStyle]}>
          <View style={styles.rowLeft}>
            <View style={styles.orgLogo}>
              <Text style={styles.orgLogoText}>{opportunity.orgLogo}</Text>
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle} numberOfLines={1}>{opportunity.title}</Text>
              <Text style={styles.rowOrg}>{opportunity.orgName}</Text>
            </View>
          </View>
          <View style={styles.rowRight}>
            <View style={styles.rowDetail}>
              <Feather name={DetailIcons.date} size={14} color={Colors.dark.textTertiary} />
              <Text style={styles.rowDetailText}>{formatDate(opportunity.date)}</Text>
            </View>
            <View style={[styles.rowSpots, { backgroundColor: getUrgencyColor() + '20' }]}>
              <Text style={[styles.rowSpotsText, { color: getUrgencyColor() }]}>
                {spotsLeft} spots
              </Text>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => { pressed.value = withSpring(1, microSpring.press); }}
      onPressOut={() => { pressed.value = withSpring(0, microSpring.release); }}
      // @ts-ignore - web only hover events
      onHoverIn={() => { hovered.value = withTiming(1, { duration: MOTION.duration.standard }); }}
      onHoverOut={() => { hovered.value = withTiming(0, { duration: MOTION.duration.standard }); }}
      style={webCursorStyle as ViewStyle}
    >
      <Animated.View style={[styles.card, cardStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.orgInfo}>
            <View style={styles.orgLogo}>
              <Text style={styles.orgLogoText}>{opportunity.orgLogo}</Text>
            </View>
            <View style={styles.orgDetails}>
              <View style={styles.orgNameRow}>
                <Text style={styles.orgName}>{opportunity.orgName}</Text>
                {opportunity.orgVerified && (
                  <View style={styles.verifiedBadge}>
                    <Feather name={StatusIcons.verified} size={10} color={Colors.dark.base} />
                  </View>
                )}
              </View>
              <Text style={styles.orgRating}>★ {opportunity.rating.toFixed(1)}</Text>
            </View>
          </View>
          {opportunity.creditEligible && (
            <View style={styles.creditBadge}>
              <Feather name={DetailIcons.credit} size={12} color={Colors.accent} />
              <Text style={styles.creditText}>Credit</Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>{opportunity.title}</Text>

        {/* Tags */}
        <View style={styles.tags}>
          {opportunity.causeTags.slice(0, 3).map(tag => (
            <PillBadge key={tag} label={tag} causeTag={tag} size="tiny" />
          ))}
        </View>

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Feather name={DetailIcons.date} size={14} color={Colors.dark.textTertiary} />
            <Text style={styles.detailText}>{formatDate(opportunity.date)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name={DetailIcons.time} size={14} color={Colors.dark.textTertiary} />
            <Text style={styles.detailText}>{opportunity.startTime} – {opportunity.endTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name={DetailIcons.location} size={14} color={Colors.dark.textTertiary} />
            <Text style={styles.detailText}>{opportunity.distance?.toFixed(1)} mi</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.spotsContainer}>
            <View style={styles.spotsBar}>
              <Animated.View
                style={[
                  styles.spotsFill,
                  { backgroundColor: getUrgencyColor() },
                  progressStyle,
                ]}
              />
            </View>
            <Text style={[styles.spotsText, { color: getUrgencyColor() }]}>
              {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
            </Text>
          </View>
          <View style={styles.hoursContainer}>
            <Text style={styles.hoursValue}>{opportunity.durationHours}</Text>
            <Text style={styles.hoursUnit}>hrs</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: CardStyle.borderRadius,
    padding: 24,
    ...Shadows.card,
  },
  rowCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: CardStyle.borderRadiusSmall,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadows.cardSubtle,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rowInfo: {
    flex: 1,
  },
  rowTitle: {
    ...Typography.label,
    color: Colors.dark.textPrimary,
  },
  rowOrg: {
    ...Typography.caption,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  rowDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowDetailText: {
    ...Typography.caption,
    color: Colors.dark.textTertiary,
  },
  rowSpots: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  rowSpotsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orgInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  orgLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.element,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgLogoText: {
    fontSize: 18,
  },
  orgDetails: {
    flex: 1,
  },
  orgNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orgName: {
    ...Typography.label,
    color: Colors.dark.textPrimary,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgRating: {
    ...Typography.caption,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  creditBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  creditText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.accent,
  },
  title: {
    ...Typography.subtitle,
    color: Colors.dark.textPrimary,
    marginBottom: 14,
    lineHeight: 24,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  details: {
    gap: 8,
    marginBottom: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.divider,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    ...Typography.caption,
    color: Colors.dark.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  spotsContainer: {
    flex: 1,
    marginRight: 20,
  },
  spotsBar: {
    height: 6,
    backgroundColor: Colors.dark.element,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  spotsFill: {
    height: '100%',
    borderRadius: 3,
  },
  spotsText: {
    fontSize: 13,
    fontWeight: '600',
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: Colors.accentSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  hoursValue: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.accent,
  },
  hoursUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.accent,
    marginLeft: 2,
    opacity: 0.8,
  },
});

export default WebOpportunityCard;
