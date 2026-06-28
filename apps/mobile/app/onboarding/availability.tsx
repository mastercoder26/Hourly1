// Onboarding Step 4 - Availability Selection
import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { PillButton } from '../../components/ui/PillButton';
import { DayOfWeek } from '../../types';
import { enterFade, enterRise, stagger } from '../../lib/motion';
import { getOnboardingState, setOnboardingAvailability } from '../../lib/onboardingStore';

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SHIFT_LENGTHS = [1, 2, 3, 4, 5, 6];

export default function AvailabilityStep() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const isOrg = role === 'organizer';
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(
    getOnboardingState().availabilityDays as DayOfWeek[],
  );
  const [shiftLength, setShiftLength] = useState(3);

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const accentColor = Colors.dark.textPrimary; // Changed from teal/purple to use high contrast

  const handleComplete = () => {
    setOnboardingAvailability(selectedDays);
    router.push(`/onboarding/complete?role=${role || 'student'}`);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={styles.header} entering={enterFade(40)}>
        <ProgressBar steps={4} currentStep={3} accent="purple" />
        <PillButton variant="ghost" size="small" onPress={handleComplete}>
          Skip for now
        </PillButton>
      </Animated.View>

      <View style={styles.content}>
        <Animated.View entering={enterRise(120)}>
          <Text style={styles.stepLabel}>Step 4 of 4</Text>
          <Text style={styles.title}>When are you available?</Text>
          <Text style={styles.subtitle}>
            We'll prioritize opportunities that fit your schedule
          </Text>
        </Animated.View>

        <Animated.View entering={enterRise(200)}>
          <Text style={styles.sectionLabel}>Days of the week</Text>
          <View style={styles.dayGrid}>
            {DAYS.map((day, i) => {
              const isSelected = selectedDays.includes(day);
              return (
                <Animated.View key={day} style={{ flex: 1 }} entering={enterRise(stagger(i, 240, 30, 420))}>
                  <Pressable
                    onPress={() => toggleDay(day)}
                    style={({ pressed }) => [
                      styles.dayChip,
                      pressed && styles.chipPressed,
                      isSelected && { backgroundColor: Colors.dark.element, borderColor: accentColor },
                    ]}
                  >
                    <Text style={[styles.dayText, isSelected && { color: accentColor }]}>
                      {day}
                    </Text>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View entering={enterRise(260)}>
          <Text style={[styles.sectionLabel, { marginTop: 32 }]}>Preferred shift length</Text>
          <View style={styles.shiftRow}>
            {SHIFT_LENGTHS.map((hours, i) => {
              const isSelected = shiftLength === hours;
              return (
                <Animated.View key={hours} style={{ flex: 1 }} entering={enterRise(stagger(i, 300, 24, 420))}>
                  <Pressable
                    onPress={() => setShiftLength(hours)}
                    style={({ pressed }) => [
                      styles.shiftChip,
                      pressed && styles.chipPressed,
                      isSelected && { backgroundColor: accentColor, borderColor: accentColor },
                    ]}
                  >
                    <Text style={[styles.shiftText, isSelected && { color: Colors.dark.base }]}>
                      {hours}h
                    </Text>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>
      </View>

      <Animated.View style={styles.footer} entering={enterRise(320)}>
        <View style={styles.footerButtons}>
          <PillButton variant="ghost" size="medium" onPress={() => router.back()} style={{ flex: 1 }}>
            Back
          </PillButton>
          <PillButton
            variant="primary"
            size="large"
            onPress={handleComplete}
            style={{ flex: 2 }}
          >
            Finish setup
          </PillButton>
        </View>
      </Animated.View>
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
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  stepLabel: {
    fontFamily: Typography.sub.fontFamily,
    fontSize: Typography.sub.fontSize,
    fontWeight: Typography.sub.fontWeight as any,
    color: Colors.dark.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  title: {
    fontFamily: Typography.title.fontFamily,
    fontSize: Typography.title.fontSize,
    fontWeight: Typography.title.fontWeight,
    color: Colors.dark.textPrimary,
    letterSpacing: Typography.title.letterSpacing,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
    color: Colors.dark.textSecondary,
    marginBottom: 32,
  },
  sectionLabel: {
    fontFamily: Typography.sub.fontFamily,
    fontSize: Typography.sub.fontSize,
    fontWeight: Typography.sub.fontWeight as any,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  dayGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  dayChip: {
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.dark.card, // Less prominent
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  dayText: {
    fontFamily: Typography.label.fontFamily,
    fontSize: Typography.label.fontSize,
    fontWeight: Typography.label.fontWeight,
    color: Colors.dark.textSecondary,
  },
  shiftRow: {
    flexDirection: 'row',
    gap: 8,
  },
  shiftChip: {
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.dark.card, // Less prominent
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  shiftText: {
    fontFamily: Typography.label.fontFamily,
    fontSize: Typography.label.fontSize,
    fontWeight: Typography.label.fontWeight,
    color: Colors.dark.textSecondary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
});
