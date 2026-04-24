// FilterBar - sticky filter bar for opportunity feed with refined styling
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { CauseTag } from '../types';
import { MOTION, PRESS_FEEDBACK } from '../lib/motion';
import { Feather } from '@expo/vector-icons';

interface FilterBarProps {
  onFiltersChange?: (filters: Filters) => void;
}

export interface Filters {
  causes: CauseTag[];
  maxDistance: number;
  creditEligible: boolean;
}

const ALL_CAUSES: CauseTag[] = ['Environment', 'Education', 'Food', 'Animals', 'Seniors', 'Youth', 'Health', 'Arts'];

function FilterChip({ 
  label, 
  isActive, 
  activeColor,
  activeBgColor,
  onPress,
  icon,
}: { 
  label: string;
  isActive: boolean;
  activeColor?: string;
  activeBgColor?: string;
  onPress: () => void;
  icon?: string;
}) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(PRESS_FEEDBACK.scale, { duration: MOTION.duration.instant });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: MOTION.duration.quick });
  };

  const chipBgColor = isActive 
    ? (activeBgColor || Colors.accentSoft)
    : Colors.dark.element;
  
  const chipTextColor = isActive 
    ? (activeColor || Colors.accent)
    : Colors.dark.textSecondary;

  return (
    <Pressable 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.chip, animatedStyle, { backgroundColor: chipBgColor }]}>
        {icon && (
          <Feather name={icon as any} size={14} color={chipTextColor} />
        )}
        <Text style={[styles.chipText, { color: chipTextColor }]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

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
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scroll}
      >
        {/* Credit-eligible filter */}
        <FilterChip
          label="Credit eligible"
          icon="award"
          isActive={creditOnly}
          onPress={toggleCredit}
        />

        {/* Separator */}
        <View style={styles.separator} />

        {/* Cause filters */}
        {ALL_CAUSES.map(cause => {
          const isActive = selectedCauses.includes(cause);
          return (
            <FilterChip
              key={cause}
              label={cause}
              isActive={isActive}
              activeColor={Colors.causeTags[cause]}
              activeBgColor={Colors.causeTagsSoft[cause]}
              onPress={() => toggleCause(cause)}
            />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: Colors.dark.divider,
    marginHorizontal: 4,
  },
});
