import React from 'react';
import { View, ScrollView } from 'react-native';
import { Surface, Typography, PillButton } from '../../../components/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ApplicantManagementScreen() {
  const { opportunityId } = useLocalSearchParams();
  const router = useRouter();

  const applicants = [
    { name: 'Sarah Jenkins', grade: '10th', hours: 42.5, status: 'approved' },
    { name: 'Michael Chen', grade: '11th', hours: 15.0, status: 'pending' },
    { name: 'Elena Rodriguez', grade: '12th', hours: 120.0, status: 'pending' },
  ];

  return (
    <ScrollView className="flex-1 bg-white dark:bg-zinc-950 p-6">
      <View className="mt-12 mb-6 flex-row justify-between items-center">
        <View>
          <Typography variant="body" className="text-zinc-500 mb-1">Seedling Planter</Typography>
          <Typography variant="h2" className="text-zinc-900 dark:text-zinc-50">Applicants</Typography>
        </View>
        <Typography variant="caption" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 rounded-full">4 Spots Left</Typography>
      </View>

      {applicants.map((a, i) => (
        <Surface key={i} className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-3xl mb-4 border border-zinc-200 dark:border-zinc-800">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 rounded-full bg-purple-100 dark:bg-zinc-800 items-center justify-center mr-3">
                <Typography variant="body" className="text-purple-700 dark:text-purple-400 font-bold">{a.name.charAt(0)}</Typography>
              </View>
              <View>
                <Typography variant="body" className="font-semibold text-zinc-900 dark:text-zinc-50">{a.name}</Typography>
                <Typography variant="caption" className="text-zinc-500">{a.grade} Grade • {a.hours} Hrs logged</Typography>
              </View>
            </View>
            {a.status === 'approved' && (
              <Typography variant="caption" className="text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">Approved</Typography>
            )}
          </View>
          
          {a.status === 'pending' && (
            <View className="flex-row space-x-2 gap-2 mt-2">
              <PillButton size="small" title="Approve" onPress={() => {}} style={{ backgroundColor: '#1D9E75' }} className="flex-1" />
              <PillButton size="small" title="Decline" onPress={() => {}} variant="secondary" className="flex-1" />
            </View>
          )}
        </Surface>
      ))}

      <View className="mt-8 mb-12">
        <PillButton 
          title="Done" 
          onPress={() => router.back()} 
          variant="secondary"
          className="w-full"
        />
      </View>
    </ScrollView>
  );
}
