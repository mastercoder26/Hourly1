import React from 'react';
import { View } from 'react-native';
import { Surface, Typography } from '../../components/ui';

export default function HoursChart() {
  const data = [
    { cause: 'Environment', hours: 25, color: 'bg-green-500' },
    { cause: 'Education', hours: 14, color: 'bg-blue-500' },
    { cause: 'Food Poverty', hours: 8, color: 'bg-orange-500' },
  ];

  const total = data.reduce((acc, curr) => acc + curr.hours, 0);

  return (
    <Surface className="p-4 bg-white dark:bg-zinc-900 mt-4 rounded-3xl">
      <Typography variant="h3" className="mb-4">Hours by Cause</Typography>
      {data.map((d, i) => {
        const pct = (d.hours / total) * 100;
        return (
          <View key={i} className="mb-3">
            <View className="flex-row justify-between mb-1">
              <Typography variant="caption">{d.cause}</Typography>
              <Typography variant="caption" className="font-semibold">{d.hours}h</Typography>
            </View>
            <View className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <View className={`h-full ${d.color} rounded-full`} style={{ width: `${pct}%` }} />
            </View>
          </View>
        );
      })}
    </Surface>
  );
}
