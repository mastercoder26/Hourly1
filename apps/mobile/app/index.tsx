import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function IntroScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-offWhite dark:bg-black">
      <View className="flex-1 justify-between px-8 py-12">
        {/* Header */}
        <View className="items-center mt-12">
          <Text className="text-[42px] font-bold text-teal tracking-tight">hourly</Text>
          <Text className="text-textMuted text-[16px] mt-2 text-center">
            Volunteer smarter. Grow faster.
          </Text>
        </View>

        {/* Role Selection */}
        <View className="gap-5">
          <Text className="text-textPrimary text-[18px] font-semibold text-center mb-2">
            I am a...
          </Text>

          {/* Student Card */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/auth/student')}
            className="bg-white dark:bg-[#1C1C1E] border-[0.5px] border-grayBorder rounded-card p-8 flex-row items-center gap-5"
          >
            <View className="w-14 h-14 rounded-full bg-[#1D9E7520] items-center justify-center">
              <Text className="text-[28px]">🎓</Text>
            </View>
            <View className="flex-1">
              <Text className="text-textPrimary text-[18px] font-semibold">Student</Text>
              <Text className="text-textMuted text-[13px] mt-1">
                Find volunteer roles, track hours, build your portfolio
              </Text>
            </View>
            <Text className="text-textMuted text-[20px]">›</Text>
          </TouchableOpacity>

          {/* Org Card */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/auth/org')}
            className="bg-white dark:bg-[#1C1C1E] border-[0.5px] border-grayBorder rounded-card p-8 flex-row items-center gap-5"
          >
            <View className="w-14 h-14 rounded-full bg-[#534AB720] items-center justify-center">
              <Text className="text-[28px]">🏢</Text>
            </View>
            <View className="flex-1">
              <Text className="text-textPrimary text-[18px] font-semibold">Organization</Text>
              <Text className="text-textMuted text-[13px] mt-1">
                Post roles, manage volunteers, track impact
              </Text>
            </View>
            <Text className="text-textMuted text-[20px]">›</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="items-center">
          <Text className="text-textMuted text-[12px] text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
