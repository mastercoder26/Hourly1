import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Card } from '../components/ui/Card';
import { enterFade, enterRise } from '../lib/motion';

export default function RoleSelectionScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Animated.View style={styles.header} entering={enterFade(40)}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressablePressed]}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
      </Animated.View>

      <View style={styles.content}>
        <Animated.View style={styles.titleContainer} entering={enterRise(120)}>
          <Text style={styles.title}>Welcome to Hourly</Text>
          <Text style={styles.subtitle}>How will you be using the platform?</Text>
        </Animated.View>

        <Animated.View style={styles.optionsContainer} entering={enterRise(200)}>
          <Pressable
            onPress={() => router.push('/(auth)/sign-up?role=student')}
            style={({ pressed }) => [styles.rolePressable, pressed && styles.pressablePressed]}
          >
            <Card style={styles.roleCard}>
              <View style={styles.roleContent}>
                <Text style={styles.roleTitle}>I'm a Student</Text>
                <Text style={styles.roleDescription}>Find volunteer opportunities, track hours, and build your portfolio.</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </Card>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(auth)/sign-up?role=organizer')}
            style={({ pressed }) => [styles.rolePressable, pressed && styles.pressablePressed]}
          >
            <Card style={styles.roleCard}>
              <View style={styles.roleContent}>
                <Text style={styles.roleTitle}>I'm an Organizer</Text>
                <Text style={styles.roleDescription}>Post opportunities, manage volunteers, and track impact.</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </Card>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    paddingVertical: 8,
  },
  rolePressable: {
    borderRadius: 20,
  },
  pressablePressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  backText: {
    fontFamily: Typography.label.fontFamily,
    fontSize: 16,
    color: Colors.dark.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontFamily: Typography.valueLarge.fontFamily,
    fontSize: 32,
    fontWeight: Typography.valueLarge.fontWeight as any,
    color: Colors.dark.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Typography.body.fontFamily,
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
  optionsContainer: {
    gap: 16,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.dark.element,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    fontFamily: Typography.label.fontFamily,
    fontSize: 20,
    fontWeight: Typography.label.fontWeight as any,
    color: Colors.dark.textPrimary,
    marginBottom: 8,
  },
  roleDescription: {
    fontFamily: Typography.body.fontFamily,
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
    paddingRight: 16,
  },
  arrow: {
    fontFamily: Typography.body.fontFamily,
    fontSize: 24,
    color: Colors.dark.textPrimary,
  },
});