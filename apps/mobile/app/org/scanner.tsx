// QR Scanner — organizer scans volunteer QR; calls `attendance.checkInByQr` in live mode.
import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, Alert, TextInput, Platform } from 'react-native';
import { Text } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { PillButton } from '../../components/ui/PillButton';
import { trpc } from '../../lib/trpc';
import { isDemoMode, isLiveMode } from '../../lib/dataMode';
import { useDemoStore } from '../../lib/demo/demoStore';

export default function ScannerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ opportunityId?: string }>();
  const opportunityId = Array.isArray(params.opportunityId) ? params.opportunityId[0] : params.opportunityId;

  const [permission, requestPermission] = useCameraPermissions();
  const [lastPayload, setLastPayload] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [checkedInCount, setCheckedInCount] = useState(0);

  const checkInMutation = trpc.attendance.checkInByQr.useMutation();
  const checkInByQrPayload = useDemoStore(s => s.checkInByQrPayload);
  const demoAttendance = useDemoStore(s => s.attendance);
  const rosterQuery = trpc.attendance.listForOpportunity.useQuery(
    { opportunityId: opportunityId ?? '' },
    { enabled: isLiveMode() && Boolean(opportunityId) },
  );

  const roster = rosterQuery.data ?? [];

  const runCheckIn = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      if (isDemoMode()) {
        const record = checkInByQrPayload(trimmed, opportunityId);
        if (record) {
          setLastPayload(trimmed);
          setCheckedInCount(c => c + 1);
        }
        return;
      }

      checkInMutation.mutate(
        { raw: trimmed },
        {
          onSuccess: () => {
            setLastPayload(trimmed);
            setCheckedInCount(c => c + 1);
            void rosterQuery.refetch();
            Alert.alert('Checked in', 'Volunteer check-in recorded.');
          },
          onError: err => {
            Alert.alert('Check-in failed', err.message);
          },
        },
      );
    },
    [checkInByQrPayload, checkInMutation, opportunityId, rosterQuery],
  );

  const onBarcodeScanned = useCallback(
    (e: { data: string }) => {
      runCheckIn(e.data);
    },
    [runCheckIn],
  );

  const showCamera = useMemo(() => permission?.granted === true, [permission?.granted]);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.closeButton}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>

      <Text style={styles.title}>Scan check-in</Text>
      <Text style={styles.subtitle}>Point camera at volunteer&apos;s QR code</Text>

      {isLiveMode() && !opportunityId ? (
        <Card style={styles.resultCard}>
          <Text style={styles.hint}>
            Open the scanner from an active listing (dashboard) so we know which shift this scan belongs to.
          </Text>
        </Card>
      ) : null}

      {permission && !permission.granted ? (
        <Card style={styles.resultCard}>
          <Text style={styles.hint}>Camera permission is required to scan QR codes on device.</Text>
          <PillButton variant="primary" accent="purple" fullWidth onPress={() => void requestPermission()}>
            Grant camera access
          </PillButton>
        </Card>
      ) : null}

      {showCamera ? (
        <View style={styles.cameraWrap}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={onBarcodeScanned}
          />
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>
      ) : (
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraText}>
            {Platform.OS === 'web' ? 'Camera scanning runs on iOS/Android builds.' : 'Camera preview'}
          </Text>
        </View>
      )}

      <Card style={styles.resultCard}>
        <Text style={styles.resultLabel}>Manual entry (debug / simulator)</Text>
        <TextInput
          style={styles.manualInput}
          placeholder="Paste hourly://checkin/…"
          placeholderTextColor={Colors.dark.textTertiary}
          value={manualCode}
          onChangeText={setManualCode}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <PillButton variant="secondary" fullWidth size="medium" onPress={() => runCheckIn(manualCode)}>
          Submit code
        </PillButton>
        {lastPayload ? <Text style={styles.payloadPreview} numberOfLines={2}>{lastPayload}</Text> : null}
      </Card>

      <Card style={styles.rosterCard}>
        <Text style={styles.rosterTitle}>
          Live roster ({isLiveMode() ? roster.filter(r => r.checkinTime).length : demoAttendance.filter(a => a.opportunityId === opportunityId && a.checkinTime).length} checked in)
        </Text>
        {isLiveMode() && roster.length === 0 && <Text style={styles.hint}>No attendance rows yet.</Text>}
        {isLiveMode()
          ? roster
              .filter(r => r.checkinTime)
              .slice(0, 8)
              .map(r => (
                <View key={r.id} style={styles.rosterItem}>
                  <Text style={styles.rosterDot}>🟢</Text>
                  <Text style={styles.rosterName}>{r.studentName}</Text>
                  <Text style={styles.rosterTime}>
                    {r.checkinTime ? new Date(r.checkinTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : ''}
                  </Text>
                </View>
              ))
          : null}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.base, paddingTop: 60, paddingHorizontal: 24, gap: 16 },
  closeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.dark.element, alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 16, color: Colors.dark.textPrimary },
  title: { fontSize: 28, fontWeight: '500', color: Colors.dark.textPrimary, letterSpacing: -0.3 },
  subtitle: { fontSize: 15, color: Colors.dark.textSecondary, marginTop: -8 },
  cameraWrap: { height: 260, borderRadius: 24, overflow: 'hidden', backgroundColor: '#000' },
  scanFrame: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: Colors.purple, borderWidth: 3 },
  topLeft: { top: 40, left: 40, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 8 },
  topRight: { top: 40, right: 40, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 8 },
  bottomLeft: { bottom: 40, left: 40, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 8 },
  bottomRight: { bottom: 40, right: 40, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 8 },
  cameraPlaceholder: { height: 200, borderRadius: 24, backgroundColor: Colors.dark.element, alignItems: 'center', justifyContent: 'center' },
  cameraText: { fontSize: 15, color: Colors.dark.textSecondary, paddingHorizontal: 16, textAlign: 'center' },
  resultCard: { gap: 12 },
  resultLabel: { fontSize: 12, color: Colors.dark.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  manualInput: {
    backgroundColor: Colors.dark.element,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.dark.textPrimary,
  },
  payloadPreview: { fontSize: 11, color: Colors.dark.textTertiary },
  rosterCard: { gap: 10, marginBottom: 32 },
  rosterTitle: { fontSize: 13, fontWeight: '500', color: Colors.dark.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  rosterItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rosterDot: { fontSize: 10 },
  rosterName: { flex: 1, fontSize: 15, color: Colors.dark.textPrimary },
  rosterTime: { fontSize: 13, color: Colors.dark.textSecondary },
  hint: { fontSize: 14, color: Colors.dark.textSecondary },
});
