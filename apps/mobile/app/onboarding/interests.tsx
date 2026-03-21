// Onboarding Step 3 — Interest/Cause Selection (up to 5 bubbles)
import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/Themed';;
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { PillButton } from '../../components/ui/PillButton';
import { CauseTag } from '../../types';

const CAUSES: { tag: CauseTag; emoji: string }[] = [
  { tag: 'Environment', emoji: '🌿' },
  { tag: 'Education', emoji: '📚' },
  { tag: 'Food', emoji: '🍎' },
  { tag: 'Animals', emoji: '🐾' },
  { tag: 'Seniors', emoji: '☀️' },
  { tag: 'Youth', emoji: '🧒' },
  { tag: 'Health', emoji: '❤️' },
  { tag: 'Arts', emoji: '🎨' },
];

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
      <View style={styles.header}>
        <ProgressBar steps={4} currentStep={2} accent={isOrg ? 'purple' : 'teal'} />
        <PillButton variant="ghost" size="small" onPress={() => router.push(`/onboarding/availability?role=${role || 'student'}`)}>
          Skip for now
        </PillButton>
      </View>

      <View style={styles.content}>
        <Text style={styles.stepLabel}>Step 3 of 4</Text>
        <Text style={styles.title}>
          {isOrg ? 'What causes does your org serve?' : 'What causes are you passionate about?'}
        </Text>
        <Text style={styles.subtitle}>
          Choose up to 5 • {selected.length}/5 selected
        </Text>

        <View style={styles.bubbleGrid}>
          {CAUSES.map(({ tag, emoji }) => {
            const isSelected = selected.includes(tag);
            return (
              <Pressable
                key={tag}
                onPress={() => toggle(tag)}
                style={[
                  styles.bubble,
                  isSelected && {
                    backgroundColor: Colors.causeTags[tag] + '25',
                    borderColor: Colors.causeTags[tag],
                  },
                ]}
              >
                <Text style={styles.bubbleEmoji}>{emoji}</Text>
                <Text
                  style={[
                    styles.bubbleText,
                    isSelected && { color: Colors.causeTags[tag] },
                  ]}
                >
                  {tag}
                </Text>
                {isSelected && (
                  <View style={[styles.checkmark, { backgroundColor: Colors.causeTags[tag] }]}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          <PillButton variant="ghost" size="medium" onPress={() => router.back()} style={{ flex: 1 }}>
            Back
          </PillButton>
          <PillButton
            variant="primary"
            accent={isOrg ? 'purple' : 'teal'}
            size="large"
            onPress={() => router.push(`/onboarding/availability?role=${role || 'student'}`)}
            style={{ flex: 2 }}
          >
            Continue
          </PillButton>
        </View>
      </View>
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
    fontSize: 13,
    fontWeight: '500',
    color: Colors.dark.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: Colors.dark.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
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
  bubbleEmoji: {
    fontSize: 20,
  },
  bubbleText: {
    fontSize: 15,
    fontWeight: '500',
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
  checkmarkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
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
