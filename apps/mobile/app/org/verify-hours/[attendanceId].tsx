// Demo organizer: single shift verification (check-in method, times, approve)
import React, { useCallback, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import type { CheckInMethod } from '@hourly/shared';
import {
  demoApplicants,
  demoStudent,
  DEMO_ORG_PRIMARY_ID,
  DEMO_STUDENT_ID,
} from '@hourly/shared';
import { Colors, CardStyle, Shadows } from '../../../constants/colors';
import { Typography } from '../../../constants/typography';
import { Card } from '../../../components/ui/Card';
import { PillButton } from '../../../components/ui/PillButton';
import { useDemoStore } from '../../../lib/demo/demoStore';
import { isDemoMode } from '../../../lib/dataMode';

function volunteerName(studentId: string): string {
  if (studentId === DEMO_STUDENT_ID) {
    return `${demoStudent.firstName} ${demoStudent.lastName}`;
  }
  const row = demoApplicants.find(a => a.id === studentId);
  return row ? `${row.firstName} ${row.lastName}` : studentId;
}

function labelForMethod(m?: CheckInMethod): string {
  switch (m) {
    case 'qr_scan':
      return 'QR code scan';
    case 'self_checkin_app':
      return 'Self check-in in app';
    case 'coordinator_override':
      return 'Coordinator entered times';
    case 'manual_entry':
      return 'Manual / sign-in sheet';
    default:
      return 'Recorded';
  }
}

function formatDateTime(iso?: string) {
  if (!iso) return 'N/A';
  try {
    return new Date(iso).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function VerifyHoursDetailScreen() {
  const router = useRouter();
  const { attendanceId } = useLocalSearchParams<{ attendanceId: string }>();
  const id = Array.isArray(attendanceId) ? attendanceId[0] : attendanceId;

  const opportunities = useDemoStore(s => s.opportunities);
  const attendance = useDemoStore(s => s.attendance);
  const verifyAttendance = useDemoStore(s => s.verifyAttendance);

  const record = useMemo(
    () => (id ? attendance.find(a => a.id === id) : undefined),
    [attendance, id],
  );

  const opportunity = useMemo(() => {
    if (!record) return undefined;
    return opportunities.find(o => o.id === record.opportunityId);
  }, [opportunities, record]);

  const orgValid = opportunity?.orgId === DEMO_ORG_PRIMARY_ID;
  const canAct =
    isDemoMode() &&
    record &&
    orgValid &&
    record.verificationStatus === 'PENDING';

  const name = record ? volunteerName(record.studentId) : '';

  const onApprove = useCallback(() => {
    if (!record || !canAct) return;
    Alert.alert(
      'Approve hours',
      `Verify ${record.hoursLogged}h for ${name}? This will count toward their service record.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            verifyAttendance(record.id);
            Alert.alert('Approved', 'Hours are marked verified.', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          },
        },
      ],
    );
  }, [canAct, name, record, router, verifyAttendance]);

  if (!id || !record) {
    return (
      <View style={styles.miss}>
        <Text style={styles.missTitle}>Not found</Text>
        <PillButton variant="secondary" onPress={() => router.back()}>
          Go back
        </PillButton>
      </View>
    );
  }

  if (!orgValid || record.verificationStatus !== 'PENDING') {
    return (
      <View style={styles.miss}>
        <Text style={styles.missTitle}>
          {record.verificationStatus === 'VERIFIED' ? 'Already verified' : 'Not available'}
        </Text>
        <Text style={styles.missBody}>
          This shift is not waiting on your review, or it belongs to another organization.
        </Text>
        <PillButton variant="secondary" onPress={() => router.back()}>
          Go back
        </PillButton>
      </View>
    );
  }

  const method = labelForMethod(record.checkInMethod);
  const detail = record.checkInDetail;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
        <Feather name="chevron-left" size={24} color={Colors.dark.textPrimary} />
        <Text style={styles.backText}>Pending hours</Text>
      </Pressable>

      <Text style={styles.kicker}>REVIEW SHIFT</Text>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.eventLine}>{opportunity?.title ?? 'Event'}</Text>

      <Card style={styles.methodCard}>
        <View style={styles.methodHeader}>
          <View style={styles.methodIcon}>
            <Feather
              name={record.checkInMethod === 'qr_scan' ? 'grid' : 'smartphone'}
              size={20}
              color={Colors.accent}
            />
          </View>
          <View style={styles.methodHeaderText}>
            <Text style={styles.methodLabel}>Check-in method</Text>
            <Text style={styles.methodValue}>{method}</Text>
          </View>
        </View>
        {detail ? (
          <Text style={styles.methodDetail}>{detail}</Text>
        ) : (
          <Text style={styles.methodDetail}>No extra detail on file for this demo shift.</Text>
        )}
      </Card>

      <Card style={styles.timesCard}>
        <Text style={styles.sectionLabel}>Times</Text>
        <Row icon="log-in" label="Check-in" value={formatDateTime(record.checkinTime)} />
        <Row icon="log-out" label="Check-out" value={formatDateTime(record.checkoutTime)} />
        <View style={styles.hoursBanner}>
          <Text style={styles.hoursLabel}>Hours logged (calculated)</Text>
          <Text style={styles.hoursValue}>{record.hoursLogged}h</Text>
        </View>
      </Card>

      {opportunity && (
        <Card style={styles.locCard}>
          <Text style={styles.sectionLabel}>Location (event)</Text>
          <Text style={styles.locText}>
            {opportunity.location.address}, {opportunity.location.city}, {opportunity.location.state}
          </Text>
        </Card>
      )}

      {canAct && (
        <View style={styles.actions}>
          <PillButton variant="primary" fullWidth size="large" onPress={onApprove}>
            Approve hours
          </PillButton>
          <Text style={styles.legal}>
            By approving, you confirm the check-in method and times are accurate for your organization records.
          </Text>
        </View>
      )}

      {!isDemoMode() && (
        <Text style={styles.liveNote}>
          Live mode will submit approvals to your connected backend. Use demo mode to try this screen.
        </Text>
      )}
    </ScrollView>
  );
}

function Row({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Feather name={icon} size={16} color={Colors.dark.textSecondary} />
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.base },
  content: { padding: 20, paddingTop: 48, paddingBottom: 48 },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  backText: { ...Typography.body, color: Colors.dark.textPrimary },
  kicker: { ...Typography.header, marginBottom: 4 },
  title: { ...Typography.title, color: Colors.dark.textPrimary, marginBottom: 4 },
  eventLine: { ...Typography.body, color: Colors.dark.textSecondary, marginBottom: 20 },
  methodCard: { marginBottom: 12, padding: CardStyle.paddingSmall, gap: 12, ...Shadows.card },
  methodHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodHeaderText: { flex: 1, gap: 2 },
  methodLabel: { ...Typography.tiny, color: Colors.dark.textTertiary },
  methodValue: { ...Typography.subtitle, color: Colors.dark.textPrimary },
  methodDetail: { ...Typography.caption, color: Colors.dark.textSecondary, lineHeight: 20 },
  timesCard: { marginBottom: 12, padding: CardStyle.paddingSmall, gap: 14, ...Shadows.card },
  sectionLabel: { ...Typography.header, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  rowText: { flex: 1, gap: 2 },
  rowLabel: { ...Typography.tiny, color: Colors.dark.textTertiary },
  rowValue: { ...Typography.body, color: Colors.dark.textPrimary, fontWeight: '500' },
  hoursBanner: {
    marginTop: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.dark.element,
  },
  hoursLabel: { ...Typography.caption, color: Colors.dark.textSecondary },
  hoursValue: { fontSize: 28, fontWeight: '600', color: Colors.accent, marginTop: 4 },
  locCard: { marginBottom: 20, padding: CardStyle.paddingSmall, ...Shadows.card },
  locText: { ...Typography.caption, color: Colors.dark.textSecondary, lineHeight: 20 },
  actions: { gap: 12, marginTop: 8 },
  legal: { ...Typography.tiny, color: Colors.dark.textTertiary, textAlign: 'center', lineHeight: 16 },
  liveNote: { ...Typography.caption, color: Colors.dark.textTertiary, textAlign: 'center', marginTop: 12 },
  miss: { flex: 1, backgroundColor: Colors.dark.base, padding: 24, justifyContent: 'center', gap: 12 },
  missTitle: { ...Typography.title, color: Colors.dark.textPrimary },
  missBody: { ...Typography.caption, color: Colors.dark.textSecondary },
});
