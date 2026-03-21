// Onboarding Step 4 — Availability Selection
import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/Themed';;
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/colors';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { PillButton } from '../../components/ui/PillButton';
import { DayOfWeek } from '../../types';

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SHIFT_LENGTHS = [1, 2, 3, 4, 5, 6];

export default function AvailabilityStep() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const isOrg = role === 'organizer';
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [shiftLength, setShiftLength] = useState(3);

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const accentColor = isOrg ? Colors.purple : Colors.teal;

  const handleComplete = () => {
    router.push(`/onboarding/complete?role=${role || 'student'}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProgressBar steps={4} currentStep={3} accent={isOrg ? 'purple' : 'teal'} />
        <PillButton variant="ghost" size="small" onPress={handleComplete}>
          Skip for now
        </PillButton>
      </View>

      <View style={styles.content}>
        <Text style={styles.stepLabel}>Step 4 of 4</Text>
        <Text style={styles.title}>When are you available?</Text>
        <Text style={styles.subtitle}>
          We'll prioritize opportunities that fit your schedule
        </Text>

        {/* Day selection */}
        <Text style={styles.sectionLabel}>Days of the week</Text>
        <View style={styles.dayGrid}>
          {DAYS.map(day => {
            const isSelected = selectedDays.includes(day);
            return (
              <Pressable
                key={day}
                onPress={() => toggleDay(day)}
                style={[
                  styles.dayChip,
                  isSelected && { backgroundColor: accentColor + '25', borderColor: accentColor },
                ]}
              >
                <Text style={[styles.dayText, isSelected && { color: accentColor }]}>
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Shift length */}
        <Text style={[styles.sectionLabel, { marginTop: 32 }]}>Preferred shift length</Text>
        <View style={styles.shiftRow}>
          {SHIFT_LENGTHS.map(hours => {
            const isSelected = shiftLength === hours;
            return (
              <Pressable
                key={hours}
                onPress={() => setShiftLength(hours)}
                style={[
                  styles.shiftChip,
                  isSelected && { backgroundColor: accentColor, borderColor: accentColor },
                ]}
              >
                <Text style={[styles.shiftText, isSelected && { color: '#FFFFFF' }]}>
                  {hours}h
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          <PillButton variant="ghost" size="medium" onPress={() => router.back()} style={{ flex: 1 }}>
            Back
          </PillButton>
          <PillButton
            variant="primary"
            accent={isOrg ? 'purple' : 'teal'}
            size="large"
            onPress={handleComplete}
            style={{ flex: 2 }}
          >
            Finish setup
          </PillButton>
        </View>
      </View>
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
    fontSize: 13,
    fontWeight: '500',
    color: Colors.dark.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  dayGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  dayChip: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.dark.element,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
  },
  shiftRow: {
    flexDirection: 'row',
    gap: 10,
  },
  shiftChip: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.dark.element,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  shiftText: {
    fontSize: 15,
    fontWeight: '500',
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
