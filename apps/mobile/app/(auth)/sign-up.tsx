// Auth — Sign Up Screen
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Pressable, ScrollView } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { PillButton } from '../../components/ui/PillButton';

export default function SignUpScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: string }>();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    // Mock sign-up — connects to Clerk in Phase 2
    router.replace(`/onboarding?role=${role || 'student'}`);
  };

  const isStudent = role !== 'organizer';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeIn.delay(100)}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.springify().damping(18).mass(0.8).delay(200)}>
          <Text style={styles.title}>Create {isStudent ? 'student' : 'organizer'} account</Text>
          <Text style={styles.subtitle}>Join Hourly and start {isStudent ? 'volunteering' : 'managing volunteers'}</Text>
        </Animated.View>

        <Animated.View style={styles.form} entering={FadeInDown.springify().damping(18).mass(0.8).delay(350)}>
          <View style={styles.nameRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>First name</Text>
              <TextInput
                style={styles.input}
                placeholder="Alex"
                placeholderTextColor={Colors.dark.textTertiary}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Last name</Text>
              <TextInput
                style={styles.input}
                placeholder="Rivera"
                placeholderTextColor={Colors.dark.textTertiary}
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="you@school.edu"
                placeholderTextColor={Colors.dark.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="At least 8 characters"
              placeholderTextColor={Colors.dark.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </Animated.View>

        <Animated.View style={styles.actions} entering={FadeInDown.springify().damping(18).mass(0.8).delay(500)}>
          <PillButton variant="primary" fullWidth size="large" onPress={handleSignUp}>
            Create account
          </PillButton>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <PillButton variant="default" fullWidth size="large" onPress={handleSignUp}>
            Sign up with Google
          </PillButton>

          <Text style={styles.terms}>
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.element,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  closeText: {
    fontSize: 16,
    color: Colors.dark.textPrimary,
  },
  title: {
    fontFamily: Typography.valueLarge.fontFamily,
    fontSize: Typography.valueLarge.fontSize,
    fontWeight: Typography.valueLarge.fontWeight,
    letterSpacing: Typography.valueLarge.letterSpacing,
    lineHeight: Typography.valueLarge.lineHeight,
    color: Colors.dark.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
    color: Colors.dark.textSecondary,
    marginBottom: 40,
  },
  form: {
    gap: 24,
    marginBottom: 32,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 16,
  },
  inputGroup: {
    gap: 12,
  },
  label: {
    fontFamily: Typography.sub.fontFamily,
    fontSize: Typography.sub.fontSize,
    fontWeight: Typography.sub.fontWeight as any,
    letterSpacing: Typography.sub.letterSpacing,
    textTransform: 'uppercase',
    color: Colors.dark.textSecondary,
  },
  input: {
    fontFamily: Typography.body.fontFamily,
    backgroundColor: Colors.dark.element,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: Colors.dark.textPrimary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  actions: {
    gap: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.dark.element,
  },
  dividerText: {
    fontFamily: Typography.sub.fontFamily,
    fontSize: Typography.sub.fontSize,
    letterSpacing: Typography.sub.letterSpacing,
    textTransform: 'uppercase',
    color: Colors.dark.textTertiary,
  },
  terms: {
    fontFamily: Typography.caption.fontFamily,
    fontSize: Typography.caption.fontSize,
    color: Colors.dark.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 16,
  },
});
