// QR Scanner - org-side camera scanner
import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { Text } from '@/components/Themed';;
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { PillButton } from '../../components/ui/PillButton';

export default function ScannerScreen() {
  const router = useRouter();
  const [checkedInCount, setCheckedInCount] = useState(2);

  const handleCheckIn = () => {
    setCheckedInCount(prev => prev + 1);
    Alert.alert('Checked in', 'Alex Rivera has been checked in for this shift.');
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.closeButton}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>

      <Text style={styles.title}>Scan check-in</Text>
      <Text style={styles.subtitle}>Point camera at volunteer's QR code</Text>

      {/* Camera placeholder */}
      <View style={styles.cameraPlaceholder}>
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        <Text style={styles.cameraText}>📸 Camera preview</Text>
        <Text style={styles.cameraHint}>Camera access required on device</Text>
      </View>

      {/* Mock scan result */}
      <Card style={styles.resultCard}>
        <Text style={styles.resultLabel}>Last scan</Text>
        <View style={styles.resultRow}>
          <View style={styles.resultAvatar}>
            <Text style={styles.resultAvatarText}>AR</Text>
          </View>
          <View>
            <Text style={styles.resultName}>Alex Rivera</Text>
            <Text style={styles.resultDetails}>Grade 11 • 47.5h total</Text>
          </View>
        </View>
        <PillButton
          variant="primary"
          accent="purple"
          fullWidth
          size="medium"
          onPress={handleCheckIn}
        >
          ✓ Check in
        </PillButton>
      </Card>

      {/* Live roster */}
      <Card style={styles.rosterCard}>
        <Text style={styles.rosterTitle}>Live roster ({checkedInCount} checked in)</Text>
        <View style={styles.rosterItem}>
          <Text style={styles.rosterDot}>🟢</Text>
          <Text style={styles.rosterName}>Jordan T.</Text>
          <Text style={styles.rosterTime}>9:02 AM</Text>
        </View>
        <View style={styles.rosterItem}>
          <Text style={styles.rosterDot}>🟢</Text>
          <Text style={styles.rosterName}>Alex R.</Text>
          <Text style={styles.rosterTime}>9:05 AM</Text>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.base, paddingTop: 60, paddingHorizontal: 24, gap: 20 },
  closeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.dark.element, alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 16, color: Colors.dark.textPrimary },
  title: { fontSize: 28, fontWeight: '500', color: Colors.dark.textPrimary, letterSpacing: -0.3 },
  subtitle: { fontSize: 15, color: Colors.dark.textSecondary, marginTop: -12 },
  cameraPlaceholder: { height: 260, borderRadius: 24, backgroundColor: Colors.dark.element, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  scanFrame: { position: 'absolute', width: 200, height: 200, top: 30 },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: Colors.purple, borderWidth: 3 },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 8 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 8 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 8 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 8 },
  cameraText: { fontSize: 18, color: Colors.dark.textSecondary },
  cameraHint: { fontSize: 12, color: Colors.dark.textTertiary, marginTop: 8 },
  resultCard: { gap: 14 },
  resultLabel: { fontSize: 12, color: Colors.dark.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  resultAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  resultAvatarText: { fontSize: 15, fontWeight: '600', color: Colors.purple },
  resultName: { fontSize: 16, fontWeight: '500', color: Colors.dark.textPrimary },
  resultDetails: { fontSize: 13, color: Colors.dark.textSecondary },
  rosterCard: { gap: 12 },
  rosterTitle: { fontSize: 13, fontWeight: '500', color: Colors.dark.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  rosterItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rosterDot: { fontSize: 10 },
  rosterName: { flex: 1, fontSize: 15, color: Colors.dark.textPrimary },
  rosterTime: { fontSize: 13, color: Colors.dark.textSecondary },
});
