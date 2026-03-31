import { Platform } from 'react-native';

const fontFamily = Platform.select({
  web: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
  ios: 'SF Pro Display',
  android: 'Roboto',
  default: 'System',
});

const fontFamilyMono = Platform.select({
  web: "'SF Mono', Menlo, Monaco, monospace",
  ios: 'SF Mono',
  android: 'monospace',
  default: 'monospace',
});

export const Typography = {
  // Display sizes for hero numbers
  displayHuge: { fontFamily, fontSize: 72, fontWeight: '300' as const, letterSpacing: -2, lineHeight: 80 },
  displayLarge: { fontFamily, fontSize: 56, fontWeight: '400' as const, letterSpacing: -1.5, lineHeight: 64 },
  
  // Value sizes for stats and data
  valueHuge: { fontFamily, fontSize: 48, fontWeight: '400' as const, letterSpacing: -1, lineHeight: 56 },
  valueLarge: { fontFamily, fontSize: 32, fontWeight: '500' as const, letterSpacing: -0.5, lineHeight: 38 },
  valueMedium: { fontFamily, fontSize: 24, fontWeight: '500' as const, letterSpacing: -0.3, lineHeight: 30 },
  
  // Monospace for data values (transaction IDs, precise numbers)
  mono: { fontFamily: fontFamilyMono, fontSize: 14, fontWeight: '400' as const, letterSpacing: 0 },
  monoSmall: { fontFamily: fontFamilyMono, fontSize: 12, fontWeight: '400' as const, letterSpacing: 0 },
  
  // Section headers (uppercase, spaced)
  header: { 
    fontFamily, 
    fontSize: 12, 
    fontWeight: '600' as const, 
    letterSpacing: 0.8, 
    textTransform: 'uppercase' as const, 
    color: '#8E8E93' 
  },
  headerLarge: { 
    fontFamily, 
    fontSize: 13, 
    fontWeight: '600' as const, 
    letterSpacing: 0.6, 
    textTransform: 'uppercase' as const, 
    color: '#8E8E93' 
  },
  
  // Content typography
  title: { fontFamily, fontSize: 28, fontWeight: '600' as const, letterSpacing: -0.4, lineHeight: 34 },
  titleSmall: { fontFamily, fontSize: 22, fontWeight: '600' as const, letterSpacing: -0.3, lineHeight: 28 },
  subtitle: { fontFamily, fontSize: 17, fontWeight: '500' as const, lineHeight: 22 },
  
  // Body text
  label: { fontFamily, fontSize: 15, fontWeight: '500' as const, lineHeight: 20 },
  body: { fontFamily, fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodySmall: { fontFamily, fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  
  // Secondary text
  sub: { 
    fontFamily, 
    fontSize: 12, 
    fontWeight: '500' as const, 
    letterSpacing: 0.3, 
    textTransform: 'uppercase' as const, 
    color: '#8E8E93' 
  },
  caption: { fontFamily, fontSize: 12, fontWeight: '400' as const, lineHeight: 16, color: '#8E8E93' },
  small: { fontFamily, fontSize: 11, fontWeight: '400' as const, lineHeight: 14 },
  tiny: { fontFamily, fontSize: 10, fontWeight: '500' as const, lineHeight: 12 },
};
