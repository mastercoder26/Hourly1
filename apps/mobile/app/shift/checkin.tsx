// Check-In Screen - QR code display for student
import React, { useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { PillButton } from '../../components/ui/PillButton';
import { enterFade, enterRise } from '../../lib/motion';
import { useDemoStore } from '../../lib/demo/demoStore';
import { DEMO_STUDENT_ID } from '@hourly/shared';

export default function CheckInScreen() {
  const router = useRouter();
  const applications = useDemoStore(s => s.applications);
  const opportunities = useDemoStore(s => s.opportunities);

  const app = useMemo(
    () =>
      applications.find(a => a.status === 'APPROVED' && a.studentId === DEMO_STUDENT_ID) ??
      applications[0],
    [applications],
  );

  const opp = useMemo(
    () => opportunities.find(o => o.id === app?.opportunityId),
    [opportunities, app?.opportunityId],
  );

  if (!app) {
    return (
      <View style={styles.container}>
        <Text style={styles.missing}>No shift to check in for. Apply to an opportunity first.</Text>
        <PillButton variant="primary" accent="teal" onPress={() => router.back()}>
          Go back
        </PillButton>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View entering={enterFade(40)}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
        >
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </Animated.View>

      <Animated.View entering={enterRise(120)} style={styles.content}>
        <Text style={styles.title}>Check in</Text>
        <Text style={styles.subtitle}>Show this QR code to the coordinator</Text>

        <Card style={styles.qrCard}>
          <View style={styles.qrContainer}>
            <QRCode value={app.qrCodeData} size={180} color="#000000" backgroundColor="#FFFFFF" />
          </View>
          <Text style={styles.qrHint}>Your QR code works offline</Text>
        </Card>

        {opp && (
          <Card style={styles.shiftInfo}>
            <View style={styles.shiftRow}>
              <View style={styles.shiftOrgLogo}>
                <Text style={styles.shiftOrgEmoji}>{opp.orgLogo}</Text>
              </View>
              <View>
                <Text style={styles.shiftTitle}>{opp.title}</Text>
                <Text style={styles.shiftOrg}>{opp.orgName}</Text>
              </View>
            </View>
            <View style={styles.shiftDetails}>
              <View style={styles.shiftDetailRow}>
                <Text style={styles.detailIcon}>📅</Text>
                <Text style={styles.detailText}>
                  {new Date(opp.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
              <View style={styles.shiftDetailRow}>
                <Text style={styles.detailIcon}>🕐</Text>
                <Text style={styles.detailText}>
                  {opp.startTime} – {opp.endTime}
                </Text>
              </View>
            </View>
          </Card>
        )}

        <PillButton
          variant="primary"
          accent="teal"
          fullWidth
          size="large"
          onPress={() => router.replace('/shift/active')}
        >
          Simulate check-in →
        </PillButton>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
    paddingTop: 60,
  },
  missing: {
    color: Colors.dark.textSecondary,
    padding: 24,
    textAlign: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.element,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 24,
    marginBottom: 16,
  },
  closeButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.97 }],
  },
  closeText: {
    fontSize: 16,
    color: Colors.dark.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    marginTop: -16,
  },
  qrCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  qrContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },
  qrHint: {
    fontSize: 13,
    color: Colors.dark.textTertiary,
  },
  shiftInfo: {
    gap: 16,
  },
  shiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  shiftOrgLogo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.dark.element,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shiftOrgEmoji: {
    fontSize: 22,
  },
  shiftTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
  },
  shiftOrg: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  shiftDetails: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.element,
  },
  shiftDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailIcon: {
    fontSize: 14,
  },
  detailText: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
});
