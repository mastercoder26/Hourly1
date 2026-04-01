import { Easing, FadeIn, FadeInDown, FadeOut, FadeOutDown, FadeInUp, SlideInRight, SlideOutLeft, withSpring, withTiming, interpolate, Extrapolation } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Timing constants
export const MOTION = {
  duration: {
    instant: 100,
    quick: 150,
    standard: 200,
    emphasized: 300,
    screen: 350,
    reveal: 500,
  },
  // Bezier curves
  easeOut: Easing.bezier(0.23, 1, 0.32, 1),        // Decelerate
  easeIn: Easing.bezier(0.55, 0, 1, 0.45),         // Accelerate
  easeInOut: Easing.bezier(0.77, 0, 0.175, 1),    // Smooth both ends
  bounce: Easing.bezier(0.34, 1.56, 0.64, 1),     // Overshoot
  // Spring config for natural motion
  spring: {
    damping: 18,
    stiffness: 200,
    mass: 0.9,
  },
  springSnappy: {
    damping: 22,
    stiffness: 280,
    mass: 0.8,
  },
  springGentle: {
    damping: 16,
    stiffness: 150,
    mass: 1.0,
  },
  // Premium spring config - very smooth, high quality feel
  springPremium: {
    damping: 20,
    stiffness: 300,
    mass: 0.7,
  },
  // Bouncy spring for playful interactions
  springBouncy: {
    damping: 12,
    stiffness: 180,
    mass: 0.8,
  },
};

// Press feedback config
export const PRESS_FEEDBACK = {
  scale: 0.97,
  scaleSubtle: 0.985,
  scaleBold: 0.94,
  opacity: 0.85,
  opacitySubtle: 0.92,
  brightness: 1.1,  // For hover states
};

// Haptic feedback helpers
export const haptic = {
  light: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },
  medium: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },
  heavy: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  },
  success: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  },
  warning: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  },
  error: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  },
  selection: () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  },
};

// Stagger delay calculator
export const stagger = (
  index: number,
  start = 0,
  step = 50,
  maxDelay = 400,
) => Math.min(start + index * step, maxDelay);

// Entrance animations
export const enterFade = (delay = 0, duration = MOTION.duration.quick) =>
  FadeIn.duration(duration).delay(delay).easing(MOTION.easeOut);

export const enterRise = (delay = 0) =>
  FadeInDown.springify()
    .damping(MOTION.spring.damping)
    .stiffness(MOTION.spring.stiffness)
    .mass(MOTION.spring.mass)
    .delay(delay);

export const enterRiseSnappy = (delay = 0) =>
  FadeInDown.springify()
    .damping(MOTION.springSnappy.damping)
    .stiffness(MOTION.springSnappy.stiffness)
    .mass(MOTION.springSnappy.mass)
    .delay(delay);

export const enterDrop = (delay = 0) =>
  FadeInUp.springify()
    .damping(MOTION.spring.damping)
    .stiffness(MOTION.spring.stiffness)
    .mass(MOTION.spring.mass)
    .delay(delay);

export const enterSlide = (delay = 0) =>
  SlideInRight.duration(MOTION.duration.emphasized).delay(delay).easing(MOTION.easeOut);

// Exit animations
export const exitFade = (duration = MOTION.duration.quick) =>
  FadeOut.duration(duration).easing(MOTION.easeIn);

export const exitDrop = (duration = MOTION.duration.standard) =>
  FadeOutDown.duration(duration).easing(MOTION.easeIn);

export const exitSlide = (duration = MOTION.duration.standard) =>
  SlideOutLeft.duration(duration).easing(MOTION.easeIn);

// Utility: Create staggered entrance for list items
export const createStaggeredEntrance = (baseDelay = 0, staggerStep = 45) => {
  return (index: number) => enterRise(stagger(index, baseDelay, staggerStep));
};

// Utility: Timing config for animated values
export const timingConfig = (duration = MOTION.duration.standard) => ({
  duration,
  easing: MOTION.easeOut,
});

export const springConfig = () => ({
  damping: MOTION.spring.damping,
  stiffness: MOTION.spring.stiffness,
  mass: MOTION.spring.mass,
});

// Premium entrance for hero elements
export const enterPremium = (delay = 0) =>
  FadeInDown.springify()
    .damping(MOTION.springPremium.damping)
    .stiffness(MOTION.springPremium.stiffness)
    .mass(MOTION.springPremium.mass)
    .delay(delay);

// Bouncy entrance for playful elements
export const enterBouncy = (delay = 0) =>
  FadeInDown.springify()
    .damping(MOTION.springBouncy.damping)
    .stiffness(MOTION.springBouncy.stiffness)
    .mass(MOTION.springBouncy.mass)
    .delay(delay);

// Card entrance - subtle scale + fade
export const enterCard = (delay = 0) =>
  FadeIn.duration(MOTION.duration.standard)
    .delay(delay)
    .easing(MOTION.easeOut);

// Micro-interaction spring configs
export const microSpring = {
  press: { damping: 15, stiffness: 400, mass: 0.5 },
  release: { damping: 18, stiffness: 300, mass: 0.7 },
  tap: { damping: 20, stiffness: 500, mass: 0.4 },
};

// Create press animation style helper
export const createPressStyle = (
  pressedValue: { value: number },
  config: { scale?: number; opacity?: number } = {}
) => {
  'worklet';
  const scale = config.scale ?? PRESS_FEEDBACK.scale;
  const opacity = config.opacity ?? PRESS_FEEDBACK.opacity;
  
  return {
    transform: [
      { scale: interpolate(pressedValue.value, [0, 1], [1, scale], Extrapolation.CLAMP) },
    ],
    opacity: interpolate(pressedValue.value, [0, 1], [1, opacity], Extrapolation.CLAMP),
  };
};

// List animation utilities
export const listAnimations = {
  // For FlatList items with nice stagger
  itemEnter: (index: number, baseDelay = 0) => 
    enterRise(stagger(index, baseDelay, 50, 300)),
  
  // For grid items
  gridEnter: (index: number, columns: number, baseDelay = 0) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    const delay = baseDelay + (row * 80) + (col * 40);
    return enterRise(Math.min(delay, 400));
  },
  
  // For masonry layouts
  masonryEnter: (index: number, baseDelay = 0) =>
    enterRise(stagger(index, baseDelay, 35, 350)),
};
