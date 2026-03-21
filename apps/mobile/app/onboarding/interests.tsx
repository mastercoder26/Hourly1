import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { TextValueLarge, TextRegular } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/PillButton';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CAUSES = ['Environment', 'Education', 'Food', 'Animals', 'Seniors', 'Youth', 'Health', 'Arts'];

export default function InterestsStep() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCause = (cause: string) => {
    if (selected.includes(cause)) {
      setSelected(selected.filter(c => c !== cause));
    } else if (selected.length < 5) {
      setSelected([...selected, cause]);
    }
  };

  const handleNext = async () => {
    await AsyncStorage.setItem('onboarding_interests', JSON.stringify(selected));
    router.push('/onboarding/availability');
  };

  const handleSkip = () => {
    router.push('/onboarding/availability');
  };

  return (
    <View className="flex-1 justify-between p-8 pt-12">
      <View>
        <TextValueLarge className="mb-2">What do you care about?</TextValueLarge>
        <TextRegular className="text-textMuted mb-2">
          Pick up to 5 causes. We'll show you roles that match.
        </TextRegular>
        <TextRegular className="text-teal mb-8 font-medium">
          {selected.length}/5 Selected
        </TextRegular>
        
        <View className="flex-row flex-wrap gap-3">
          {CAUSES.map(cause => {
            const isSelected = selected.includes(cause);
            return (
              <TouchableOpacity 
                key={cause}
                onPress={() => toggleCause(cause)}
                className={`px-6 py-4 rounded-pill border-2 ${
                  isSelected 
                    ? 'bg-[#1D9E7515] border-teal' 
                    : 'bg-transparent border-grayBorder dark:border-[#2C2C2E]'
                }`}
              >
                <Text className={`font-medium text-[16px] ${
                  isSelected ? 'text-teal' : 'text-textPrimary'
                }`}>
                  {cause}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      <View className="gap-4">
        <PillButton 
          label="Next" 
          variant={selected.length > 0 ? "primary" : "secondary"} 
          onPress={handleNext} 
        />
        <PillButton label="Skip for now" variant="ghost" onPress={handleSkip} />
      </View>
    </View>
  );
}
