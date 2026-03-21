import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { TextValueLarge, TextRegular, TextSub } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/PillButton';
import { Card } from '../../components/ui/Card';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GRADES = ['9th', '10th', '11th', '12th', 'College', 'Other'];

export default function SchoolStep() {
  const router = useRouter();
  const [zipCode, setZipCode] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');

  const handleNext = async () => {
    try {
      await AsyncStorage.setItem('onboarding_school', JSON.stringify({ zipCode, school, grade }));
    } catch (e) {
      console.error('Failed to save to storage', e);
    }
    router.push('/onboarding/interests');
  };

  const handleSkip = () => {
    router.push('/onboarding/interests');
  };

  return (
    <View className="flex-1 justify-between p-8 pt-12">
      <View>
        <TextValueLarge className="mb-2">Your School</TextValueLarge>
        <TextRegular className="text-textMuted mb-8">
          This helps us match you with local opportunities and counselor tracking.
        </TextRegular>
        
        <Card className="gap-6 mb-6 p-6">
          <View>
            <TextSub className="mb-2">ZIP Code</TextSub>
            <TextInput 
              className="bg-offWhite dark:bg-[#2C2C2E] text-textPrimary px-4 py-3 rounded-small font-medium"
              placeholder="e.g. 90210"
              placeholderTextColor="#888888"
              keyboardType="number-pad"
              value={zipCode}
              onChangeText={setZipCode}
            />
          </View>

          <View>
            <TextSub className="mb-2">School Name</TextSub>
            <TextInput 
              className="bg-offWhite dark:bg-[#2C2C2E] text-textPrimary px-4 py-3 rounded-small font-medium"
              placeholder="High School or College"
              placeholderTextColor="#888888"
              value={school}
              onChangeText={setSchool}
            />
          </View>
        </Card>

        <TextSub className="mb-3 ml-2">Grade Level</TextSub>
        <View className="flex-row flex-wrap gap-3">
          {GRADES.map(g => (
            <TouchableOpacity 
              key={g}
              onPress={() => setGrade(g)}
              className={`px-5 py-2.5 rounded-pill border ${
                grade === g 
                  ? 'bg-teal border-teal' 
                  : 'bg-transparent border-grayBorder'
              }`}
            >
              <Text className={`font-medium ${grade === g ? 'text-white' : 'text-textPrimary'}`}>
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="gap-4">
        <PillButton label="Next" variant="primary" onPress={handleNext} />
        <PillButton label="Skip for now" variant="ghost" onPress={handleSkip} />
      </View>
    </View>
  );
}
