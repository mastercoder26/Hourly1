import { Platform, type ViewStyle } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { Colors } from './colors';

const bottomPadFloor = () => Platform.select({ android: 10, default: 6 }) ?? 6;

/** Height of the tab bar content row (icons + sliding indicator track). */
export const TAB_BAR_ROW_HEIGHT = 48;

type TabBarOptions = { borderColor?: string };

/**
 * Native bottom tab bar: safe-area bottom inset + fixed row so icons are not clipped.
 */
export function nativeTabBarStyle(insets: EdgeInsets, opts?: TabBarOptions): ViewStyle {
  const borderColor = opts?.borderColor ?? Colors.dark.divider;
  const bottomPad = Math.max(insets.bottom, bottomPadFloor());
  return {
    backgroundColor: Colors.dark.base,
    borderTopWidth: 1,
    borderTopColor: borderColor,
    height: TAB_BAR_ROW_HEIGHT + bottomPad,
    paddingTop: 2,
    paddingBottom: bottomPad,
    paddingHorizontal: 0,
    elevation: 0,
    shadowOpacity: 0,
  };
}

/**
 * Extra bottom padding for ScrollView/FlatList on tab screens so the last item clears the tab bar.
 * Web uses a slim inset: the native tab bar is hidden in wide layout.
 */
export function tabBarScrollContentPadding(insets: EdgeInsets): number {
  if (Platform.OS === 'web') {
    return 24;
  }
  const bottom = Math.max(insets.bottom, bottomPadFloor());
  return 16 + TAB_BAR_ROW_HEIGHT + bottom;
}

/** Top padding for tab screen scroll content: safe area on native, comfortable gap on web. */
export function tabScreenContentTopPadding(insets: EdgeInsets): number {
  if (Platform.OS === 'web') {
    return 24;
  }
  return insets.top + 16;
}
