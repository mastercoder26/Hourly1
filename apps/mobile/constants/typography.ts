// Hourly Design System — Typography
// Clean sans-serif (Inter), two weights: 400 regular, 500 medium

import { Platform } from 'react-native';

const fontFamily = Platform.select({
  web: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  ios: 'Inter',
  android: 'Inter',
  default: 'Inter',
});

export const Typography = {
  // Huge numbers (total hours, balances)
  valueHuge: {
    fontFamily,
    fontSize: 48,
    fontWeight: '400' as const,
    letterSpacing: -1,
    lineHeight: 56,
  },
  // Large values
  valueLarge: {
    fontFamily,
    fontSize: 32,
    fontWeight: '500' as const,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  // Medium values
  valueMedium: {
    fontFamily,
    fontSize: 20,
    fontWeight: '500' as const,
    lineHeight: 26,
  },
  // Section headers (uppercase)
  header: {
    fontFamily,
    fontSize: 13,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  // Page titles
  title: {
    fontFamily,
    fontSize: 28,
    fontWeight: '500' as const,
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  // Subtitle
  subtitle: {
    fontFamily,
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  // Body / labels
  label: {
    fontFamily,
    fontSize: 15,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  // Body regular
  body: {
    fontFamily,
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  // Sub labels (uppercase)
  sub: {
    fontFamily,
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: 0.2,
    textTransform: 'uppercase' as const,
  },
  // Captions
  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  // Small
  small: {
    fontFamily,
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 14,
  },
};
