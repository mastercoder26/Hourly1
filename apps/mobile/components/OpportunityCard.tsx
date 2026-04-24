// OpportunityCard - main feed card component with premium animations
import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Opportunity } from '../types';
import { Colors, CardStyle, Shadows } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { PillBadge } from './ui/PillBadge';
import { Feather } from '@expo/vector-icons';
import { MOTION, PRESS_FEEDBACK, haptic, microSpring } from '../lib/motion';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const router = useRouter();
  const pressed = useSharedValue(0);
  const hovered = useSharedValue(0);

  const spotsLeft = opportunity.totalSpots - opportunity.filledSpots;
  const isUrgent = spotsLeft <= 5;
  const isCritical = spotsLeft <= 1;
  const fillPercentage = (opportunity.filledSpots / opportunity.totalSpots) * 100;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Premium press animation with depth effect
  const cardStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      pressed.value,
      [0, 1],
      [1, PRESS_FEEDBACK.scaleSubtle],
      Extrapolation.CLAMP
    );
    
    const translateY = interpolate(
      pressed.value,
      [0, 1],
      [0, 2],
      Extrapolation.CLAMP
    );

    const shadowOpacity = interpolate(
      pressed.value,
      [0, 1],
      [0.25, 0.15],
      Extrapolation.CLAMP
    );

    // Web hover lift effect
    const hoverTranslateY = Platform.OS === 'web' 
      ? interpolate(hovered.value, [0, 1], [0, -2], Extrapolation.CLAMP)
      : 0;

    const hoverShadow = Platform.OS === 'web'
      ? interpolate(hovered.value, [0, 1], [0.25, 0.35], Extrapolation.CLAMP)
      : 0.25;

    return {
      transform: [
        { scale },
        { translateY: translateY + hoverTranslateY },
      ],
      shadowOpacity: pressed.value > 0 ? shadowOpacity : hoverShadow,
    };
  });

  const handlePressIn = () => {
    pressed.value = withSpring(1, microSpring.press);
    haptic.light();
  };

  const handlePressOut = () => {
    pressed.value = withSpring(0, microSpring.release);
  };

  const handleHoverIn = () => {
    if (Platform.OS === 'web') {
      hovered.value = withTiming(1, { duration: MOTION.duration.standard });
    }
  };

  const handleHoverOut = () => {
    if (Platform.OS === 'web') {
      hovered.value = withTiming(0, { duration: MOTION.duration.standard });
    }
  };

  const getUrgencyColor = () => {
    if (isCritical) return Colors.urgencyRed;
    if (isUrgent) return Colors.urgencyOrange;
    return Colors.accent;
  };

  return (
    <Pressable
      onPress={() => router.push(`/opportunity/${opportunity.id}`)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      // @ts-ignore - web only
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
    >
      <Animated.View style={[styles.card, cardStyle]}>
        {/* Header row */}
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
                    <Feather name="check" size={10} color={Colors.dark.base} />
                  </View>
                )}
              </View>
              <View style={styles.ratingRow}>
                <Text style={styles.orgRating}>★ {opportunity.rating.toFixed(1)}</Text>
              </View>
            </View>
          </View>
          {opportunity.creditEligible && (
            <View style={styles.creditBadge}>
              <Feather name="award" size={12} color={Colors.accent} style={{ marginRight: 4 }} />
              <Text style={styles.creditBadgeText}>Credit</Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title}>{opportunity.title}</Text>

        {/* Cause tags */}
        <View style={styles.tags}>
          {opportunity.causeTags.slice(0, 3).map(tag => (
            <PillBadge key={tag} label={tag} causeTag={tag} size="tiny" />
          ))}
          {opportunity.causeTags.length > 3 && (
            <PillBadge label={`+${opportunity.causeTags.length - 3}`} size="tiny" />
          )}
        </View>

        {/* Details row */}
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Feather name="calendar" size={13} color={Colors.dark.textTertiary} />
            <Text style={styles.detailText}>{formatDate(opportunity.date)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="clock" size={13} color={Colors.dark.textTertiary} />
            <Text style={styles.detailText}>{opportunity.startTime} – {opportunity.endTime}</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="map-pin" size={13} color={Colors.dark.textTertiary} />
            <Text style={styles.detailText}>{opportunity.distance?.toFixed(1)} mi</Text>
          </View>
        </View>

        {/* Footer: spots + hours */}
        <View style={styles.footer}>
          <View style={styles.spotsContainer}>
            <View style={styles.spotsBar}>
              <Animated.View
                style={[
                  styles.spotsFill,
                  {
                    width: `${fillPercentage}%`,
                    backgroundColor: getUrgencyColor(),
                  },
                ]}
              />
            </View>
            <View style={styles.spotsInfo}>
              <Text style={[styles.spotsText, { color: getUrgencyColor() }]}>
                {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
              </Text>
              <Text style={styles.spotsTotal}>of {opportunity.totalSpots}</Text>
            </View>
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
    marginBottom: 16,
    ...Shadows.card,
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
    fontSize: 20,
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  orgRating: {
    ...Typography.caption,
    color: Colors.dark.textSecondary,
  },
  creditBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  creditBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.accent,
    letterSpacing: 0.2,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.divider,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  spotsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spotsText: {
    fontSize: 13,
    fontWeight: '600',
  },
  spotsTotal: {
    ...Typography.caption,
    color: Colors.dark.textTertiary,
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
