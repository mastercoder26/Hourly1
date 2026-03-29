// Auth — Sign In Screen
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { PillButton } from '../../components/ui/PillButton';
import { useSignIn } from '@clerk/expo/legacy';
import { enterFade, enterRise } from '../../lib/motion';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
  const isClerkConfigured = clerkKey.length > 0 && !clerkKey.includes('PLACEHOLDER');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    if (!isClerkConfigured) {
      router.replace('/(student-tabs)/feed');
      return;
    }
    if (!isLoaded) return;

    setError('');
    setIsSubmitting(true);
    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace('/(student-tabs)/feed');
      } else {
        setError('Sign in could not be completed.');
      }
    } catch (err: unknown) {
      const message =
        typeof err === 'object' &&
        err !== null &&
        'errors' in err &&
        Array.isArray((err as { errors?: Array<{ message?: string }> }).errors)
          ? (err as { errors: Array<{ message?: string }> }).errors[0]?.message
          : null;
      setError(message ?? 'Sign in failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Animated.View entering={enterFade(40)}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
          >
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={enterRise(120)}>
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>Welcome back to Hourly</Text>
        </Animated.View>

        <Animated.View style={styles.form} entering={enterRise(200)}>
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
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.dark.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <PillButton variant="ghost" size="small" style={{ alignSelf: 'flex-end', paddingRight: 0 }}>
            <Text style={{ ...Typography.label, color: Colors.dark.textSecondary }}>Forgot password?</Text>
          </PillButton>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </Animated.View>

        <Animated.View style={styles.actions} entering={enterRise(280)}>
          <PillButton
            variant="primary"
            fullWidth
            size="large"
            onPress={handleSignIn}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </PillButton>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <PillButton
            variant="default"
            fullWidth
            size="large"
            onPress={handleSignIn}
          >
            Continue with Google
          </PillButton>

          <PillButton
            variant="ghost"
            fullWidth
            size="medium"
            onPress={() => router.replace('/(student-tabs)/feed')}
          >
            Continue as guest
          </PillButton>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
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
  closeButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.97 }],
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
});
