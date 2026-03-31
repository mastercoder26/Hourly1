// Opportunity Feed — main student home screen with refined animations
import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, ActivityIndicator, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import Animated from 'react-native-reanimated';
import { Colors, Shadows } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Feather } from '@expo/vector-icons';
import { OpportunityCard } from '../../components/OpportunityCard';
import { FilterBar, Filters } from '../../components/FilterBar';
import { useOpportunities } from '../../hooks/useOpportunities';
import { Opportunity } from '../../types';
import { enterFade, enterRise, enterRiseSnappy, stagger, createStaggeredEntrance } from '../../lib/motion';

export default function FeedScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<Filters>({ causes: [], maxDistance: 25, creditEligible: false });

  const { data: filteredOpportunities, loading, error, refetch, usingFallback } = useOpportunities({
    causes: filters.causes,
    creditEligible: filters.creditEligible,
    maxDistance: filters.maxDistance,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const getStaggeredEntrance = createStaggeredEntrance(0, 60);

  const renderItem = useCallback(({ item, index }: { item: Opportunity; index: number }) => (
    <Animated.View entering={getStaggeredEntrance(index)}>
      <OpportunityCard opportunity={item} />
    </Animated.View>
  ), [getStaggeredEntrance]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Finding opportunities...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorIcon}>
          <Feather name="alert-circle" size={32} color={Colors.error} />
        </View>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>Failed to load opportunities</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={styles.header} entering={enterFade(40)}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>GOOD EVENING</Text>
          <Text style={styles.title}>Find opportunities</Text>
        </View>
        <Pressable style={styles.avatar}>
          <Text style={styles.avatarText}>AR</Text>
        </Pressable>
      </Animated.View>

      {/* Filter bar */}
      <Animated.View entering={enterRiseSnappy(80)}>
        <FilterBar onFiltersChange={setFilters} />
      </Animated.View>

      {/* Demo mode notice */}
      {usingFallback ? (
        <Animated.View style={styles.demoNotice} entering={enterFade(120)}>
          <Feather name="info" size={14} color={Colors.accent} />
          <Text style={styles.demoNoticeText}>Demo mode: showing sample opportunities</Text>
        </Animated.View>
      ) : null}

      {/* Results count */}
      <Animated.View style={styles.resultsHeader} entering={enterFade(140)}>
        <Text style={styles.resultsCount}>
          {filteredOpportunities?.length ?? 0} {(filteredOpportunities?.length ?? 0) === 1 ? 'opportunity' : 'opportunities'}
        </Text>
      </Animated.View>

      {/* Feed list */}
      <FlatList
        data={filteredOpportunities}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={Colors.accent}
            progressBackgroundColor={Colors.dark.card}
          />
        }
        ListEmptyComponent={
          <Animated.View style={styles.empty} entering={enterRise(200)}>
            <View style={styles.emptyIcon}>
              <Feather name="search" size={40} color={Colors.dark.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>No opportunities found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters or check back later</Text>
          </Animated.View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    ...Typography.header,
    marginBottom: 4,
  },
  title: {
    ...Typography.title,
    color: Colors.dark.textPrimary,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.button,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.accent,
    letterSpacing: 0.5,
  },
  resultsHeader: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  resultsCount: {
    ...Typography.caption,
    color: Colors.dark.textTertiary,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 24,
    marginBottom: 12,
    backgroundColor: Colors.accentSoft,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  demoNoticeText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '500',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.dark.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    ...Typography.subtitle,
    color: Colors.dark.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.dark.base,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.dark.base,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.errorSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    ...Typography.subtitle,
    color: Colors.dark.textPrimary,
    marginBottom: 8,
  },
  errorText: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.dark.element,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  retryButtonText: {
    ...Typography.label,
    color: Colors.dark.textPrimary,
  },
});
