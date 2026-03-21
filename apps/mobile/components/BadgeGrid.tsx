import React from 'react';
import { View, ScrollView } from 'react-native';
import { Surface, Typography, PillButton } from '../../components/ui';

export default function BadgeGrid() {
  const badges = [
    { title: 'First Shift', icon: '🌱', active: true },
    { title: '10 Hours', icon: '🥉', active: true },
    { title: '50 Hours', icon: '🥈', active: false },
    { title: '100 Hours', icon: '🥇', active: false },
    { title: '5 Orgs', icon: '🤝', active: true },
    { title: '1 Yr Streak', icon: '🔥', active: false },
  ];

  return (
    <Surface className="p-4 bg-white dark:bg-zinc-900 mt-4 rounded-3xl">
      <Typography variant="h3" className="mb-4">Milestone Badges</Typography>
      <View className="flex-row flex-wrap justify-between">
        {badges.map((b, i) => (
          <View key={i} className={`items-center w-1/3 p-2 mb-2 ${!b.active && 'opacity-40'}`}>
            <View className="w-16 h-16 rounded-full items-center justify-center bg-teal-50 dark:bg-zinc-800 border border-teal-100 dark:border-teal-900/50 mb-2">
              <Typography variant="h2">{b.icon}</Typography>
            </View>
            <Typography variant="caption" className="text-center">{b.title}</Typography>
          </View>
        ))}
      </View>
    </Surface>
  );
}
