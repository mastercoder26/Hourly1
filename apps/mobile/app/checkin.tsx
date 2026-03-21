import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Surface, Typography, PillButton } from '../components/ui';
import QRCode from 'react-native-qrcode-svg';
import { useRouter } from 'expo-router';

// Mock application ID and Shift info
const dummyShift = {
  app_id: 'app_5k9z2v1x',
  org_name: 'City Roots Farm',
  role: 'Seedling Planter',
  date: 'Oct 30, 2024',
  startTime: '9:00 AM',
  endTime: '1:00 PM',
};

export default function CheckInScreen() {
  const router = useRouter();
  const [checkingIn, setCheckingIn] = useState(false);

  // Simulate an organization scanning the QR code and confirming
  const handleSimulateScan = () => {
    setCheckingIn(true);
    setTimeout(() => {
      setCheckingIn(false);
      // Navigate to the active shift screen
      router.push('/active-shift');
    }, 1500);
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-zinc-950 p-6">
      <View className="flex-1 items-center justify-center mt-12 pb-12">
        <Typography variant="h2" className="text-center mb-2 text-zinc-900 dark:text-zinc-50 flex-wrap">Check In via QR</Typography>
        <Typography variant="body" className="text-center mb-10 text-zinc-500 dark:text-zinc-400 max-w-sm">Present this code to the event organizer to check into your shift.</Typography>

        <Surface className="p-8 items-center bg-zinc-50 dark:bg-zinc-900 shadow-md border border-zinc-200 dark:border-zinc-800 rounded-3xl mb-8 w-full max-w-sm">
          <View className="mb-6 p-4 bg-white dark:bg-white rounded-xl">
            {/* Generate QR with mock data offline */}
            <QRCode
              value={dummyShift.app_id}
              size={200}
              color="black"
              backgroundColor="white"
            />
          </View>

          <Typography variant="h3" className="text-zinc-900 dark:text-zinc-50 text-center mb-1 flex-wrap">{dummyShift.role}</Typography>
          <Typography variant="body" className="text-teal-600 dark:text-teal-400 text-center mb-4 flex-wrap">{dummyShift.org_name}</Typography>

          <View className="w-full flex-row justify-between mb-2">
            <Typography variant="caption" className="text-zinc-500 dark:text-zinc-400">Date</Typography>
            <Typography variant="body" className="text-zinc-900 dark:text-zinc-50 font-medium">{dummyShift.date}</Typography>
          </View>
          <View className="w-full flex-row justify-between">
            <Typography variant="caption" className="text-zinc-500 dark:text-zinc-400">Time</Typography>
            <Typography variant="body" className="text-zinc-900 dark:text-zinc-50 font-medium">{dummyShift.startTime} - {dummyShift.endTime}</Typography>
          </View>
        </Surface>

        {/* Development Only: Simulate Organization Scan */}
        <Surface className="w-full max-w-sm p-4 border border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-900/20 mb-6">
          <Typography variant="caption" className="text-purple-700 dark:text-purple-300 mb-3 text-center">Development Testing</Typography>
          <PillButton 
            title={checkingIn ? "Simulating..." : "Simulate Org Scan"} 
            onPress={handleSimulateScan}
            variant="secondary"
            disabled={checkingIn}
            className="w-full"
          />
        </Surface>
      </View>
    </ScrollView>
  );
}
