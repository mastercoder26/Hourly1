// Web-specific styles and utilities
// Provides CSS-like styling for web platform

import { Platform, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

// Check if running on web
export const isWeb = Platform.OS === 'web';

// Web-specific breakpoints
export const Breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};

// Web-specific transitions (CSS-style)
export const WebTransitions = {
  fast: 'all 0.15s ease-out',
  standard: 'all 0.2s ease-out',
  slow: 'all 0.3s ease-out',
  transform: 'transform 0.2s ease-out',
  opacity: 'opacity 0.15s ease-out',
  background: 'background-color 0.2s ease-out',
};

// Web-specific hover styles
export const WebHoverStyles = {
  lift: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  },
  glow: {
    boxShadow: `0 0 20px ${Colors.accent}40`,
  },
  brighten: {
    filter: 'brightness(1.1)',
  },
  scale: {
    transform: 'scale(1.02)',
  },
};

// Web cursor styles
export const WebCursors = {
  pointer: { cursor: 'pointer' },
  default: { cursor: 'default' },
  text: { cursor: 'text' },
  grab: { cursor: 'grab' },
  grabbing: { cursor: 'grabbing' },
  notAllowed: { cursor: 'not-allowed' },
};

// Web-specific card styles
export const WebCardStyles = StyleSheet.create({
  card: {
    ...(isWeb && {
      // @ts-ignore - web CSS properties
      transition: WebTransitions.standard,
      cursor: 'pointer',
    }),
  },
  cardHover: {
    ...(isWeb && {
      // @ts-ignore
      transform: [{ translateY: -2 }],
    }),
  },
});

// Web-specific button styles
export const WebButtonStyles = StyleSheet.create({
  button: {
    ...(isWeb && {
      // @ts-ignore
      transition: WebTransitions.fast,
      cursor: 'pointer',
      userSelect: 'none',
    }),
  },
});

// Grid layout helpers for web
export const createWebGrid = (columns: number, gap: number = 16) => ({
  ...(isWeb && {
    // @ts-ignore
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap,
  }),
});

// Responsive grid that adjusts based on screen size
export const responsiveGrid = {
  mobile: createWebGrid(1, 12),
  tablet: createWebGrid(2, 16),
  desktop: createWebGrid(3, 20),
};

// Web-specific scroll behavior
export const WebScrollStyles = {
  smoothScroll: {
    // @ts-ignore
    scrollBehavior: 'smooth',
  },
  hideScrollbar: {
    // @ts-ignore
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  customScrollbar: {
    // @ts-ignore
    scrollbarWidth: 'thin',
    scrollbarColor: `${Colors.dark.element} transparent`,
  },
};

// Web typography enhancements
export const WebTypography = {
  antialiased: {
    // @ts-ignore
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  noSelect: {
    // @ts-ignore
    userSelect: 'none',
  },
  selectable: {
    // @ts-ignore
    userSelect: 'text',
  },
};

// Helper to apply web-only styles
export const webOnly = <T extends object>(styles: T): T | {} => {
  return isWeb ? styles : {};
};

// Helper to create responsive styles
export const responsive = <T>(mobile: T, tablet?: T, desktop?: T): T => {
  // In React Native, we'd use useWindowDimensions hook
  // This is a placeholder for the pattern
  return mobile;
};

export default {
  isWeb,
  Breakpoints,
  WebTransitions,
  WebHoverStyles,
  WebCursors,
  WebCardStyles,
  WebButtonStyles,
  WebScrollStyles,
  WebTypography,
  createWebGrid,
  responsiveGrid,
  webOnly,
  responsive,
};
