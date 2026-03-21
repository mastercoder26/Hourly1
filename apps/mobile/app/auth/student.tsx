import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { PillButton } from '../../components/ui/PillButton';

export default function StudentAuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (mode === 'signup') {
      // Mock signup → go through student onboarding (school, interests, availability)
      router.push('/onboarding/school');
    } else {
      // Mock login → go straight to student tabs
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-offWhite dark:bg-black">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-8 pt-6 pb-12">
            {/* Back */}
            <TouchableOpacity onPress={() => router.back()} className="mb-8">
              <Text className="text-textMuted text-[15px]">← Back</Text>
            </TouchableOpacity>

            {/* Header */}
            <View className="mb-8">
              <Text className="text-[32px] font-semibold text-textPrimary tracking-tight">
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </Text>
              <Text className="text-textMuted text-[15px] mt-2">
                {mode === 'login'
                  ? 'Sign in to your student account'
                  : 'Start tracking your volunteer hours'}
              </Text>
            </View>

            {/* Mode Toggle */}
            <View className="flex-row bg-grayBorder rounded-pill p-1 mb-8 self-start">
              <TouchableOpacity
                onPress={() => setMode('login')}
                className={`px-6 py-2.5 rounded-pill ${mode === 'login' ? 'bg-white dark:bg-[#1C1C1E]' : ''}`}
              >
                <Text className={`text-[14px] font-medium ${mode === 'login' ? 'text-textPrimary' : 'text-textMuted'}`}>
                  Log In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMode('signup')}
                className={`px-6 py-2.5 rounded-pill ${mode === 'signup' ? 'bg-white dark:bg-[#1C1C1E]' : ''}`}
              >
                <Text className={`text-[14px] font-medium ${mode === 'signup' ? 'text-textPrimary' : 'text-textMuted'}`}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View className="gap-4 mb-6">
              {mode === 'signup' && (
                <View>
                  <Text className="text-textMuted text-[12px] uppercase tracking-wider mb-2">Full Name</Text>
                  <TextInput
                    className="bg-white dark:bg-[#1C1C1E] border-[0.5px] border-grayBorder rounded-small px-4 py-4 text-textPrimary text-[15px]"
                    placeholder="Sarah Jenkins"
                    placeholderTextColor="#888888"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              )}

              <View>
                <Text className="text-textMuted text-[12px] uppercase tracking-wider mb-2">Email</Text>
                <TextInput
                  className="bg-white dark:bg-[#1C1C1E] border-[0.5px] border-grayBorder rounded-small px-4 py-4 text-textPrimary text-[15px]"
                  placeholder="you@school.edu"
                  placeholderTextColor="#888888"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text className="text-textMuted text-[12px] uppercase tracking-wider mb-2">Password</Text>
                <TextInput
                  className="bg-white dark:bg-[#1C1C1E] border-[0.5px] border-grayBorder rounded-small px-4 py-4 text-textPrimary text-[15px]"
                  placeholder="••••••••"
                  placeholderTextColor="#888888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <PillButton
              label={mode === 'login' ? 'Log In' : 'Create Account'}
              variant="primary"
              size="large"
              onPress={handleSubmit}
              className="mb-4"
            />

            <View className="flex-row items-center gap-4 my-4">
              <View className="flex-1 h-[0.5px] bg-grayBorder" />
              <Text className="text-textMuted text-[12px]">or</Text>
              <View className="flex-1 h-[0.5px] bg-grayBorder" />
            </View>

            <PillButton
              label="Continue with Google"
              variant="ghost"
              size="large"
              onPress={handleSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
