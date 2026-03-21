import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { TextValueLarge, TextRegular, TextSub } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/PillButton';
import { Card } from '../../components/ui/Card';

export default function SigninStep() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center p-8">
      <TextValueLarge className="mb-2">Welcome to Hourly</TextValueLarge>
      <TextRegular className="text-textMuted mb-8">
        Show up. We handle everything else.
      </TextRegular>
      
      <Card className="gap-6">
        <View className="items-center">
          <TextSub>Sign in to continue</TextSub>
        </View>
        <PillButton 
          label="Sign in with Google" 
          variant="secondary"
          onPress={() => router.push('/onboarding/school')} 
        />
        <PillButton 
          label="Sign in with Email" 
          variant="secondary"
          onPress={() => router.push('/onboarding/school')} 
        />
        <View className="h-[1px] w-full bg-grayBorder my-2" />
        <PillButton 
          label="Continue as Guest" 
          variant="ghost"
          onPress={() => router.push('/onboarding/school')} 
        />
      </Card>
    </View>
  );
}
