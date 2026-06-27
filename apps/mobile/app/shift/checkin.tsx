// Check-In — student QR from live `application.listMine`, optional GPS self check-in.
import React, { useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import QRCode from 'react-native-qrcode-svg';
import * as Location from 'expo-location';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { PillButton } from '../../components/ui/PillButton';
import { enterFade, enterRise } from '../../lib/motion';
import { useDemoStore } from '../../lib/demo/demoStore';
import { DEMO_STUDENT_ID } from '@hourly/shared';
import { trpc } from '../../lib/trpc';
import { isDemoMode, isLiveMode } from '../../lib/dataMode';
import { ApiOpportunityLike, toMobileOpportunity } from '../../lib/opportunity-adapter';

export default function CheckInScreen() {
  const router = useRouter();
  const applications = useDemoStore(s => s.applications);
  const opportunities = useDemoStore(s => s.opportunities);
  const startStudentCheckIn = useDemoStore(s => s.startStudentCheckIn);

  const listMineQuery = trpc.application.listMine.useQuery(undefined, { enabled: isLiveMode() });
  const gpsCheckIn = trpc.attendance.checkInByGps.useMutation();

  const liveApp = useMemo(() => {
    if (!isLiveMode() || !listMineQuery.data) return undefined;
    const approved = listMineQuery.data.find(a => a.status === 'APPROVED');
    return approved ?? listMineQuery.data[0];
  }, [listMineQuery.data]);

  const liveOppQuery = trpc.opportunity.getById.useQuery(
    { id: liveApp?.opportunityId ?? '' },
    { enabled: isLiveMode() && Boolean(liveApp?.opportunityId) },
  );

  const demoApp = useMemo(
    () =>
      applications.find(a => a.status === 'APPROVED' && a.studentId === DEMO_STUDENT_ID) ??
      applications[0],
    [applications],
  );

  const app = isLiveMode() ? liveApp : demoApp;

  const opp = useMemo(() => {
    if (isLiveMode() && liveOppQuery.data) {
      return toMobileOpportunity(liveOppQuery.data as ApiOpportunityLike);
    }
    return opportunities.find(o => o.id === app?.opportunityId);
  }, [app?.opportunityId, liveOppQuery.data, opportunities]);

  const [locBusy, setLocBusy] = useState(false);

  const onGpsCheckIn = useCallback(async () => {
    if (!isLiveMode() || !app?.opportunityId) {
      Alert.alert('GPS check-in', 'Available in live mode with an active application.');
      return;
    }
    setLocBusy(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location needed', 'Allow location to verify you are at the event site.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      await gpsCheckIn.mutateAsync({
        opportunityId: app.opportunityId,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      Alert.alert('Checked in', 'Your GPS location matched the event. Coordinator can still scan your QR if needed.');
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'Unknown error';
      Alert.alert('GPS check-in failed', msg);
    } finally {
      setLocBusy(false);
    }
  }, [app?.opportunityId, gpsCheckIn]);

  if (isLiveMode() && listMineQuery.isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.teal} />
        <Text style={styles.missing}>Loading your shifts…</Text>
      </View>
    );
  }

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

        {isLiveMode() && (
          <PillButton
            variant="primary"
            accent="teal"
            fullWidth
            size="large"
            onPress={onGpsCheckIn}
            disabled={locBusy || gpsCheckIn.isPending}
          >
            {locBusy || gpsCheckIn.isPending ? 'Checking location…' : 'GPS check-in at venue'}
          </PillButton>
        )}

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
          onPress={() => {
            if (isDemoMode() && app) {
              startStudentCheckIn(app.id);
            }
            router.replace('/shift/active');
          }}
        >
          {isDemoMode() ? 'Simulate check-in →' : 'Done'}
        </PillButton>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
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
