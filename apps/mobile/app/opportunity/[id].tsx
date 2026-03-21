import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { mockOpportunities } from '../../mocks/opportunities';
import { TextValueLarge, TextRegular, TextSub } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/PillButton';
import { Card } from '../../components/ui/Card';
import { ApplySheet } from '../../components/ApplySheet';
import { useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

export default function OpportunityDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const applySheetRef = useRef<BottomSheet>(null);
  const [hasApplied, setHasApplied] = useState(false);

  const opp = mockOpportunities.find(o => o.id === id);

  if (!opp) {
    return (
      <View className="flex-1 items-center justify-center bg-offWhite dark:bg-black">
        <TextRegular>Opportunity not found</TextRegular>
        <PillButton label="Go back" className="mt-4" onPress={() => router.back()} />
      </View>
    );
  }

  const handleApply = () => {
    applySheetRef.current?.expand();
  };

  const handleConfirmApply = () => {
    // Mock API call
    setTimeout(() => {
      setHasApplied(true);
      applySheetRef.current?.close();
    }, 500);
  };

  return (
    <View className="flex-1 bg-offWhite dark:bg-black">
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} className="mb-6 mt-12 bg-grayBorder/20 px-4 py-2 rounded-full self-start">
          <TextRegular className="text-textMuted">← Back</TextRegular>
        </TouchableOpacity>

        <TextSub className="text-teal mb-2">{opp.orgName} • ★ 4.8</TextSub>
        <TextValueLarge className="mb-6">{opp.roleTitle}</TextValueLarge>

        <View className="flex-row gap-2 mb-6">
          <View className="bg-[#1D9E7515] px-3 py-1 rounded-pill">
            <Text className="text-teal font-medium text-xs">{opp.cause}</Text>
          </View>
          {opp.creditEligible && (
            <View className="bg-[#534AB715] px-3 py-1 rounded-pill">
              <Text className="text-purple font-medium text-xs">Credit Eligible</Text>
            </View>
          )}
        </View>

        <Card className="mb-6 gap-4">
          <View className="flex-row justify-between">
            <TextSub>Date & Time</TextSub>
            <TextRegular className="font-medium">{opp.dateTime}</TextRegular>
          </View>
          <View className="h-[1px] w-full bg-grayBorder" />
          <View className="flex-row justify-between">
            <TextSub>Availability</TextSub>
            <TextRegular className={opp.spotsRemaining < 5 ? "text-orange-500 font-medium" : "text-textPrimary"}>
              {opp.spotsRemaining} spots left
            </TextRegular>
          </View>
          <View className="h-[1px] w-full bg-grayBorder" />
          <View className="flex-row justify-between">
            <TextSub>Age Min</TextSub>
            <TextRegular>14+</TextRegular>
          </View>
        </Card>

        <TextSub className="mb-3">Location</TextSub>
        <View className="h-48 w-full rounded-card overflow-hidden mb-6 border-[0.5px] border-grayBorder items-center justify-center px-4">
          <TextRegular className="text-textMuted text-center">
            {opp.distance}km away
          </TextRegular>
        </View>

        <TextSub className="mb-3">What to Bring</TextSub>
        <Card className="mb-6">
          <TextRegular className="mb-2">• Water bottle</TextRegular>
          <TextRegular className="mb-2">• Comfortable shoes</TextRegular>
          <TextRegular>• Photo ID</TextRegular>
        </Card>

        <View className="mb-24" />
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1C1C1E] p-4 border-t border-grayBorder pb-8 flex-row gap-3">
        {hasApplied ? (
          <View className="flex-1 bg-green-100 rounded-pill py-4 items-center flex-row justify-center gap-2">
            <Text className="text-teal font-medium text-[16px]">✓ Applied</Text>
          </View>
        ) : (
          <>
            <PillButton label="Save" variant="ghost" className="flex-1 max-w-[100px]" />
            <PillButton label={`Apply — 1 tap`} variant="primary" className="flex-1" onPress={handleApply} />
          </>
        )}
      </View>

      <ApplySheet 
        opportunity={opp} 
        onConfirm={handleConfirmApply} 
        innerRef={applySheetRef} 
      />
    </View>
  );
}
