// Check-In Screen — QR code display for student
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { PillButton } from '../../components/ui/PillButton';
import { mockApplications } from '../../mocks/data';
import { mockOpportunities } from '../../mocks/opportunities';

export default function CheckInScreen() {
  const router = useRouter();
  const app = mockApplications[0]; // Mock: use first application
  const opp = mockOpportunities.find(o => o.id === app.opportunityId);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.closeButton}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>

      <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.content}>
        <Text style={styles.title}>Check in</Text>
        <Text style={styles.subtitle}>Show this QR code to the coordinator</Text>

        {/* QR Code placeholder */}
        <Card style={styles.qrCard}>
          <View style={styles.qrContainer}>
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrIcon}>📱</Text>
              <Text style={styles.qrText}>QR Code</Text>
              <Text style={styles.qrData}>{app.qrCodeData}</Text>
            </View>
          </View>
          <Text style={styles.qrHint}>Your QR code works offline</Text>
        </Card>

        {/* Shift info */}
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
                  {new Date(opp.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </Text>
              </View>
              <View style={styles.shiftDetailRow}>
                <Text style={styles.detailIcon}>🕐</Text>
                <Text style={styles.detailText}>{opp.startTime} – {opp.endTime}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Simulate check-in button (for testing) */}
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
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  qrIcon: {
    fontSize: 48,
  },
  qrText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  qrData: {
    fontSize: 8,
    color: '#888888',
    textAlign: 'center',
    paddingHorizontal: 20,
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
