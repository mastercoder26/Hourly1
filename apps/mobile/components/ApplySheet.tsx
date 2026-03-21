import React, { useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { PillButton } from './ui/PillButton';
import { TextValueLarge, TextRegular, TextSub } from './ui/Typography';
import { Opportunity } from '../mocks/opportunities';

interface ApplySheetProps {
  opportunity: Opportunity;
  onConfirm: () => void;
  innerRef: React.RefObject<BottomSheet>;
}

export function ApplySheet({ opportunity, onConfirm, innerRef }: ApplySheetProps) {
  return (
    <BottomSheet
      ref={innerRef}
      snapPoints={['50%']}
      index={-1}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: '#F7F7F5' }}
    >
      <BottomSheetView className="flex-1 px-6 pb-8 bg-offWhite dark:bg-[#1C1C1E]">
        <View className="items-center mb-6 mt-2">
          <TextValueLarge className="text-[24px]">Confirm Application</TextValueLarge>
          <TextSub className="mt-2 text-teal">{opportunity.orgName}</TextSub>
        </View>

        <View className="bg-white dark:bg-[#2C2C2E] p-5 rounded-card border-[0.5px] border-grayBorder mb-6">
          <TextRegular className="font-bold mb-4">{opportunity.roleTitle}</TextRegular>
          
          <View className="flex-row justify-between mb-2">
            <TextRegular className="text-textMuted">When</TextRegular>
            <TextRegular>{opportunity.dateTime}</TextRegular>
          </View>
          
          <View className="flex-row justify-between mb-2">
            <TextRegular className="text-textMuted">Duration</TextRegular>
            <TextRegular>{opportunity.hours} hours</TextRegular>
          </View>
          
           {opportunity.creditEligible && (
            <View className="bg-[#534AB715] px-2 py-1 rounded-sm self-start mt-2">
              <Text className="text-[10px] uppercase font-bold text-purple">Eligible for Credit</Text>
            </View>
           )}
        </View>

        <PillButton 
          label="Confirm & Apply" 
          variant="primary" 
          onPress={onConfirm} 
        />
        <PillButton 
          label="Cancel" 
          variant="ghost" 
          className="mt-3" 
          onPress={() => innerRef.current?.close()} 
        />
      </BottomSheetView>
    </BottomSheet>
  );
}
