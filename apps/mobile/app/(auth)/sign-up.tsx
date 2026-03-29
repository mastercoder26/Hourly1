// Auth — Sign Up Screen
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Pressable, ScrollView } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { PillButton } from '../../components/ui/PillButton';
import { useSignUp } from '@clerk/expo/legacy';

export default function SignUpScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: string }>();
  const { signUp, setActive, isLoaded } = useSignUp();

  const selectedRole = role === 'organizer' ? 'organizer' : 'student';
  const onboardingRoute = `/onboarding?role=${selectedRole}`;
  const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
  const isClerkConfigured = clerkKey.length > 0 && !clerkKey.includes('PLACEHOLDER');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getClerkError = (err: unknown) => {
    if (
      typeof err === 'object' &&
      err !== null &&
      'errors' in err &&
      Array.isArray((err as { errors?: Array<{ message?: string }> }).errors)
    ) {
      return (err as { errors: Array<{ message?: string }> }).errors[0]?.message;
    }
    return null;
  };

  const handleSignUp = async () => {
    if (!isClerkConfigured) {
      router.replace(onboardingRoute as never);
      return;
    }
    if (!isLoaded) return;

    setError('');
    setIsSubmitting(true);

    try {
      await signUp.create({
        emailAddress: email.trim(),
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: unknown) {
      setError(getClerkError(err) ?? 'Sign up failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;

    setError('');
    setIsSubmitting(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code: code.trim() });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace(onboardingRoute as never);
      } else {
        setError('Verification could not be completed.');
      }
    } catch (err: unknown) {
      setError(getClerkError(err) ?? 'Verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStudent = selectedRole !== 'organizer';

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
          {!pendingVerification ? (
            <>
              <PillButton
                variant="primary"
                fullWidth
                size="large"
                onPress={handleSignUp}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
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
            </>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Verification code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123456"
                  placeholderTextColor={Colors.dark.textTertiary}
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                />
              </View>
              <PillButton
                variant="primary"
                fullWidth
                size="large"
                onPress={handleVerify}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Verifying...' : 'Verify email'}
              </PillButton>
              <PillButton
                variant="ghost"
                fullWidth
                size="medium"
                onPress={() => setPendingVerification(false)}
              >
                Use a different email
              </PillButton>
            </>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  errorText: {
    fontFamily: Typography.body.fontFamily,
    color: Colors.error,
    fontSize: 13,
    textAlign: 'center',
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
