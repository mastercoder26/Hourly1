import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Surface, Typography, PillButton } from '../components/ui';
import { useRouter } from 'expo-router';

export default function ActiveShiftScreen() {
  const router = useRouter();
  
  // Shift state: mock a 4-hour shift but run a fast timer for demo
  const shiftDurationMins = 240; // 4 hours
  
  // Starting state
  const [elapsedMins, setElapsedMins] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // Fast forward simulation: 1 second = 2 minutes elapsed
  useEffect(() => {
    if (elapsedMins >= shiftDurationMins) {
      setIsDone(true);
      return;
    }

    const interval = setInterval(() => {
      setElapsedMins(prev => Math.min(prev + 2, shiftDurationMins));
    }, 1000);

    return () => clearInterval(interval);
  }, [elapsedMins]);

  // Handle early or normal checkout
  const handleCheckOut = () => {
    Alert.alert(
      "Confirm Checkout",
      "Are you sure you want to end your shift early? Only recorded time will count.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Check Out", 
          style: "destructive",
          onPress: () => {
            // Mock POST /attendance logic and route to home
            router.replace('/(tabs)');
          }
        }
      ]
    );
  };

  const handleFinish = () => {
    // Already did full time
    router.replace('/(tabs)');
  };

  const progressPct = (elapsedMins / shiftDurationMins) * 100;
  
  const formatTime = (totalMins: number) => {
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-zinc-950 p-6">
      <View className="flex-1 items-center justify-center mt-12 pb-12">
        <Typography variant="h2" className="text-center mb-2 text-zinc-900 dark:text-zinc-50">Active Shift</Typography>
        <Typography variant="body" className="text-center mb-10 text-teal-600 dark:text-teal-400 max-w-sm font-medium">City Roots Farm</Typography>

        <Surface className="p-8 items-center bg-zinc-50 dark:bg-zinc-900 shadow-md border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-sm mb-12">
          
          <Typography variant="caption" className="text-zinc-500 dark:text-zinc-400 mb-1">Time Elapsed</Typography>
          <Typography variant="h1" className="text-zinc-900 dark:text-zinc-50 mb-8 font-mono">{formatTime(elapsedMins)}</Typography>

          {/* Progress Bar Container */}
          <View className="w-full h-4 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-4 overflow-hidden">
            {/* Animated Fill */}
            <View 
              className="h-full bg-teal-500 dark:bg-teal-400 rounded-full" 
              style={{ width: `${progressPct}%` }}
            />
          </View>
          
          <View className="w-full flex-row justify-between mb-4">
            <Typography variant="caption" className="text-zinc-500 dark:text-zinc-400">0h 0m</Typography>
            <Typography variant="caption" className="text-zinc-500 dark:text-zinc-400 font-medium">Goal: {formatTime(shiftDurationMins)}</Typography>
          </View>
        </Surface>

        <View className="w-full max-w-sm">
          {isDone ? (
            <PillButton 
              title="Finish & Log Hours" 
              onPress={handleFinish}
              variant="primary"
              className="w-full shadow-lg shadow-teal-500/20"
            />
          ) : (
            <PillButton 
              title="Check Out Early" 
              onPress={handleCheckOut}
              variant="secondary"
              className="w-full"
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}
