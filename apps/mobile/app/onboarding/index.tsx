// Onboarding Step 1 — School & Grade Selection
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text } from '@/components/Themed';;
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/colors';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { PillButton } from '../../components/ui/PillButton';

export default function OnboardingIndex() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const isOrg = role === 'organizer';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProgressBar steps={4} currentStep={0} accent={isOrg ? 'purple' : 'teal'} />
        <PillButton variant="ghost" size="small" onPress={() => router.push('/onboarding/school')}>
          Skip for now
        </PillButton>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <Text style={styles.stepLabel}>Step 1 of 4</Text>
        <Text style={styles.title}>
          {isOrg ? 'Tell us about your organization' : 'What school do you attend?'}
        </Text>
        <Text style={styles.subtitle}>
          {isOrg
            ? 'This helps us verify and connect you with volunteers'
            : 'This helps us match you with local opportunities'}
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder={isOrg ? 'Organization name' : 'Search your school by name or ZIP'}
            placeholderTextColor={Colors.dark.textTertiary}
          />

          {!isOrg && (
            <View style={styles.gradeSelector}>
              <Text style={styles.gradeLabel}>Grade level</Text>
              <View style={styles.gradeGrid}>
                {[9, 10, 11, 12].map(grade => (
                  <Pressable key={grade} style={styles.gradeChip}>
                    <Text style={styles.gradeText}>{grade}th</Text>
                  </Pressable>
                ))}
                <Pressable style={styles.gradeChip}>
                  <Text style={styles.gradeText}>College</Text>
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
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PillButton
          variant="primary"
          accent={isOrg ? 'purple' : 'teal'}
          fullWidth
          size="large"
          onPress={() => router.push(`/onboarding/school?role=${role || 'student'}`)}
        >
          Continue
        </PillButton>
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
  },
  contentInner: {
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
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    marginBottom: 32,
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: Colors.dark.element,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
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
    fontSize: 13,
    fontWeight: '500',
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
  },
  gradeText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
});
