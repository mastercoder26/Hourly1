// HoursChart — bar chart showing hours by cause
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { CauseTag, AttendanceRecord } from '../types';
import { mockOpportunities } from '../mocks/opportunities';

interface HoursChartProps {
  attendance: AttendanceRecord[];
}

export function HoursChart({ attendance }: HoursChartProps) {
  // Calculate hours by cause
  const hoursByCause: Record<string, number> = {};
  
  attendance.forEach(record => {
    if (record.verificationStatus === 'VERIFIED') {
      const opp = mockOpportunities.find(o => o.id === record.opportunityId);
      if (opp) {
        opp.causeTags.forEach(tag => {
          hoursByCause[tag] = (hoursByCause[tag] || 0) + record.hoursLogged;
        });
      }
    }
  });

  const entries = Object.entries(hoursByCause).sort((a, b) => b[1] - a[1]);
  const maxHours = Math.max(...entries.map(([, h]) => h), 1);

  if (entries.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No verified hours yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {entries.map(([cause, hours]) => (
        <View key={cause} style={styles.row}>
          <Text style={styles.causeLabel}>{cause}</Text>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                {
                  width: `${(hours / maxHours) * 100}%`,
                  backgroundColor: Colors.causeTags[cause] || Colors.teal,
                },
              ]}
            />
          </View>
          <Text style={styles.hoursLabel}>{hours}h</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  causeLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
    width: 90,
  },
  barContainer: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.dark.element,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 5,
  },
  hoursLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    width: 40,
    textAlign: 'right',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
