import { Platform } from 'react-native';

const fontFamily = Platform.select({
  web: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  ios: 'Inter',
  android: 'Inter',
  default: 'Inter',
});

export const Typography = {
  valueHuge: { fontFamily, fontSize: 48, fontWeight: '400' as const, letterSpacing: -1, lineHeight: 56 },
  valueLarge: { fontFamily, fontSize: 32, fontWeight: '500' as const, letterSpacing: -0.5, lineHeight: 38 },
  valueMedium: { fontFamily, fontSize: 20, fontWeight: '500' as const, lineHeight: 26 },
  header: { fontFamily, fontSize: 13, fontWeight: '500' as const, letterSpacing: 0.5, textTransform: 'uppercase' as const, color: '#8E8E93' },
  title: { fontFamily, fontSize: 24, fontWeight: '500' as const, letterSpacing: 0, lineHeight: 32 },
  subtitle: { fontFamily, fontSize: 17, fontWeight: '400' as const, lineHeight: 22 },
  label: { fontFamily, fontSize: 15, fontWeight: '500' as const, lineHeight: 20 },
  body: { fontFamily, fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  sub: { fontFamily, fontSize: 13, fontWeight: '400' as const, letterSpacing: 0.2, textTransform: 'uppercase' as const, color: '#8E8E93' },
  caption: { fontFamily, fontSize: 12, fontWeight: '400' as const, lineHeight: 18, color: '#8E8E93' },
  small: { fontFamily, fontSize: 11, fontWeight: '400' as const, lineHeight: 14 }
};
