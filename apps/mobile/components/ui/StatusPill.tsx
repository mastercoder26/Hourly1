// StatusPill — status indicator with translucent background
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { Colors } from '../../constants/colors';

type StatusType = 'completed' | 'pending' | 'processing' | 'error' | 'info' | 'verified' | 'unverified';

interface StatusPillProps {
  status: StatusType;
  label?: string;
  size?: 'small' | 'medium';
}

const STATUS_CONFIG: Record<StatusType, { color: string; bgColor: string; label: string }> = {
  completed: {
    color: Colors.success,
    bgColor: Colors.successSoft,
    label: 'Completed',
  },
  verified: {
    color: Colors.success,
    bgColor: Colors.successSoft,
    label: 'Verified',
  },
  pending: {
    color: Colors.warning,
    bgColor: Colors.warningSoft,
    label: 'Pending',
  },
  unverified: {
    color: Colors.warning,
    bgColor: Colors.warningSoft,
    label: 'Unverified',
  },
  processing: {
    color: Colors.info,
    bgColor: Colors.infoSoft,
    label: 'Processing',
  },
  error: {
    color: Colors.error,
    bgColor: Colors.errorSoft,
    label: 'Error',
  },
  info: {
    color: Colors.info,
    bgColor: Colors.infoSoft,
    label: 'Info',
  },
};

export function StatusPill({ status, label, size = 'small' }: StatusPillProps) {
  const config = STATUS_CONFIG[status];
  const displayLabel = label ?? config.label;

  return (
    <View
      style={[
        styles.pill,
        size === 'medium' && styles.medium,
        { backgroundColor: config.bgColor },
      ]}
    >
      <Text
        style={[
          styles.text,
          size === 'medium' && styles.textMedium,
          { color: config.color },
        ]}
      >
        {displayLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  textMedium: {
    fontSize: 13,
  },
});
