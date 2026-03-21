import React from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Card, TextValueLarge, TextRegular, TextCaption, TextSub, PillButton } from '../../components/ui';
import { useRouter } from 'expo-router';

const mockRoles = [
  { id: '1', title: 'Seedling Planter', date: 'Oct 30', spots: 4, applicants: 8, filled: 0.6 },
  { id: '2', title: 'Harvest Helper', date: 'Nov 5', spots: 6, applicants: 3, filled: 0.2 },
];

export default function OrgDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-offWhite dark:bg-black">
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <TextCaption className="text-purple font-bold uppercase tracking-widest">City Roots Farm</TextCaption>
          <TextValueLarge className="mt-1">Dashboard</TextValueLarge>
        </View>

        {/* Stats Row */}
        <View className="flex-row gap-3 mb-6">
          <Card className="flex-1 p-5 items-center" metric>
            <TextCaption className="text-purple uppercase tracking-wider">Volunteers</TextCaption>
            <TextValueLarge className="text-purple text-[28px]">12</TextValueLarge>
            <TextCaption>active</TextCaption>
          </Card>
          <Card className="flex-1 p-5 items-center" metric>
            <TextCaption className="text-purple uppercase tracking-wider">Hours</TextCaption>
            <TextValueLarge className="text-purple text-[28px]">145</TextValueLarge>
            <TextCaption>logged</TextCaption>
          </Card>
          <Card className="flex-1 p-5 items-center" metric>
            <TextCaption className="text-purple uppercase tracking-wider">Roles</TextCaption>
            <TextValueLarge className="text-purple text-[28px]">{mockRoles.length}</TextValueLarge>
            <TextCaption>active</TextCaption>
          </Card>
        </View>

        {/* Post Role CTA */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/(org-tabs)/post')}
          className="rounded-card p-5 mb-6 flex-row items-center justify-between"
          style={{ backgroundColor: '#534AB7' }}
        >
          <View>
            <TextRegular className="text-white font-semibold text-[17px]">Post a New Role</TextRegular>
            <TextCaption className="text-white/70 mt-1">Takes under 2 minutes</TextCaption>
          </View>
          <TextRegular className="text-white text-[24px]">+</TextRegular>
        </TouchableOpacity>

        {/* Active Listings */}
        <TextSub className="mb-3">Active Listings</TextSub>

        {mockRoles.map((role) => (
          <Card key={role.id} className="p-5 mb-4">
            <View className="flex-row justify-between items-start mb-2">
              <TextRegular className="font-semibold flex-1 pr-2">{role.title}</TextRegular>
              <View className="bg-[#534AB715] px-2 py-1 rounded-pill">
                <TextCaption className="text-purple">{role.date}</TextCaption>
              </View>
            </View>
            <TextCaption className="mb-4">
              {role.spots} spots remaining • {role.applicants} applicants
            </TextCaption>

            <View className="w-full h-2 bg-grayBorder rounded-full overflow-hidden mb-4">
              <View
                className="h-full rounded-full"
                style={{ width: `${role.filled * 100}%`, backgroundColor: '#534AB7' }}
              />
            </View>

            <View className="flex-row gap-2">
              <PillButton
                size="small"
                variant="ghost"
                label="Applicants"
                onPress={() => router.push(`/org/applicants/${role.id}` as any)}
                className="flex-1"
              />
              <PillButton
                size="small"
                variant="ghost"
                label="Scanner"
                onPress={() => router.push('/(org-tabs)/scanner')}
                className="flex-1"
              />
            </View>
          </Card>
        ))}

        <View className="mb-12" />
      </ScrollView>
    </SafeAreaView>
  );
}
