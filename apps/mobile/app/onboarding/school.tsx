// Onboarding Step 2 — School confirmation (intermediate step)
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';;
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/colors';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { PillButton } from '../../components/ui/PillButton';

export default function SchoolStep() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const isOrg = role === 'organizer';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProgressBar steps={4} currentStep={1} accent={isOrg ? 'purple' : 'teal'} />
        <PillButton variant="ghost" size="small" onPress={() => router.push(`/onboarding/interests?role=${role || 'student'}`)}>
          Skip for now
        </PillButton>
      </View>

      <View style={styles.content}>
        <Text style={styles.stepLabel}>Step 2 of 4</Text>
        <Text style={styles.title}>
          {isOrg ? 'Where are you located?' : 'Confirm your school'}
        </Text>
        <Text style={styles.subtitle}>
          {isOrg
            ? 'Help volunteers find opportunities near them'
            : 'We\'ll use this to find nearby opportunities'}
        </Text>

        {/* Mock school cards */}
        <View style={styles.schoolCard}>
          <Text style={styles.schoolEmoji}>🏫</Text>
          <View>
            <Text style={styles.schoolName}>Austin High School</Text>
            <Text style={styles.schoolAddress}>1715 W Cesar Chavez St, Austin, TX 78703</Text>
          </View>
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
            onPress={() => router.push(`/onboarding/interests?role=${role || 'student'}`)}
            style={{ flex: 2 }}
          >
            Continue
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
  schoolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: Colors.teal,
  },
  schoolEmoji: {
    fontSize: 32,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    marginBottom: 4,
  },
  schoolAddress: {
    fontSize: 13,
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
