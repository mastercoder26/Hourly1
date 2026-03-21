import React from 'react';
import { View, ScrollView } from 'react-native';
import { Surface, Typography, PillButton } from '../../components/ui';
import { useRouter } from 'expo-router';

export default function CreateRoleScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-white dark:bg-zinc-950 p-6">
      <View className="mt-12 mb-6">
        <Typography variant="caption" className="text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest mb-2">Step 1 of 4</Typography>
        <Typography variant="h2" className="text-zinc-900 dark:text-zinc-50 mb-4">Post a Role</Typography>
      </View>

      <Surface className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-3xl mb-6">
        <Typography variant="h3" className="mb-2">Role Title</Typography>
        <View className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 mb-6">
          <Typography variant="body" className="text-zinc-400">e.g. Tree Planter, Event Setup...</Typography>
        </View>

        <Typography variant="h3" className="mb-2">Causes & Tags</Typography>
        <View className="flex-row flex-wrap space-x-2 gap-2 mb-6">
          {['Environment', 'Education', 'Health', 'Animals'].map((tag, i) => (
            <View key={i} className="px-4 py-2 border border-purple-200 dark:border-purple-800 rounded-full bg-purple-50 dark:bg-purple-900/20">
              <Typography variant="caption" className="text-purple-700 dark:text-purple-300">{tag}</Typography>
            </View>
          ))}
        </View>

        <Typography variant="h3" className="mb-2">When and Where</Typography>
        <View className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 mb-6">
          <Typography variant="caption" className="text-zinc-500 mb-1">Select Date & Time</Typography>
          <Typography variant="body" className="font-medium text-zinc-900 dark:text-zinc-50">Sat, Oct 30 • 9:00 AM - 1:00 PM</Typography>
        </View>
        <View className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 mb-6">
          <Typography variant="caption" className="text-zinc-500 mb-1">Location</Typography>
          <Typography variant="body" className="font-medium text-zinc-900 dark:text-zinc-50">123 Farm Rd, City, State</Typography>
        </View>

        <Typography variant="h3" className="mb-2">Requirements</Typography>
        <View className="flex-row items-center justify-between mb-4 mt-2">
          <Typography variant="body" className="text-zinc-900 dark:text-zinc-50">Credit Eligible</Typography>
          <View className="w-12 h-6 bg-purple-500 rounded-full items-end justify-center px-1">
            <View className="w-4 h-4 bg-white rounded-full" />
          </View>
        </View>
      </Surface>

      <PillButton 
        title="Publish Role" 
        onPress={() => router.replace('/org/dashboard')} 
        style={{ backgroundColor: '#534AB7' }}
        className="w-full mb-12 shadow-lg shadow-purple-500/30"
      />
    </ScrollView>
  );
}
