// Onboarding Step 1 — School & Grade Selection
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { PillButton } from '../../components/ui/PillButton';
import { enterFade, enterRise } from '../../lib/motion';

export default function OnboardingIndex() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const isOrg = role === 'organizer';
  const [selectedGrade, setSelectedGrade] = useState<number | 'college' | null>(null);

  const handleContinue = () => {
    const roleParam = role || 'student';

    if (!selectedGrade || isOrg) {
      router.push(`/onboarding/school?role=${roleParam}`);
      return;
    }

    router.push(`/onboarding/school?role=${roleParam}&grade=${selectedGrade}`);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={styles.header} entering={enterFade(40)}>
        <ProgressBar steps={4} currentStep={0} accent="purple" />
        <PillButton
          variant="ghost"
          size="small"
          onPress={() => router.push(`/onboarding/school?role=${role || 'student'}`)}
        >
          Skip for now
        </PillButton>
      </Animated.View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <Animated.View entering={enterRise(120)}>
          <Text style={styles.stepLabel}>Step 1 of 4</Text>
          <Text style={styles.title}>
            {isOrg ? 'Tell us about your organization' : 'What school do you attend?'}
          </Text>
          <Text style={styles.subtitle}>
            {isOrg
              ? 'This helps us verify and connect you with volunteers'
              : 'This helps us match you with local opportunities'}
          </Text>
        </Animated.View>

        <Animated.View style={styles.form} entering={enterRise(200)}>
          <TextInput
            style={styles.input}
            placeholder={isOrg ? 'Organization name' : 'Search your school by name or ZIP'}
            placeholderTextColor={Colors.dark.textTertiary}
          />

          {!isOrg && (
            <View style={styles.gradeSelector}>
              <Text style={styles.gradeLabel}>Grade level</Text>
              <View style={styles.gradeGrid}>
                {[9, 10, 11, 12].map(grade => {
                  const isSelected = selectedGrade === grade;
                  return (
                    <Pressable
                      key={grade}
                      onPress={() => setSelectedGrade(grade)}
                      style={({ pressed }) => [
                        styles.gradeChip,
                        isSelected && styles.gradeChipSelected,
                        pressed && styles.gradeChipPressed,
                      ]}
                    >
                      <Text style={[styles.gradeText, isSelected && styles.gradeTextSelected]}>{grade}th</Text>
                    </Pressable>
                  );
                })}
                <Pressable
                  onPress={() => setSelectedGrade('college')}
                  style={({ pressed }) => [
                    styles.gradeChip,
                    selectedGrade === 'college' && styles.gradeChipSelected,
                    pressed && styles.gradeChipPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.gradeText,
                      selectedGrade === 'college' && styles.gradeTextSelected,
                    ]}
                  >
                    College
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {isOrg && (
            <>
              <TextInput
                style={styles.input}
                placeholder="EIN (e.g. 12-3456789)"
                placeholderTextColor={Colors.dark.textTertiary}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Organization mission (optional)"
                placeholderTextColor={Colors.dark.textTertiary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </>
          )}
        </Animated.View>
      </ScrollView>

      <Animated.View style={styles.footer} entering={enterRise(280)}>
        <PillButton
          variant="primary"
          fullWidth
          size="large"
          onPress={handleContinue}
        >
          Continue
        </PillButton>
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
  },
  contentInner: {
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
    lineHeight: Typography.title.lineHeight,
  },
  subtitle: {
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
    color: Colors.dark.textSecondary,
    marginBottom: 32,
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  input: {
    fontFamily: Typography.body.fontFamily,
    backgroundColor: Colors.dark.element,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: Colors.dark.textPrimary,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
  },
  gradeSelector: {
    gap: 12,
  },
  gradeLabel: {
    fontFamily: Typography.sub.fontFamily,
    fontSize: Typography.sub.fontSize,
    fontWeight: Typography.sub.fontWeight as any,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gradeChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: Colors.dark.element,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  gradeChipSelected: {
    backgroundColor: Colors.purpleSoft,
    borderColor: Colors.purple,
  },
  gradeChipPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  gradeText: {
    fontFamily: Typography.label.fontFamily,
    fontSize: Typography.label.fontSize,
    fontWeight: Typography.label.fontWeight,
    color: Colors.dark.textSecondary,
  },
  gradeTextSelected: {
    color: Colors.purple,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
});
