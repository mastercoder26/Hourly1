import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import { PillButton } from '@/components/ui/PillButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useDemoAuth, type DemoRole } from '@/context/DemoAuthContext';
import {
  isValidEmail,
  isValidPassword,
  PRESET_ORGANIZER_ACCOUNT,
  PRESET_STUDENT_ACCOUNT,
} from '@/lib/demo/demoAccounts';

type AuthMode = 'sign-in' | 'sign-up';

export default function DemoAuthScreen() {
  const router = useRouter();
  const { mode: modeParam } = useLocalSearchParams<{ mode?: string }>();
  const { signIn, signUp, signInPreset } = useDemoAuth();
  const [mode, setMode] = useState<AuthMode>(modeParam === 'sign-up' ? 'sign-up' : 'sign-in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<DemoRole>('student');
  const [error, setError] = useState<string | null>(null);

  const navigateForRole = (nextRole: DemoRole) => {
    if (nextRole === 'organizer') {
      router.dismissTo('/(org-tabs)/dashboard');
      return;
    }
    router.dismissTo('/(student-tabs)/feed');
  };

  const handleSubmit = () => {
    setError(null);
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (!isValidPassword(password)) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'sign-up') {
      const result = signUp(name, email, password, role);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      navigateForRole(role);
      return;
    }

    const result = signIn(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigateForRole(result.role);
    return;
  };

  const handlePreset = (accountId: string, presetRole: DemoRole) => {
    setError(null);
    signInPreset(accountId);
    navigateForRole(presetRole);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.top}>
        <ScreenHeader variant="back" accent="teal" onPress={() => router.back()} />
        <Text style={styles.title}>{mode === 'sign-in' ? 'Sign in' : 'Create account'}</Text>
        <Text style={styles.subtitle}>Demo mode — saved only for this session</Text>
      </View>

      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        {mode === 'sign-up' ? (
          <>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Alex Rivera"
              placeholderTextColor={Colors.dark.textTertiary}
              autoCapitalize="words"
            />
            <Text style={styles.label}>Role</Text>
            <View style={styles.roleRow}>
              <PillButton
                variant={role === 'student' ? 'primary' : 'default'}
                accent="teal"
                size="small"
                onPress={() => setRole('student')}
                style={styles.roleButton}
              >
                Student
              </PillButton>
              <PillButton
                variant={role === 'organizer' ? 'primary' : 'default'}
                accent="purple"
                size="small"
                onPress={() => setRole('organizer')}
                style={styles.roleButton}
              >
                Organizer
              </PillButton>
            </View>
          </>
        ) : null}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@school.edu"
          placeholderTextColor={Colors.dark.textTertiary}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          placeholderTextColor={Colors.dark.textTertiary}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PillButton variant="primary" accent="teal" fullWidth size="large" onPress={handleSubmit}>
          {mode === 'sign-in' ? 'Sign in' : 'Create account'}
        </PillButton>

        <PillButton
          variant="ghost"
          fullWidth
          size="medium"
          onPress={() => {
            setError(null);
            setMode(prev => (prev === 'sign-in' ? 'sign-up' : 'sign-in'));
          }}
        >
          {mode === 'sign-in' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </PillButton>

        <Text style={styles.sectionLabel}>Quick demo accounts</Text>
        <PillButton
          variant="secondary"
          fullWidth
          size="medium"
          onPress={() => handlePreset(PRESET_STUDENT_ACCOUNT.id, 'student')}
        >
          Alex Rivera (Student) — demo123
        </PillButton>
        <PillButton
          variant="secondary"
          fullWidth
          size="medium"
          onPress={() => handlePreset(PRESET_ORGANIZER_ACCOUNT.id, 'organizer')}
        >
          Green Earth Foundation (Organizer) — demo123
        </PillButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
    paddingTop: 56,
  },
  top: {
    paddingHorizontal: Spacing.screenHorizontal,
    gap: Spacing.sm,
  },
  title: {
    ...Typography.title,
    color: Colors.dark.textPrimary,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.lg,
  },
  form: {
    paddingHorizontal: Spacing.screenHorizontalWide,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
  },
  label: {
    ...Typography.header,
    marginTop: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.dark.element,
    borderRadius: 16,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    fontSize: 16,
    color: Colors.dark.textPrimary,
  },
  roleRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  roleButton: {
    flex: 1,
  },
  error: {
    ...Typography.bodySmall,
    color: Colors.error,
  },
  sectionLabel: {
    ...Typography.header,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xs,
  },
});
