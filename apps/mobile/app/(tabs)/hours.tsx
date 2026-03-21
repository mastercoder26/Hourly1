import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Card, TextValueLarge, TextRegular, TextCaption, TextSub, TextHeader } from '../../components/ui';
import HoursChart from '../../components/HoursChart';

const recentShifts = [
  { org: 'City Roots Farm', date: 'Oct 30', hours: 4, status: 'verified', cause: 'Environment' },
  { org: 'Downtown Library', date: 'Oct 12', hours: 2.5, status: 'verified', cause: 'Education' },
  { org: 'City Food Bank', date: 'Sep 28', hours: 3, status: 'pending', cause: 'Food' },
  { org: 'Green Earth', date: 'Sep 15', hours: 5, status: 'verified', cause: 'Environment' },
];

export default function HoursTab() {
  const totalHours = recentShifts.filter(s => s.status === 'verified').reduce((sum, s) => sum + s.hours, 0);
  const pendingHours = recentShifts.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.hours, 0);

  return (
    <SafeAreaView className="flex-1 bg-offWhite dark:bg-black">
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <TextValueLarge>Hours Tracker</TextValueLarge>
          <TextRegular className="text-textMuted mt-1">All your volunteer time in one place</TextRegular>
        </View>

        {/* Summary Row */}
        <View className="flex-row gap-3 mb-6">
          <Card className="flex-1 p-5 items-center" metric>
            <TextHeader>Verified</TextHeader>
            <TextValueLarge className="text-teal text-[28px]">{totalHours}</TextValueLarge>
            <TextCaption>hours</TextCaption>
          </Card>
          <Card className="flex-1 p-5 items-center" metric>
            <TextHeader>Pending</TextHeader>
            <TextValueLarge className="text-[28px] text-orange-500">{pendingHours}</TextValueLarge>
            <TextCaption>hours</TextCaption>
          </Card>
        </View>

        {/* Chart */}
        <HoursChart />

        {/* Recent Shifts List */}
        <TextSub className="mb-3 mt-2">Recent Shifts</TextSub>
        <Card className="mb-12">
          {recentShifts.map((shift, i) => (
            <View key={i}>
              {i > 0 && <View className="h-[0.5px] w-full bg-grayBorder my-3" />}
              <View className="flex-row justify-between items-center">
                <View className="flex-1 pr-4">
                  <TextRegular className="font-semibold">{shift.org}</TextRegular>
                  <TextCaption className="mt-0.5">{shift.date} • {shift.cause}</TextCaption>
                </View>
                <View className="items-end">
                  <TextRegular className="text-teal font-semibold">+{shift.hours}h</TextRegular>
                  <View className={`mt-1 px-2 py-0.5 rounded-pill ${
                    shift.status === 'verified' ? 'bg-[#1D9E7515]' : 'bg-orange-100 dark:bg-orange-900/20'
                  }`}>
                    <TextCaption className={shift.status === 'verified' ? 'text-teal' : 'text-orange-500'}>
                      {shift.status}
                    </TextCaption>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
