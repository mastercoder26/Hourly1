// FilterBar — sticky filter bar for opportunity feed
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import { Colors } from '@/constants/colors';
import { CauseTag } from '../types';

interface FilterBarProps {
  onFiltersChange?: (filters: Filters) => void;
}

export interface Filters {
  causes: CauseTag[];
  maxDistance: number;
  creditEligible: boolean;
}

const ALL_CAUSES: CauseTag[] = ['Environment', 'Education', 'Food', 'Animals', 'Seniors', 'Youth', 'Health', 'Arts'];

export function FilterBar({ onFiltersChange }: FilterBarProps) {
  const [selectedCauses, setSelectedCauses] = useState<CauseTag[]>([]);
  const [creditOnly, setCreditOnly] = useState(false);

  const toggleCause = (cause: CauseTag) => {
    const newCauses = selectedCauses.includes(cause)
      ? selectedCauses.filter(c => c !== cause)
      : [...selectedCauses, cause];
    setSelectedCauses(newCauses);
    onFiltersChange?.({ causes: newCauses, maxDistance: 25, creditEligible: creditOnly });
  };

  const toggleCredit = () => {
    setCreditOnly(!creditOnly);
    onFiltersChange?.({ causes: selectedCauses, maxDistance: 25, creditEligible: !creditOnly });
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Credit-eligible filter */}
        <Pressable
          onPress={toggleCredit}
          style={({ pressed }) => [
            styles.chip,
            creditOnly && styles.chipActive,
            pressed && styles.chipPressed,
          ]}
        >
          <Text style={[styles.chipText, creditOnly && styles.chipTextActive]}>
            Credit eligible
          </Text>
        </Pressable>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Cause filters */}
        {ALL_CAUSES.map(cause => {
          const isActive = selectedCauses.includes(cause);
          return (
            <Pressable
              key={cause}
              onPress={() => toggleCause(cause)}
              style={({ pressed }) => [
                styles.chip,
                isActive && { backgroundColor: Colors.causeTags[cause] + '30' },
                pressed && styles.chipPressed,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isActive && { color: Colors.causeTags[cause] },
                ]}
              >
                {cause}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  scroll: {
    paddingHorizontal: 20,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.dark.element,
  },
  chipPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  chipActive: {
    backgroundColor: Colors.tealSoft,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
  },
  chipTextActive: {
    color: Colors.teal,
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: Colors.dark.element,
  },
});
