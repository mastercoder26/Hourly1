// Modal settings sub-screens (local state until API is wired)
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Switch, Linking, Platform } from 'react-native';
import { Text } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { PillButton } from '../../components/ui/PillButton';
import Constants from 'expo-constants';

const PRIVACY_URL =
  (Constants.expoConfig?.extra as { privacyPolicyUrl?: string } | undefined)?.privacyPolicyUrl ??
  'https://example.com/privacy';

export default function SettingsScreen() {
  const router = useRouter();
  const { screen } = useLocalSearchParams<{ screen: string }>();
  const key = Array.isArray(screen) ? screen[0] : screen;

  const [pushApps, setPushApps] = useState(true);
  const [pushReminders, setPushReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const close = () => router.back();

  const title =
    key === 'notifications'
      ? 'Notifications'
      : key === 'appearance'
        ? 'Appearance'
        : key === 'privacy'
          ? 'Privacy'
          : key === 'help'
            ? 'Help & support'
            : key === 'terms'
              ? 'Terms of service'
              : key === 'impact'
                ? 'Impact reports'
                : key === 'team'
                  ? 'Team members'
                  : key === 'edit'
                    ? 'Edit profile'
                    : key === 'org-settings'
                      ? 'Organization settings'
                      : 'Settings';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={close} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {key === 'notifications' && (
          <Card style={styles.card}>
            <RowToggle label="Push - application updates" value={pushApps} onChange={setPushApps} />
            <RowToggle label="Push - shift reminders" value={pushReminders} onChange={setPushReminders} />
            <Text style={styles.hint}>Notification preferences are saved on this device.</Text>
          </Card>
        )}

        {key === 'appearance' && (
          <Card style={styles.card}>
            <RowToggle label="Dark mode" value={darkMode} onChange={setDarkMode} />
            <Text style={styles.hint}>Display preference is saved on this device.</Text>
          </Card>
        )}

        {key === 'privacy' && (
          <Card style={styles.card}>
            <Text style={styles.para}>
              Hourly collects only what is needed to verify volunteer hours. In production, your school and
              organizations see aggregated progress - never your private messages as contact info.
            </Text>
            <PillButton variant="secondary" fullWidth onPress={() => Linking.openURL(PRIVACY_URL)}>
              Open privacy policy
            </PillButton>
          </Card>
        )}

        {key === 'help' && (
          <Card style={styles.card}>
            <Text style={styles.para}>
              For account help, email support@hourly.app (placeholder).
            </Text>
            <PillButton variant="secondary" fullWidth onPress={() => Linking.openURL('mailto:support@hourly.app')}>
              Email support
            </PillButton>
          </Card>
        )}

        {key === 'terms' && (
          <Card style={styles.card}>
            <Text style={styles.para}>
              Terms of use will live on your marketing site. Open a placeholder page to simulate the flow.
            </Text>
            <PillButton variant="secondary" fullWidth onPress={() => Linking.openURL('https://example.com/terms')}>
              Open terms (placeholder)
            </PillButton>
          </Card>
        )}

        {key === 'impact' && (
          <Card style={styles.card}>
            <Text style={styles.para}>
              Export-ready impact summaries will connect here when your backend is linked. Totals match your
              dashboard.
            </Text>
            <PillButton variant="primary" fullWidth onPress={() => Linking.openURL('https://example.com/report.pdf')}>
              Preview sample PDF (placeholder)
            </PillButton>
          </Card>
        )}

        {key === 'team' && (
          <Card style={styles.card}>
            <Text style={styles.para}>
              Invite coordinators and viewers by email once your auth provider and API are connected.
            </Text>
          </Card>
        )}

        {key === 'edit' && (
          <Card style={styles.card}>
            <Text style={styles.para}>
              Profile fields sync to your backend in live mode. Edit the seed in @hourly/shared or use Clerk user
              metadata once connected.
            </Text>
          </Card>
        )}

        {key === 'org-settings' && (
          <Card style={styles.card}>
            <Text style={styles.para}>
              Organization defaults, branding, and verification status will be editable here against the API in
              production.
            </Text>
          </Card>
        )}

        {!['notifications', 'appearance', 'privacy', 'help', 'terms', 'impact', 'team', 'edit', 'org-settings'].includes(
          key ?? '',
        ) && (
          <Text style={styles.para}>Unknown screen.</Text>
        )}
      </ScrollView>
    </View>
  );
}

function RowToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: Colors.dark.element, true: Colors.teal }}
        thumbColor={Platform.OS === 'ios' ? undefined : Colors.dark.textPrimary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.base },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.element,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.element,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { fontSize: 16, color: Colors.dark.textPrimary },
  headerTitle: { fontSize: 17, fontWeight: '500', color: Colors.dark.textPrimary },
  body: { padding: 20, paddingBottom: 40 },
  card: { padding: 20, gap: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowLabel: { flex: 1, fontSize: 15, color: Colors.dark.textPrimary },
  hint: { fontSize: 13, color: Colors.dark.textSecondary },
  para: { fontSize: 15, color: Colors.dark.textSecondary, lineHeight: 22 },
});
