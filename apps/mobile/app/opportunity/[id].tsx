// Opportunity Detail — full detail view with map, reviews, and apply
import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { Colors } from '@/constants/colors';
import { Card } from '../../components/ui/Card';
import { PillBadge } from '../../components/ui/PillBadge';
import { PillButton } from '../../components/ui/PillButton';
import { MapPreview } from '../../components/MapPreview';
import { Feather } from '@expo/vector-icons';
import { trpc } from '../../lib/trpc';
import { ApiOpportunityLike, toMobileOpportunity } from '../../lib/opportunity-adapter';
import { getOpportunityById } from '../../mocks/opportunities';
import { enterFade, enterRise, exitDrop, exitFade, MOTION } from '../../lib/motion';

export default function OpportunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const opportunityId = Array.isArray(id) ? id[0] : id;
  const [useFallback, setUseFallback] = useState(false);

  const { data: rawOpportunity, isLoading, error } = trpc.opportunity.getById.useQuery({
    id: opportunityId ?? '',
  });
  const applyMutation = trpc.application.apply.useMutation();

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const timer = setTimeout(() => {
      setUseFallback(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      setUseFallback(true);
    }
  }, [error]);

  useEffect(() => {
    if (rawOpportunity) {
      setUseFallback(false);
    }
  }, [rawOpportunity]);

  const fallbackOpportunity = useMemo(() => {
    if (!opportunityId) {
      return undefined;
    }

    return getOpportunityById(opportunityId);
  }, [opportunityId]);

  const shouldUseFallback = useFallback || Boolean(error);
  const opportunity = rawOpportunity
    ? toMobileOpportunity(rawOpportunity as ApiOpportunityLike)
    : (shouldUseFallback ? fallbackOpportunity ?? null : null);

  const [showApplySheet, setShowApplySheet] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  const checkScale = useSharedValue(0.92);
  const checkOpacity = useSharedValue(0);

  if (isLoading && !shouldUseFallback) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.teal} />
      </View>
    );
  }

  if (error || !opportunity) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Opportunity not found</Text>
      </View>
    );
  }

  const spotsLeft = opportunity.totalSpots - opportunity.filledSpots;
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const handleApply = async () => {
    if (!opportunityId) return;

    if (shouldUseFallback) {
      setApplied(true);
      setShowApplySheet(false);
      checkScale.value = withSequence(
        withSpring(1.08, { damping: 14, stiffness: 260, mass: 0.8 }),
        withSpring(1, { damping: 18, stiffness: 220, mass: 0.9 })
      );
      checkOpacity.value = withTiming(1, {
        duration: MOTION.duration.standard,
        easing: MOTION.easeOut,
      });
      return;
    }

    try {
      await applyMutation.mutateAsync({
        opportunityId,
      });

      setApplied(true);
      setShowApplySheet(false);
      checkScale.value = withSequence(
        withSpring(1.08, { damping: 14, stiffness: 260, mass: 0.8 }),
        withSpring(1, { damping: 18, stiffness: 220, mass: 0.9 })
      );
      checkOpacity.value = withTiming(1, {
        duration: MOTION.duration.standard,
        easing: MOTION.easeOut,
      });
    } catch {
      Alert.alert('Apply failed', 'Please try again in a moment.');
    }
  };

  const handleToggleSave = () => {
    const nextSaved = !saved;
    setSaved(nextSaved);
    Alert.alert(
      nextSaved ? 'Saved' : 'Removed',
      nextSaved
        ? 'This opportunity was added to your saved list.'
        : 'This opportunity was removed from your saved list.',
    );
  };

  const successStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.backPressed]}
        >
          <Feather name="arrow-left" size={20} color={Colors.teal} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Animated.View entering={enterRise(80)} style={styles.orgHeader}>
          <View style={styles.orgLogo}>
            <Text style={styles.orgEmoji}>{opportunity.orgLogo}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.orgNameRow}>
              <Text style={styles.orgName}>{opportunity.orgName}</Text>
              {opportunity.orgVerified && <Feather name="check-circle" size={14} color={Colors.teal} />}
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingStars}>{'★'.repeat(Math.round(opportunity.rating))}</Text>
              <Text style={styles.ratingText}>{opportunity.rating.toFixed(1)}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={enterRise(140)}>
          <Text style={styles.title}>{opportunity.title}</Text>
          {shouldUseFallback && (
            <Text style={styles.fallbackNote}>Demo mode: showing local opportunity</Text>
          )}
          <View style={styles.tags}>
            {opportunity.causeTags.map(tag => (
              <PillBadge key={tag} label={tag} causeTag={tag} size="medium" />
            ))}
            {opportunity.creditEligible && (
              <PillBadge label="Credit eligible" color={Colors.teal} size="medium" />
            )}
          </View>
        </Animated.View>

        <Animated.View entering={enterRise(200)}>
          <Card style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Feather name="calendar" size={20} color={Colors.dark.textSecondary} style={styles.detailIcon} />
              <View>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{formatDate(opportunity.date)}</Text>
              </View>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <Feather name="clock" size={20} color={Colors.dark.textSecondary} style={styles.detailIcon} />
              <View>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{opportunity.startTime} – {opportunity.endTime} ({opportunity.durationHours}h)</Text>
              </View>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <Feather name="users" size={20} color={Colors.dark.textSecondary} style={styles.detailIcon} />
              <View>
                <Text style={styles.detailLabel}>Spots</Text>
                <Text style={[styles.detailValue, spotsLeft <= 3 && { color: Colors.urgencyOrange }]}>
                  {spotsLeft} of {opportunity.totalSpots} remaining
                </Text>
              </View>
            </View>
            {opportunity.ageMinimum > 0 && (
              <>
                <View style={styles.detailDivider} />
                <View style={styles.detailRow}>
                  <Feather name="user-check" size={20} color={Colors.dark.textSecondary} style={styles.detailIcon} />
                  <View>
                    <Text style={styles.detailLabel}>Minimum age</Text>
                    <Text style={styles.detailValue}>{opportunity.ageMinimum}+</Text>
                  </View>
                </View>
              </>
            )}
          </Card>
        </Animated.View>

        <Animated.View entering={enterRise(260)}>
          <Text style={styles.sectionTitle}>About this opportunity</Text>
          <Text style={styles.description}>{opportunity.description}</Text>
        </Animated.View>

        <Animated.View entering={enterRise(320)}>
          <Text style={styles.sectionTitle}>Location</Text>
          <MapPreview
            latitude={opportunity.location.lat}
            longitude={opportunity.location.lng}
            title={opportunity.title}
            address={`${opportunity.location.address}, ${opportunity.location.city}, ${opportunity.location.state}`}
            height={220}
          />
        </Animated.View>

        {opportunity.whatToBring.length > 0 && (
          <Animated.View entering={enterRise(360)}>
            <Text style={styles.sectionTitle}>What to bring</Text>
            <Card style={styles.checklistCard}>
              {opportunity.whatToBring.map((item, i) => (
                <View key={i} style={styles.checklistRow}>
                  <Feather name="circle" size={18} color={Colors.dark.textSecondary} />
                  <Text style={styles.checklistItem}>{item}</Text>
                </View>
              ))}
            </Card>
          </Animated.View>
        )}

        {opportunity.reviews.length > 0 && (
          <Animated.View entering={enterRise(400)}>
            <Text style={styles.sectionTitle}>Volunteer reviews</Text>
            {opportunity.reviews.map(review => (
              <Card key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewAuthor}>{review.authorName}</Text>
                  <Text style={styles.reviewStars}>{'★'.repeat(review.rating)}</Text>
                </View>
                <Text style={styles.reviewText}>"{review.text}"</Text>
                <Text style={styles.reviewDate}>
                  {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </Card>
            ))}
          </Animated.View>
        )}

        {/* Spacer for bottom bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {showApplySheet && (
        <Animated.View entering={enterFade()} exiting={exitFade()} style={styles.sheetOverlay}>
          <Pressable style={styles.sheetBg} onPress={() => setShowApplySheet(false)} />
          <Animated.View entering={enterRise(40)} exiting={exitDrop()} style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Confirm application</Text>
            <Card style={styles.sheetSummary}>
              <Text style={styles.sheetSummaryTitle}>{opportunity.title}</Text>
              <Text style={styles.sheetSummaryOrg}>{opportunity.orgName}</Text>
              <Text style={styles.sheetSummaryDate}>{formatDate(opportunity.date)} • {opportunity.startTime} – {opportunity.endTime}</Text>
            </Card>
            <PillButton
              variant="primary"
              accent="teal"
              fullWidth
              size="large"
              onPress={handleApply}
              disabled={applyMutation.isPending}
            >
              {applyMutation.isPending ? 'Submitting...' : 'Confirm — apply now'}
            </PillButton>
            <PillButton variant="ghost" fullWidth size="medium" onPress={() => setShowApplySheet(false)}>
              Cancel
            </PillButton>
          </Animated.View>
        </Animated.View>
      )}

      {applied && (
        <Animated.View style={styles.successOverlay} entering={enterFade(40)}>
          <Animated.View style={[styles.successCircle, successStyle]}>
            <Feather name="check" size={48} color={Colors.teal} style={styles.successCheck} />
          </Animated.View>
          <Text style={styles.successTitle}>Application sent!</Text>
          <Text style={styles.successSubtitle}>You'll be notified when the org responds</Text>
          <PillButton
            variant="primary"
            accent="teal"
            size="large"
            onPress={() => router.back()}
            style={{ marginTop: 24 }}
          >
            Back to feed
          </PillButton>
        </Animated.View>
      )}

      {!showApplySheet && !applied && (
        <View style={styles.bottomBar}>
          <PillButton variant="default" size="medium" onPress={handleToggleSave}>
            {saved ? 'Saved' : 'Save for later'}
          </PillButton>
          <PillButton
            variant="primary"
            accent="teal"
            size="large"
            style={{ flex: 1 }}
            onPress={() => setShowApplySheet(true)}
          >
            Apply — 1 tap
          </PillButton>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.dark.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 24,
  },
  errorText: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingRight: 16,
  },
  backPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  backText: {
    fontSize: 16,
    color: Colors.teal,
    fontWeight: '500',
  },
  orgHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  orgLogo: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.dark.element,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgEmoji: {
    fontSize: 28,
  },
  orgNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orgName: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  ratingStars: {
    fontSize: 14,
    color: Colors.warning,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  title: {
    fontSize: 26,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 16,
    lineHeight: 32,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fallbackNote: {
    fontSize: 12,
    color: Colors.teal,
    fontWeight: '600',
    marginBottom: 14,
  },
  detailsCard: {
    padding: 0,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  detailDivider: {
    height: 1,
    backgroundColor: Colors.dark.element,
    marginHorizontal: 24,
  },
  detailIcon: {
    width: 28,
    textAlign: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.dark.textPrimary,
    lineHeight: 24,
  },
  checklistCard: {
    gap: 12,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checklistItem: {
    fontSize: 15,
    color: Colors.dark.textPrimary,
  },
  reviewCard: {
    marginBottom: 12,
    borderRadius: 20,
    padding: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
  },
  reviewStars: {
    fontSize: 14,
    color: Colors.warning,
  },
  reviewText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.dark.textTertiary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 36,
    backgroundColor: Colors.dark.card,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.element,
  },
  sheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  sheetBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: Colors.dark.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.dark.element,
    alignSelf: 'center',
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    textAlign: 'center',
  },
  sheetSummary: {
    borderRadius: 20,
    gap: 6,
  },
  sheetSummaryTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
  },
  sheetSummaryOrg: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  sheetSummaryDate: {
    fontSize: 13,
    color: Colors.dark.textTertiary,
    marginTop: 4,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.dark.base,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successCheck: {
    fontWeight: '300',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
});
