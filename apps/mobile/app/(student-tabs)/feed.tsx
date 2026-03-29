// Opportunity Feed — main student home screen
import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Themed';;
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import { OpportunityCard } from '../../components/OpportunityCard';
import { FilterBar, Filters } from '../../components/FilterBar';
import { useOpportunities } from '../../hooks/useOpportunities';
import { Opportunity } from '../../types';

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

  const renderItem = useCallback(({ item, index }: { item: Opportunity; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
      <OpportunityCard opportunity={item} />
    </Animated.View>
  ), []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.teal} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Failed to load opportunities</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good evening, Alex</Text>
          <Text style={styles.title}>Find opportunities</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AR</Text>
        </View>
      </View>

      {/* Filter bar */}
      <FilterBar onFiltersChange={setFilters} />

      {usingFallback ? (
        <View style={styles.demoNotice}>
          <Text style={styles.demoNoticeText}>Demo mode: showing local mock opportunities</Text>
        </View>
      ) : null}

      {/* Feed list */}
      <FlatList
        data={filteredOpportunities}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.teal} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={48} color={Colors.dark.textSecondary} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>No opportunities found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
          </View>
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
    marginBottom: 8,
  },
  greeting: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    letterSpacing: -0.3,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.teal,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  demoNotice: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: Colors.tealSoft,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  demoNoticeText: {
    color: Colors.teal,
    fontSize: 12,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.dark.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: Colors.dark.textSecondary,
    fontSize: 15,
  },
});
