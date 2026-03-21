import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Surface, Typography, PillButton } from '../../components/ui';
import BadgeGrid from '../../components/BadgeGrid';
import HoursChart from '../../components/HoursChart';
import * as Sharing from 'expo-sharing';

export default function PortfolioScreen() {
  const handleShare = async () => {
    // Mock web url string representing portfolio
    const url = 'https://hourly.app/v/s_jenkins';
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(url, { dialogTitle: 'My Volunteer Portfolio' });
      } else {
        Alert.alert('Link Copied', url);
      }
    } catch {
      Alert.alert('Link Copied', url);
    }
  };

  return (
    <ScrollView className="flex-1 bg-zinc-50 dark:bg-zinc-950 p-6">
      <View className="mt-12 items-center mb-6">
        <Typography variant="caption" className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest mb-2">Verified Impact</Typography>
        <Typography variant="h1" className="text-6xl font-mono text-zinc-900 dark:text-zinc-50">47.5</Typography>
        <Typography variant="body" className="text-zinc-500">Total Hours Logged</Typography>
      </View>

      <View className="flex-row space-x-2 gap-2 mt-4 mb-4">
        <PillButton title="Share Portfolio" onPress={handleShare} variant="primary" className="flex-1" />
        <PillButton title="Download PDF" onPress={() => Alert.alert('Certificate Downloaded')} variant="secondary" className="flex-1" />
      </View>

      <HoursChart />
      <BadgeGrid />

      <Surface className="p-4 bg-white dark:bg-zinc-900 mt-4 mb-12 rounded-3xl">
        <Typography variant="h3" className="mb-4">Recent Shifts</Typography>
        {[
          { org: 'City Roots Farm', date: 'Oct 30', hours: 4, type: 'Environment' },
          { org: 'Downtown Library', date: 'Oct 12', hours: 2.5, type: 'Education' }
        ].map((s, i) => (
          <View key={i} className="flex-row justify-between mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-4 last:border-0 last:pb-0">
            <View>
              <Typography variant="body" className="font-semibold text-zinc-900 dark:text-zinc-50">{s.org}</Typography>
              <Typography variant="caption" className="text-zinc-500">{s.date} • {s.type}</Typography>
            </View>
            <View className="items-end justify-center">
              <Typography variant="body" className="text-teal-600 dark:text-teal-400 font-bold">+{s.hours}h</Typography>
            </View>
          </View>
        ))}
      </Surface>
    </ScrollView>
  );
}
