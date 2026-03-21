// OpportunityCard — main feed card component
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Opportunity } from '../types';
import { Colors, CardStyle } from '../constants/colors';
import { PillBadge } from './ui/PillBadge';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const router = useRouter();
  const spotsLeft = opportunity.totalSpots - opportunity.filledSpots;
  const isUrgent = spotsLeft <= 5;
  const isCritical = spotsLeft <= 1;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <Pressable
      onPress={() => router.push(`/opportunity/${opportunity.id}`)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      {/* Header row */}
      <View style={styles.header}>
        <View style={styles.orgInfo}>
          <View style={styles.orgLogo}>
            <Text style={styles.orgLogoText}>{opportunity.orgLogo}</Text>
          </View>
          <View>
            <View style={styles.orgNameRow}>
              <Text style={styles.orgName}>{opportunity.orgName}</Text>
              {opportunity.orgVerified && (
                <Text style={styles.verifiedBadge}>✓</Text>
              )}
            </View>
            <Text style={styles.orgRating}>★ {opportunity.rating.toFixed(1)}</Text>
          </View>
        </View>
        {opportunity.creditEligible && (
          <View style={styles.creditBadge}>
            <Text style={styles.creditBadgeText}>Credit</Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text style={styles.title}>{opportunity.title}</Text>

      {/* Cause tags */}
      <View style={styles.tags}>
        {opportunity.causeTags.map(tag => (
          <PillBadge key={tag} label={tag} causeTag={tag} />
        ))}
      </View>

      {/* Details row */}
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>📅</Text>
          <Text style={styles.detailText}>{formatDate(opportunity.date)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>🕐</Text>
          <Text style={styles.detailText}>{opportunity.startTime} – {opportunity.endTime}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detailText}>{opportunity.distance?.toFixed(1)} mi</Text>
        </View>
      </View>

      {/* Footer: spots + hours */}
      <View style={styles.footer}>
        <View style={styles.spotsContainer}>
          <View style={styles.spotsBar}>
            <View
              style={[
                styles.spotsFill,
                {
                  width: `${(opportunity.filledSpots / opportunity.totalSpots) * 100}%`,
                  backgroundColor: isCritical
                    ? Colors.urgencyRed
                    : isUrgent
                    ? Colors.urgencyOrange
                    : Colors.teal,
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.spotsText,
              isCritical && { color: Colors.urgencyRed },
              isUrgent && !isCritical && { color: Colors.urgencyOrange },
            ]}
          >
            {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
          </Text>
        </View>
        <Text style={styles.hours}>{opportunity.durationHours}h</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: CardStyle.borderRadius,
    padding: CardStyle.paddingSmall,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
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
  },
  orgLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.element,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgLogoText: {
    fontSize: 18,
  },
  orgNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orgName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
  },
  verifiedBadge: {
    fontSize: 12,
    color: Colors.teal,
    fontWeight: '600',
  },
  orgRating: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  creditBadge: {
    backgroundColor: Colors.tealSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  creditBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.teal,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    marginBottom: 12,
    lineHeight: 24,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailIcon: {
    fontSize: 14,
  },
  detailText: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotsContainer: {
    flex: 1,
    marginRight: 16,
  },
  spotsBar: {
    height: 4,
    backgroundColor: Colors.dark.element,
    borderRadius: 2,
    marginBottom: 6,
    overflow: 'hidden',
  },
  spotsFill: {
    height: '100%',
    borderRadius: 2,
  },
  spotsText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  hours: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.teal,
  },
});
