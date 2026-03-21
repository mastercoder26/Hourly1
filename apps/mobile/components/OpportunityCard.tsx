import { View, Text, TouchableOpacity } from 'react-native';
import { Opportunity } from '../mocks/opportunities';
import { Card } from './ui/Card';
import { TextValueLarge, TextRegular, TextSub } from './ui/Typography';
import { useRouter } from 'expo-router';

export function OpportunityCard({ item }: { item: Opportunity }) {
  const router = useRouter();

  const isUrgent = item.spotsRemaining < 5;
  const isCritical = item.spotsRemaining === 1;

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={() => router.push(`/opportunity/${item.id}` as any)}
      className="mb-4"
    >
      <Card className="gap-3">
        <View className="flex-row justify-between items-start">
          <View className="flex-1 pr-2">
            <TextSub className="text-teal mb-1">{item.orgName}</TextSub>
            <TextValueLarge className="text-[22px] leading-7">{item.roleTitle}</TextValueLarge>
          </View>
          <View className={`px-3 py-1 rounded-pill ${
            item.cause === 'Environment' ? 'bg-green-100 dark:bg-green-900/30' : 
            item.cause === 'Food' ? 'bg-orange-100 dark:bg-orange-900/30' : 
            'bg-purple-100 dark:bg-purple-900/30'
          }`}>
            <Text className="text-xs font-medium dark:text-gray-200">{item.cause}</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-4 mt-2">
          <TextRegular className="text-textMuted">{item.dateTime}</TextRegular>
          <View className="w-1 h-1 rounded-full bg-grayBorder" />
          <TextRegular className="text-textMuted">{item.distance} mi</TextRegular>
          <View className="w-1 h-1 rounded-full bg-grayBorder" />
          <TextRegular className="text-textMuted">{item.hours} hrs</TextRegular>
        </View>

        <View className="flex-row justify-between items-center mt-4">
          <View className="flex-row gap-2">
             {item.creditEligible && (
              <View className="bg-[#534AB715] px-2 py-1 rounded-sm">
                <Text className="text-[10px] uppercase font-bold text-purple">Eligible</Text>
              </View>
             )}
          </View>
          <TextRegular className={`font-medium ${
            isCritical ? 'text-red-500' : isUrgent ? 'text-orange-500' : 'text-textPrimary'
          }`}>
            {item.spotsRemaining} spot{item.spotsRemaining !== 1 ? 's' : ''} left
          </TextRegular>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
