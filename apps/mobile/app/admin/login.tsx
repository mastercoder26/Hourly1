import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Text } from '@/components/Themed';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { PillButton } from '@/components/ui/PillButton';
import { trpc } from '@/lib/trpc';
import { fetchApiHealth, isApiVersionCurrent } from '@/lib/apiHealth';

function getWebStorageItem(key: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setWebStorageItem(key: string, value: string) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage write failures in demo flows.
  }
}

function deleteWebStorageItem(key: string) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage delete failures in demo flows.
  }
}

export default function AdminLoginScreen() {
  const router = useRouter();
  const loginMutation = trpc.admin.login.useMutation();
  const configQuery = trpc.admin.checkConfig.useQuery(undefined, {
    retry: 1,
    staleTime: 60_000,
  });

  const [checkingExistingSession, setCheckingExistingSession] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [apiHealthWarning, setApiHealthWarning] = useState('');

  useEffect(() => {
    let active = true;

    async function loadHealth() {
      const health = await fetchApiHealth();
      if (!active) {
        return;
      }

      if (!health) {
        setApiHealthWarning('Could not reach the API server. It may be waking up — wait a moment and try again.');
        return;
      }

      if (!isApiVersionCurrent(health)) {
        setApiHealthWarning(
          'The live API is running an older build. Redeploy hourly1-api on Render from the latest main branch, then retry admin login.',
        );
        return;
      }

      if (health.adminConfigured === false) {
        setApiHealthWarning(
          'Admin password is not set on the API. Add ADMIN_DASHBOARD_PASSWORD in Render environment variables and redeploy.',
        );
      }
    }

    loadHealth();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    async function bootstrap() {
      let existingToken: string | null = null;

      try {
        existingToken = await SecureStore.getItemAsync('hourly_admin_token');
      } catch {
        existingToken = null;
      }

      if (!existingToken) {
        existingToken = getWebStorageItem('hourly_admin_token');
      }

      const expiresAt =
        (await SecureStore.getItemAsync('hourly_admin_expires_at').catch(() => null)) ??
        getWebStorageItem('hourly_admin_expires_at');
      const sessionExpired = expiresAt ? Date.parse(expiresAt) <= Date.now() : false;

      if (existingToken && !sessionExpired) {
        router.replace('/admin/dashboard' as never);
      } else if (existingToken && sessionExpired) {
        await Promise.all([
          SecureStore.deleteItemAsync('hourly_admin_token').catch(() => undefined),
          SecureStore.deleteItemAsync('hourly_admin_email').catch(() => undefined),
          SecureStore.deleteItemAsync('hourly_admin_expires_at').catch(() => undefined),
        ]);
        deleteWebStorageItem('hourly_admin_token');
        deleteWebStorageItem('hourly_admin_email');
        deleteWebStorageItem('hourly_admin_expires_at');
      }

      if (isActive) {
        setCheckingExistingSession(false);
      }
    }

    bootstrap();

    return () => {
      isActive = false;
    };
  }, [router]);

  async function handleAdminLogin() {
    setError('');

    try {
      const result = await loginMutation.mutateAsync({
        email: email.trim(),
        password,
      });

      await Promise.all([
        SecureStore.setItemAsync('hourly_admin_token', result.token).catch(() => undefined),
        SecureStore.setItemAsync('hourly_admin_email', result.email).catch(() => undefined),
        SecureStore.setItemAsync('hourly_admin_expires_at', result.expiresAt).catch(() => undefined),
      ]);

      setWebStorageItem('hourly_admin_token', result.token);
      setWebStorageItem('hourly_admin_email', result.email);
      setWebStorageItem('hourly_admin_expires_at', result.expiresAt);
      router.replace('/admin/dashboard' as never);
    } catch (err: unknown) {
      const message =
        typeof err === 'object' &&
        err !== null &&
        'message' in err &&
        typeof (err as { message?: unknown }).message === 'string'
          ? (err as { message: string }).message
          : 'Admin sign in failed';

      if (message.toLowerCase().includes('invalid admin credentials')) {
        setError(
          configQuery.data?.passwordConfigured === false
            ? 'Admin password is not configured on the API server. Set ADMIN_DASHBOARD_PASSWORD in Render, redeploy, then try again.'
            : 'Invalid admin credentials. Use the email and password configured in Render (ADMIN_DASHBOARD_EMAIL / ADMIN_DASHBOARD_PASSWORD).',
        );
        return;
      }

      setError(message);
    }
  }

  if (checkingExistingSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.teal} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.title}>Admin Portal</Text>
        <Text style={styles.subtitle}>Sign in with authorized admin credentials.</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Admin email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="admin@hourly.app"
              placeholderTextColor={Colors.dark.textTertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Enter admin password"
              placeholderTextColor={Colors.dark.textTertiary}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {apiHealthWarning ? <Text style={styles.warningText}>{apiHealthWarning}</Text> : null}

          {configQuery.data?.passwordConfigured === false && !apiHealthWarning ? (
            <Text style={styles.warningText}>
              API admin login is not configured yet. Add ADMIN_DASHBOARD_PASSWORD on Render and redeploy the API.
            </Text>
          ) : null}

          <PillButton
            variant="primary"
            fullWidth
            size="large"
            onPress={handleAdminLogin}
            disabled={loginMutation.isPending || !email.trim() || !password}
          >
            {loginMutation.isPending ? 'Signing in...' : 'Enter Dashboard'}
          </PillButton>

          <Text style={styles.note}>
            Credentials are validated server-side via API env vars.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.dark.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  backText: {
    color: Colors.dark.textSecondary,
    fontFamily: Typography.label.fontFamily,
    fontSize: 15,
  },
  title: {
    color: Colors.dark.textPrimary,
    fontFamily: Typography.valueLarge.fontFamily,
    fontSize: Typography.valueLarge.fontSize,
    fontWeight: Typography.valueLarge.fontWeight,
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.dark.textSecondary,
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
    marginBottom: 28,
  },
  form: {
    gap: 18,
  },
  inputGroup: {
    gap: 10,
  },
  label: {
    color: Colors.dark.textSecondary,
    fontFamily: Typography.sub.fontFamily,
    fontSize: Typography.sub.fontSize,
    letterSpacing: Typography.sub.letterSpacing,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: Colors.dark.element,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.dark.textPrimary,
    fontSize: 16,
  },
  errorText: {
    color: Colors.error,
    fontFamily: Typography.body.fontFamily,
    fontSize: 13,
  },
  warningText: {
    color: Colors.warning,
    fontFamily: Typography.body.fontFamily,
    fontSize: 13,
    lineHeight: 18,
  },
  note: {
    color: Colors.dark.textTertiary,
    fontFamily: Typography.caption.fontFamily,
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight,
    textAlign: 'center',
    marginTop: 8,
  },
});
