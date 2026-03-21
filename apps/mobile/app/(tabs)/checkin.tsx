import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Card, TextValueLarge, TextRegular, TextCaption, TextSub, PillButton } from '../../components/ui';
import QRCode from 'react-native-qrcode-svg';
import { useRouter } from 'expo-router';

const dummyShift = {
  app_id: 'app_5k9z2v1x',
  org_name: 'City Roots Farm',
  role: 'Seedling Planter',
  date: 'Oct 30, 2024',
  startTime: '9:00 AM',
  endTime: '1:00 PM',
};

export default function CheckInTab() {
  const router = useRouter();
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  const handleSimulateScan = () => {
    setCheckingIn(true);
    setTimeout(() => {
      setCheckingIn(false);
      setCheckedIn(true);
    }, 1500);
  };

  const handleActiveShift = () => {
    router.push('/active-shift');
  };

  return (
    <SafeAreaView className="flex-1 bg-offWhite dark:bg-black">
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <TextValueLarge>Check-In</TextValueLarge>
          <TextRegular className="text-textMuted mt-1">
            Show your QR code to check into a shift
          </TextRegular>
        </View>

        {checkedIn ? (
          <Card className="p-8 items-center mb-6">
            <View className="w-16 h-16 rounded-full bg-[#1D9E7520] items-center justify-center mb-4">
              <TextValueLarge className="text-teal text-[28px]">✓</TextValueLarge>
            </View>
            <TextValueLarge className="text-teal text-center text-[24px] mb-2">Checked In!</TextValueLarge>
            <TextRegular className="text-textMuted text-center mb-6">{dummyShift.role} at {dummyShift.org_name}</TextRegular>
            <PillButton label="View Active Shift" variant="primary" onPress={handleActiveShift} className="w-full" />
          </Card>
        ) : (
          <Card className="p-8 items-center mb-6">
            <View className="mb-6 p-4 bg-white rounded-xl">
              <QRCode
                value={dummyShift.app_id}
                size={200}
                color="black"
                backgroundColor="white"
              />
            </View>

            <TextRegular className="font-semibold text-center mb-1">{dummyShift.role}</TextRegular>
            <TextRegular className="text-teal text-center mb-5">{dummyShift.org_name}</TextRegular>

            <View className="w-full gap-3">
              <View className="flex-row justify-between">
                <TextCaption>Date</TextCaption>
                <TextRegular className="font-medium">{dummyShift.date}</TextRegular>
              </View>
              <View className="h-[0.5px] w-full bg-grayBorder" />
              <View className="flex-row justify-between">
                <TextCaption>Time</TextCaption>
                <TextRegular className="font-medium">{dummyShift.startTime} – {dummyShift.endTime}</TextRegular>
              </View>
            </View>
          </Card>
        )}

        {/* Upcoming shifts */}
        <TextSub className="mb-3">Upcoming Shifts</TextSub>
        <Card className="p-4 mb-4">
          <View className="flex-row justify-between items-center">
            <View className="flex-1 pr-4">
              <TextRegular className="font-semibold">Seedling Planter</TextRegular>
              <TextCaption className="mt-1">City Roots Farm • Oct 30 • 9 AM</TextCaption>
            </View>
            <View className="bg-[#1D9E7515] px-3 py-1 rounded-pill">
              <TextCaption className="text-teal font-medium">Approved</TextCaption>
            </View>
          </View>
        </Card>

        {/* Dev simulate */}
        {!checkedIn && (
          <Card className="p-4 border border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-900/20 mt-2">
            <TextCaption className="text-purple-700 dark:text-purple-300 mb-3 text-center">Dev: Simulate Check-in</TextCaption>
            <PillButton
              label={checkingIn ? 'Simulating...' : 'Simulate Org Scan'}
              onPress={handleSimulateScan}
              variant="secondary"
              disabled={checkingIn}
            />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
