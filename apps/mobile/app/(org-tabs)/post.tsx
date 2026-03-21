import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Text, Switch } from 'react-native';
import { Card, TextValueLarge, TextRegular, TextCaption, TextSub, PillButton } from '../../components/ui';
import { useRouter } from 'expo-router';

const CAUSE_TAGS = ['Environment', 'Education', 'Health', 'Animals', 'Food', 'Youth', 'Seniors', 'Arts'];

export default function PostRoleTab() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [spots, setSpots] = useState('');
  const [creditEligible, setCreditEligible] = useState(false);
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(false);

  const toggleCause = (cause: string) => {
    if (selectedCauses.includes(cause)) {
      setSelectedCauses(selectedCauses.filter(c => c !== cause));
    } else if (selectedCauses.length < 3) {
      setSelectedCauses([...selectedCauses, cause]);
    }
  };

  const handlePublish = () => {
    setPublished(true);
  };

  if (published) {
    return (
      <SafeAreaView className="flex-1 bg-offWhite dark:bg-black">
        <View className="flex-1 items-center justify-center p-8">
          <View className="w-20 h-20 rounded-full bg-[#534AB720] items-center justify-center mb-6">
            <Text className="text-[36px]">✓</Text>
          </View>
          <TextValueLarge className="text-center mb-3 text-[24px]">Role Published!</TextValueLarge>
          <TextRegular className="text-textMuted text-center mb-8">
            Your role is now live. Volunteers will start applying soon.
          </TextRegular>
          <PillButton
            label="Back to Dashboard"
            onPress={() => {
              setPublished(false);
              setStep(1);
              setTitle('');
              setSelectedCauses([]);
              router.push('/(org-tabs)');
            }}
            style={{ backgroundColor: '#534AB7' }}
            className="w-full"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-offWhite dark:bg-black">
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <TextCaption className="text-purple font-bold uppercase tracking-widest mb-1">Step {step} of 3</TextCaption>
          <TextValueLarge>Post a Role</TextValueLarge>
        </View>

        {/* Progress bar */}
        <View className="h-2 w-full bg-grayBorder rounded-full mb-8 overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{ width: `${(step / 3) * 100}%`, backgroundColor: '#534AB7' }}
          />
        </View>

        {step === 1 && (
          <View className="gap-5">
            <Card className="p-5">
              <TextSub className="mb-2">Role Title *</TextSub>
              <TextInput
                className="bg-offWhite dark:bg-[#2C2C2E] text-textPrimary px-4 py-3 rounded-small"
                placeholder="e.g. Tree Planter, Event Setup..."
                placeholderTextColor="#888888"
                value={title}
                onChangeText={setTitle}
              />
            </Card>

            <Card className="p-5">
              <TextSub className="mb-3">Cause Tags (up to 3)</TextSub>
              <View className="flex-row flex-wrap gap-2">
                {CAUSE_TAGS.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => toggleCause(tag)}
                    className={`px-4 py-2 rounded-pill border ${
                      selectedCauses.includes(tag)
                        ? 'border-purple bg-[#534AB715]'
                        : 'border-grayBorder bg-transparent'
                    }`}
                  >
                    <Text className={`text-[13px] font-medium ${
                      selectedCauses.includes(tag) ? 'text-purple' : 'text-textPrimary'
                    }`}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>

            <Card className="p-5">
              <TextSub className="mb-2">Description</TextSub>
              <TextInput
                className="bg-offWhite dark:bg-[#2C2C2E] text-textPrimary px-4 py-3 rounded-small"
                placeholder="Describe the role, tasks, and what to bring..."
                placeholderTextColor="#888888"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                style={{ minHeight: 80 }}
              />
            </Card>
          </View>
        )}

        {step === 2 && (
          <View className="gap-5">
            <Card className="p-5">
              <TextSub className="mb-2">Date & Time *</TextSub>
              <TextInput
                className="bg-offWhite dark:bg-[#2C2C2E] text-textPrimary px-4 py-3 rounded-small"
                placeholder="e.g. Sat, Nov 5 • 9:00 AM – 1:00 PM"
                placeholderTextColor="#888888"
                value={date}
                onChangeText={setDate}
              />
            </Card>

            <Card className="p-5">
              <TextSub className="mb-2">Location *</TextSub>
              <TextInput
                className="bg-offWhite dark:bg-[#2C2C2E] text-textPrimary px-4 py-3 rounded-small"
                placeholder="123 Farm Rd, City, State"
                placeholderTextColor="#888888"
                value={location}
                onChangeText={setLocation}
              />
            </Card>

            <Card className="p-5">
              <TextSub className="mb-2">Number of Spots</TextSub>
              <TextInput
                className="bg-offWhite dark:bg-[#2C2C2E] text-textPrimary px-4 py-3 rounded-small"
                placeholder="e.g. 10"
                placeholderTextColor="#888888"
                value={spots}
                onChangeText={setSpots}
                keyboardType="number-pad"
              />
            </Card>
          </View>
        )}

        {step === 3 && (
          <View className="gap-5">
            <Card className="p-5">
              <View className="flex-row justify-between items-center mb-4">
                <View>
                  <TextRegular className="font-semibold">Credit Eligible</TextRegular>
                  <TextCaption className="mt-1">Students can earn school credit</TextCaption>
                </View>
                <Switch
                  value={creditEligible}
                  onValueChange={setCreditEligible}
                  trackColor={{ false: '#E4E4E4', true: '#534AB7' }}
                  thumbColor="white"
                />
              </View>
            </Card>

            {/* Preview */}
            <TextSub className="mb-2">Preview</TextSub>
            <Card className="p-5">
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 pr-4">
                  <TextSub className="text-purple mb-1">City Roots Farm</TextSub>
                  <TextRegular className="font-semibold text-[18px]">{title || 'Your Role Title'}</TextRegular>
                </View>
                {selectedCauses[0] && (
                  <View className="bg-[#534AB715] px-2 py-1 rounded-pill">
                    <Text className="text-purple text-[11px] font-medium">{selectedCauses[0]}</Text>
                  </View>
                )}
              </View>
              {date && <TextCaption className="mb-1">📅 {date}</TextCaption>}
              {location && <TextCaption className="mb-1">📍 {location}</TextCaption>}
              {spots && <TextCaption>👥 {spots} spots available</TextCaption>}
              {creditEligible && (
                <View className="mt-3 bg-[#534AB715] px-3 py-1 rounded-pill self-start">
                  <Text className="text-purple text-[11px] font-bold uppercase">Credit Eligible</Text>
                </View>
              )}
            </Card>
          </View>
        )}

        {/* Navigation */}
        <View className="flex-row gap-3 mt-8 mb-12">
          {step > 1 && (
            <PillButton
              label="Back"
              variant="ghost"
              onPress={() => setStep(step - 1)}
              className="flex-1"
            />
          )}
          {step < 3 ? (
            <PillButton
              label="Next"
              onPress={() => setStep(step + 1)}
              style={{ backgroundColor: '#534AB7' }}
              className="flex-1"
            />
          ) : (
            <PillButton
              label="Publish Role"
              onPress={handlePublish}
              style={{ backgroundColor: '#534AB7' }}
              className="flex-1"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
