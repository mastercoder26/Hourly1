import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { TextValueLarge, TextRegular, TextSub } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/PillButton';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const LENGTHS = ['1-2 hours', '2-4 hours', 'Half day', 'Whole day'];

export default function AvailabilityStep() {
  const router = useRouter();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedLength, setSelectedLength] = useState<string>('');

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleFinish = async () => {
    await AsyncStorage.setItem('onboarding_availability', JSON.stringify({ days: selectedDays, length: selectedLength }));
    // Future: API syncing here
    // Redirect to home/feed when done
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 justify-between p-8 pt-12">
      <View>
        <TextValueLarge className="mb-2">When are you free?</TextValueLarge>
        <TextRegular className="text-textMuted mb-8">
          This helps the matching algorithm find roles that fit your schedule.
        </TextRegular>
        
        <TextSub className="mb-3 ml-2">Days of the week</TextSub>
        <View className="flex-row flex-wrap gap-3 mb-8">
          {DAYS.map(day => (
            <TouchableOpacity 
              key={day}
              onPress={() => toggleDay(day)}
              className={`px-4 py-2.5 rounded-pill border ${
                selectedDays.includes(day) 
                  ? 'bg-teal border-teal' 
                  : 'bg-transparent border-grayBorder'
              }`}
            >
              <Text className={`font-medium ${selectedDays.includes(day) ? 'text-white' : 'text-textPrimary'}`}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextSub className="mb-3 ml-2">Preferred Shift Length</TextSub>
        <View className="flex-row flex-wrap gap-3">
            {LENGTHS.map(len => (
              <TouchableOpacity 
                key={len}
                onPress={() => setSelectedLength(len)}
                className={`px-5 py-3 rounded-pill border w-[48%] items-center ${
                  selectedLength === len 
                    ? 'bg-purple border-purple' 
                    : 'bg-transparent border-grayBorder'
                }`}
              >
                <Text className={`font-medium ${selectedLength === len ? 'text-white' : 'text-textPrimary'}`}>
                  {len}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>

      <View className="gap-4">
        <PillButton label="Complete Setup" variant="primary" onPress={handleFinish} />
        <PillButton label="Skip for now" variant="ghost" onPress={handleSkip} />
      </View>
    </View>
  );
}
