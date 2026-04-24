// Onboarding Step 3 - Interest/Cause Selection (up to 5 bubbles)
import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { CauseIcons, IconSizes } from '../../constants/icons';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { PillButton } from '../../components/ui/PillButton';
import { CauseTag } from '../../types';
import { enterFade, enterRise, stagger, MOTION } from '../../lib/motion';

const CAUSES: { tag: CauseTag; icon: keyof typeof Feather.glyphMap }[] = [
  { tag: 'Environment', icon: CauseIcons.Environment },
  { tag: 'Education', icon: CauseIcons.Education },
  { tag: 'Food', icon: CauseIcons.Food },
  { tag: 'Animals', icon: CauseIcons.Animals },
  { tag: 'Seniors', icon: CauseIcons.Seniors },
  { tag: 'Youth', icon: CauseIcons.Youth },
  { tag: 'Health', icon: CauseIcons.Health },
  { tag: 'Arts', icon: CauseIcons.Arts },
];

// Animated cause bubble with spring feedback
interface CauseBubbleProps {
  tag: CauseTag;
  icon: keyof typeof Feather.glyphMap;
  isSelected: boolean;
  causeColor: string;
  onPress: () => void;
}

function CauseBubble({ tag, icon, isSelected, causeColor, onPress }: CauseBubbleProps) {
  const scale = useSharedValue(1);
  const selected = useSharedValue(isSelected ? 1 : 0);

  React.useEffect(() => {
    selected.value = withSpring(isSelected ? 1 : 0, MOTION.springSnappy);
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(
      selected.value,
      [0, 1],
      [Colors.dark.element, causeColor + '25']
    ),
    borderColor: interpolateColor(
      selected.value,
      [0, 1],
      ['transparent', causeColor]
    ),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(selected.value ? 1.1 : 1, MOTION.springSnappy) },
    ],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(selected.value, MOTION.springSnappy) },
    ],
    opacity: selected.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, MOTION.springSnappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, MOTION.spring);
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.bubble, animatedStyle]}>
        <Animated.View style={iconStyle}>
          <Feather
            name={icon}
            size={IconSizes.medium}
            color={isSelected ? causeColor : Colors.dark.textSecondary}
          />
        </Animated.View>
        <Text
          style={[
            styles.bubbleText,
            isSelected && { color: causeColor },
          ]}
        >
          {tag}
        </Text>
        <Animated.View style={[styles.checkmark, { backgroundColor: causeColor }, checkStyle]}>
          <Feather name="check" size={10} color="#000000" />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

export default function InterestsStep() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const isOrg = role === 'organizer';
  const [selected, setSelected] = useState<CauseTag[]>([]);

  const toggle = (tag: CauseTag) => {
    if (selected.includes(tag)) {
      setSelected(selected.filter(t => t !== tag));
    } else if (selected.length < 5) {
      setSelected([...selected, tag]);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={styles.header} entering={enterFade(40)}>
        <ProgressBar steps={4} currentStep={2} accent="purple" />
        <PillButton variant="ghost" size="small" onPress={() => router.push(`/onboarding/availability?role=${role || 'student'}`)}>
          Skip for now
        </PillButton>
      </Animated.View>

      <View style={styles.content}>
        <Animated.View entering={enterRise(120)}>
          <Text style={styles.stepLabel}>Step 3 of 4</Text>
          <Text style={styles.title}>
            {isOrg ? 'What causes does your org serve?' : 'What causes are you passionate about?'}
          </Text>
          <Text style={styles.subtitle}>
            Choose up to 5 • {selected.length}/5 selected
          </Text>
        </Animated.View>

        <View style={styles.bubbleGrid}>
          {CAUSES.map(({ tag, icon }, index) => {
            const isSelected = selected.includes(tag);
            const causeColor = Colors.causeTags[tag];
            return (
              <Animated.View key={tag} entering={enterRise(stagger(index, 200, 35, 420))}>
                <CauseBubble
                  tag={tag}
                  icon={icon}
                  isSelected={isSelected}
                  causeColor={causeColor}
                  onPress={() => toggle(tag)}
                />
              </Animated.View>
            );
          })}
        </View>
      </View>

      <Animated.View style={styles.footer} entering={enterRise(280)}>
        <View style={styles.footerButtons}>
          <PillButton variant="ghost" size="medium" onPress={() => router.back()} style={{ flex: 1 }}>
            Back
          </PillButton>
          <PillButton
            variant="primary"
            size="large"
            onPress={() => router.push(`/onboarding/availability?role=${role || 'student'}`)}
            style={{ flex: 2 }}
          >
            Continue
          </PillButton>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  stepLabel: {
    fontFamily: Typography.sub.fontFamily,
    fontSize: Typography.sub.fontSize,
    fontWeight: Typography.sub.fontWeight as any,
    color: Colors.dark.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  title: {
    fontFamily: Typography.title.fontFamily,
    fontSize: Typography.title.fontSize,
    fontWeight: Typography.title.fontWeight,
    color: Colors.dark.textPrimary,
    letterSpacing: Typography.title.letterSpacing,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
    color: Colors.dark.textSecondary,
    marginBottom: 32,
  },
  bubbleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: Colors.dark.element,
    borderWidth: 1.5,
    borderColor: 'transparent',
    position: 'relative',
  },
  bubbleText: {
    fontFamily: Typography.label.fontFamily,
    fontSize: Typography.label.fontSize,
    fontWeight: Typography.label.fontWeight,
    color: Colors.dark.textSecondary,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
});
