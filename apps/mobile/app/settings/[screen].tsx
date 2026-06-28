// Modal settings sub-screens (demo store in demo mode)
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Switch,
  Linking,
  Platform,
  TextInput,
  Alert,
  Pressable,
} from 'react-native';
import { Text } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { Card } from '../../components/ui/Card';
import { PillButton } from '../../components/ui/PillButton';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { useDemoStore } from '../../lib/demo/demoStore';
import { isDemoMode } from '../../lib/dataMode';
import Constants from 'expo-constants';

const PRIVACY_URL =
  (Constants.expoConfig?.extra as { privacyPolicyUrl?: string } | undefined)?.privacyPolicyUrl ??
  'https://hourly.app/privacy';

const SUPPORT_EMAIL = 'support@hourly.app';

async function copySupportEmail(): Promise<boolean> {
  if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(SUPPORT_EMAIL);
    return true;
  }
  return false;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { screen } = useLocalSearchParams<{ screen: string }>();
  const key = Array.isArray(screen) ? screen[0] : screen;
  const demo = isDemoMode();

  const studentProfile = useDemoStore(s => s.studentProfile);
  const orgProfile = useDemoStore(s => s.orgProfile);
  const teamMembers = useDemoStore(s => s.teamMembers);
  const notificationPrefs = useDemoStore(s => s.notificationPrefs);
  const appearancePrefs = useDemoStore(s => s.appearancePrefs);
  const updateStudentProfile = useDemoStore(s => s.updateStudentProfile);
  const updateOrgProfile = useDemoStore(s => s.updateOrgProfile);
  const addTeamMember = useDemoStore(s => s.addTeamMember);
  const removeTeamMember = useDemoStore(s => s.removeTeamMember);
  const setNotificationPrefs = useDemoStore(s => s.setNotificationPrefs);
  const setAppearancePrefs = useDemoStore(s => s.setAppearancePrefs);
  const opportunities = useDemoStore(s => s.opportunities);
  const attendance = useDemoStore(s => s.attendance);

  const [firstName, setFirstName] = useState(studentProfile.firstName);
  const [lastName, setLastName] = useState(studentProfile.lastName);
  const [school, setSchool] = useState(studentProfile.school);
  const [orgName, setOrgName] = useState(orgProfile.name);
  const [orgMission, setOrgMission] = useState(orgProfile.mission);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');

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

  const verifiedHours = attendance.filter(a => a.verificationStatus === 'VERIFIED').length;
  const orgHours = attendance
    .filter(a => opportunities.some(o => o.id === a.opportunityId && o.orgId === orgProfile.id))
    .reduce((sum, a) => sum + a.hoursLogged, 0);

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <ScreenHeader variant="close" title={title} onPress={close} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {key === 'notifications' && (
          <Card style={styles.card}>
            <RowToggle
              label="Push - application updates"
              value={notificationPrefs.pushApps}
              onChange={value => setNotificationPrefs({ pushApps: value })}
            />
            <RowToggle
              label="Push - shift reminders"
              value={notificationPrefs.pushReminders}
              onChange={value => setNotificationPrefs({ pushReminders: value })}
            />
            <Text style={styles.hint}>
              {demo ? 'Saved for this demo session only.' : 'Notification preferences are saved on this device.'}
            </Text>
          </Card>
        )}

        {key === 'appearance' && (
          <Card style={styles.card}>
            <RowToggle
              label="Dark mode"
              value={appearancePrefs.darkMode}
              onChange={value => setAppearancePrefs({ darkMode: value })}
            />
            <Text style={styles.hint}>
              {demo ? 'Saved for this demo session only.' : 'Display preference is saved on this device.'}
            </Text>
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
              For account help, email us at{' '}
              <Text style={styles.email}>{SUPPORT_EMAIL}</Text>
            </Text>
            <Pressable
              onPress={async () => {
                const copied = await copySupportEmail();
                if (copied) {
                  Alert.alert('Copied', `${SUPPORT_EMAIL} copied to clipboard.`);
                  return;
                }
                if (Platform.OS === 'web') {
                  Alert.alert('Support email', SUPPORT_EMAIL);
                  return;
                }
                Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
              }}
              style={styles.copyRow}
            >
              <Text style={styles.copyLabel}>Copy email address</Text>
            </Pressable>
            {Platform.OS !== 'web' ? (
              <PillButton
                variant="secondary"
                fullWidth
                onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
              >
                Email support
              </PillButton>
            ) : null}
          </Card>
        )}

        {key === 'terms' && (
          <Card style={styles.card}>
            <Text style={styles.para}>Review the Hourly terms of use for students and organizations.</Text>
            <PillButton variant="secondary" fullWidth onPress={() => Linking.openURL('https://hourly.app/terms')}>
              Open terms
            </PillButton>
          </Card>
        )}

        {key === 'impact' && (
          <Card style={styles.card}>
            <Text style={styles.para}>
              Impact summary for {orgProfile.name}: {orgHours.toFixed(1)} volunteer hours logged across{' '}
              {opportunities.filter(o => o.orgId === orgProfile.id).length} active listings. {verifiedHours}{' '}
              attendance records verified in this session.
            </Text>
            <PillButton
              variant="primary"
              accent="purple"
              fullWidth
              onPress={() =>
                Alert.alert(
                  'Impact report ready',
                  `Exported ${orgHours.toFixed(1)} hours and ${verifiedHours} verified records for this demo session.`,
                )
              }
            >
              Generate session report
            </PillButton>
          </Card>
        )}

        {key === 'team' && (
          <Card style={styles.card}>
            {teamMembers.map(member => (
              <View key={member.id} style={styles.teamRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.teamName}>{member.name}</Text>
                  <Text style={styles.teamSub}>
                    {member.role} • {member.email}
                  </Text>
                </View>
                <PillButton variant="ghost" size="small" onPress={() => removeTeamMember(member.id)}>
                  Remove
                </PillButton>
              </View>
            ))}
            <Text style={styles.label}>Invite teammate</Text>
            <TextInput
              style={styles.input}
              value={memberName}
              onChangeText={setMemberName}
              placeholder="Name"
              placeholderTextColor={Colors.dark.textTertiary}
            />
            <TextInput
              style={styles.input}
              value={memberEmail}
              onChangeText={setMemberEmail}
              placeholder="Email"
              placeholderTextColor={Colors.dark.textTertiary}
              autoCapitalize="none"
            />
            <PillButton
              variant="secondary"
              fullWidth
              onPress={() => {
                if (!memberName.trim() || !memberEmail.trim()) {
                  Alert.alert('Missing info', 'Enter a name and email.');
                  return;
                }
                addTeamMember({
                  name: memberName.trim(),
                  email: memberEmail.trim(),
                  role: 'Viewer',
                });
                setMemberName('');
                setMemberEmail('');
              }}
            >
              Add teammate
            </PillButton>
          </Card>
        )}

        {key === 'edit' && (
          <Card style={styles.card}>
            <Text style={styles.label}>First name</Text>
            <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
            <Text style={styles.label}>Last name</Text>
            <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
            <Text style={styles.label}>School</Text>
            <TextInput style={styles.input} value={school} onChangeText={setSchool} />
            <PillButton
              variant="primary"
              accent="teal"
              fullWidth
              onPress={() => {
                updateStudentProfile({
                  firstName: firstName.trim(),
                  lastName: lastName.trim(),
                  school: school.trim(),
                });
                close();
              }}
            >
              Save profile
            </PillButton>
          </Card>
        )}

        {key === 'org-settings' && (
          <Card style={styles.card}>
            <Text style={styles.label}>Organization name</Text>
            <TextInput style={styles.input} value={orgName} onChangeText={setOrgName} />
            <Text style={styles.label}>Mission</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={orgMission}
              onChangeText={setOrgMission}
              multiline
            />
            <PillButton
              variant="primary"
              accent="purple"
              fullWidth
              onPress={() => {
                updateOrgProfile({
                  name: orgName.trim(),
                  mission: orgMission.trim(),
                });
                close();
              }}
            >
              Save organization
            </PillButton>
          </Card>
        )}

        {!['notifications', 'appearance', 'privacy', 'help', 'terms', 'impact', 'team', 'edit', 'org-settings'].includes(
          key ?? '',
        ) && <Text style={styles.para}>Unknown screen.</Text>}
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
  headerWrap: { paddingTop: 56 },
  body: { padding: Spacing.screenHorizontal, paddingBottom: Spacing.xxxl },
  card: { padding: Spacing.xl, gap: Spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  rowLabel: { flex: 1, fontSize: 15, color: Colors.dark.textPrimary },
  hint: { ...Typography.bodySmall, color: Colors.dark.textSecondary },
  para: { ...Typography.body, color: Colors.dark.textSecondary },
  email: { color: Colors.dark.textPrimary, fontWeight: '600' },
  copyRow: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 16,
    backgroundColor: Colors.dark.element,
    alignItems: 'center',
  },
  copyLabel: { fontSize: 15, fontWeight: '600', color: Colors.dark.textPrimary },
  label: { ...Typography.header },
  input: {
    backgroundColor: Colors.dark.element,
    borderRadius: 16,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    fontSize: 16,
    color: Colors.dark.textPrimary,
  },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.divider,
  },
  teamName: { ...Typography.label, color: Colors.dark.textPrimary },
  teamSub: { ...Typography.caption },
});
