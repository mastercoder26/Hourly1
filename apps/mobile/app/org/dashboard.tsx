import React from 'react';
import { View, ScrollView } from 'react-native';
import { Surface, Typography, PillButton } from '../../components/ui';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-purple-50 dark:bg-zinc-950 p-6">
      <View className="mt-12 mb-6">
        <Typography variant="body" className="text-purple-600 dark:text-purple-400 font-semibold mb-1">City Roots Farm</Typography>
        <Typography variant="h2" className="text-zinc-900 dark:text-zinc-50">Org Dashboard</Typography>
      </View>

      <View className="flex-row space-x-2 gap-2 mb-6">
        <Surface className="flex-1 p-4 bg-white dark:bg-zinc-900 rounded-3xl items-center border border-purple-100 dark:border-zinc-800">
          <Typography variant="h3" className="text-purple-600 dark:text-purple-400">12</Typography>
          <Typography variant="caption" className="text-center">Active Volunteers</Typography>
        </Surface>
        <Surface className="flex-1 p-4 bg-white dark:bg-zinc-900 rounded-3xl items-center border border-purple-100 dark:border-zinc-800">
          <Typography variant="h3" className="text-purple-600 dark:text-purple-400">145</Typography>
          <Typography variant="caption" className="text-center">Hours Logged</Typography>
        </Surface>
      </View>

      <PillButton 
        title="+ Post a New Role" 
        onPress={() => router.push('/org/create-role')} 
        style={{ backgroundColor: '#534AB7' }}
        className="w-full mb-8 shadow-lg shadow-purple-500/30"
      />

      <Typography variant="h3" className="mb-4 text-zinc-800 dark:text-zinc-100">Active Listings</Typography>
      
      {/* Mock Active Role */}
      <Surface className="p-4 bg-white dark:bg-zinc-900 rounded-3xl mb-4 border border-zinc-200 dark:border-zinc-800">
        <View className="flex-row justify-between mb-2">
          <Typography variant="body" className="font-semibold text-zinc-900 dark:text-zinc-50">Seedling Planter</Typography>
          <Typography variant="caption" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded-full overflow-hidden">Tomorrow</Typography>
        </View>
        <Typography variant="caption" className="text-zinc-500 mb-4">4 spots remaining • 8 applicants</Typography>
        
        <View className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-4">
          <View className="h-full bg-purple-500 rounded-full" style={{ width: '60%' }} />
        </View>

        <View className="flex-row space-x-2 gap-2">
          <PillButton size="small" variant="secondary" title="Manage Applicants" onPress={() => router.push('/org/applicants/1')} className="flex-1" />
          <PillButton size="small" variant="secondary" title="Scanner" onPress={() => router.push('/org/scanner')} className="flex-1" />
        </View>
      </Surface>
    </ScrollView>
  );
}
