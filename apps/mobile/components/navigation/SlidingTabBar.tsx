import React, { useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Platform,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useReducedMotion,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { CommonActions } from '@react-navigation/native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { nativeTabBarStyle } from '../../constants/tabBar';
import { MOTION, haptic } from '../../lib/motion';

const INDICATOR_WIDTH = 28;
const INDICATOR_HEIGHT = 3;

function indicatorXForIndex(index: number, trackWidth: number, tabCount: number): number {
  if (trackWidth <= 0 || tabCount <= 0) return 0;
  const cellW = trackWidth / tabCount;
  return index * cellW + (cellW - INDICATOR_WIDTH) / 2;
}

export function SlidingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const [trackW, setTrackW] = React.useState(() => Math.max(320, windowWidth));
  const translateX = useSharedValue(0);
  const tabCount = state.routes.length;

  const moveIndicator = useCallback(
    (index: number, width: number) => {
      const x = indicatorXForIndex(index, width, tabCount);
      if (reduceMotion) {
        translateX.value = withTiming(x, {
          duration: MOTION.duration.quick,
          easing: MOTION.easeOut,
        });
      } else {
        translateX.value = withSpring(x, MOTION.springSnappy);
      }
    },
    [tabCount, translateX, reduceMotion],
  );

  useEffect(() => {
    moveIndicator(state.index, trackW);
  }, [state.index, trackW, moveIndicator]);

  const onRowLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      setTrackW(w);
      moveIndicator(state.index, w);
    },
    [state.index, moveIndicator],
  );

  if (Platform.OS === 'web' && windowWidth > 768) {
    return null;
  }

  const barStyle = nativeTabBarStyle(insets);
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={barStyle} accessibilityRole="tablist">
      <View style={styles.iconRow} onLayout={onRowLayout}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const onPress = () => {
            const pressEvent = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !pressEvent.defaultPrevented) {
              navigation.dispatch({
                ...CommonActions.navigate(route),
                target: state.key,
              });
              haptic.selection();
            }
          };
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={options.title ?? options.tabBarAccessibilityLabel ?? route.name}
              onPress={onPress}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              style={styles.tabCell}
            >
              {options.tabBarIcon?.({
                focused,
                color: focused ? Colors.dark.textPrimary : Colors.dark.textTertiary,
                size: 24,
              })}
            </Pressable>
          );
        })}
      </View>
      <View style={styles.indicatorTrack} pointerEvents="none" accessibilityElementsHidden>
        <Animated.View style={[styles.indicator, indicatorStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
  },
  tabCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  indicatorTrack: {
    height: INDICATOR_HEIGHT + 4,
    width: '100%',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    bottom: 2,
    width: INDICATOR_WIDTH,
    height: INDICATOR_HEIGHT,
    borderRadius: INDICATOR_HEIGHT / 2,
    backgroundColor: Colors.accent,
  },
});
