// Portfolio — hours tracker, badge grid, past shifts
import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { PillBadge } from '../../components/ui/PillBadge';
import { PillButton } from '../../components/ui/PillButton';
import { HoursChart } from '../../components/HoursChart';
import { BadgeGrid } from '../../components/BadgeGrid';
import { mockStudent, mockAttendance, mockBadges } from '../../mocks/data';
import { mockOpportunities } from '../../mocks/opportunities';
import { enterRise, MOTION } from '../../lib/motion';

export default function PortfolioScreen() {
  const hoursAnim = useSharedValue(0);
  const totalVerified = mockAttendance
    .filter(a => a.verificationStatus === 'VERIFIED')
    .reduce((sum, a) => sum + a.hoursLogged, 0);

  useEffect(() => {
    hoursAnim.value = withDelay(
      120,
      withTiming(1, { duration: 420, easing: MOTION.easeOut }),
    );
  }, [hoursAnim]);

  const hoursStyle = useAnimatedStyle(() => ({
    opacity: hoursAnim.value,
  }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={enterRise(60)}>
        <Text style={styles.title}>Portfolio</Text>
      </Animated.View>

      <Animated.View entering={enterRise(120)}>
        <Card style={styles.hoursCard}>
          <Text style={styles.hoursLabel}>Total verified hours</Text>
          <Animated.View style={hoursStyle}>
            <Text style={styles.hoursValue}>{totalVerified}</Text>
          </Animated.View>
          <Text style={styles.hoursSubtext}>across {new Set(mockAttendance.map(a => a.opportunityId)).size} shifts</Text>
          <View style={styles.hoursActions}>
            <PillButton variant="primary" accent="teal" size="small">
              Share portfolio
            </PillButton>
            <PillButton variant="default" size="small">
              Download certificate
            </PillButton>
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={enterRise(180)}>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Hours by cause</Text>
          <HoursChart attendance={mockAttendance} />
        </Card>
      </Animated.View>

      <Animated.View entering={enterRise(240)}>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Milestones</Text>
          <BadgeGrid badges={mockBadges} />
        </Card>
      </Animated.View>

      <Animated.View entering={enterRise(300)}>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Past shifts</Text>
          {mockAttendance.map(record => {
            const opp = mockOpportunities.find(o => o.id === record.opportunityId);
            return (
              <View key={record.id} style={styles.shiftRow}>
                <View style={styles.shiftInfo}>
                  <Text style={styles.shiftEmoji}>{opp?.orgLogo || '📋'}</Text>
                  <View>
                    <Text style={styles.shiftTitle}>{opp?.title || 'Shift'}</Text>
                    <Text style={styles.shiftDate}>
                      {new Date(record.checkinTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                </View>
                <View style={styles.shiftRight}>
                  <Text style={styles.shiftHours}>{record.hoursLogged}h</Text>
                  <PillBadge
                    label={record.verificationStatus === 'VERIFIED' ? 'Verified' : 'Pending'}
                    color={record.verificationStatus === 'VERIFIED' ? Colors.success : Colors.warning}
                  />
                </View>
              </View>
            );
          })}
        </Card>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 24,
  },
  hoursCard: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 36,
  },
  hoursLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  hoursValue: {
    fontSize: 64,
    fontWeight: '400',
    color: Colors.dark.textPrimary,
    letterSpacing: -2,
    lineHeight: 72,
  },
  hoursSubtext: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
    marginBottom: 24,
  },
  hoursActions: {
    flexDirection: 'row',
    gap: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  shiftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.element,
  },
  shiftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  shiftEmoji: {
    fontSize: 20,
  },
  shiftTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
  },
  shiftDate: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  shiftRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  shiftHours: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.teal,
  },
});
